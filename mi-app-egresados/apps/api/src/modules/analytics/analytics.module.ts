import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { DescriptiveStatsService } from './descriptive-stats.service';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller';
import { GraduateAnalyticsController } from './controllers/graduate-analytics.controller';
import { CompanyAnalyticsController } from './controllers/company-analytics.controller';
import { Application } from '../applications/entities/application.entity';
import { Graduate } from '../graduates/entities/graduate.entity';
import { JobOffer } from '../jobs/entities/job-offer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Graduate, JobOffer]),
  ],
  controllers: [
    AdminAnalyticsController,
    GraduateAnalyticsController,
    CompanyAnalyticsController,
  ],
  providers: [AnalyticsService, DescriptiveStatsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
