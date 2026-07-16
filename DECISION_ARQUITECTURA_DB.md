# Decisión de Arquitectura — Base de Datos (OLTP vs OLAP)

> **Estado:** acordado · Aplicar cuando se conecte la app a base de datos + IA.
> **Fecha:** 16 julio 2026

## Decisión

**ORUS corre sobre OLTP (Supabase / Postgres). Punto.**

La app es carga transaccional pura: cada usuario crea/edita/borra sus transacciones,
lee las suyas y sincroniza en tiempo real con su Workspace. Eso es OLTP de manual.

El "dashboard analítico" (donut, presupuestos, gasto del mes) **no es OLAP**: son
agregaciones pequeñas por usuario que Postgres resuelve con índices en milisegundos.

## Por qué OLTP también es lo mejor por seguridad

La clave es **Row Level Security (RLS)** de Postgres/Supabase: políticas a nivel de
**fila** que la base de datos hace cumplir aunque el código tenga bugs
(ej. "un usuario solo lee filas donde `user_id = auth.uid()`").

Para finanzas con **Workspaces compartidos**, esto es lo que garantiza que el usuario A
jamás vea datos del usuario B, y que en un workspace solo se vea lo compartido. La
seguridad vive en la base de datos, no solo en el backend.

Un almacén OLAP sería **peor** como base de la app en vivo: control de acceso más grueso
(por dataset, no por fila), copias de datos, no pensado para aislamiento por usuario en
tiempo real.

## El patrón de producción (lo que hay que recordar)

1. **Empezar 100% OLTP** con Supabase (Postgres) + RLS.
2. Si algún día se necesita **analítica pesada entre TODOS los usuarios** —entrenar/afinar
   el modelo de IA que lee notificaciones bancarias, o insights agregados de mercado—
   **agregar un OLAP aparte** (BigQuery / ClickHouse) alimentado por **ETL desde el OLTP**.
3. Ese OLAP es un **sistema separado, NUNCA el backend en vivo de la app**. La app siempre
   corre sobre OLTP con RLS; el OLAP queda aislado para análisis interno.

## Punto de enganche en el código

Cuando se conecte el backend, el único lugar a cambiar son los **servicios**:
`src/services/categoryService.js` y `src/services/transactionService.js`.
Hoy leen de localStorage/dummy; mañana hacen llamadas async a Supabase
(get/create/update/delete, scopeadas por usuario/workspace). Los componentes y los hooks
(`useTransactions`, `useCategories`) **no se tocan** — ya exponen `isLoading`/`error` y
acciones async-tolerant justo para esto.

## Otros puntos de seguridad (más importantes que OLTP/OLAP)

- **RLS** (aislamiento por usuario/workspace) — el gran ganador.
- Cifrado en tránsito (TLS) y en reposo.
- Auth sólido (Supabase Auth) + mínimo privilegio; **nunca** exponer la `service_role key`.
- **Cumplimiento:** en Colombia aplica la Ley 1581 de 2012 (Habeas Data). Revisar con
  compliance antes de producción. *(No es asesoría legal.)*
- Logs de auditoría de accesos y cambios.
