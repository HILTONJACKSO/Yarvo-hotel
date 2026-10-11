import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.activity.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async create(data: any) {
    return this.prisma.activity.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        price: data.price,
        image: data.image || (data.images && data.images.length > 0 ? data.images[0] : null),
        images: data.images || [],
        isActive: data.isActive ?? true
      }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.activity.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        price: data.price,
        image: data.image !== undefined ? data.image : (data.images && data.images.length > 0 ? data.images[0] : undefined),
        images: data.images !== undefined ? data.images : undefined,
        isActive: data.isActive
      }
    });
  }

  async remove(id: string) {
    return this.prisma.activity.delete({ where: { id } });
  }
}
