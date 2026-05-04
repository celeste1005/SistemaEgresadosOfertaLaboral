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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let ReportesService = class ReportesService {
    constructor(pool) {
        this.pool = pool;
    }
    async getAdminReportes() {
        const res = await this.pool.query(`
      SELECT 
        id, 
        tipo_reporte as tipo, 
        fecha_generacion as fecha, 
        'Admin' as autor,
        CONCAT('Reporte ', tipo_reporte, ' ', to_char(fecha_generacion, 'DD/MM')) as nombre
      FROM reportes_generados
      ORDER BY fecha_generacion DESC
    `);
        return res.rows;
    }
    async generarReportePDF(tipo, filtros) {
        console.log(`Iniciando generación de reporte ${tipo} con filtros:`, filtros);
        return {
            id: 'rep_12345',
            status: 'PROCESANDO',
            mensaje: 'El reporte se está generando en segundo plano.'
        };
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_POOL')),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Pool !== "undefined" && pg_1.Pool) === "function" ? _a : Object])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map