import { Pool } from 'pg';
export declare class EgresadosService {
    private pool;
    constructor(pool: Pool);
    getAdminEgresados(): Promise<any>;
    getEgresadoStats(userId: number): Promise<{
        misPostulaciones: number;
        ofertasRecomendadas: number;
        perfilCompletado: number;
        visitasPerfil: number;
        proximasEntrevistas: any;
    }>;
    updateProfile(userId: number, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getMiPerfil(userId: number): Promise<any>;
}
