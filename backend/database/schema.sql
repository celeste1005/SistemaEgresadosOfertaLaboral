-- Esquema de Base de Datos para Sistema de Gestión de Egresados y Oferta Laboral

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tipos Enums
CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'EGRESADO', 'EMPRESA');
CREATE TYPE modalidad_oferta AS ENUM ('PRESENCIAL', 'REMOTO', 'HIBRIDO');
CREATE TYPE estado_postulacion AS ENUM ('POSTULADO', 'EN_REVISION', 'ENTREVISTA', 'CONTRATADO', 'RECHAZADO');

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    rol rol_usuario NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Perfiles de Egresados
CREATE TABLE perfiles_egresados (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    carrera VARCHAR(255) NOT NULL,
    año_egreso INTEGER NOT NULL,
    telefono VARCHAR(50),
    ubicacion VARCHAR(255),
    biografia TEXT,
    habilidades_tecnicas JSONB DEFAULT '[]',
    habilidades_blandas JSONB DEFAULT '[]',
    cv_url VARCHAR(512),
    empleado BOOLEAN DEFAULT FALSE
);

-- Tabla de Perfiles de Empresas
CREATE TABLE perfiles_empresas (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_empresa VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    sitio_web VARCHAR(255),
    descripcion TEXT,
    ubicacion VARCHAR(255)
);

-- Tabla de Ofertas Laborales
CREATE TABLE ofertas_laborales (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES perfiles_empresas(usuario_id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    modalidad modalidad_oferta NOT NULL,
    rango_salarial_min DECIMAL(12,2),
    rango_salarial_max DECIMAL(12,2),
    ubicacion VARCHAR(255),
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP WITH TIME ZONE
);

-- Tabla de Habilidades (Catálogo)
CREATE TABLE habilidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    categoria VARCHAR(50) -- 'TECNICA', 'BLANDA'
);

-- Tabla Intermedia Ofertas - Habilidades
CREATE TABLE oferta_habilidades (
    oferta_id INTEGER REFERENCES ofertas_laborales(id) ON DELETE CASCADE,
    habilidad_id INTEGER REFERENCES habilidades(id) ON DELETE CASCADE,
    PRIMARY KEY (oferta_id, habilidad_id)
);

-- Tabla de Postulaciones
CREATE TABLE postulaciones (
    id SERIAL PRIMARY KEY,
    oferta_id INTEGER NOT NULL REFERENCES ofertas_laborales(id) ON DELETE CASCADE,
    egresado_id INTEGER NOT NULL REFERENCES perfiles_egresados(usuario_id) ON DELETE CASCADE,
    estado estado_postulacion DEFAULT 'POSTULADO',
    fecha_postulacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(oferta_id, egresado_id)
);

-- Historial de Estados de Postulación
CREATE TABLE historial_postulaciones (
    id SERIAL PRIMARY KEY,
    postulacion_id INTEGER NOT NULL REFERENCES postulaciones(id) ON DELETE CASCADE,
    estado_anterior estado_postulacion,
    estado_nuevo estado_postulacion NOT NULL,
    comentario TEXT,
    fecha_cambio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    tipo VARCHAR(50), -- 'INFO', 'SUCCESS', 'WARNING', 'ERROR'
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reportes Generados
CREATE TABLE reportes_generados (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    tipo_reporte VARCHAR(100) NOT NULL,
    parametros JSONB,
    url_archivo VARCHAR(512),
    estado VARCHAR(20) DEFAULT 'PROCESANDO', -- 'PROCESANDO', 'COMPLETADO', 'ERROR'
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_egresados_carrera ON perfiles_egresados(carrera);
CREATE INDEX idx_egresados_año_egreso ON perfiles_egresados(año_egreso);
CREATE INDEX idx_ofertas_empresa ON ofertas_laborales(empresa_id);
CREATE INDEX idx_ofertas_activa ON ofertas_laborales(activa) WHERE activa = TRUE;
CREATE INDEX idx_postulaciones_oferta ON postulaciones(oferta_id);
CREATE INDEX idx_postulaciones_egresado ON postulaciones(egresado_id);
CREATE INDEX idx_habilidades_nombre ON habilidades(nombre);

-- Vistas Materializadas para Dashboards
CREATE MATERIALIZED VIEW mv_empleabilidad_por_carrera AS
SELECT 
    carrera,
    COUNT(*) as total_egresados,
    COUNT(*) FILTER (WHERE empleado = TRUE) as empleados,
    ROUND(COUNT(*) FILTER (WHERE empleado = TRUE) * 100.0 / COUNT(*), 2) as tasa_empleabilidad
FROM perfiles_egresados
GROUP BY carrera;

CREATE MATERIALIZED VIEW mv_demanda_habilidades AS
SELECT 
    h.nombre as habilidad,
    COUNT(oh.oferta_id) as total_demandado
FROM habilidades h
JOIN oferta_habilidades oh ON h.id = oh.habilidad_id
GROUP BY h.nombre
ORDER BY total_demandado DESC;

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Función para refrescar vistas materializadas (ejecutar vía cron o tras cambios masivos)
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_empleabilidad_por_carrera;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_demanda_habilidades;
END;
$$ LANGUAGE plpgsql;
