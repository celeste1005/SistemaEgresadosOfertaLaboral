-- Script de Inserts Masivo y Realista para NexusGrad
-- Este script pobla el sistema con suficientes datos para que los gráficos, tablas y dashboards se vean completos.

-- 1. Limpieza total para evitar conflictos de IDs
TRUNCATE reportes_generados, notificaciones, historial_postulaciones, postulaciones, oferta_habilidades, habilidades, ofertas_laborales, perfiles_egresados, perfiles_empresas, usuarios RESTART IDENTITY CASCADE;

-- 2. Usuarios (Admin, Empresas, Egresados)
INSERT INTO usuarios (email, password_hash, nombre_completo, rol) VALUES
-- Admin
('admin@nexusgrad.com', '$2b$10$YourHashHere', 'Administrador Principal', 'ADMIN'),

-- Empresas (Sectores: Tech, Banca, Retail, Salud, Minería)
('hr@techcorp.com', '$2b$10$YourHashHere', 'Recursos Humanos TechCorp', 'EMPRESA'),
('contacto@finanzas-sa.com', '$2b$10$YourHashHere', 'Gerencia Finanzas S.A.', 'EMPRESA'),
('jobs@innovate.it', '$2b$10$YourHashHere', 'Talento Innovate IT', 'EMPRESA'),
('reclutamiento@retailperu.com', '$2b$10$YourHashHere', 'Retail Perú Recruiting', 'EMPRESA'),
('talento@saludglobal.com', '$2b$10$YourHashHere', 'Salud Global S.A.C', 'EMPRESA'),
('rrhh@minera-norte.com', '$2b$10$YourHashHere', 'RRHH Minera del Norte', 'EMPRESA'),

-- Egresados (Diversas carreras)
('ana.garcia@gmail.com', '$2b$10$YourHashHere', 'Ana García', 'EGRESADO'),
('luis.perez@outlook.com', '$2b$10$YourHashHere', 'Luis Pérez', 'EGRESADO'),
('marta.rivas@yahoo.com', '$2b$10$YourHashHere', 'Marta Rivas', 'EGRESADO'),
('carlos.sosa@nexus.com', '$2b$10$YourHashHere', 'Carlos Sosa', 'EGRESADO'),
('elena.ruiz@gmail.com', '$2b$10$YourHashHere', 'Elena Ruiz', 'EGRESADO'),
('juan.sistemas@nexus.com', '$2b$10$YourHashHere', 'Juan Sistemas', 'EGRESADO'),
('maria.admin@nexus.com', '$2b$10$YourHashHere', 'Maria Admin', 'EGRESADO'),
('pedro.industrial@gmail.com', '$2b$10$YourHashHere', 'Pedro Industrial', 'EGRESADO'),
('sofia.psico@outlook.com', '$2b$10$YourHashHere', 'Sofia Psicología', 'EGRESADO'),
('diego.derecho@gmail.com', '$2b$10$YourHashHere', 'Diego Derecho', 'EGRESADO'),
('lucia.comu@nexus.com', '$2b$10$YourHashHere', 'Lucia Comunicaciones', 'EGRESADO'),
('roberto.civil@gmail.com', '$2b$10$YourHashHere', 'Roberto Civil', 'EGRESADO'),
('gabriela.conta@outlook.com', '$2b$10$YourHashHere', 'Gabriela Contabilidad', 'EGRESADO'),
('victor.meca@gmail.com', '$2b$10$YourHashHere', 'Victor Mecánica', 'EGRESADO');

-- 3. Perfiles de Empresas
INSERT INTO perfiles_empresas (usuario_id, nombre_empresa, sector, sitio_web, descripcion, ubicacion) VALUES
(2, 'TechCorp SA', 'Tecnología', 'https://techcorp.com', 'Líder en desarrollo de software enterprise y soluciones Cloud.', 'Remoto / Lima'),
(3, 'Finanzas S.A.', 'Banca y Finanzas', 'https://finanzas.sa', 'Servicios financieros de última generación con enfoque en Fintech.', 'San Isidro, Lima'),
(4, 'Innovate IT', 'Consultoría', 'https://innovate.it', 'Consultoría estratégica en transformación digital y IA.', 'Híbrido'),
(5, 'Retail Perú', 'Comercio', 'https://retailperu.com', 'Cadena de tiendas líder a nivel nacional con expansión regional.', 'Lima, Perú'),
(6, 'Salud Global', 'Salud', 'https://saludglobal.com', 'Red de clínicas y servicios de salud integral con tecnología médica.', 'Miraflores, Lima'),
(7, 'Minera del Norte', 'Minería', 'https://mineranorte.com', 'Explotación minera responsable y sostenible con altos estándares.', 'Cajamarca, Perú');

-- 4. Perfiles de Egresados
INSERT INTO perfiles_egresados (usuario_id, carrera, año_egreso, telefono, ubicacion, biografia, habilidades_tecnicas, empleado) VALUES
(8, 'Ingeniería de Sistemas', 2023, '987654321', 'Lima', 'Apasionada por el desarrollo frontend y la arquitectura de software.', '["React", "TypeScript", "Tailwind", "Next.js"]', TRUE),
(9, 'Administración de Empresas', 2022, '912345678', 'Arequipa', 'Especialista en gestión de procesos y optimización de recursos.', '["Excel Avanzado", "SAP", "Agile", "Scrum"]', FALSE),
(10, 'Psicología Organizacional', 2024, '998877665', 'Lima', 'Enfoque en selección de talento IT y cultura organizacional.', '["Reclutamiento", "Entrevistas", "Gestión del Cambio"]', TRUE),
(11, 'Ingeniería Industrial', 2023, '945612378', 'Trujillo', 'Optimización de cadena de suministro y análisis de datos.', '["Logística", "AutoCAD", "Lean Six Sigma"]', FALSE),
(12, 'Ingeniería de Sistemas', 2024, '963258741', 'Lima', 'Fullstack Developer en formación con gusto por el Backend.', '["Node.js", "NestJS", "PostgreSQL", "Docker"]', FALSE),
(13, 'Derecho Corporativo', 2021, '955443322', 'Cusco', 'Especialista en leyes laborales y cumplimiento normativo.', '["Derecho Laboral", "Contratos", "Compliance"]', TRUE),
(14, 'Comunicaciones', 2023, '911223344', 'Lima', 'Estratega de contenidos digitales y relaciones públicas.', '["Marketing Digital", "SEO", "Copywriting"]', TRUE),
(15, 'Ingeniería Industrial', 2022, '922334455', 'Piura', 'Gestión de proyectos de manufactura y control de calidad.', '["ISO 9001", "ERP", "Project Management"]', TRUE),
(16, 'Psicología Organizacional', 2023, '933445566', 'Lima', 'Interés en capacitación y desarrollo de talento humano.', '["Capacitación", "KPIs RRHH", "Onboarding"]', FALSE),
(17, 'Derecho Corporativo', 2024, '944556677', 'Lima', 'Asesoría legal para startups y emprendimientos tecnológicos.', '["Propiedad Intelectual", "Tributario"]', FALSE),
(18, 'Comunicaciones', 2024, '955667788', 'Ica', 'Producción audiovisual y manejo de crisis en redes sociales.', '["Adobe Premiere", "After Effects", "PR"]', FALSE),
(19, 'Ingeniería Civil', 2023, '966778899', 'Lima', 'Diseño estructural y supervisión de obras de gran envergadura.', '["ETABS", "S10", "Revit"]', TRUE),
(20, 'Contabilidad', 2022, '977889900', 'Arequipa', 'Auditoría financiera y gestión de impuestos para medianas empresas.', '["Auditoría", "NIIF", "CONCAR"]', TRUE),
(21, 'Ingeniería Mecánica', 2023, '988990011', 'Chimbote', 'Mantenimiento predictivo y diseño de maquinaria industrial.', '["SolidWorks", "Mantenimiento", "Termodinámica"]', FALSE);

-- 5. Habilidades (Catálogo Extendido)
INSERT INTO habilidades (nombre, categoria) VALUES
('React / Next.js', 'TECNICA'),
('Node.js / NestJS', 'TECNICA'),
('SQL / NoSQL', 'TECNICA'),
('Cloud (AWS/Azure)', 'TECNICA'),
('Python / AI', 'TECNICA'),
('UI/UX Design', 'TECNICA'),
('SAP / ERP', 'TECNICA'),
('Lean Six Sigma', 'TECNICA'),
('Derecho Laboral', 'TECNICA'),
('Marketing Digital', 'TECNICA'),
('Auditoría Financiera', 'TECNICA'),
('Liderazgo', 'BLANDA'),
('Comunicación Efectiva', 'BLANDA'),
('Trabajo en Equipo', 'BLANDA'),
('Pensamiento Crítico', 'BLANDA'),
('Resolución de Conflictos', 'BLANDA');

-- 6. Ofertas Laborales (Historial de 5 meses para gráficos)
INSERT INTO ofertas_laborales (empresa_id, titulo, descripcion, requisitos, modalidad, rango_salarial_min, rango_salarial_max, ubicacion, fecha_creacion) VALUES
(2, 'Senior Frontend Developer', 'Buscamos experto en React y Next.js.', '3 años de experiencia mínima.', 'REMOTO', 3500, 5500, 'Remoto', '2026-01-10'),
(3, 'Analista de Riesgos', 'Evaluación de perfiles crediticios y mercado.', 'Bachiller en Economía o Adm.', 'PRESENCIAL', 2800, 4200, 'San Isidro', '2026-01-25'),
(4, 'Consultor IT Junior', 'Apoyo en implementación de sistemas ERP.', 'Ing. Sistemas recién egresado.', 'HIBRIDO', 2200, 3000, 'Lima', '2026-02-05'),
(5, 'Jefe de Logística', 'Gestión de almacenes y flota de transporte.', 'Exp. en Retail mayor a 5 años.', 'PRESENCIAL', 4500, 6500, 'Callao', '2026-02-15'),
(6, 'Psicólogo de Selección', 'Encargado de procesos masivos de salud.', 'Licenciado con colegiatura.', 'HIBRIDO', 2500, 3500, 'Miraflores', '2026-03-02'),
(7, 'Ingeniero de Minas Jr', 'Supervisión en campo y reportes de seguridad.', 'Disponibilidad para trabajar en régimen.', 'PRESENCIAL', 3000, 4500, 'Cajamarca', '2026-03-20'),
(2, 'DevOps Engineer', 'Implementación de pipelines CI/CD y Kubernetes.', 'Certificación AWS deseable.', 'REMOTO', 4000, 6500, 'Remoto', '2026-04-05'),
(4, 'UX Designer', 'Diseño de interfaces para aplicaciones móviles.', 'Portafolio en Behance/Dribbble.', 'HIBRIDO', 3000, 4800, 'Surco', '2026-04-18'),
(3, 'Contador General', 'Elaboración de estados financieros y balances.', 'CPA habilitado.', 'PRESENCIAL', 3500, 5000, 'Lima', '2026-05-01'),
(5, 'Estratega Social Media', 'Gestión de marca en redes y campañas pagadas.', 'Experiencia en Meta Ads.', 'REMOTO', 2500, 3800, 'Remoto', '2026-05-03');

-- 7. Postulaciones (Mezcla de estados para el Dashboard)
INSERT INTO postulaciones (oferta_id, egresado_id, estado, fecha_postulacion) VALUES
(1, 8, 'ENTREVISTA', '2026-01-12'),
(1, 12, 'POSTULADO', '2026-01-15'),
(2, 9, 'EN_REVISION', '2026-01-28'),
(3, 12, 'CONTRATADO', '2026-02-10'),
(4, 11, 'POSTULADO', '2026-02-18'),
(4, 15, 'EN_REVISION', '2026-02-20'),
(5, 10, 'ENTREVISTA', '2026-03-05'),
(5, 16, 'POSTULADO', '2026-03-08'),
(6, 15, 'POSTULADO', '2026-03-25'),
(7, 12, 'POSTULADO', '2026-04-10'),
(8, 14, 'EN_REVISION', '2026-04-20'),
(8, 18, 'POSTULADO', '2026-04-22'),
(9, 20, 'POSTULADO', '2026-05-02'),
(10, 14, 'POSTULADO', '2026-05-04');

-- 8. Historial de Postulaciones (Refleja el flujo)
INSERT INTO historial_postulaciones (postulacion_id, estado_anterior, estado_nuevo, comentario) VALUES
(1, 'POSTULADO', 'EN_REVISION', 'Perfil cumple con los requisitos técnicos.'),
(1, 'EN_REVISION', 'ENTREVISTA', 'Programar entrevista técnica para el viernes.'),
(3, 'POSTULADO', 'EN_REVISION', 'Revisando experiencia previa en banca.'),
(4, 'POSTULADO', 'EN_REVISION', 'Candidato ideal para puesto junior.'),
(4, 'EN_REVISION', 'ENTREVISTA', 'Entrevista inicial exitosa.'),
(4, 'ENTREVISTA', 'CONTRATADO', 'Bienvenido al equipo de Innovate IT.'),
(7, 'POSTULADO', 'EN_REVISION', 'Perfil psicológico muy sólido.'),
(7, 'EN_REVISION', 'ENTREVISTA', 'Coordinar cita con gerencia de salud.');

-- 9. Notificaciones (Para que la campana tenga avisos)
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo) VALUES
(8, 'Nueva Entrevista', 'Has sido seleccionado para una entrevista en TechCorp SA.', 'SUCCESS'),
(9, 'Perfil en Revisión', 'Finanzas S.A. está revisando tu postulación.', 'INFO'),
(12, '¡Felicidades!', 'Has sido contratado por Innovate IT para el puesto de Consultor IT Junior.', 'SUCCESS'),
(1, 'Nuevo Reporte Disponible', 'El reporte de empleabilidad del Q1 ya puede ser descargado.', 'WARNING'),
(2, 'Nuevos Postulantes', 'Tienes 3 nuevos candidatos para la vacante de Senior Frontend.', 'INFO');

-- 10. Reportes Generados (Para llenar la tabla de reportes)
INSERT INTO reportes_generados (usuario_id, tipo_reporte, estado, url_archivo) VALUES
(1, 'GESTION', 'COMPLETADO', 'https://nexusgrad.com/reports/gestion_mayo_2026.pdf'),
(1, 'OPERACIONAL', 'COMPLETADO', 'https://nexusgrad.com/reports/egresados_activos_q1.pdf'),
(1, 'GESTION', 'ERROR', NULL),
(1, 'OPERACIONAL', 'PROCESANDO', NULL);

-- 11. Relación Ofertas-Habilidades (Para filtros avanzados)
INSERT INTO oferta_habilidades (oferta_id, habilidad_id) VALUES
(1, 1), (1, 13), -- Senior Frontend: React, Comunicación
(2, 7), (2, 11), -- Analista Riesgos: SAP, Auditoría
(3, 2), (3, 14), -- Consultor IT: Node, Trabajo equipo
(4, 7), (4, 12), -- Jefe Logística: SAP, Liderazgo
(7, 4), (7, 5),  -- DevOps: Cloud, Python
(8, 6), (8, 14); -- UX Designer: UI/UX, Trabajo equipo

-- Finalización: Refrescar vistas si la función existe
-- SELECT refresh_analytics_views();
