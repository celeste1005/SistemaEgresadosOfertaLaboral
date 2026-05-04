import { Injectable, UnauthorizedException } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from './trpc.service';
import { AuthService, LoginSchema, RegisterSchema, ProfileSchema, OfertaSchema } from '../modules/auth/auth.service';
import { DashboardService } from '../modules/dashboard/dashboard.service';
import { EgresadosService } from '../modules/egresados/egresados.service';
import { OfertasService } from '../modules/ofertas/ofertas.service';
import { ReportesService } from '../modules/reportes/reportes.service';

@Injectable()
export class TrpcRouter {
  constructor(
    private trpc: TrpcService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private egresadosService: EgresadosService,
    private ofertasService: OfertasService,
    private reportesService: ReportesService,
  ) {}

  appRouter = this.trpc.router({
    // Auth Procedures
    login: this.trpc.procedure
      .input(LoginSchema)
      .mutation(async ({ input }) => {
        const user = await this.authService.validateUser(input.email, input.password);
        if (!user) {
          throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.authService.login(user);
      }),

    register: this.trpc.procedure
      .input(RegisterSchema)
      .mutation(async ({ input }) => {
        return this.authService.register(input);
      }),

    updateProfile: this.trpc.protectedProcedure
      .input(ProfileSchema)
      .mutation(async ({ input, ctx }) => {
        return this.egresadosService.updateProfile(ctx.user.sub, input);
      }),

    getMiPerfil: this.trpc.protectedProcedure
      .query(async ({ ctx }) => {
        return this.egresadosService.getMiPerfil(ctx.user.sub);
      }),

    // Job Offers Procedures
    getOfertas: this.trpc.procedure
      .query(async () => {
        return this.ofertasService.getOfertas();
      }),

    crearOferta: this.trpc.protectedProcedure
      .input(OfertaSchema)
      .mutation(async ({ input, ctx }) => {
        return this.ofertasService.crearOferta(ctx.user.sub, input);
      }),

    postularAOferta: this.trpc.protectedProcedure
      .input(z.object({ ofertaId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return this.ofertasService.postularAOferta(ctx.user.sub, parseInt(input.ofertaId));
      }),

    getOfertaCandidatos: this.trpc.protectedProcedure
      .input(z.object({ ofertaId: z.number() }))
      .query(async ({ input }) => {
        return this.ofertasService.getOfertaCandidatos(input.ofertaId);
      }),

    getMisPostulaciones: this.trpc.protectedProcedure
      .query(async ({ ctx }) => {
        return this.ofertasService.getPostulacionesByEgresado(ctx.user.sub);
      }),

    // Admin Specific Procedures
    getAdminEgresados: this.trpc.procedure
      .query(async () => {
        return this.egresadosService.getAdminEgresados();
      }),

    getAdminEmpresas: this.trpc.procedure
      .query(async () => {
        return this.ofertasService.getAdminEmpresas();
      }),

    getAdminReportes: this.trpc.procedure
      .query(async () => {
        return this.reportesService.getAdminReportes();
      }),

    // Acciones de Administración
    eliminarUsuario: this.trpc.protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return this.authService.eliminarUsuario(input.id);
      }),

    eliminarOferta: this.trpc.protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return this.ofertasService.eliminarOferta(input.id);
      }),

    updateOferta: this.trpc.protectedProcedure
      .input(z.object({
        id: z.number(),
        titulo: z.string().min(5),
        descripcion: z.string().min(20),
        ubicacion: z.string().min(3),
        salarioMin: z.coerce.number().min(1),
        salarioMax: z.coerce.number().min(1),
        modalidad: z.enum(['PRESENCIAL', 'REMOTO', 'HIBRIDO']),
        requisitos: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        return this.ofertasService.updateOferta(input.id, input);
      }),

    // Dashboard Procedures (Protegidos)
    getAdminStats: this.trpc.procedure
      .query(async () => {
        return this.dashboardService.getAdminStats();
      }),

    getEgresadoStats: this.trpc.protectedProcedure
      .query(async ({ ctx }) => {
        return this.egresadosService.getEgresadoStats(ctx.user.sub);
      }),

    getEmpresaStats: this.trpc.protectedProcedure
      .query(async ({ ctx }) => {
        return this.ofertasService.getEmpresaStats(ctx.user.sub);
      }),
  });
}

export type AppRouter = TrpcRouter['appRouter'];
