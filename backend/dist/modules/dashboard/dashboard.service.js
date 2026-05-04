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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let DashboardService = class DashboardService {
    constructor(pool) {
        this.pool = pool;
    }
    async getAdminStats() {
        const totalEgresadosRes = await this.pool.query('SELECT COUNT(*) FROM perfiles_egresados');
        const totalEmpresasRes = await this.pool.query('SELECT COUNT(*) FROM perfiles_empresas');
        const ofertasActivasRes = await this.pool.query('SELECT COUNT(*) FROM ofertas_laborales WHERE activa = TRUE');
        const empleabilidadRes = await this.pool.query(`
      SELECT ROUND(COUNT(*) FILTER (WHERE empleado = TRUE) * 100.0 / NULLIF(COUNT(*), 0), 1) as tasa 
      FROM perfiles_egresados
    `);
        const evolucionRes = await this.pool.query(`
      WITH meses AS (
        SELECT generate_series(
          date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
          date_trunc('month', CURRENT_DATE),
          '1 month'::interval
        ) as mes_inicio
      )
      SELECT 
        to_char(m.mes_inicio, 'Mon') as mes,
        COUNT(DISTINCT o.id) as ofertas,
        COUNT(DISTINCT p.id) as postulaciones
      FROM meses m
      LEFT JOIN ofertas_laborales o ON date_trunc('month', o.fecha_creacion) = m.mes_inicio
      LEFT JOIN postulaciones p ON date_trunc('month', p.fecha_postulacion) = m.mes_inicio
      GROUP BY m.mes_inicio
      ORDER BY m.mes_inicio ASC
    `);
        const carrerasRes = await this.pool.query(`
      SELECT carrera as name, COUNT(*) as value 
      FROM perfiles_egresados 
      GROUP BY carrera 
      ORDER BY value DESC
    `);
        const skillsRes = await this.pool.query(`
      SELECT nombre as subject, 100 as A, 80 as B, 150 as "fullMark"
      FROM habilidades
      LIMIT 6
    `);
        const sectoresRes = await this.pool.query(`
      SELECT sector, COUNT(*) as cantidad
      FROM perfiles_empresas
      GROUP BY sector
    `);
        const sectorColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        return {
            totalEgresados: parseInt(totalEgresadosRes.rows[0].count),
            totalEmpresas: parseInt(totalEmpresasRes.rows[0].count),
            ofertasActivas: parseInt(ofertasActivasRes.rows[0].count),
            tasaEmpleabilidad: parseFloat(empleabilidadRes.rows[0].tasa || '0'),
            evolucionOfertas: evolucionRes.rows.map(row => ({
                mes: row.mes,
                ofertas: parseInt(row.ofertas),
                postulaciones: parseInt(row.postulaciones)
            })),
            distribucionCarrera: carrerasRes.rows.map(row => ({
                name: row.name,
                value: parseInt(row.value)
            })),
            demandaHabilidades: skillsRes.rows.length > 0 ? skillsRes.rows : [
                { subject: 'React', A: 120, B: 110, fullMark: 150 },
                { subject: 'Node.js', A: 98, B: 130, fullMark: 150 },
            ],
            empleabilidadPorSector: sectoresRes.rows.map((s, i) => ({
                sector: s.sector,
                cantidad: parseInt(s.cantidad),
                color: sectorColors[i % sectorColors.length]
            })),
            actividadReciente: [
                { name: 'Ana Garcia', company: 'Tech Corp', role: 'Fullstack Dev', status: 'Entrevista', color: 'indigo' },
                { name: 'Luis Pérez', company: 'Data Soft', role: 'Data Analyst', status: 'Pendiente', color: 'slate' },
                { name: 'Marta Rivas', company: 'Build IT', role: 'Project Manager', status: 'Aceptado', color: 'emerald' },
            ]
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_POOL')),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Pool !== "undefined" && pg_1.Pool) === "function" ? _a : Object])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map