import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { EgresadosModule } from './modules/egresados/egresados.module';
import { OfertasModule } from './modules/ofertas/ofertas.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportesModule } from './modules/reportes/reportes.module';
import { TrpcModule } from './trpc/trpc.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TrpcModule,
    AuthModule,
    EgresadosModule,
    OfertasModule,
    DashboardModule,
    ReportesModule,
  ],
})
export class AppModule {}
