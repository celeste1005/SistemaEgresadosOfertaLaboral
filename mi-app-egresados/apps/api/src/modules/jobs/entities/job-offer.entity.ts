import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { WorkModality } from '@repo/shared/enums/work-modality.enum';
import { Application } from '../../applications/entities/application.entity';

@Entity('ofertas_laborales')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Company, (company) => company.ofertas)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Company;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ name: 'salario_min', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salarioMin: number;

  @Column({ name: 'salario_max', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salarioMax: number;

  @Column({
    type: 'enum',
    enum: WorkModality,
    default: WorkModality.PRESENCIAL,
    name: 'modalidad_trabajo'
  })
  modalidad: WorkModality;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => Application, (application) => application.oferta)
  postulaciones: Application[];
}
