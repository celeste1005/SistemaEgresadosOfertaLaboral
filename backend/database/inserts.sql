-- Script de Inserts de Prueba para NexusGrad (IDs Simplificados)
-- Puedes ejecutar este script en pgAdmin4 para poblar tu base de datos.

-- 1. Limpieza previa (Opcional)
TRUNCATE reportes_generados, notificaciones, historial_postulaciones, postulaciones, oferta_habilidades, habilidades, ofertas_laborales, perfiles_egresados, perfiles_empresas, usuarios RESTART IDENTITY CASCADE;

-- 2. Insertar Usuarios
INSERT INTO usuarios (email, password_hash, nombre_completo, rol) VALUES
-- Admin (ID: 1)
('admin@nexusgrad.com', '$2b$10$YourHashHere', 'Administrador Principal', 'ADMIN'),
-- Empresas (IDs: 2, 3, 4)
('hr@techcorp.com', '$2b$10$YourHashHere', 'Recursos Humanos TechCorp', 'EMPRESA'),
('contacto@finanzas-sa.com', '$2b$10$YourHashHere', 'Gerencia Finanzas S.A.', 'EMPRESA'),
('jobs@innovate.it', '$2b$10$YourHashHere', 'Talento Innovate IT', 'EMPRESA'),
-- Egresados (IDs: 5, 6, 7, 8, 9, 10, 11)
('ana.garcia@gmail.com', '$2b$10$YourHashHere', 'Ana García', 'EGRESADO'),
('luis.perez@outlook.com', '$2b$10$YourHashHere', 'Luis Pérez', 'EGRESADO'),
('marta.rivas@yahoo.com', '$2b$10$YourHashHere', 'Marta Rivas', 'EGRESADO'),
('carlos.sosa@nexus.com', '$2b$10$YourHashHere', 'Carlos Sosa', 'EGRESADO'),
('elena.ruiz@gmail.com', '$2b$10$YourHashHere', 'Elena Ruiz', 'EGRESADO'),
('juan.sistemas@nexus.com', '$2b$10$YourHashHere', 'Juan Sistemas', 'EGRESADO'),
('maria.admin@nexus.com', '$2b$10$YourHashHere', 'Maria Admin', 'EGRESADO');

-- 3. Perfiles de Empresas
INSERT INTO perfiles_empresas (usuario_id, nombre_empresa, sector, sitio_web, descripcion, ubicacion) VALUES
(2, 'TechCorp SA', 'Tecnología', 'https://techcorp.com', 'Líder en desarrollo de software enterprise.', 'Remoto / Lima'),
(3, 'Finanzas S.A.', 'Banca y Finanzas', 'https://finanzas.sa', 'Servicios financieros de última generación.', 'Lima, Perú'),
(4, 'Innovate IT', 'Consultoría', 'https://innovate.it', 'Consultoría en transformación digital.', 'Híbrido');

-- 4. Perfiles de Egresados
INSERT INTO perfiles_egresados (usuario_id, carrera, año_egreso, telefono, ubicacion, biografia, habilidades_tecnicas, empleado) VALUES
(5, 'Ingeniería de Sistemas', 2023, '987654321', 'Lima', 'Apasionada por el desarrollo frontend.', '["React", "TypeScript", "Tailwind"]', TRUE),
(6, 'Administración de Empresas', 2022, '912345678', 'Arequipa', 'Especialista en gestión de procesos.', '["Excel", "SAP", "Agile"]', FALSE),
(7, 'Psicología Organizacional', 2024, '998877665', 'Lima', 'Enfoque en selección de talento IT.', '["Reclutamiento", "Soft Skills"]', TRUE),
(8, 'Ingeniería Industrial', 2023, '945612378', 'Trujillo', 'Optimización de cadena de suministro.', '["Logística", "AutoCAD"]', FALSE),
(9, 'Ingeniería de Sistemas', 2024, '963258741', 'Lima', 'Fullstack Developer en formación.', '["Node.js", "NestJS", "SQL"]', FALSE),
(10, 'Derecho Corporativo', 2021, '955443322', 'Cusco', 'Especialista en leyes laborales.', '["Derecho", "Consultoría"]', TRUE),
(11, 'Comunicaciones', 2023, '911223344', 'Lima', 'Estratega de contenidos digitales.', '["Marketing", "SEO"]', TRUE);

-- 5. Habilidades (Catálogo Extendido)
INSERT INTO habilidades (nombre, categoria) VALUES
('React / Next.js', 'TECNICA'),
('Node.js / NestJS', 'TECNICA'),
('SQL / NoSQL', 'TECNICA'),
('Cloud (AWS/Azure)', 'TECNICA'),
('Python / AI', 'TECNICA'),
('UI/UX Design', 'TECNICA'),
('Liderazgo', 'BLANDA'),
('Comunicación Efectiva', 'BLANDA'),
('Trabajo en Equipo', 'BLANDA');

-- 6. Ofertas Laborales
INSERT INTO ofertas_laborales (empresa_id, titulo, descripcion, requisitos, modalidad, rango_salarial_min, rango_salarial_max, ubicacion, fecha_creacion) VALUES
(2, 'Senior Frontend Developer', 'Buscamos experto en React.', '3 años de exp.', 'REMOTO', 3500, 5000, 'Remoto', '2026-01-15'),
(3, 'Analista de Datos', 'Manejo de SQL y PowerBI.', 'Bachiller en Adm/Ing.', 'PRESENCIAL', 2500, 3500, 'Lima', '2026-02-10'),
(4, 'Backend Developer Jr', 'Conocimiento en Node.js.', 'Ganas de aprender.', 'HIBRIDO', 2000, 2800, 'San Isidro', '2026-03-05'),
(2, 'DevOps Engineer', 'Manejo de Docker y K8s.', 'AWS Certified.', 'REMOTO', 4000, 6000, 'Remoto', '2026-04-12'),
(4, 'UX Designer', 'Diseño centrado en el usuario.', 'Figma experto.', 'HIBRIDO', 2800, 4200, 'Miraflores', '2026-05-01');

-- 7. Postulaciones
INSERT INTO postulaciones (oferta_id, egresado_id, estado) VALUES
(1, 5, 'ENTREVISTA'),
(1, 9, 'POSTULADO'),
(2, 6, 'EN_REVISION'),
(3, 8, 'POSTULADO');

-- 8. Historial de Postulaciones
INSERT INTO historial_postulaciones (postulacion_id, estado_anterior, estado_nuevo, comentario) 
SELECT id, NULL, 'POSTULADO', 'Postulación inicial' FROM postulaciones;

-- 9. Refrescar Vistas Materializadas
-- SELECT refresh_analytics_views();
