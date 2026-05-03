import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from './entities/job-offer.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobOffer)
    private jobsRepository: Repository<JobOffer>,
  ) {}

  async findAll(): Promise<JobOffer[]> {
    return this.jobsRepository.find({ relations: ['empresa'] });
  }

  async findOne(id: string): Promise<JobOffer> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['empresa'],
    });
    if (!job) throw new NotFoundException('Oferta no encontrada');
    return job;
  }
}
