import { Pool } from 'pg';
export declare class ReportesService {
    private pool;
    constructor(pool: Pool);
    getAdminReportes(): Promise<any>;
    generarReportePDF(tipo: string, filtros: any): Promise<{
        id: string;
        status: string;
        mensaje: string;
    }>;
}
