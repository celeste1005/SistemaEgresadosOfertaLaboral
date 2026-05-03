import { Injectable } from '@nestjs/common';
import { DescriptiveStatsService } from './descriptive-stats.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../applications/entities/application.entity';
import { Graduate } from '../graduates/entities/graduate.entity';
import { JobOffer } from '../jobs/entities/job-offer.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    private descriptiveStats: DescriptiveStatsService,
    @InjectRepository(Application) private applicationsRepository: Repository<Application>,
    @InjectRepository(Graduate) private graduatesRepository: Repository<Graduate>,
    @InjectRepository(JobOffer) private offersRepository: Repository<JobOffer>,
  ) {}

  async getAdminStats() {
    const [media, mediana, moda, stddev, p25, p75] = await Promise.all([
      this.descriptiveStats.calcularMediaSalarios(),
      this.descriptiveStats.calcularMedianaSalarios(),
      this.descriptiveStats.calcularModaSalarios(),
      this.descriptiveStats.calcularDesviacionEstandarAniosGraduacion(),
      this.descriptiveStats.calcularPercentilSalarial(25),
      this.descriptiveStats.calcularPercentilSalarial(75),
    ]);

    const egresadosPorAño = await this.graduatesRepository
      .createQueryBuilder('egresado')
      .select('egresado.anio_graduacion', 'año')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('egresado.anio_graduacion')
      .orderBy('egresado.anio_graduacion', 'ASC')
      .getRawMany();

    return {
      salarios: { media, mediana, moda, p25, p75 },
      educacion: { desviacionEstandarAnios: stddev },
      egresadosPorAño,
    };
  }

  async getGraduateStats(egresadoId: string) {
    const postulaciones = await this.applicationsRepository.find({
      where: { egresadoId },
    });

    const total = postulaciones.length;
    const porEstado = postulaciones.reduce((acc, app) => {
      acc[app.estado] = (acc[app.estado] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPostulaciones: total,
      distribucionEstados: porEstado,
    };
  }

  async getCompanyStats(empresaId: string) {
    const ofertas = await this.offersRepository.find({
      where: { empresaId },
      relations: ['postulaciones'],
    });

    return ofertas.map(o => ({
      titulo: o.titulo,
      totalPostulaciones: o.postulaciones.length,
      activo: o.activo,
    }));
  }
}
