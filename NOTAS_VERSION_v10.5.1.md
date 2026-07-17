# 🚀 ORUS — Notas de versión prod-v10.5.1

**Fecha:** 17 julio 2026 · **Base:** prod-v10.5.0 · **Build:** ✅ limpio (80 módulos)

Versión centrada en **manejo de errores** (aislamiento por sección), un **tag de confirmación
de nueva transacción**, y más **extracción de componentes** desde App/DashboardScreen.

---

## Manejo de errores (Hito 1.3)

- **ErrorBoundary reutilizable** (`components/ErrorBoundary.jsx`) con prop `fallback`
  (default = pantalla "Oops"; `null` = ocultar) y `resetKey` para recuperarse solo.
- **Boundaries por sección** — cada parte importante se oculta si falla, sin tumbar el resto:
  donut, tags del donut, barra de colores, tags de pilares, tarjetas, lista de transacciones
  (dashboard y página de Movimientos), barra del pilar, barras de categoría, FABs,
  botón de configuración, barra de periodo, y fila GASTADO/INGRESOS.
- **Páginas que no cargan** → pantalla global "Oops" (ErrorBoundary raíz).
- **Acciones que fallan** → **toast rojo** (`PopupService.showErrorPopup`) en crear/editar/eliminar
  categoría, editar presupuesto y editar perfil (envueltas en `try/catch`).

## Tag de confirmación de nueva transacción

- `components/NewTransactionToast.jsx` + hook `hooks/useTransactionToast.js`.
- Aparece **bajando** en el hueco entre "Saldo actual" y el periodo, dura **1.5s**, sale hacia arriba.
- Gasto: `{icono pilar} · {categoría} · -{monto}` (rojo suave, borde = color del pilar).
  Ingreso: `💚 · +{monto}` (verde, fondo verde + borde gris).
- Se dispara **solo al crear** una transacción nueva (tras `addTx`).

## Extracción de componentes (App "más delgada")

- `Periodo.jsx` — barra saldo/periodo (antes inline en DashboardScreen).
- `FloatingActionButtons.jsx` — FABs lápiz/micrófono (antes inline en DashboardOverlays).
- `GastadoIngresosBar.jsx` — fila GASTADO/INGRESOS (antes inline en HeaderService).
- `useTransactionToast.js` — estado del tag (antes inline en App).

## Limpieza

- Se quitó el **fail-switch de prueba** (`failIf`/`FailProbe` + `utils/failSwitch.js`) usado para
  validar los boundaries. Los `ErrorBoundary` reales quedan intactos.

---

## Estado / backlog

- Build 80 módulos, sin NUL. Lint: 12 errores de app (todos pre-existentes: `set-state-in-effect`,
  el `setBalance` conocido, etc.) + los de `__tests__` (config de entorno, no bugs).
- **Siguiente:** refactor "Adelgazar App.jsx" — extraer las **6 pantallas inline**
  (`new-transaction`, editar transacción, `settings`, `profile`, `show-incomes`, `pillar-detail`)
  una a una + un `ScreenRouter`. Ver `BACKLOG_ORUS.md`.
- **Pendiente antes del refactor:** revisar algo en los **botones de la página de configuración**
  (nota de Nacho).

---

**prod-v10.5.1** · ORUS Finanzas · Nacho (@nassirsamur@gmail.com) · 17 julio 2026
