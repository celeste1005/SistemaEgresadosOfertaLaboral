import { Pool } from 'pg';
export declare class DashboardService {
    private pool;
    constructor(pool: Pool);
    getAdminStats(): Promise<{
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
    }>;
}
