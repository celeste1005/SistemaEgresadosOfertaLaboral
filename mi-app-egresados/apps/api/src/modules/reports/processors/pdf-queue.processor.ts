import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ReportsService } from '../reports.service';

@Processor('pdf-reports')
export class PdfQueueProcessor {
  constructor(private readonly reportsService: ReportsService) {}

  @Process('generate')
  async handleGenerate(job: Job) {
    const { userId, reportType, params } = job.data;
    console.log(`Generando reporte ${reportType} para usuario ${userId}...`);
    
    // Aquí se llamaría a la lógica de generación y se guardaría en S3 o DB
    // Por simplicidad, solo simulamos la espera
    if (reportType === 'empleabilidad') {
      await this.reportsService.generateEmployabilityReport(params.cohorte);
    }
    
    console.log(`Reporte ${reportType} generado exitosamente.`);
  }
}
