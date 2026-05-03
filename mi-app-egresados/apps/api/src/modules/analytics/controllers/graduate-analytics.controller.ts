import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from '../analytics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@repo/shared/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics/graduate')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GraduateAnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('my-stats')
  @Roles(UserRole.EGRESADO)
  @ApiOperation({ summary: 'Obtener estadísticas personales del egresado' })
  async getMyStats(@Request() req) {
    return this.analyticsService.getGraduateStats(req.user.id);
  }
}
