import { Module } from '@nestjs/common';
import { OfertasService } from './ofertas.service';

@Module({
  providers: [OfertasService],
  exports: [OfertasService],
})
export class OfertasModule {}
