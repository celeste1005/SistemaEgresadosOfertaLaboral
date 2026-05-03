// apps/api/src/modules/applications/dto/response-application.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@repo/shared/enums/application-status.enum';

export class ApplicationHistoryEntryDto {
  @ApiProperty()
  estado: string;

  @ApiProperty()
  fecha: Date;

  @ApiProperty({ required: false })
  comentario?: string;
}

export class ResponseApplicationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ofertaId: string;

  @ApiProperty()
  egresadoId: string;

  @ApiProperty({ enum: ApplicationStatus })
  estado: ApplicationStatus;

  @ApiProperty({ type: [ApplicationHistoryEntryDto] })
  historial_estados: ApplicationHistoryEntryDto[];

  @ApiProperty({ required: false })
  comentarios?: string;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;

  // Opcional: datos anidados de la oferta o del egresado
  @ApiProperty({ required: false })
  oferta?: {
    id: string;
    titulo: string;
    empresaNombre: string;
  };

  @ApiProperty({ required: false })
  egresado?: {
    id: string;
    nombreCompleto: string;
    carrera: string;
  };
}