import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationStatus } from '@repo/shared/enums/application-status.enum';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async create(createDto: CreateApplicationDto): Promise<Application> {
    // Verificar si ya existe una postulación activa para esta oferta y egresado
    const existing = await this.applicationsRepository.findOne({
      where: {
        ofertaId: createDto.ofertaId,
        egresadoId: createDto.egresadoId,
      },
    });

    if (existing) {
      throw new BadRequestException('Ya te has postulado a esta oferta');
    }

    const application = this.applicationsRepository.create({
      ...createDto,
      estado: ApplicationStatus.POSTULADO,
      historial_estados: [
        {
          estado: ApplicationStatus.POSTULADO,
          fecha: new Date(),
          comentario: 'Postulación inicial',
        },
      ],
    });

    return this.applicationsRepository.save(application);
  }

  async findAll(query: any): Promise<Application[]> {
    const { egresadoId, ofertaId, estado, limit = 10, cursor } = query;
    const qb = this.applicationsRepository.createQueryBuilder('app')
      .leftJoinAndSelect('app.oferta', 'oferta')
      .leftJoinAndSelect('oferta.empresa', 'empresa')
      .leftJoinAndSelect('app.egresado', 'egresado');

    if (egresadoId) qb.andWhere('app.egresadoId = :egresadoId', { egresadoId });
    if (ofertaId) qb.andWhere('app.ofertaId = :ofertaId', { ofertaId });
    if (estado) qb.andWhere('app.estado = :estado', { estado });
    
    qb.orderBy('app.creadoEn', 'DESC').take(limit);

    return qb.getMany();
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['oferta', 'oferta.empresa', 'egresado'],
    });
    if (!application) throw new NotFoundException('Postulación no encontrada');
    return application;
  }

  async updateStatus(id: string, updateDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findOne(id);
    
    application.estado = updateDto.estado;
    application.historial_estados.push({
      estado: updateDto.estado,
      fecha: new Date(),
      comentario: updateDto.comentarios,
    });

    return this.applicationsRepository.save(application);
  }
}
