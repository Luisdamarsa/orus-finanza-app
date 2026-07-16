/**
 * colorService.js
 *
 * Fuente única de verdad para colores semánticos y lógica de color dinámico.
 * Antes: hex "mágicos" (#EF4444, #22C55E, #FCA5A5...) regados por N componentes
 * y la decisión de "color sobre-presupuesto" duplicada en 4 lugares.
 *
 * FASE 1.2 de refactorización.
 */

/**
 * Tokens de color semánticos. Un solo lugar para el color de marca.
 * Cambiar aquí cambia toda la app.
 */
export const COLORS = {
  gasto: "#EF4444",      // rojo fuerte: gasto, saldo negativo, sobrepaso
  ingreso: "#22C55E",    // verde: ingreso, ahorro en overage
  overSoft: "#FCA5A5",   // rojo suave: barras/porcentaje en overage
  neutral: "#64748B",    // gris/slate: saldo neutro, default
};

/**
 * Aplica transparencia a un color hex de 6 dígitos.
 * @param {string} color  hex "#RRGGBB"
 * @param {string|number} alpha  "88" (2 dígitos hex) o número 0..1
 * @returns {string} hex "#RRGGBBAA"
 */
export function withAlpha(color, alpha) {
  let hex;
  if (typeof alpha === "number") {
    const clamped = Math.max(0, Math.min(1, alpha));
    hex = Math.round(clamped * 255).toString(16).padStart(2, "0");
  } else {
    hex = String(alpha).padStart(2, "0").slice(0, 2);
  }
  return `${color}${hex}`;
}

/**
 * Color según estado de presupuesto.
 * - No sobrepasa → fallback (gris/color de pilar según contexto).
 * - Sobrepasa y es Ahorro → verde (sobrepasar ahorro es bueno).
 * - Sobrepasa (otros) → rojo fuerte (strong) o rojo suave (default).
 *
 * @param {Object} opts
 * @param {boolean} opts.isOver     ¿sobrepasó el presupuesto?
 * @param {boolean} [opts.isAhorros] ¿es el pilar de Ahorro?
 * @param {boolean} [opts.strong]    usar rojo fuerte (#EF4444) en vez de suave (#FCA5A5)
 * @param {string}  opts.fallback   color cuando NO sobrepasa
 * @returns {string}
 */
export function getOverBudgetColor({ isOver, isAhorros = false, strong = false, fallback }) {
  if (!isOver) return fallback;
  if (isAhorros) return COLORS.ingreso;
  return strong ? COLORS.gasto : COLORS.overSoft;
}
