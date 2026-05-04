import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { AuthModule } from '../modules/auth/auth.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { EgresadosModule } from '../modules/egresados/egresados.module';
import { OfertasModule } from '../modules/ofertas/ofertas.module';
import { ReportesModule } from '../modules/reportes/reportes.module';

@Module({
  imports: [AuthModule, DashboardModule, EgresadosModule, OfertasModule, ReportesModule],
  providers: [TrpcService, TrpcRouter],
  exports: [TrpcRouter],
})
export class TrpcModule {}
