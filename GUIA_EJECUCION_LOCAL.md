# Guia de Ejecucion Local

Esta guia sirve para que otra persona pueda clonar el proyecto y ejecutarlo en su maquina, aunque el deploy no funcione.

## 1) Requisitos

- Node.js 20.x
- npm 10+
- PostgreSQL 15+ (solo para modo sin Docker)
- Docker Desktop (opcional, para modo con Docker)

## 2) Clonar y entrar al proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd SistemaEgresadosYOferta
```

## 3) Instalar dependencias

Instala todo desde la raiz (workspaces frontend + backend):

```bash
npm run install:all
```

Si falla por peer dependencies en algun entorno:

```bash
npm install --legacy-peer-deps
```

## 4) Configuracion de variables de entorno

### Backend

Crear archivo `backend/.env` con:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=sistema_egresados
PORT=3006
JWT_SECRET=super_secret_key_nexusgrad_2026
```

### Frontend

Crear archivo `frontend/.env.local` con:

```env
NEXT_PUBLIC_TRPC_URL=http://127.0.0.1:3006
```

Nota: el frontend agrega automaticamente `/trpc`.

## 5) Base de datos

1. Crear base: `sistema_egresados`
2. Ejecutar `backend/database/schema.sql`
3. Ejecutar `backend/database/inserts.sql`

## 6) Ejecutar el proyecto (sin Docker)

Desde la raiz:

```bash
npm run dev
```

Servicios esperados:

- Frontend: `http://localhost:3000`
- Backend tRPC: `http://localhost:3006/trpc`

## 7) Ejecutar con Docker (opcional)

Desde la raiz:

```bash
npm run docker:up
```

Para apagar:

```bash
npm run docker:down
```

## 8) Usuarios de prueba

Correos del seed:

- `admin@nexusgrad.com`
- `hr@techcorp.com`
- `ana.garcia@gmail.com`

Con hashes de prueba del seed, cualquier clave de 6+ caracteres funciona (ejemplo: `123456`).

## 9) Build de validacion

Frontend:

```bash
npm run build -w frontend
```

Backend:

```bash
npm run build -w backend
```

## 10) Problemas comunes

- Error de conexion a DB:
	Verificar `backend/.env` y que PostgreSQL este levantado.
- Error de login tRPC:
	Verificar `NEXT_PUBLIC_TRPC_URL` y que el backend responda en `/trpc`.
- Error de dependencias:
	Reinstalar con `npm install --legacy-peer-deps`.

