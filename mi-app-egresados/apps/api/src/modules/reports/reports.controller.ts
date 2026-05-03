// apps/api/src/modules/reports/reports.controller.ts
import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@repo/shared/enums/user-role.enum';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('gestion/empleabilidad')
  @Roles(UserRole.ADMIN)
  async generateEmployabilityReport(@Body('cohorte') cohorte: string, @Res() res: Response) {
    const pdf = await this.reportsService.generateEmployabilityReport(cohorte);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_empleabilidad.pdf"');
    res.send(pdf);
  }
}