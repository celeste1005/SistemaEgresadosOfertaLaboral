// apps/api/src/modules/applications/dto/create-application.dto.ts
import { IsUUID, IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  ofertaId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  egresadoId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comentarios?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}