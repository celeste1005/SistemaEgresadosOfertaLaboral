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
exports.OfertasService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let OfertasService = class OfertasService {
    constructor(pool) {
        this.pool = pool;
    }
    async getOfertas() {
        const res = await this.pool.query(`
      SELECT 
        o.id, 
        o.empresa_id as "empresaId",
        o.titulo, 
        o.descripcion,
        o.requisitos,
        pe.nombre_empresa as empresa, 
        pe.sitio_web as "sitioWeb",
        pe.descripcion as "empresaDescripcion",
        o.ubicacion, 
        CONCAT('$', o.rango_salarial_min, ' - $', o.rango_salarial_max) as salario,
        o.modalidad as tipo,
        LEFT(pe.nombre_empresa, 2) as logo
      FROM ofertas_laborales o
      JOIN perfiles_empresas pe ON o.empresa_id = pe.usuario_id
      WHERE o.activa = TRUE
      ORDER BY o.fecha_creacion DESC
    `);
        return res.rows;
    }
    async crearOferta(empresaId, data) {
        const { titulo, descripcion, ubicacion, salario, tipo, requisitos } = data;
        const salarios = salario.replace(/[^0-9-]/g, '').split('-');
        const min = parseFloat(salarios[0]) || 0;
        const max = parseFloat(salarios[1]) || min;
        await this.pool.query(`
      INSERT INTO ofertas_laborales (empresa_id, titulo, descripcion, requisitos, modalidad, rango_salarial_min, rango_salarial_max, ubicacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [empresaId, titulo, descripcion, requisitos.join(', '), tipo.toUpperCase(), min, max, ubicacion]);
        return { success: true, message: 'Oferta publicada exitosamente' };
    }
    async postularAOferta(egresadoId, ofertaId) {
        await this.pool.query(`
      INSERT INTO postulaciones (oferta_id, egresado_id, estado)
      VALUES ($1, $2, 'POSTULADO')
      ON CONFLICT (oferta_id, egresado_id) DO NOTHING
    `, [ofertaId, egresadoId]);
        return { success: true, message: 'Tu postulación ha sido enviada con éxito' };
    }
    async getEmpresaStats(empresaId) {
        const activasRes = await this.pool.query('SELECT COUNT(*) FROM ofertas_laborales WHERE empresa_id = $1 AND activa = TRUE', [empresaId]);
        const postulantesRes = await this.pool.query(`
      SELECT COUNT(*) 
      FROM postulaciones p
      JOIN ofertas_laborales o ON p.oferta_id = o.id
      WHERE o.empresa_id = $1
    `, [empresaId]);
        const entrevistasRes = await this.pool.query(`
      SELECT COUNT(*) 
      FROM postulaciones p
      JOIN ofertas_laborales o ON p.oferta_id = o.id
      WHERE o.empresa_id = $1 AND p.estado = 'ENTREVISTA'
    `, [empresaId]);
        const porOfertaRes = await this.pool.query(`
      SELECT o.titulo, COUNT(p.id) as cantidad
      FROM ofertas_laborales o
      LEFT JOIN postulaciones p ON o.id = p.oferta_id
      WHERE o.empresa_id = $1
      GROUP BY o.id, o.titulo
      LIMIT 5
    `, [empresaId]);
        return {
            ofertasActivas: parseInt(activasRes.rows[0].count),
            totalPostulantes: parseInt(postulantesRes.rows[0].count),
            entrevistasProgramadas: parseInt(entrevistasRes.rows[0].count),
            calificacionEmpresa: 4.8,
            postulacionesPorOferta: porOfertaRes.rows.map(r => ({
                titulo: r.titulo,
                cantidad: parseInt(r.cantidad)
            }))
        };
    }
    async getAdminEmpresas() {
        const res = await this.pool.query(`
      SELECT 
        u.id, 
        pe.nombre_empresa as nombre, 
        pe.sector, 
        pe.sitio_web as "sitioWeb",
        pe.ubicacion,
        pe.descripcion,
        (SELECT COUNT(*) FROM ofertas_laborales WHERE empresa_id = u.id) as ofertas,
        'Activa' as estado
      FROM usuarios u
      JOIN perfiles_empresas pe ON u.id = pe.usuario_id
      WHERE u.rol = 'EMPRESA'
    `);
        return res.rows;
    }
    async eliminarOferta(id) {
        await this.pool.query('DELETE FROM ofertas_laborales WHERE id = $1', [id]);
        return { success: true, message: 'Oferta eliminada correctamente' };
    }
    async updateOferta(id, data) {
        const { titulo, descripcion, ubicacion, salarioMin, salarioMax, modalidad, requisitos } = data;
        await this.pool.query(`UPDATE ofertas_laborales
       SET titulo = $2,
           descripcion = $3,
           requisitos = $4,
           modalidad = $5,
           rango_salarial_min = $6,
           rango_salarial_max = $7,
           ubicacion = $8
       WHERE id = $1`, [
            id,
            titulo,
            descripcion,
            Array.isArray(requisitos) ? requisitos.join(', ') : requisitos,
            modalidad.toUpperCase(),
            salarioMin,
            salarioMax,
            ubicacion,
        ]);
        return { success: true, message: 'Oferta actualizada correctamente' };
    }
    async getOfertaCandidatos(ofertaId) {
        const res = await this.pool.query(`SELECT 
         p.id as "postulacionId",
         u.nombre_completo as nombre,
         u.email,
         pe.carrera,
         pe.año_egreso as "anioEgreso",
         pe.ubicacion,
         p.estado,
         p.fecha_postulacion as "fechaPostulacion"
       FROM postulaciones p
       JOIN perfiles_egresados pe ON p.egresado_id = pe.usuario_id
       JOIN usuarios u ON u.id = pe.usuario_id
       WHERE p.oferta_id = $1
       ORDER BY p.fecha_postulacion DESC`, [ofertaId]);
        return res.rows;
    }
    async getPostulacionesByEgresado(egresadoId) {
        const res = await this.pool.query('SELECT oferta_id FROM postulaciones WHERE egresado_id = $1', [egresadoId]);
        return res.rows.map(r => r.oferta_id);
    }
};
exports.OfertasService = OfertasService;
exports.OfertasService = OfertasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_POOL')),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Pool !== "undefined" && pg_1.Pool) === "function" ? _a : Object])
], OfertasService);
//# sourceMappingURL=ofertas.service.js.map