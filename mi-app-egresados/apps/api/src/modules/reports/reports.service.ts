import { Injectable } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReportsService {
  constructor(
    private pdfGenerator: PdfGeneratorService,
    private analyticsService: AnalyticsService,
    @InjectQueue('pdf-reports') private reportQueue: Queue,
  ) {}

  async generateEmployabilityReport(cohorte: string): Promise<Buffer> {
    const stats = await this.analyticsService.getAdminStats();
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #2c3e50; text-align: center; }
            .stat-card { border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 8px; display: inline-block; width: 30%; }
            .value { font-size: 24px; font-weight: bold; color: #3498db; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Reporte de Empleabilidad - Cohorte ${cohorte}</h1>
          <div class="stats">
            <div class="stat-card">
              <div>Media Salarial</div>
              <div class="value">$${stats.salarios.media.toLocaleString()}</div>
            </div>
            <div class="stat-card">
              <div>Mediana Salarial</div>
              <div class="value">$${stats.salarios.mediana.toLocaleString()}</div>
            </div>
            <div class="stat-card">
              <div>Moda Salarial</div>
              <div class="value">$${stats.salarios.moda.toLocaleString()}</div>
            </div>
          </div>
          
          <h2>Distribución de Egresados por Año</h2>
          <table>
            <thead>
              <tr>
                <th>Año</th>
                <th>Cantidad de Egresados</th>
              </tr>
            </thead>
            <tbody>
              ${stats.egresadosPorAño.map(item => `
                <tr>
                  <td>${item.año}</td>
                  <td>${item.cantidad}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    return this.pdfGenerator.generatePDF(htmlContent);
  }

  async queueReport(userId: string, reportType: string, params: any) {
    await this.reportQueue.add('generate', {
      userId,
      reportType,
      params,
    });
    return { message: 'Reporte en cola para generación' };
  }
}
