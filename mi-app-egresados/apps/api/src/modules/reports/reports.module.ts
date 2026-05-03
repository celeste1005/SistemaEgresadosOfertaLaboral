import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PdfGeneratorService } from './pdf-generator.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { BullModule } from '@nestjs/bull';
import { PdfQueueProcessor } from './processors/pdf-queue.processor';

@Module({
  imports: [
    AnalyticsModule,
    BullModule.registerQueue({
      name: 'pdf-reports',
    }),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, PdfGeneratorService, PdfQueueProcessor],
  exports: [ReportsService],
})
export class ReportsModule {}
