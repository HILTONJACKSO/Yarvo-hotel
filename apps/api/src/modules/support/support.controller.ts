import { Controller, Post, Body } from '@nestjs/common';
import { SupportService } from './support.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Public()
  @Post('sales-lead')
  async createSalesLead(
    @Body() body: { name: string; email: string; propertyName?: string; message: string; rooms?: number }
  ) {
    return this.supportService.createSalesLead({
      name: body.name,
      email: body.email,
      businessType: body.propertyName,
      message: body.message,
    });
  }
}
