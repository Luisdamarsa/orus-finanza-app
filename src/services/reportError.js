/**
 * reportError.js — capa ÚNICA de reporte de errores.
 *
 * Sentry.captureException(error, { extra: context }) — con scrubbing de datos
 * sensibles (montos / PII; finanzas + Ley 1581). Nada más del código cambia.
 *
 * Enganchada en:
 *  - ErrorBoundary.componentDidCatch (errores de render)
 *  - window.onerror / unhandledrejection (errores de eventos y promesas,
 *    que los ErrorBoundary NO atrapan)
 */
export function reportError(error, context = {}) {
  // TODO (fase BD): Sentry.captureException(error, { extra: context });
}

let installed = false;

/** Engancha los errores globales que el ErrorBoundary no atrapa. Llamar una vez al arrancar. */
export function installGlobalErrorReporting() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (e) => {
    reportError(e.error || e.message, {
      type: "window.onerror",
      source: e.filename,
      line: e.lineno,
      col: e.colno,
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    reportError(e.reason, { type: "unhandledrejection" });
  });
}
