import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string, propertyId?: string) {
    return this.prisma.expense.create({
      data: {
        amount: createExpenseDto.amount,
        category: createExpenseDto.category,
        date: new Date(createExpenseDto.date),
        description: createExpenseDto.description,
        referenceCode: createExpenseDto.referenceCode,
        recordedById: userId,
        ...(propertyId ? { propertyId } : {}),
      },
    });
  }

  async findAll(start?: string, end?: string, propertyId?: string) {
    const where: any = {
      ...(propertyId ? { propertyId } : {}),
    };
    if (start && end) {
      where.date = {
        gte: new Date(start),
        lte: new Date(new Date(end).setUTCHours(23, 59, 59, 999))
      };
    }
    return this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  async findOne(id: string, propertyId?: string) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        ...(propertyId ? { propertyId } : {}),
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });
    if (!expense) throw new NotFoundException(`Expense with ID ${id} not found`);
    return expense;
  }

  async remove(id: string, propertyId?: string) {
    const expense = await this.findOne(id, propertyId);
    return this.prisma.expense.delete({ where: { id: expense.id } });
  }
}
