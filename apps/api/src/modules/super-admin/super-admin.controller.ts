import { Controller, Get, Patch, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('super-admin')
@Roles('SUPER_ADMIN') // Only accessible by SUPER_ADMIN
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.superAdminService.getDashboardStats();
  }

  @Get('properties')
  async getAllProperties() {
    return this.superAdminService.getAllProperties();
  }

  @Patch('properties/:id/status')
  async updatePropertyStatus(
    @Param('id') id: string,
    @Body() body: { status: 'PENDING' | 'APPROVED' | 'SUSPENDED' }
  ) {
    return this.superAdminService.updatePropertyStatus(id, body.status);
  }

  @Delete('properties/:id')
  async deleteProperty(@Param('id') id: string) {
    return this.superAdminService.deleteProperty(id);
  }

  @Get('users')
  async getAllUsers() {
    return this.superAdminService.getAllUsers();
  }

  @Get('support-tickets')
  async getAllSupportTickets() {
    return this.superAdminService.getAllSupportTickets();
  }

  @Patch('users/:id/reset-password')
  async resetUserPassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string }
  ) {
    await this.superAdminService.resetUserPassword(id, body.newPassword);
    return { message: 'Password reset successfully' };
  }
}
