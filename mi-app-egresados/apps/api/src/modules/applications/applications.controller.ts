import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationQueryDto } from './dto/application-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@repo/shared/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('applications')
@ApiBearerAuth()
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.EGRESADO)
  @ApiOperation({ summary: 'Crear una nueva postulación' })
  create(@Body() createDto: CreateApplicationDto) {
    return this.applicationsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPRESA, UserRole.EGRESADO)
  @ApiOperation({ summary: 'Listar postulaciones con filtros' })
  findAll(@Query() query: ApplicationQueryDto) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPRESA, UserRole.EGRESADO)
  @ApiOperation({ summary: 'Obtener detalle de una postulación' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.EMPRESA)
  @ApiOperation({ summary: 'Actualizar estado de una postulación' })
  updateStatus(@Param('id') id: string, @Body() updateDto: UpdateApplicationDto) {
    return this.applicationsService.updateStatus(id, updateDto);
  }
}
