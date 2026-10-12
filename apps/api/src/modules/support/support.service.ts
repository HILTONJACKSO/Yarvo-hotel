import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createSalesLead(data: {
    name: string;
    email: string;
    country?: string;
    businessType?: string;
    message: string;
  }) {
    return this.prisma.supportTicket.create({
      data: {
        subject: `Sales Lead: ${data.name}`,
        message: data.message,
        name: data.name,
        email: data.email,
        country: data.country,
        businessType: data.businessType,
      },
    });
  }

  // To be expanded with authenticated support ticket creation
}
