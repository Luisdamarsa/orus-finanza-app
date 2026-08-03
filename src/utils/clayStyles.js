/**
 * clayStyles.js — Utilidades para aplicar estilos clay (sombras, radios, animaciones)
 * Usa los tokens centralizados para consistencia visual
 */

import { SHADOWS, RADIUS } from "../constants/tokens";

/**
 * Obtener shadow clay según contexto
 * @param {string} level - "main" (tarjetas grandes), "sm" (filas/pills), "pressed" (inputs)
 * @param {boolean} isDark - si es modo oscuro
 * @returns {string} box-shadow CSS
 */
export function getClayShadow(level = "main", isDark = true) {
  if (!isDark && level === "main") return SHADOWS.shadowLight;
  if (!isDark && level === "sm") return SHADOWS.shadowSmLight;
  if (!isDark && level === "pressed") return SHADOWS.shadowPressedLight;

  if (level === "sm") return SHADOWS.shadowSm;
  if (level === "pressed") return SHADOWS.shadowPressed;
  return SHADOWS.shadow;
}

/**
 * Estilos básicos para tarjeta clay (card)
 * @param {object} tokens - objeto de tokens (DARK o LIGHT)
 * @param {boolean} isDark - si es modo oscuro
 * @returns {object} objeto de estilos inline
 */
export function cardStyles(tokens, isDark = true) {
  return {
    background: `linear-gradient(155deg, ${tokens.surface || tokens.surfaceFlat} 0%, ${tokens.surfaceFlat} 100%)`,
    border: `1px solid ${tokens.border}`,
    borderRadius: RADIUS.lg,
    boxShadow: getClayShadow("main", isDark),
  };
}

/**
 * Estilos para fila/item clay
 * @param {object} tokens - objeto de tokens
 * @param {boolean} isDark - si es modo oscuro
 * @returns {object} objeto de estilos inline
 */
export function rowStyles(tokens, isDark = true) {
  return {
    background: tokens.surfaceFlat,
    border: `1px solid ${tokens.border}`,
    borderRadius: RADIUS.md,
    boxShadow: getClayShadow("sm", isDark),
  };
}

/**
 * Estilos para botón clay con interacción
 * @param {object} tokens - objeto de tokens
 * @param {boolean} isPressing - si el botón está siendo presionado
 * @returns {object} objeto de estilos inline
 */
export function buttonStyles(tokens, isPressing = false) {
  return {
    background: isPressing ? `rgba(0, 0, 0, 0.15)` : tokens.surfaceFlat,
    border: `1.5px solid ${tokens.border}`,
    borderRadius: RADIUS.md,
    cursor: "pointer",
    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isPressing ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
    boxShadow: isPressing ? "inset 0 2px 6px rgba(0, 0, 0, 0.2)" : "none",
  };
}

/**
 * Estilos para input clay
 * @param {object} tokens - objeto de tokens
 * @param {boolean} isDark - si es modo oscuro
 * @returns {object} objeto de estilos inline
 */
export function inputStyles(tokens, isDark = true) {
  return {
    background: tokens.inputBg,
    border: `1px solid ${tokens.border}`,
    borderRadius: RADIUS.md,
    color: tokens.text,
    padding: "10px 14px",
    fontSize: 13.5,
    fontWeight: 600,
    boxShadow: getClayShadow("pressed", isDark),
  };
}

/**
 * Estilos para pill/badge
 * @param {string} color - color base (ej. "#9B6DFF")
 * @returns {object} objeto de estilos inline
 */
export function pillStyles(color) {
  return {
    background: `${color}16`,
    border: `1px solid ${color}33`,
    borderRadius: RADIUS.pill,
    color: color,
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 700,
  };
}

/**
 * Estilos para FAB (botón flotante)
 * @param {object} tokens - objeto de tokens
 * @param {boolean} isDark - si es modo oscuro
 * @returns {object} objeto de estilos inline
 */
export function fabStyles(tokens, isDark = true) {
  return {
    borderRadius: RADIUS.circle,
    boxShadow: getClayShadow("main", isDark),
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    transition: "all 0.2s ease",
  };
}
