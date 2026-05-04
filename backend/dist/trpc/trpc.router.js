"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrpcRouter = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const trpc_service_1 = require("./trpc.service");
const auth_service_1 = require("../modules/auth/auth.service");
const dashboard_service_1 = require("../modules/dashboard/dashboard.service");
const egresados_service_1 = require("../modules/egresados/egresados.service");
const ofertas_service_1 = require("../modules/ofertas/ofertas.service");
const reportes_service_1 = require("../modules/reportes/reportes.service");
let TrpcRouter = class TrpcRouter {
    constructor(trpc, authService, dashboardService, egresadosService, ofertasService, reportesService) {
        this.trpc = trpc;
        this.authService = authService;
        this.dashboardService = dashboardService;
        this.egresadosService = egresadosService;
        this.ofertasService = ofertasService;
        this.reportesService = reportesService;
        this.appRouter = this.trpc.router({
            login: this.trpc.procedure
                .input(auth_service_1.LoginSchema)
                .mutation(async ({ input }) => {
                const user = await this.authService.validateUser(input.email, input.password);
                if (!user) {
                    throw new common_1.UnauthorizedException('Credenciales inválidas');
                }
                return this.authService.login(user);
            }),
            register: this.trpc.procedure
                .input(auth_service_1.RegisterSchema)
                .mutation(async ({ input }) => {
                return this.authService.register(input);
            }),
            updateProfile: this.trpc.protectedProcedure
                .input(auth_service_1.ProfileSchema)
                .mutation(async ({ input, ctx }) => {
                return this.egresadosService.updateProfile(ctx.user.sub, input);
            }),
            getMiPerfil: this.trpc.protectedProcedure
                .query(async ({ ctx }) => {
                return this.egresadosService.getMiPerfil(ctx.user.sub);
            }),
            getOfertas: this.trpc.procedure
                .query(async () => {
                return this.ofertasService.getOfertas();
            }),
            crearOferta: this.trpc.protectedProcedure
                .input(auth_service_1.OfertaSchema)
                .mutation(async ({ input, ctx }) => {
                return this.ofertasService.crearOferta(ctx.user.sub, input);
            }),
            postularAOferta: this.trpc.protectedProcedure
                .input(zod_1.z.object({ ofertaId: zod_1.z.string() }))
                .mutation(async ({ input, ctx }) => {
                return this.ofertasService.postularAOferta(ctx.user.sub, parseInt(input.ofertaId));
            }),
            getOfertaCandidatos: this.trpc.protectedProcedure
                .input(zod_1.z.object({ ofertaId: zod_1.z.number() }))
                .query(async ({ input }) => {
                return this.ofertasService.getOfertaCandidatos(input.ofertaId);
            }),
            getMisPostulaciones: this.trpc.protectedProcedure
                .query(async ({ ctx }) => {
                return this.ofertasService.getPostulacionesByEgresado(ctx.user.sub);
            }),
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
            eliminarUsuario: this.trpc.protectedProcedure
                .input(zod_1.z.object({ id: zod_1.z.number() }))
                .mutation(async ({ input }) => {
                return this.authService.eliminarUsuario(input.id);
            }),
            eliminarOferta: this.trpc.protectedProcedure
                .input(zod_1.z.object({ id: zod_1.z.number() }))
                .mutation(async ({ input }) => {
                return this.ofertasService.eliminarOferta(input.id);
            }),
            updateOferta: this.trpc.protectedProcedure
                .input(zod_1.z.object({
                id: zod_1.z.number(),
                titulo: zod_1.z.string().min(5),
                descripcion: zod_1.z.string().min(20),
                ubicacion: zod_1.z.string().min(3),
                salarioMin: zod_1.z.coerce.number().min(1),
                salarioMax: zod_1.z.coerce.number().min(1),
                modalidad: zod_1.z.enum(['PRESENCIAL', 'REMOTO', 'HIBRIDO']),
                requisitos: zod_1.z.array(zod_1.z.string()),
            }))
                .mutation(async ({ input }) => {
                return this.ofertasService.updateOferta(input.id, input);
            }),
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
};
exports.TrpcRouter = TrpcRouter;
exports.TrpcRouter = TrpcRouter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [trpc_service_1.TrpcService,
        auth_service_1.AuthService,
        dashboard_service_1.DashboardService,
        egresados_service_1.EgresadosService,
        ofertas_service_1.OfertasService,
        reportes_service_1.ReportesService])
], TrpcRouter);
//# sourceMappingURL=trpc.router.js.map