import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Injectable()
export class RoomTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoomTypeDto: CreateRoomTypeDto, propertyId?: string) {
    const { taxIds, ...data } = createRoomTypeDto;
    
    const existing = await this.prisma.roomType.findFirst({
      where: {
        code: data.code,
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
      },
    });

    if (existing) {
      throw new ConflictException(`Room type with code ${data.code} already exists`);
    }

    return this.prisma.roomType.create({
      data: {
        ...data,
        ...(propertyId ? { propertyId } : {}),
        taxes: taxIds ? {
          connect: taxIds.map(id => ({ id }))
        } : undefined
      },
    });
  }

  async findAll(propertyId?: string) {
    return this.prisma.roomType.findMany({
      where: {
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
      },
      orderBy: { name: 'asc' },
      include: { taxes: true }
    });
  }

  async findOne(id: string, propertyId?: string) {
    const roomType = await this.prisma.roomType.findFirst({
      where: {
        id,
        deletedAt: null,
        ...(propertyId ? { propertyId } : {}),
      },
      include: { taxes: true }
    });

    if (!roomType || roomType.deletedAt) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }

    return roomType;
  }

  async update(id: string, updateRoomTypeDto: UpdateRoomTypeDto, propertyId?: string) {
    await this.findOne(id, propertyId); // Ensure it exists and is not deleted
    
    const { taxIds, ...data } = updateRoomTypeDto as any;

    if (data.code) {
      const existing = await this.prisma.roomType.findFirst({
        where: {
          code: data.code,
          id: { not: id },
          deletedAt: null,
          ...(propertyId ? { propertyId } : {}),
        },
      });

      if (existing) {
        throw new ConflictException(`Room type with code ${data.code} already exists`);
      }
    }

    return this.prisma.roomType.update({
      where: { id },
      data: {
        ...data,
        taxes: taxIds ? {
          set: taxIds.map((tid: string) => ({ id: tid }))
        } : undefined
      },
    });
  }

  async remove(id: string, propertyId?: string) {
    await this.findOne(id, propertyId); // Ensure it exists and is not deleted

    // Soft delete
    return this.prisma.roomType.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
