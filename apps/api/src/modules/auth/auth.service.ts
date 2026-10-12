import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterPropertyDto } from './dto/register-property.dto';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async registerProperty(dto: RegisterPropertyDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.adminEmail } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await argon2.hash(dto.adminPassword);
    
    // Extract first and last name from adminName
    const nameParts = dto.adminName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Admin';

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Property
      const property = await tx.property.create({
        data: {
          name: dto.propertyName,
          address: dto.propertyAddress,
          city: dto.propertyCity,
          selectedFeatures: dto.selectedFeatures,
        },
      });

      // 2. Ensure CEO role exists globally
      // Assuming global roles for now.
      let ceoRole = await tx.role.findUnique({ where: { name: 'CEO' } });
      if (!ceoRole) {
        ceoRole = await tx.role.create({
          data: {
            name: 'CEO',
            description: 'Property Owner / CEO',
            permissions: [],
          },
        });
      }

      // 3. Create User attached to Property
      const user = await tx.user.create({
        data: {
          email: dto.adminEmail,
          passwordHash,
          firstName,
          lastName,
          propertyId: property.id,
          roles: {
            connect: { id: ceoRole.id },
          },
        },
      });

      return {
        message: 'Property registered successfully',
        propertyId: property.id,
      };
    });
  }

  async validateUser(loginDto: LoginDto, ipAddress: string) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      await this.usersService.recordLoginAttempt(loginDto.email, ipAddress, false);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isLocked) {
      throw new UnauthorizedException(
        'Account is locked due to too many failed login attempts. Contact your administrator.',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    // New logic: Check if the user belongs to a property and if it is approved.
    // SUPER_ADMIN users (who may not have a property) bypass this check.
    const isSuperAdmin = user.roles?.some((r: any) => r.name === 'SUPER_ADMIN');
    if (user.property && !isSuperAdmin) {
      if (user.property.status === 'PENDING') {
        await this.usersService.recordLoginAttempt(loginDto.email, ipAddress, false);
        throw new UnauthorizedException('Your property is pending approval by the Yarvo team.');
      }
      if (user.property.status === 'SUSPENDED') {
        await this.usersService.recordLoginAttempt(loginDto.email, ipAddress, false);
        throw new UnauthorizedException('Your property account has been suspended. Please contact support.');
      }
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);

    if (!isPasswordValid) {
      await this.usersService.recordLoginAttempt(loginDto.email, ipAddress, false);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.recordLoginAttempt(loginDto.email, ipAddress, true);
    return user;
  }

  async login(user: any, ipAddress: string, userAgent: string) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles: user.roles.map((r: any) => r.name),
      propertyId: user.propertyId,
      features: user.property?.selectedFeatures || []
    };

    // Use signAsync with explicit options per token type
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '7d' as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d' as any,
    });

    const refreshTokenHash = await argon2.hash(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await this.usersService.createSession(
      user.id,
      refreshTokenHash,
      ipAddress,
      userAgent,
      expiresAt,
    );

    return { accessToken, refreshToken, sessionId: session.id };
  }

  async logout(sessionId: string) {
    await this.usersService.revokeSession(sessionId);
  }

  async refreshTokens(
    sessionId: string,
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const session = await this.usersService.findSession(sessionId);

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired or not found');
    }

    const isTokenValid = await argon2.verify(session.refreshTokenHash, refreshToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = session.user;
    if (!user || !user.isActive || user.isLocked) {
      throw new UnauthorizedException('User account is invalid');
    }

    // Rotate: revoke old session, create new one
    await this.usersService.revokeSession(session.id);
    return this.login(user, ipAddress, userAgent);
  }
}

