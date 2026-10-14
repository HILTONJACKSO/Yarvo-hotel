import { Controller, Get, Body, Patch, Param, Req } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Properties')
@ApiCookieAuth('accessToken')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get the main property configuration' })
  @ApiResponse({ status: 200, description: 'The property configuration.' })
  getProperty(@Req() req: any) {
    return this.propertiesService.getProperty(req.user?.propertyId);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CEO', 'MANAGER')
  @ApiOperation({ summary: 'Update property configuration' })
  @ApiResponse({ status: 200, description: 'Property successfully updated.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto, @Req() req: any) {
    const isSuperAdmin = req.user?.roles?.some((r: string) => r.toUpperCase() === 'SUPER_ADMIN');
    const targetId = (!isSuperAdmin && req.user?.propertyId) ? req.user.propertyId : id;
    return this.propertiesService.update(targetId, updatePropertyDto);
  }
}

