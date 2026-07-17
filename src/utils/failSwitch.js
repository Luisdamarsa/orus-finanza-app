/**
 * failSwitch.js — Utilidad SOLO para probar los ErrorBoundary (dev).
 *
 * Fuerza el fallo de una sección si agregas ?fail=<seccion> a la URL.
 *   Ej:  ?fail=donut           → falla el donut
 *        ?fail=donut,colorbar  → fallan varias a la vez
 *
 * Secciones válidas: donut, donuttags, colorbar, tags, cards, txns, catbar
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
