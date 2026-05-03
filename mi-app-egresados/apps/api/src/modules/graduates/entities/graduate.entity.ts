import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity('egresados')
export class Graduate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @Column({ name: 'nombre_completo' })
  nombreCompleto: string;

  @Column()
  carrera: string;

  @Column({ name: 'anio_graduacion' })
  anioGraduacion: number;

  @Column({ name: 'anios_experiencia', default: 0 })
  aniosExperiencia: number;

  @Column({ type: 'jsonb', name: 'habilidades_jsonb', default: [] })
  habilidades: string[];

  @Column({ name: 'url_cv', nullable: true })
  urlCv: string;

  @Column({ nullable: true })
  ubicacion: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @OneToMany(() => Application, (application) => application.egresado)
  postulaciones: Application[];
}
