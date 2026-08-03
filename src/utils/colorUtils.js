/**
 * colorUtils.js — Utilidades para colores de pilares y métodos de pago
 * Mapea IDs a colores (pastel/vívido según isDark)
 */

import { PILLARS, PAYMENT_METHODS } from "../constants/tokens";

/**
 * Obtener color de pilar según ID y modo
 * @param {string} pillarKey - ID del pilar (ej. "fijos", "deuda", etc.)
 * @param {boolean} isDark - si es modo oscuro (pastel) o claro (vívido)
 * @returns {string} color hex
 */
export function getPillarColor(pillarKey, isDark) {
  const pillar = PILLARS[pillarKey];
  if (!pillar) return isDark ? "#8B87A3" : "#7B7A99";
  return isDark ? pillar.dark : pillar.light;
}

/**
 * Obtener nombre de pilar
 * @param {string} pillarKey - ID del pilar
 * @returns {string} nombre legible
 */
export function getPillarName(pillarKey) {
  return PILLARS[pillarKey]?.name || pillarKey;
}

/**
 * Obtener ícono de pilar (Lucide icon name)
 * @param {string} pillarKey - ID del pilar
 * @returns {string} nombre del ícono
 */
export function getPillarIcon(pillarKey) {
  return PILLARS[pillarKey]?.icon || "grid-2x2";
}

/**
 * Obtener color de pilar con opacidad suave (softBg)
 * @param {string} pillarKey - ID del pilar
 * @param {boolean} isDark - si es modo oscuro
 * @returns {string} color rgba
 */
export function getPillarSoftBg(pillarKey, isDark) {
  const color = getPillarColor(pillarKey, isDark);
  const alpha = isDark ? 0.16 : 0.14;
  return hexToRgba(color, alpha);
}

/**
 * Obtener color de método de pago
 * @param {string} methodKey - ID del método (ej. "banco", "tarjeta", etc.)
 * @param {boolean} isDark - si es modo oscuro
 * @returns {string} color hex
 */
export function getPaymentMethodColor(methodKey, isDark) {
  const method = PAYMENT_METHODS[methodKey];
  if (!method) return isDark ? "#8B87A3" : "#7B7A99";
  return isDark ? method.dark : method.light;
}

/**
 * Obtener nombre de método de pago
 * @param {string} methodKey - ID del método
 * @returns {string} nombre legible
 */
export function getPaymentMethodName(methodKey) {
  return PAYMENT_METHODS[methodKey]?.name || methodKey;
}

/**
 * Convertir hex a rgba
 * @param {string} hex - color hex (ej. "#FF0000")
 * @param {number} alpha - opacidad (0-1)
 * @returns {string} color rgba
 */
export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Obtener todos los pilares con sus colores
 * @param {boolean} isDark - si es modo oscuro
 * @returns {array} array de objetos {id, name, color, icon}
 */
export function getAllPillars(isDark) {
  return Object.entries(PILLARS).map(([key, pillar]) => ({
    id: key,
    name: pillar.name,
    color: isDark ? pillar.dark : pillar.light,
    icon: pillar.icon,
  }));
}

/**
 * Obtener todos los métodos de pago con sus colores
 * @param {boolean} isDark - si es modo oscuro
 * @returns {array} array de objetos {id, name, color}
 */
export function getAllPaymentMethods(isDark) {
  return Object.entries(PAYMENT_METHODS).map(([key, method]) => ({
    id: key,
    name: method.name,
    color: isDark ? method.dark : method.light,
  }));
}
