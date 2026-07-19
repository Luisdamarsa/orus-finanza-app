# 🚀 ORUS — Notas de versión prod-v10.6.0

**Fecha:** 17 julio 2026 · **Base:** prod-v10.5.1 · **Build:** ✅ limpio (92 módulos)

Versión centrada en el **refactor "Adelgazar App.jsx"**: App pasa de ser un archivo con toda la
UI y el enrutamiento inline a un **orquestador** (estado + `<ScreenRouter/>`).

---

## Refactor de pantallas (RS-1 → RS-7)

App.jsx: **841 → 438 líneas (−48%)**. Todas las pantallas y su lógica salieron a componentes/hooks:

- **RS-1** `ScreenShell` — envoltorio full-screen común (antes repetido 10 veces).
- **RS-2** `PillarDetailPage` — sacado de dentro de App a su archivo.
- **RS-3** `SettingsScreen`, `ProfileScreen`, `ShowIncomesScreen`.
- **RS-4** `TransactionScreen` (nueva + editar, mismo componente) + hook `useTransactionActions`
  (crear/editar/eliminar + navegación).
- **RS-5** `BudgetsScreen` (con su cálculo de presupuestos), `CategoriesScreen`, `AddCategoryScreen`.
- **RS-6** `MovimientosScreen`.
- **RS-7** `ScreenRouter` — reemplaza la cadena de `if (screen === …)`.

Resultado: el `Dashboard()` de App termina en
`<DashboardContext.Provider value={dashboard}><ScreenRouter {...routerProps} /></Provider>`.

## Ajustes de UX incluidos

- Tag vacío del donut: **"Sin gastos"** (antes "Sin datos").
- Toast de nueva transacción de **ahorro**: monto en **verde** (#86EFAC), como en la lista.
- Tarjeta de pilar sin gasto: badge **"0%"** (antes "1% del total" en Varios sin presupuesto).
- Tag de pilar en **agregar/editar categoría**: **borde 2px del color** del pilar (como en transacción;
  antes usaba `outline` y se veía distinto).
- Botones de Configuración: el hover pinta el botón (`e.currentTarget`), sin caja gris residual.
- Título de **Presupuestos** centrado.

## Contexto (viene de v10.5.x)

Manejo de errores por sección (ErrorBoundary que ocultan) + Oops a nivel página + toast rojo en
acciones; tag de confirmación de nueva transacción (1.5s). El fail-switch de prueba fue removido.

---

## Estado / próximos pasos

- Build 92 módulos, sin NUL, sin imports huérfanos. Lint: 12 errores de app pre-existentes
  (`set-state-in-effect`, el `setBalance` conocido) + los de `__tests__` (config de entorno).
- **Siguiente** (ver `BACKLOG_ORUS.md`): quick wins de UI (Hito 4.4 animación ingresos, 4.3 barra de
  presupuesto tras hablar con MJ), o **páginas de config faltantes** (Hito 6), o **paginación de
  movimientos** (Hito 2.1). Lo grande (Auth/Onboarding/Notificaciones, legal) va en la fase BD.

---

**prod-v10.6.0** · ORUS Finanzas · Nacho (@nassirsamur@gmail.com) · 17 julio 2026
