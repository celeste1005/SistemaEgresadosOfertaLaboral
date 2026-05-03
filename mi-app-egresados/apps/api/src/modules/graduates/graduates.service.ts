// apps/api/src/modules/graduates/graduates.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Graduate } from './entities/graduate.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GraduatesService {
  constructor(
    @InjectRepository(Graduate)
    private graduatesRepository: Repository<Graduate>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOne(id: string): Promise<Graduate> {
    const cached = await this.cacheManager.get<Graduate>(`graduate:${id}`);
    if (cached) return cached;

    const graduate = await this.graduatesRepository.findOne({ where: { id } });
    if (!graduate) throw new NotFoundException();

    await this.cacheManager.set(`graduate:${id}`, graduate, 300000);
    return graduate;
  }

  // ... resto de métodos (create, update, delete, paginación)
}