# Gestock v2 — Backend

Reinicio del proyecto Gestock: mismo dominio de inventarios, pero con enfoque en
**analitica predictiva de stock** y stack unificado en TypeScript (NestJS + Prisma + PostgreSQL)
en vez de Django.

## Por que este enfoque

- **Mismo lenguaje que el frontend** (React/TS): menos cambio de contexto, tipos compartibles.
- **NestJS** da una arquitectura modular con decoradores e inyeccion de dependencias,
  el mismo tipo de estructura "enterprise" que se ve en Spring, pero en JS.
- **Prisma** como ORM: migraciones versionadas y tipado automatico del schema.

## Arquitectura

```
src/
  auth/          Login + JWT + guard de roles (ADMIN, MANAGER, EMPLOYEE)
  users/         Gestion de usuarios del sistema
  categories/    Categorias de producto
  products/      CRUD de productos + endpoint de stock bajo
  movements/     Entradas/salidas de stock (transaccional, ajusta currentStock)
  forecasting/   Analitica predictiva: consumo diario promedio, dias hasta
                 agotar stock y cantidad sugerida de reabastecimiento
  prisma/        Servicio global de conexion a la base de datos
```

### El diferenciador: `forecasting`

Toma las salidas (`Movement` tipo `OUT`) de los ultimos 30 dias de un producto,
calcula el consumo promedio diario, y con eso proyecta:

- `daysUntilStockout`: en cuantos dias se queda sin stock al ritmo actual.
- `suggestedReorderQty`: cuanto conviene pedir para cubrir el stock minimo
  mas un colchon de 15 dias.

Es el punto que vas a poder defender como la parte "innovadora" frente al
inventario tradicional: no solo dice cuanto hay, dice **cuando se va a acabar**.

## Poner a correr el proyecto

1. `npm install`
2. Copia `.env.example` a `.env` y ajusta `DATABASE_URL` con tu PostgreSQL local.
3. `npx prisma migrate dev --name init` — crea las tablas.
4. `npx prisma db seed` — llena la base con usuarios, categorías, productos y 30 días de movimientos históricos de prueba (necesarios para que el forecast no de siempre cero). Usuarios creados: `admin@gestock.com`, `manager@gestock.com`, `empleado@gestock.com`, clave `Gestock123!` para los tres.
5. Corre los scripts de `sql/` contra tu base de datos (psql, DBeaver, pgAdmin, lo que uses):
   - `sql/01_vista_listado_productos.sql`
   - `sql/02_procedimiento_listado_productos.sql`
6. Configura el correo en `.env` (ver comentarios de `SMTP_*` en `.env.example`):
   - **Gmail**: genera una "contraseña de aplicación" en tu cuenta de Google y úsala en `SMTP_PASS`.
   - **Mailtrap** (recomendado para la demo, no manda correos reales): crea un inbox gratis en mailtrap.io y copia sus credenciales SMTP.
7. `npm run start:dev` — servidor en `http://localhost:3000`.

## Endpoints agregados para el rubric de la sustentación

| Criterio | Endpoint |
|---|---|
| 1. Registro | `POST /auth/register` |
| 1. Login | `POST /auth/login` |
| 2. Recuperación de clave | `POST /auth/forgot-password` → `POST /auth/reset-password` |
| 5. Perfil (nombre/rol en dashboard) | `GET /auth/me` (requiere Bearer token) |
| 6. Listado por Vista SQL | `GET /products/view` |
| 7. Listado por Procedimiento | `GET /products/procedure` |

## CRUD y forecasting completos

| Recurso | Endpoints |
|---|---|
| Productos | `POST` `GET` `GET /:id` `PATCH /:id` `DELETE /:id`, más `/view`, `/procedure`, `/low-stock` |
| Categorías | `POST` `GET` `PATCH /:id` `DELETE /:id` |
| Usuarios (solo ADMIN) | `POST` `GET` `PATCH /:id/role` `DELETE /:id` |
| Movimientos | `POST` (ajusta stock automáticamente) `GET /product/:productId` |
| Forecasting | `POST /product/:productId` `POST /all` `GET` (últimos forecasts) `GET /dashboard` (resumen para tarjetas) |

## Flujo de Git sugerido (igual al que usaste en la API de biblioteca)

- `main` — version estable
- `feature/auth` — login + JWT + roles
- `feature/products-categories` — CRUD de productos y categorias
- `feature/movements` — entradas/salidas de stock
- `feature/forecasting` — analitica predictiva

Commits pequenos y frecuentes por rama, merge a `main` cuando cada modulo
funcione y tenga sus pruebas manuales con Postman/Insomnia.

## Siguientes pasos

1. Probar los endpoints con Postman (login -> crear producto -> registrar
   movimientos -> generar forecast).
2. Sembrar datos de prueba (`seed.ts` con Prisma) para tener movimientos
   historicos y que el forecast tenga sentido en la demo.
3. Frontend: dashboard con grafico de consumo por producto + tarjetas de
   "productos en riesgo de agotarse" usando `GET /forecasting`.
