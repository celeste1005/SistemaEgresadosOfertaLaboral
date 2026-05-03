// apps/api/src/modules/applications/dto/update-application.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@repo/shared/enums/application-status.enum';

export class UpdateApplicationDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  estado: ApplicationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comentarios?: string;
}