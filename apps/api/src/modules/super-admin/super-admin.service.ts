import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const totalProperties = await this.prisma.property.count();
    const pendingProperties = await this.prisma.property.count({ where: { status: 'PENDING' } });
    const activeProperties = await this.prisma.property.count({ where: { status: 'APPROVED' } });
    const totalUsers = await this.prisma.user.count();
    const totalLeads = await this.prisma.supportTicket.count({ where: { status: 'OPEN', propertyId: null } });

    // Mock MRR for now, in a real app this would sum up subscriptions
    const mrr = activeProperties * 299; 

    // Recent activity
    const recentProperties = await this.prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { name: true, createdAt: true, status: true }
    });
    
    const recentActivity = recentProperties.map(p => {
      const date = new Date(p.createdAt);
      const isRecent = (new Date().getTime() - date.getTime()) < 24 * 60 * 60 * 1000;
      return {
        text: p.status === 'APPROVED' ? `Property '${p.name}' was approved` : 
              p.status === 'PENDING' ? `New property '${p.name}' registered` : 
              `Property '${p.name}' was suspended`,
        time: isRecent ? 'Today' : date.toLocaleDateString(),
        color: p.status === 'APPROVED' ? 'text-emerald-400' : p.status === 'PENDING' ? 'text-blue-400' : 'text-red-400'
      };
    });

    // Platform growth
    const allProperties = await this.prisma.property.findMany({
      select: { createdAt: true }
    });
    
    const currentYear = new Date().getFullYear();
    const platformGrowth = new Array(12).fill(0);
    allProperties.forEach(p => {
      const date = new Date(p.createdAt);
      if (date.getFullYear() === currentYear) {
        platformGrowth[date.getMonth()] += 1;
      }
    });

    return { 
      totalProperties, pendingProperties, activeProperties, totalUsers, totalLeads, mrr,
      recentActivity,
      platformGrowth
    };
  }

  async getAllProperties() {
    return this.prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
  }

  async updatePropertyStatus(propertyId: string, status: 'PENDING' | 'APPROVED' | 'SUSPENDED') {
    return this.prisma.property.update({
      where: { id: propertyId },
      data: { status },
    });
  }

  async deleteProperty(propertyId: string) {
    return this.prisma.property.delete({
      where: { id: propertyId },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        isLocked: true,
        property: { select: { id: true, name: true } },
        roles: { select: { name: true } },
        createdAt: true,
      }
    });
  }

  async getAllSupportTickets() {
    return this.prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { name: true } },
      }
    });
  }

  async resetUserPassword(userId: string, newPassword: string) {
    const passwordHash = await argon2.hash(newPassword);
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
