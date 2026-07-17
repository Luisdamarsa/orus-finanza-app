# 🚀 ORUS — Notas de versión prod-v10.5.0

**Fecha:** 17 julio 2026 · **Base:** prod-v10.4.3 (+varios commits) · **Build:** ✅ limpio (74 módulos)

Versión que cierra la **refactorización del Dashboard** (HU-1 a HU-7) y resuelve el
**gap subpixel** en la vista responsive.

---

## Cambios principales

### Refactor del Dashboard (HU-1 → HU-7)
`App.jsx` pasó de **1266 → 924 líneas**. El componente `Dashboard()` ahora solo arma el
estado y lo entrega por contexto; toda la vista vive en componentes independientes.

- **HU-1** `DashboardContext` + contrato de datos (`useDashboard()`).
- **HU-2** `DashboardOverlays` — FABs (lápiz/mic), PeriodSelector, PillarBarsPopup, UpdateBalanceModal.
- **HU-3** `DashboardExpandedState` — Estado 1 (Donut + DonutTags + tarjetas de pilares).
- **HU-4** `DashboardCollapsedState` — Estado 2 (ColorBar + tags de pilares).
- **HU-5** `MovimientosBar` (barra Movimientos, por props) + extracción de header/saldo/sticky.
- **HU-6** `DashboardScreen` — compone la vista completa; el `return` de `Dashboard()` es solo
  `<DashboardContext.Provider><DashboardScreen/></Provider>`.
- **HU-7** Verificación integral: build 74 módulos, contrato sin huecos (56 keys consumidas,
  todas provistas), degradados inferiores (Estado 1 y 2) preservados.

Comportamiento **idéntico** al anterior — solo se movió estructura, no lógica.

### Fix del gap subpixel (vista responsive)
La costura fina al hacer scroll **no** era offset de posición sino el **borde de recorte**
de `overflow: auto` a escala fraccionaria (DPR/responsive). Solución: tapar la costura con un
**elemento opaco por encima**.

- **Página Movimientos:** el título ahora pinta encima (`zIndex: 2`) y solapa el scroll con su
  fondo opaco (`marginBottom: -3`).
- **Dashboard Estado 2:** la zona sticky ya pinta encima (`zIndex: 30`); se amplió el solape del
  contenedor de transacciones a `calc(stickyH - 6px)` para absorber la deriva de medición.

Verificado sin gap en vista responsive (Chrome y Edge).

### Otros
- Se restauró una **truncación** de `MovimientosPage.jsx` (el editor cortó el archivo en el
  degradado inferior); recuperado desde git, build OK.

---

## Estructura resultante (componentes del Dashboard)

```
Dashboard() (App.jsx)         → estado + contexto, renderiza DashboardScreen
 └─ DashboardContext / useDashboard()
DashboardScreen.jsx           → vista completa (header, sticky, transacciones, bottom fade)
 ├─ DashboardExpandedState    → Estado 1 (donut + tarjetas)
 ├─ DashboardCollapsedState   → Estado 2 (colorbar + tags)
 ├─ MovimientosBar            → barra Movimientos (por props)
 └─ DashboardOverlays         → FABs + popups + modales
```

---

## Conocido / backlog (fase BD — no bloquea)

- **`setBalance` indefinido** en `DashboardOverlays` (UpdateBalanceModal). El botón "Saldo actual"
  está `disabled`, así que el modal nunca se abre → sin crash. Conectar al setter real en la fase BD.
- **Transacciones huérfanas** al borrar una categoría (soft delete): hoy se muestran igual, pero
  hay que reasignarlas/bucket "Sin categoría" en la fase BD (ver `DECISION_ARQUITECTURA_DB.md`).
- **Lint (unused-vars):** ~72 variables/imports sin usar (leftovers) — cosmético, no rompe build.
- **Lint (tests):** ~222 `no-undef` en `__tests__` (`describe`/`test`/`expect`/`jest`) por falta del
  entorno de test en `eslint.config.js` — no son bugs, es config.
- **i18n:** los idiomas/monedas se capturan pero la UI aún no traduce.

---

**prod-v10.5.0** · ORUS Finanzas · Nacho (@nassirsamur@gmail.com) · 17 julio 2026
