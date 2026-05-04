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
exports.EgresadosService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let EgresadosService = class EgresadosService {
    constructor(pool) {
        this.pool = pool;
    }
    async getAdminEgresados() {
        const res = await this.pool.query(`
      SELECT 
        u.id, 
        u.nombre_completo as nombre, 
        pe.carrera, 
        pe.año_egreso as "anioEgreso", 
        u.email,
        CASE WHEN pe.empleado THEN 'Empleado' ELSE 'En Búsqueda' END as estado
      FROM usuarios u
      JOIN perfiles_egresados pe ON u.id = pe.usuario_id
      WHERE u.rol = 'EGRESADO'
    `);
        return res.rows;
    }
    async getEgresadoStats(userId) {
        const postulacionesRes = await this.pool.query('SELECT COUNT(*) FROM postulaciones WHERE egresado_id = $1', [userId]);
        const perfilRes = await this.pool.query('SELECT * FROM perfiles_egresados WHERE usuario_id = $1', [userId]);
        const entrevistasRes = await this.pool.query(`
      SELECT pe.nombre_empresa as empresa, o.fecha_creacion as fecha, '10:00 AM' as hora
      FROM postulaciones p
      JOIN ofertas_laborales o ON p.oferta_id = o.id
      JOIN perfiles_empresas pe ON o.empresa_id = pe.usuario_id
      WHERE p.egresado_id = $1 AND p.estado = 'ENTREVISTA'
      LIMIT 3
    `, [userId]);
        return {
            misPostulaciones: parseInt(postulacionesRes.rows[0].count),
            ofertasRecomendadas: 12,
            perfilCompletado: perfilRes.rows[0] ? 85 : 0,
            visitasPerfil: 24,
            proximasEntrevistas: entrevistasRes.rows
        };
    }
    async updateProfile(userId, data) {
        const { carrera, anioEgreso, telefono, direccion, habilidades, experiencia } = data;
        await this.pool.query(`
      INSERT INTO perfiles_egresados (usuario_id, carrera, año_egreso, telefono, ubicacion, biografia, habilidades_tecnicas)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (usuario_id) DO UPDATE SET
        carrera = EXCLUDED.carrera,
        año_egreso = EXCLUDED.año_egreso,
        telefono = EXCLUDED.telefono,
        ubicacion = EXCLUDED.ubicacion,
        biografia = EXCLUDED.biografia,
        habilidades_tecnicas = EXCLUDED.habilidades_tecnicas
    `, [userId, carrera, anioEgreso, telefono, direccion, experiencia, JSON.stringify(habilidades || [])]);
        return { success: true, message: 'Perfil actualizado correctamente' };
    }
    async getMiPerfil(userId) {
        const perfilRes = await this.pool.query('SELECT * FROM perfiles_egresados WHERE usuario_id = $1', [userId]);
        return perfilRes.rows[0] || null;
    }
};
exports.EgresadosService = EgresadosService;
exports.EgresadosService = EgresadosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_POOL')),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Pool !== "undefined" && pg_1.Pool) === "function" ? _a : Object])
], EgresadosService);
//# sourceMappingURL=egresados.service.js.map