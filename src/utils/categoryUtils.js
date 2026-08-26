/**
 * categoryUtils.js
 * ✅ 100% Supabase - sin ALL_CATS
 * Utilidades para trabajar con categorías usando IDs
 */

/**
 * Obtener nombre de categoría por ID (para display)
 * ✅ 100% Supabase via categoryMap
 * @param {string} categoryId - ID de la categoría
 * @param {object} categoryMap - mapping {id: name} de Supabase
 * @returns {string|null} Nombre de la categoría
 */
export function getCategoryName(categoryId, categoryMap = {}) {
  if (!categoryId) return 'Sin categoría';

  // Buscar en categoryMap (Supabase)
  if (categoryMap[categoryId]) {
    return categoryMap[categoryId];
  }

  // Si no está en categoryMap, retornar el ID
  // Esto es normal si categoryMap aún se está recargando desde Supabase
  return categoryId;
}
