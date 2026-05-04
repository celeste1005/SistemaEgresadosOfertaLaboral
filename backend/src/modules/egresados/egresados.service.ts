import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class EgresadosService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

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

  async getEgresadoStats(userId: number) {
    const postulacionesRes = await this.pool.query(
      'SELECT COUNT(*) FROM postulaciones WHERE egresado_id = $1',
      [userId]
    );

    const perfilRes = await this.pool.query(
      'SELECT * FROM perfiles_egresados WHERE usuario_id = $1',
      [userId]
    );

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
      ofertasRecomendadas: 12, // Simulado o basado en habilidades
      perfilCompletado: perfilRes.rows[0] ? 85 : 0,
      visitasPerfil: 24,
      proximasEntrevistas: entrevistasRes.rows
    };
  }

  async updateProfile(userId: number, data: any) {
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

  async getMiPerfil(userId: number) {
    const perfilRes = await this.pool.query(
      'SELECT * FROM perfiles_egresados WHERE usuario_id = $1',
      [userId]
    );
    return perfilRes.rows[0] || null;
  }
}
