import { Pool } from 'pg';
export declare class OfertasService {
    private pool;
    constructor(pool: Pool);
    getOfertas(): Promise<any>;
    crearOferta(empresaId: number, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
    postularAOferta(egresadoId: number, ofertaId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getEmpresaStats(empresaId: number): Promise<{
        ofertasActivas: number;
        totalPostulantes: number;
        entrevistasProgramadas: number;
        calificacionEmpresa: number;
        postulacionesPorOferta: any;
    }>;
    getAdminEmpresas(): Promise<any>;
    eliminarOferta(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateOferta(id: number, data: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getOfertaCandidatos(ofertaId: number): Promise<any>;
    getPostulacionesByEgresado(egresadoId: number): Promise<any>;
}
