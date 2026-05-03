// apps/api/src/modules/applications/entities/application.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApplicationStatus } from '@repo/shared/enums/application-status.enum';
import { JobOffer } from '../../jobs/entities/job-offer.entity';
import { Graduate } from '../../graduates/entities/graduate.entity';

@Entity('postulaciones')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'oferta_id' })
  ofertaId: string;

  @Column({ name: 'egresado_id' })
  egresadoId: string;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.POSTULADO })
  estado: ApplicationStatus;

  @Column({ type: 'jsonb', default: [] })
  historial_estados: Array<{ estado: string; fecha: Date; comentario?: string }>;

  @Column({ type: 'text', nullable: true })
  comentarios: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @ManyToOne(() => JobOffer)
  @JoinColumn({ name: 'oferta_id' })
  oferta: JobOffer;

  @ManyToOne(() => Graduate)
  @JoinColumn({ name: 'egresado_id' })
  egresado: Graduate;
}