import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GraduatesService } from './graduates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@repo/shared/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('graduates')
@ApiBearerAuth()
@Controller('graduates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GraduatesController {
  constructor(private readonly graduatesService: GraduatesService) {}

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EGRESADO, UserRole.EMPRESA)
  @ApiOperation({ summary: 'Obtener perfil de un egresado' })
  findOne(@Param('id') id: string) {
    return this.graduatesService.findOne(id);
  }
}
