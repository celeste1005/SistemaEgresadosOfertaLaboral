import { TrpcService } from './trpc.service';
import { AuthService } from '../modules/auth/auth.service';
import { DashboardService } from '../modules/dashboard/dashboard.service';
import { EgresadosService } from '../modules/egresados/egresados.service';
import { OfertasService } from '../modules/ofertas/ofertas.service';
import { ReportesService } from '../modules/reportes/reportes.service';
export declare class TrpcRouter {
    private trpc;
    private authService;
    private dashboardService;
    private egresadosService;
    private ofertasService;
    private reportesService;
    constructor(trpc: TrpcService, authService: AuthService, dashboardService: DashboardService, egresadosService: EgresadosService, ofertasService: OfertasService, reportesService: ReportesService);
    appRouter: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("./trpc.service").TrpcContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        login: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email?: string;
                password?: string;
            };
            output: {
                access_token: string;
                user: {
                    id: any;
                    email: any;
                    rol: any;
                };
            };
            meta: object;
        }>;
        register: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email?: string;
                password?: string;
                nombre?: string;
                rol?: "ADMIN" | "EGRESADO" | "EMPRESA";
                carrera?: string;
                anioEgreso?: number;
                sector?: string;
                sitioWeb?: string;
                ubicacion?: string;
            };
            output: {
                success: boolean;
                message: string;
                userId: any;
            };
            meta: object;
        }>;
        updateProfile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                carrera?: string;
                anioEgreso?: number;
                telefono?: string;
                direccion?: string;
                habilidades?: string[];
                experiencia?: string;
                linkedin?: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        getMiPerfil: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getOfertas: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        crearOferta: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ubicacion?: string;
                titulo?: string;
                descripcion?: string;
                empresa?: string;
                salario?: string;
                tipo?: "Full-time" | "Part-time" | "Contract" | "Internship";
                requisitos?: string[];
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        postularAOferta: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ofertaId?: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        getOfertaCandidatos: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                ofertaId?: number;
            };
            output: any;
            meta: object;
        }>;
        getMisPostulaciones: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getAdminEgresados: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getAdminEmpresas: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        getAdminReportes: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
        eliminarUsuario: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id?: number;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        eliminarOferta: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id?: number;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        updateOferta: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                ubicacion?: string;
                titulo?: string;
                descripcion?: string;
                requisitos?: string[];
                salarioMin?: number;
                salarioMax?: number;
                modalidad?: "PRESENCIAL" | "REMOTO" | "HIBRIDO";
                id?: number;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        getAdminStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                totalEgresados: number;
                totalEmpresas: number;
                ofertasActivas: number;
                tasaEmpleabilidad: number;
                evolucionOfertas: any;
                distribucionCarrera: any;
                demandaHabilidades: any;
                empleabilidadPorSector: any;
                actividadReciente: {
                    name: string;
                    company: string;
                    role: string;
                    status: string;
                    color: string;
                }[];
            };
            meta: object;
        }>;
        getEgresadoStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                misPostulaciones: number;
                ofertasRecomendadas: number;
                perfilCompletado: number;
                visitasPerfil: number;
                proximasEntrevistas: any;
            };
            meta: object;
        }>;
        getEmpresaStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                ofertasActivas: number;
                totalPostulantes: number;
                entrevistasProgramadas: number;
                calificacionEmpresa: number;
                postulacionesPorOferta: any;
            };
            meta: object;
        }>;
    }>>;
}
export type AppRouter = TrpcRouter['appRouter'];
