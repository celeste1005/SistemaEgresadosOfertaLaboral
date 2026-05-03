import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraduatesService } from './graduates.service';
import { GraduatesController } from './graduates.controller';
import { Graduate } from './entities/graduate.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Graduate]),
    CacheModule.register(),
  ],
  controllers: [GraduatesController],
  providers: [GraduatesService],
  exports: [GraduatesService],
})
export class GraduatesModule {}
