-- =======================================================================
-- SISTEMA DE GESTIÓN DE EGRESADOS Y OFERTA LABORAL
-- Script completo para PostgreSQL 15+ (funciona también en 12+)
-- Nombres de tablas y campos en ESPAÑOL
-- Ejecutar en pgAdmin 4 (Query Tool) o con psql
-- =======================================================================

-- (Opcional: habilita búsqueda de texto avanzada. Si da error, comenta esta línea)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =======================================================================
-- 1. ENUMS (dominios personalizados)
-- =======================================================================

CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'EGRESADO', 'EMPRESA');
CREATE TYPE estado_postulacion AS ENUM ('POSTULADO', 'EN_REVISION', 'ENTREVISTA', 'CONTRATADO', 'RECHAZADO');
CREATE TYPE modalidad_trabajo AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');
CREATE TYPE tipo_habilidad AS ENUM ('DURA', 'BLANDA');

-- =======================================================================
-- 2. TABLA PRINCIPAL: USUARIOS (autenticación y roles)
-- =======================================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    rol_usuario rol_usuario NOT NULL DEFAULT 'EGRESADO',
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================================
-- 3. EGRESADOS (hereda de usuarios)
-- =======================================================================

CREATE TABLE egresados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(255) NOT NULL,
    carrera VARCHAR(150) NOT NULL,
    anio_graduacion INT CHECK (anio_graduacion BETWEEN 1950 AND EXTRACT(YEAR FROM NOW())),
    anios_experiencia INT DEFAULT 0,
    habilidades_jsonb JSONB DEFAULT '[]',
    url_cv TEXT,
    ubicacion VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================================
-- 4. EMPRESAS (hereda de usuarios)
-- =======================================================================

CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_empresa VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    ubicacion VARCHAR(255),
    descripcion TEXT,
    sitio_web VARCHAR(255),
    verificada BOOLEAN DEFAULT false,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================================
-- 5. OFERTAS LABORALES
-- =======================================================================

CREATE TABLE ofertas_laborales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    modalidad modalidad_trabajo NOT NULL,
    salario_min DECIMAL(12,2),
    salario_max DECIMAL(12,2),
    ubicacion VARCHAR(255),
    habilidades_requeridas JSONB DEFAULT '[]',
    activa BOOLEAN DEFAULT true,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP,
    CONSTRAINT chk_salario CHECK (salario_min <= salario_max)
);

-- =======================================================================
-- 6. POSTULACIONES (aplicaciones)
-- =======================================================================

CREATE TABLE postulaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oferta_id UUID NOT NULL REFERENCES ofertas_laborales(id) ON DELETE CASCADE,
    egresado_id UUID NOT NULL REFERENCES egresados(id) ON DELETE CASCADE,
    estado estado_postulacion DEFAULT 'POSTULADO',
    historial_estados JSONB DEFAULT '[]',
    comentarios TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_postulacion UNIQUE(oferta_id, egresado_id)
);

-- =======================================================================
-- 7. NOTIFICACIONES (in-app)
-- =======================================================================

CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    metadata JSONB,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================================
-- 8. CATÁLOGO DE HABILIDADES
-- =======================================================================

CREATE TABLE habilidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    tipo_habilidad tipo_habilidad NOT NULL,
    categoria VARCHAR(100)
);

-- =======================================================================
-- 9. RELACIÓN EGRESADO - HABILIDAD (muchos a muchos)
-- =======================================================================

CREATE TABLE egresado_habilidad (
    egresado_id UUID NOT NULL REFERENCES egresados(id) ON DELETE CASCADE,
    habilidad_id UUID NOT NULL REFERENCES habilidades(id) ON DELETE CASCADE,
    nivel_proficiencia INT CHECK (nivel_proficiencia BETWEEN 1 AND 5),
    PRIMARY KEY (egresado_id, habilidad_id)
);

-- =======================================================================
-- 10. REPORTES PDF GENERADOS (historial)
-- =======================================================================

CREATE TABLE reportes_pdf (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_reporte VARCHAR(50) NOT NULL,
    formato VARCHAR(20) DEFAULT 'PDF',
    url_archivo TEXT,
    parametros JSONB,
    generado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================================
-- ÍNDICES ESTRATÉGICOS PARA RENDIMIENTO
-- =======================================================================

-- Búsqueda de habilidades (JSONB)
CREATE INDEX idx_egresados_habilidad ON egresados USING GIN (habilidades_jsonb);
CREATE INDEX idx_ofertas_habilidad ON ofertas_laborales USING GIN (habilidades_requeridas);

-- Filtros comunes
CREATE INDEX idx_egresados_carrera_anio ON egresados(carrera, anio_graduacion);
CREATE INDEX idx_ofertas_modalidad_salario ON ofertas_laborales(modalidad, salario_min, salario_max);
CREATE INDEX idx_ofertas_activa_fecha ON ofertas_laborales(activa, fecha_publicacion DESC);

-- Postulaciones (dashboards y estados)
CREATE INDEX idx_postulaciones_estado_actualizado ON postulaciones(estado, actualizado_en DESC);
CREATE INDEX idx_postulaciones_egresado_estado ON postulaciones(egresado_id, estado);
CREATE INDEX idx_postulaciones_oferta_estado ON postulaciones(oferta_id, estado);

-- Búsqueda textual parcial (opcional: requiere extensión pg_trgm)
CREATE INDEX idx_egresados_nombre_trgm ON egresados USING GIN (nombre_completo gin_trgm_ops);
CREATE INDEX idx_ofertas_titulo_trgm ON ofertas_laborales USING GIN (titulo gin_trgm_ops);

-- Fechas
CREATE INDEX idx_notificaciones_usuario_creado ON notificaciones(usuario_id, creado_en DESC);
CREATE INDEX idx_reportes_usuario_generado ON reportes_pdf(usuario_id, generado_en DESC);

-- =======================================================================
-- TRIGGER PARA ACTUALIZAR 'actualizado_en' AUTOMÁTICAMENTE
-- =======================================================================

CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_usuarios
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_postulaciones
    BEFORE UPDATE ON postulaciones
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- =======================================================================
-- DATOS DE PRUEBA (SEED) - MÍNIMOS PERO SIGNIFICATIVOS
-- =======================================================================

-- 1. HABILIDADES (catálogo base)
INSERT INTO habilidades (nombre, tipo_habilidad, categoria) VALUES
('JavaScript', 'DURA', 'Programación'),
('TypeScript', 'DURA', 'Programación'),
('Python', 'DURA', 'Programación'),
('React', 'DURA', 'Frontend'),
('Node.js', 'DURA', 'Backend'),
('Trabajo en Equipo', 'BLANDA', 'Colaboración'),
('Comunicación', 'BLANDA', 'Soft Skills'),
('Liderazgo', 'BLANDA', 'Gestión');

-- 2. USUARIOS (con contraseñas simuladas -- en producción usar hashes reales de bcrypt)
-- NOTA: Las contraseñas de ejemplo son 'Password123!' pero como texto plano (solo desarrollo)
INSERT INTO usuarios (id, email, contrasena_hash, rol_usuario) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'hash_admin_123', 'ADMIN'),
('22222222-2222-2222-2222-222222222222', 'admin2@example.com', 'hash_admin_456', 'ADMIN'),
('33333333-3333-3333-3333-333333333333', 'juan.perez@email.com', 'hash_juan_123', 'EGRESADO'),
('44444444-4444-4444-4444-444444444444', 'maria.gomez@email.com', 'hash_maria_456', 'EGRESADO'),
('55555555-5555-5555-5555-555555555555', 'carlos.lopez@email.com', 'hash_carlos_789', 'EGRESADO'),
('66666666-6666-6666-6666-666666666666', 'ana.martinez@email.com', 'hash_ana_101', 'EGRESADO'),
('77777777-7777-7777-7777-777777777777', 'laura.fernandez@email.com', 'hash_laura_112', 'EGRESADO'),
('88888888-8888-8888-8888-888888888888', 'techcorp@empresa.com', 'hash_techcorp', 'EMPRESA'),
('99999999-9999-9999-9999-999999999999', 'softsol@empresa.com', 'hash_softsol', 'EMPRESA'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'datadyn@empresa.com', 'hash_datadyn', 'EMPRESA');

-- 3. EGRESADOS
INSERT INTO egresados (id, usuario_id, nombre_completo, carrera, anio_graduacion, anios_experiencia, habilidades_jsonb, ubicacion) VALUES
('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Juan Pérez', 'Ingeniería Informática', 2022, 2, '["JavaScript", "React", "Node.js"]', 'Santiago'),
('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'María Gómez', 'Ingeniería Civil', 2021, 3, '["Python", "TypeScript", "Comunicación"]', 'Valparaíso'),
('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Carlos López', 'Administración', 2023, 1, '["Trabajo en Equipo", "Liderazgo"]', 'Concepción'),
('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Ana Martínez', 'Diseño', 2020, 4, '["JavaScript", "React", "Comunicación"]', 'Santiago'),
('77777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Laura Fernández', 'Marketing', 2022, 2, '["Trabajo en Equipo", "Comunicación"]', 'Antofagasta');

-- 4. EMPRESAS
INSERT INTO empresas (id, usuario_id, nombre_empresa, sector, ubicacion, verificada) VALUES
('88888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'TechCorp', 'Tecnología', 'Santiago', true),
('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'SoftSol', 'Software', 'Valparaíso', true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DataDyn', 'Consultoría', 'Concepción', false);

-- 5. OFERTAS LABORALES
INSERT INTO ofertas_laborales (id, empresa_id, titulo, descripcion, modalidad, salario_min, salario_max, ubicacion, habilidades_requeridas, activa) VALUES
('11111111-0000-1111-0000-111111111111', '88888888-8888-8888-8888-888888888888', 'Desarrollador Fullstack', 'Buscamos desarrollador con experiencia en React y Node.js', 'HIBRIDO', 1200000, 1800000, 'Santiago', '["JavaScript", "React", "Node.js"]', true),
('22222222-0000-2222-0000-222222222222', '88888888-8888-8888-8888-888888888888', 'Ingeniero de Datos', 'Experiencia en Python y bases de datos', 'REMOTO', 1500000, 2200000, 'Remoto', '["Python", "TypeScript"]', true),
('33333333-0000-3333-0000-333333333333', '99999999-9999-9999-9999-999999999999', 'Product Owner', 'Gestión de equipos ágiles', 'PRESENCIAL', 1600000, 2000000, 'Valparaíso', '["Liderazgo", "Trabajo en Equipo"]', true),
('44444444-0000-4444-0000-444444444444', '99999999-9999-9999-9999-999999999999', 'UX/UI Designer', 'Diseño de interfaces', 'HIBRIDO', 1000000, 1400000, 'Valparaíso', '["React", "Comunicación"]', true),
('55555555-0000-5555-0000-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Analista de Marketing', 'Estrategias digitales', 'REMOTO', 900000, 1200000, 'Remoto', '["Comunicación", "Trabajo en Equipo"]', true),
('66666666-0000-6666-0000-666666666666', '88888888-8888-8888-8888-888888888888', 'DevOps Engineer', 'Infraestructura cloud', 'REMOTO', 1700000, 2300000, 'Remoto', '["Node.js", "Python"]', true),
('77777777-0000-7777-0000-777777777777', '99999999-9999-9999-9999-999999999999', 'Scrum Master', 'Metodologías ágiles', 'HIBRIDO', 1300000, 1700000, 'Valparaíso', '["Liderazgo", "Trabajo en Equipo"]', true),
('88888888-0000-8888-0000-888888888888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Data Analyst', 'Análisis de datos y reportes', 'PRESENCIAL', 1100000, 1500000, 'Concepción', '["Python", "TypeScript"]', true);

-- 6. POSTULACIONES (con historial de estados)
INSERT INTO postulaciones (id, oferta_id, egresado_id, estado, historial_estados, comentarios) VALUES
('11111111-1111-0000-1111-111111111111', '11111111-0000-1111-0000-111111111111', '33333333-3333-3333-3333-333333333333', 'ENTREVISTA', '[{"estado": "POSTULADO", "fecha": "2024-01-10"}, {"estado": "EN_REVISION", "fecha": "2024-01-15"}, {"estado": "ENTREVISTA", "fecha": "2024-01-20"}]', 'Cumple con requisitos técnicos'),
('22222222-2222-0000-2222-222222222222', '22222222-0000-2222-0000-222222222222', '44444444-4444-4444-4444-444444444444', 'CONTRATADO', '[{"estado": "POSTULADO", "fecha": "2024-01-05"}, {"estado": "EN_REVISION", "fecha": "2024-01-08"}, {"estado": "ENTREVISTA", "fecha": "2024-01-12"}, {"estado": "CONTRATADO", "fecha": "2024-01-20"}]', 'Excelente perfil técnico'),
('33333333-3333-0000-3333-333333333333', '33333333-0000-3333-0000-333333333333', '55555555-5555-5555-5555-555555555555', 'EN_REVISION', '[{"estado": "POSTULADO", "fecha": "2024-01-18"}, {"estado": "EN_REVISION", "fecha": "2024-01-22"}]', 'Evaluando experiencia en liderazgo'),
('44444444-4444-0000-4444-444444444444', '44444444-0000-4444-0000-444444444444', '66666666-6666-6666-6666-666666666666', 'RECHAZADO', '[{"estado": "POSTULADO", "fecha": "2024-01-02"}, {"estado": "EN_REVISION", "fecha": "2024-01-05"}, {"estado": "RECHAZADO", "fecha": "2024-01-10"}]', 'No cumple con expectativas de diseño'),
('55555555-5555-0000-5555-555555555555', '55555555-0000-5555-0000-555555555555', '77777777-7777-7777-7777-777777777777', 'POSTULADO', '[{"estado": "POSTULADO", "fecha": "2024-01-25"}]', 'Recién postulado'),
('66666666-6666-0000-6666-666666666666', '11111111-0000-1111-0000-111111111111', '44444444-4444-4444-4444-444444444444', 'EN_REVISION', '[{"estado": "POSTULADO", "fecha": "2024-01-12"}, {"estado": "EN_REVISION", "fecha": "2024-01-16"}]', 'Segunda postulación a la empresa'),
('77777777-7777-0000-7777-777777777777', '22222222-0000-2222-0000-222222222222', '33333333-3333-3333-3333-333333333333', 'ENTREVISTA', '[{"estado": "POSTULADO", "fecha": "2024-01-20"}, {"estado": "EN_REVISION", "fecha": "2024-01-23"}, {"estado": "ENTREVISTA", "fecha": "2024-01-28"}]', 'Agendada entrevista técnica'),
('88888888-8888-0000-8888-888888888888', '33333333-0000-3333-0000-333333333333', '66666666-6666-6666-6666-666666666666', 'POSTULADO', '[{"estado": "POSTULADO", "fecha": "2024-01-27"}]', 'Postulación reciente'),
('99999999-9999-0000-9999-999999999999', '44444444-0000-4444-0000-444444444444', '55555555-5555-5555-5555-555555555555', 'EN_REVISION', '[{"estado": "POSTULADO", "fecha": "2024-01-15"}, {"estado": "EN_REVISION", "fecha": "2024-01-19"}]', 'Evaluando portafolio'),
('aaaaaaaa-aaaa-0000-aaaa-aaaaaaaaaaaa', '55555555-0000-5555-0000-555555555555', '33333333-3333-3333-3333-333333333333', 'ENTREVISTA', '[{"estado": "POSTULADO", "fecha": "2024-01-08"}, {"estado": "EN_REVISION", "fecha": "2024-01-11"}, {"estado": "ENTREVISTA", "fecha": "2024-01-15"}]', 'Buena comunicación'),
('bbbbbbbb-bbbb-0000-bbbb-bbbbbbbbbbbb', '66666666-0000-6666-0000-666666666666', '77777777-7777-7777-7777-777777777777', 'CONTRATADO', '[{"estado": "POSTULADO", "fecha": "2024-01-01"}, {"estado": "EN_REVISION", "fecha": "2024-01-04"}, {"estado": "ENTREVISTA", "fecha": "2024-01-08"}, {"estado": "CONTRATADO", "fecha": "2024-01-15"}]', 'Contratación exitosa'),
('cccccccc-cccc-0000-cccc-cccccccccccc', '77777777-0000-7777-0000-777777777777', '44444444-4444-4444-4444-444444444444', 'POSTULADO', '[{"estado": "POSTULADO", "fecha": "2024-01-29"}]', 'Esperando revisión'),
('dddddddd-dddd-0000-dddd-dddddddddddd', '88888888-0000-8888-0000-888888888888', '55555555-5555-5555-5555-555555555555', 'EN_REVISION', '[{"estado": "POSTULADO", "fecha": "2024-01-22"}, {"estado": "EN_REVISION", "fecha": "2024-01-25"}]', 'Análisis de datos'),
('eeeeeeee-eeee-0000-eeee-eeeeeeeeeeee', '11111111-0000-1111-0000-111111111111', '66666666-6666-6666-6666-666666666666', 'RECHAZADO', '[{"estado": "POSTULADO", "fecha": "2024-01-03"}, {"estado": "EN_REVISION", "fecha": "2024-01-06"}, {"estado": "RECHAZADO", "fecha": "2024-01-09"}]', 'No cumple años de experiencia'),
('ffffffff-ffff-0000-ffff-ffffffffffff', '22222222-0000-2222-0000-222222222222', '77777777-7777-7777-7777-777777777777', 'ENTREVISTA', '[{"estado": "POSTULADO", "fecha": "2024-01-11"}, {"estado": "EN_REVISION", "fecha": "2024-01-14"}, {"estado": "ENTREVISTA", "fecha": "2024-01-18"}]', 'Segunda ronda de entrevista');

-- =======================================================================
-- FIN DEL SCRIPT
-- =======================================================================

-- Verificación rápida (opcional)
SELECT 'Base de datos creada correctamente' AS mensaje;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_ofertas FROM ofertas_laborales;
SELECT COUNT(*) AS total_postulaciones FROM postulaciones;