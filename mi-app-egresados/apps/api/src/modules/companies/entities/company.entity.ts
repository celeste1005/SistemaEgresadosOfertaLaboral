import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { JobOffer } from '../../jobs/entities/job-offer.entity';

@Entity('empresas')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ name: 'nombre_empresa' })
  nombreEmpresa: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'sitio_web', nullable: true })
  sitioWeb: string;

  @Column({ default: false })
  verificada: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @OneToMany(() => JobOffer, (offer) => offer.empresa)
  ofertas: JobOffer[];
}
