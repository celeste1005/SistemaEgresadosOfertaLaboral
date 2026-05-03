// apps/api/src/modules/applications/dto/application-query.dto.ts
import { IsOptional, IsEnum, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '@repo/shared/enums/application-status.enum';

export class ApplicationQueryDto {
  @ApiPropertyOptional({ description: 'Cursor para paginación (ID de la última postulación)' })
  @IsOptional()
  @IsUUID()
  cursor?: string;

  @ApiPropertyOptional({ description: 'Límite de registros por página', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: ApplicationStatus, description: 'Filtrar por estado' })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  estado?: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Filtrar por ID de egresado' })
  @IsOptional()
  @IsUUID()
  egresadoId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de oferta' })
  @IsOptional()
  @IsUUID()
  ofertaId?: string;

  @ApiPropertyOptional({ description: 'Fecha de creación desde (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  creadoDesde?: string;

  @ApiPropertyOptional({ description: 'Fecha de creación hasta (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  creadoHasta?: string;
}