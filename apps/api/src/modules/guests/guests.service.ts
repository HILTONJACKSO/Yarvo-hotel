import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGuestDto: CreateGuestDto, propertyId?: string) {
    if (createGuestDto.email) {
      const existing = await this.prisma.guest.findFirst({
        where: {
          email: createGuestDto.email,
          ...(propertyId ? { propertyId } : {}),
        },
      });
      if (existing) {
        if (!existing.isActive) {
          // Reactivate soft-deleted guest
          return this.prisma.guest.update({
            where: { id: existing.id },
            data: { ...createGuestDto, isActive: true },
          });
        }
        throw new ConflictException(`Guest with email ${createGuestDto.email} already exists`);
      }
    }

    return this.prisma.guest.create({
      data: {
        ...createGuestDto,
        ...(propertyId ? { propertyId } : {}),
      },
    });
  }

  async findAll(search?: string, page: number = 1, limit: number = 50, propertyId?: string) {
    const where: any = {
      isActive: true,
      ...(propertyId ? { propertyId } : {}),
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.guest.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { lastName: 'asc' },
      }),
      this.prisma.guest.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, propertyId?: string) {
    const guest = await this.prisma.guest.findFirst({
      where: {
        id,
        ...(propertyId ? { propertyId } : {}),
      },
    });

    if (!guest || !guest.isActive) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }

    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto, propertyId?: string) {
    await this.findOne(id, propertyId);

    if (updateGuestDto.email) {
      const existing = await this.prisma.guest.findFirst({
        where: {
          email: updateGuestDto.email,
          id: { not: id },
          ...(propertyId ? { propertyId } : {}),
        },
      });
      if (existing) {
        throw new ConflictException(`Guest with email ${updateGuestDto.email} already exists`);
      }
    }

    return this.prisma.guest.update({
      where: { id },
      data: updateGuestDto,
    });
  }

  async remove(id: string, propertyId?: string) {
    await this.findOne(id, propertyId);
    return this.prisma.guest.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
