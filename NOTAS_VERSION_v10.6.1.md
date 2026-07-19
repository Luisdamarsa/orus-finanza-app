# 🚀 ORUS — Notas de versión prod-v10.6.1

**Fecha:** 17 julio 2026 · **Base:** prod-v10.6.0 · **Build:** ✅ limpio (93 módulos)

Versión con **paginación de movimientos** (Hito 2.1) y la **regla "Varios"** para gastos sin categoría,
más un par de fixes de UX en Estado 2.

---

## Cambios

### Paginación de movimientos (Hito 2.1) ✅
- Hook reutilizable `usePagination(items, 15, 350)` — muestra 15 a la vez, crece de a 15 con scroll
  infinito **acumulativo** (lo ya cargado se conserva) y muestra un **spinner** al final mientras
  llega el siguiente bloque. El último bloque trae solo las que queden.
- Vive en `TransactionsListService` → aplica en el **dashboard (Estado 2)** y en la **página de
  Movimientos por pilar** a la vez.
- Listo para BD: el patrón scroll-infinito + spinner mapea 1:1 a `offset/limit`; el retardo de 350ms
  se reemplaza por la latencia real del fetch.

### Fixes de Estado 2
- **Reset al cambiar de periodo/filtro:** la lista vuelve arriba (scroll 0 + paginación en 15) — antes
  se quedaba pegada al fondo. Se logra con una `key` que remonta el contenedor.
- **`overscroll-behavior: contain`** en el contenedor de transacciones: al llegar al final y seguir
  scrolleando, ya **no se encadena** al contenedor exterior (que arrastraba y cortaba la lista).

### Gasto sin categoría → "Varios"
- Al crear un gasto **solo con descripción + valor** (sin categoría/pilar), cae en la categoría
  **"Varios"** del pilar **Varios**: la busca (case-insensitive) y la **crea si no existe** (escribe en
  `ALL_CATS` + refresca el estado, así aparece en Categorías y Presupuestos).
- Elimina el "gasto huérfano": ahora cuenta en el pilar Varios (el total cuadra), filtra bien y se ve
  correcto. En memoria: al recargar, `ALL_CATS` se reseedea sin esa "Varios".

---

## Pendientes (backlog) — dejamos aquí por ahora

- **Hito 3** · Loading real (skeletons + spinner; hoy `isLoading` está muerto).
- **Hito 4** · Pulido visual: 4.1 popup tarjetas de pilares · 4.2 tarjetas de pilares ·
  4.3 barra de presupuesto (decisión con MJ) · 4.4 animación en "mostrar ingresos" · 4.5 iconos de categorías.
- **Hito 5** · Logo.
- **Hito 6** · Páginas de config faltantes: Automation, Informes, Sobre la app, Permisos, Suscripciones.
- **Hito 7** · Legal: datos que pide la app + T&C/Privacidad (bloquea publicación).
- **Hito 8** · Auth & Onboarding: Login (Google/Apple), Onboarding, Notificaciones (core) — **fase BD**.
- **Diferido a BD** · Decisión 1.1 (nombre histórico de categoría con timestamps); conectar Supabase
  (esquema + Auth + RLS); i18n real. Ver `DECISION_ARQUITECTURA_DB.md`.

---

**prod-v10.6.1** · ORUS Finanzas · Nacho (@nassirsamur@gmail.com) · 17 julio 2026
