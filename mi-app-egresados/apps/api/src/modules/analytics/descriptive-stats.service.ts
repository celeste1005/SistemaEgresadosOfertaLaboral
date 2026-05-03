import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from '../jobs/entities/job-offer.entity';
import { Graduate } from '../graduates/entities/graduate.entity';

@Injectable()
export class DescriptiveStatsService {
  constructor(
    @InjectRepository(JobOffer)
    private offersRepository: Repository<JobOffer>,
    @InjectRepository(Graduate)
    private graduatesRepository: Repository<Graduate>,
  ) {}

  async calcularMediaSalarios(): Promise<number> {
    const result = await this.offersRepository
      .createQueryBuilder('oferta')
      .select('AVG((oferta.salario_min + oferta.salario_max) / 2)', 'media')
      .getRawOne();
    return parseFloat(result?.media || 0);
  }

  async calcularMedianaSalarios(): Promise<number> {
    const salaries = await this.offersRepository
      .createQueryBuilder('oferta')
      .select('(oferta.salario_min + oferta.salario_max) / 2', 'promedio')
      .getRawMany();
    const values = salaries.map(s => parseFloat(s.promedio)).filter(v => !isNaN(v)).sort((a,b) => a-b);
    if (values.length === 0) return 0;
    const mid = Math.floor(values.length/2);
    return values.length % 2 ? values[mid] : (values[mid-1]+values[mid])/2;
  }

  async calcularModaSalarios(): Promise<number> {
    const salaries = await this.offersRepository
      .createQueryBuilder('oferta')
      .select('(oferta.salario_min + oferta.salario_max) / 2', 'promedio')
      .getRawMany();
    const counts = new Map();
    let maxCount = 0;
    let mode = 0;
    salaries.forEach(s => {
      const val = parseFloat(s.promedio);
      if (isNaN(val)) return;
      const count = (counts.get(val) || 0) + 1;
      counts.set(val, count);
      if (count > maxCount) {
        maxCount = count;
        mode = val;
      }
    });
    return mode;
  }

  async calcularDesviacionEstandarAniosGraduacion(): Promise<number> {
    const result = await this.graduatesRepository
      .createQueryBuilder('egresado')
      .select('STDDEV(egresado.anio_graduacion)', 'stddev')
      .getRawOne();
    return parseFloat(result?.stddev || 0);
  }

  async calcularPercentilSalarial(percentil: number): Promise<number> {
    const salaries = await this.offersRepository
      .createQueryBuilder('oferta')
      .select('(oferta.salario_min + oferta.salario_max) / 2', 'promedio')
      .getRawMany();
    const values = salaries.map(s => parseFloat(s.promedio)).filter(v => !isNaN(v)).sort((a,b) => a-b);
    if (values.length === 0) return 0;
    const index = (percentil / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return values[lower] * (1 - weight) + values[upper] * weight;
  }
}
