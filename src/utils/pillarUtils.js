/**
 * pillarUtils.js
 * Utilidades para trabajar con pilares
 */

import { PILLARS } from "../constants/index.js";

/**
 * Obtener pilar por ID
 * @param {string} pillarId - ID del pilar
 * @returns {object|null} Pilar encontrado o null
 */
export function getPillarById(pillarId) {
  return PILLARS.find(p => p.id === pillarId) || null;
}

/**
 * Obtener nombre del pilar por ID (para display)
 * @param {string} pillarId - ID del pilar
 * @returns {string|null} Label del pilar
 */
export function getPillarLabel(pillarId) {
  const pillar = getPillarById(pillarId);
  return pillar ? pillar.label : null;
}

/**
 * Registrar cambio en editHistory de un pilar
 * @param {string} pillarId - ID del pilar
 * @param {object} changes - Cambios realizados {field: {from, to}, ...}
 * @param {string} changedBy - Usuario que hizo el cambio (opcional)
 */
export function recordPillarEdit(pillarId, changes, changedBy) {
  const pillar = getPillarById(pillarId);
  if (!pillar) {
    console.warn(`⚠️  Pilar no encontrado: ${pillarId}`);
    return;
  }

  // Solo registrar si hay cambios
  if (Object.keys(changes).length === 0) return;

  pillar.editHistory.push({
    changedAt: new Date().toISOString(),
    changes,
    ...(changedBy && { changedBy })
  });

  pillar.updatedAt = new Date().toISOString();

  console.log(`📝 Cambio registrado en pilar ${pillarId}:`, changes);
}

/**
 * Validar que un pillarId existe
 * @param {string} pillarId - ID a validar
 * @returns {boolean}
 */
export function isPillarIdValid(pillarId) {
  return getPillarById(pillarId) !== null;
}

/**
 * Obtener historial de cambios de un pilar
 * @param {string} pillarId - ID del pilar
 * @returns {array} Array de cambios
 */
export function getPillarEditHistory(pillarId) {
  const pillar = getPillarById(pillarId);
  return pillar ? pillar.editHistory : [];
}

/**
 * Obtener toda la información de auditoría de un pilar
 * @param {string} pillarId - ID del pilar
 * @returns {object} {createdAt, updatedAt, editHistory}
 */
export function getPillarAuditInfo(pillarId) {
  const pillar = getPillarById(pillarId);
  if (!pillar) return null;

  return {
    id: pillar.id,
    label: pillar.label,
    createdAt: pillar.createdAt,
    updatedAt: pillar.updatedAt,
    editHistory: pillar.editHistory,
    totalChanges: pillar.editHistory.length
  };
}

/**
 * Obtener todos los pilares
 * @returns {array} Array de todos los pilares
 */
export function getAllPillars() {
  return PILLARS;
}
