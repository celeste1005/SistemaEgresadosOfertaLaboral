import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from '../analytics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@repo/shared/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics/company')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyAnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('my-offers-stats')
  @Roles(UserRole.EMPRESA)
  @ApiOperation({ summary: 'Obtener estadísticas de las ofertas de la empresa' })
  async getMyOffersStats(@Request() req) {
    return this.analyticsService.getCompanyStats(req.user.id);
  }
}
