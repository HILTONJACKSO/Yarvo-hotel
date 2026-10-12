import { IsString, IsEmail, IsNotEmpty, IsArray, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterPropertyDto {
  @ApiProperty({ example: 'Admin User' })
  @IsString()
  @IsNotEmpty()
  adminName!: string;

  @ApiProperty({ example: 'admin@yarvohotel.com' })
  @IsEmail()
  adminEmail!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  adminPassword!: string;

  @ApiProperty({ example: 'Yarvo Hotel' })
  @IsString()
  @IsNotEmpty()
  propertyName!: string;

  @ApiProperty({ example: '123 Beach Ave, Monrovia' })
  @IsString()
  @IsNotEmpty()
  propertyAddress!: string;

  @ApiProperty({ example: 'Monrovia' })
  @IsString()
  @IsNotEmpty()
  propertyCity!: string;

  @ApiProperty({ example: ['POS', 'INVENTORY', 'NIGHT_AUDIT'] })
  @IsArray()
  selectedFeatures!: string[];
}
