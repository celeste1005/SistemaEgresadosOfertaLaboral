import { Module } from '@nestjs/common';
import { EgresadosService } from './egresados.service';

@Module({
  providers: [EgresadosService],
  exports: [EgresadosService],
})
export class EgresadosModule {}
