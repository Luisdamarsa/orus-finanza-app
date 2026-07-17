/**
 * failSwitch.js — Utilidad SOLO para probar los ErrorBoundary (dev).
 *
 * Fuerza el fallo de una sección si agregas ?fail=<seccion> a la URL.
 *   Ej:  ?fail=donut           → falla el donut
 *        ?fail=donut,colorbar  → fallan varias a la vez
 *
 * Secciones válidas: donut, donuttags, colorbar, tags, cards, txns, catbar, fab, settings, period, incomes
 *
 * Es inofensivo en producción (solo lanza si tú pones el parámetro).
 * Quitar las llamadas failIf(...) y este archivo cuando termines de probar.
 */
export function failIf(section) {
  if (typeof window === "undefined") return;
  const fails = (new URLSearchParams(window.location.search).get("fail") || "")
    .split(",")
    .map((s) => s.trim());
  if (fails.includes(section)) {
    throw new Error(`[TEST fail-switch] Fallo forzado en sección: ${section}`);
  }
}

/**
 * FailProbe — componente auxiliar: lanza si su sección está activa.
 * Colócalo como hijo de un ErrorBoundary junto al bloque que quieres poder
 * "fallar" sin extraerlo a su propio componente:
 *   <ErrorBoundary fallback={null}><FailProbe section="settings" />{boton}</ErrorBoundary>
 */
export function FailProbe({ section }) {
  failIf(section);
  return null;
}
