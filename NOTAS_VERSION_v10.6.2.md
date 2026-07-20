# 🚀 ORUS — Notas de versión prod-v10.6.2

**Fecha:** 17 julio 2026 · **Base:** prod-v10.6.1 · **Build:** ✅ limpio (97 módulos)

Versión con **mensaje de error mejorado + capa de reporte**, y las **pantallas legales**
(Términos y Condiciones / Privacidad) con sus borradores.

---

## Manejo de errores
- **Mensaje Oops nuevo** (centrado, mismo ⚠️): *"Oops! Algo salió mal / No estamos seguros qué
  sucedió, pero ya estamos trabajando en solucionarlo."* + botón **"↻ Inténtalo de nuevo"** (recarga).
- **Capa `reportError()`** (`services/reportError.js`): hoy `console.error`, mañana Sentry (solo se
  cambia su cuerpo). Enganchada en el `ErrorBoundary` (render) y en los globales `window.onerror` +
  `unhandledrejection` (clics/promesas que el boundary no atrapa).
- **Estado vacío** consistente: la lista de movimientos muestra **"Sin movimientos"** cuando no hay
  transacciones.

## Legal (Hito 7)
- **7.1 analizado:** inventario de datos/permisos + realidad por plataforma (iOS no lee SMS/notif.;
  Android sí vía NotificationListener; SMS restringido en Play; correo por API/OAuth) + estrategia
  **multi-fuente** (notificaciones / Atajos+App Intents en iOS / correo / voz-manual).
- **7.2 borrador en la app:** pantallas **Términos y Condiciones** y **Términos de Privacidad**
  (`LegalPage.jsx`, título en mayúscula centrado, contenido alineado a la izquierda con separación
  entre secciones), enlazadas desde el **footer de Configuración**. Contenido editable en
  `src/legal/terminos.md` y `src/legal/privacidad.md` (se renderiza con un mini-markdown).
  **Pendiente: revisión de un abogado (Ley 1581/2012, Estatuto del Consumidor) + cumplimiento de
  tiendas antes de publicar.** El borrador incluye divulgación de IA, transferencias internacionales,
  cláusula de retiro/takedown, y notas sobre arbitraje (limitado frente a consumidores en Colombia).
- Sigue como pantalla **refactorizada** (fuera de App): `LegalPage` + ruteo en `ScreenRouter`.

---

## Estado / pendientes

- Build 97 módulos, sin NUL.
- **Legal:** falta la **revisión legal profesional** y llenar los `[placeholders]` (razón social, NIT,
  contacto, fechas) antes de publicar. Ver `src/legal/*.md`.
- **Siguiente (backlog):** Hito 3 (loading real), Hito 4 (pulido visual), Hito 5 (logo), Hito 6
  (páginas de config: Automation, Informes, Sobre la app, Permisos, Suscripciones), Hito 8 (Auth/
  Onboarding/Notificaciones → fase BD).
- **Fase BD/deploy (en memoria):** Sentry real + scrubbing, campo de reseña del usuario en la pantalla
  de error, patrón único de los 4 estados, 404 solo si hay rutas URL; conectar Supabase; app nativa/
  híbrida (Capacitor/RN) para la lectura de notificaciones/App Intents.

---

**prod-v10.6.2** · ORUS Finanzas · Nacho (@nassirsamur@gmail.com) · 17 julio 2026
