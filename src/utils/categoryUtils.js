/**
 * categoryUtils.js
 * Utilidades para trabajar con categorías usando IDs
 */

import { ALL_CATS } from "../constants/index.js";

/**
 * Obtener categoría por ID
 * @param {string} categoryId - ID de la categoría
 * @returns {object|null} Categoría encontrada o null
 */
export function getCategoryById(categoryId) {
  return ALL_CATS.find(cat => cat.id === categoryId) || null;
}

/**
 * Obtener categorías por pilar
 * @param {string} pillarId - ID del pilar
 * @returns {array} Array de categorías del pilar
 */
export function getCategoriesByPillar(pillarId) {
  return ALL_CATS.filter(cat => cat.pillar === pillarId);
}

/**
 * Obtener nombre de categoría por ID (para display)
 * @param {string} categoryId - ID de la categoría
 * @returns {string|null} Nombre de la categoría
 */
export function getCategoryName(categoryId) {
  const cat = getCategoryById(categoryId);
  return cat ? cat.name : null;
}

/**
 * Registrar cambio en editHistory de una categoría
 * @param {string} categoryId - ID de la categoría
 * @param {object} changes - Cambios realizados {field: {from, to}, ...}
 * @param {string} changedBy - Usuario que hizo el cambio (opcional)
 */
export function recordCategoryEdit(categoryId, changes, changedBy) {
  const category = getCategoryById(categoryId);
  if (!category) {
    console.warn(`⚠️  Categoría no encontrada: ${categoryId}`);
    return;
  }

  // Solo registrar si hay cambios
  if (Object.keys(changes).length === 0) return;

  category.editHistory.push({
    changedAt: new Date().toISOString(),
    changes,
    ...(changedBy && { changedBy })
  });

  category.updatedAt = new Date().toISOString();

  console.log(`📝 Cambio registrado en ${categoryId}:`, changes);
}

/**
 * Generar ID único para nueva categoría
 * @param {string} namePrefix - Prefijo del nombre de la categoría
 * @param {string} pillarId - ID del pilar
 * @returns {string} ID único (ej: cat_fijos_test_1234567890)
 */
export function generateCategoryId(namePrefix, pillarId = "") {
  const namePart = namePrefix
    .toLowerCase()
    .slice(0, 3)
    .replace(/\s+/g, "");

  const timestamp = Date.now();

  if (pillarId) {
    return `cat_${pillarId}_${namePart}_${timestamp}`;
  }

  return `cat_${namePart}_${timestamp}`;
}

/**
 * Validar que un categoryId existe
 * @param {string} categoryId - ID a validar
 * @returns {boolean}
 */
export function isCategoryIdValid(categoryId) {
  return getCategoryById(categoryId) !== null;
}

/**
 * Obtener historial de cambios de una categoría
 * @param {string} categoryId - ID de la categoría
 * @returns {array} Array de cambios
 */
export function getCategoryEditHistory(categoryId) {
  const category = getCategoryById(categoryId);
  return category ? category.editHistory : [];
}

/**
 * Obtener toda la información de auditoría de una categoría
 * @param {string} categoryId - ID de la categoría
 * @returns {object} {createdAt, updatedAt, editHistory}
 */
export function getCategoryAuditInfo(categoryId) {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    editHistory: category.editHistory,
    totalChanges: category.editHistory.length
  };
}
