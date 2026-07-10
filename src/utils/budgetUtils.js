/**
 * budgetUtils.js
 *
 * Funciones para manejar presupuestos con histórico de fechas
 * Estructura agnóstica - fácil de migrar a BD
 *
 * Las funciones NO dependen de dónde vengan los datos (constants, API, DB)
 * Solo reciben arrays de datos y retornan resultados
 */

/**
 * Obtiene el presupuesto de una categoría para una fecha específica
 * @param {Array} budgetHistory - Array de histórico: [{fromDate, budget}, ...]
 * @param {string} date - Fecha en formato "YYYY-MM-DD" (ej: "2026-07-15")
 * @returns {number|null} Presupuesto vigente en esa fecha, o null si no existe
 *
 * Lógica: Busca el presupuesto más reciente anterior a la fecha dada
 * Ejemplo:
 *   - budgetHistory = [{fromDate: "2025-01-01", budget: 700000},
 *                       {fromDate: "2026-07-01", budget: 1500000}]
 *   - getBudgetForDate(budgetHistory, "2026-06-30") → 700000
 *   - getBudgetForDate(budgetHistory, "2026-07-15") → 1500000
 */
export const getBudgetForDate = (budgetHistory, date) => {
  if (!budgetHistory || budgetHistory.length === 0) return null;

  // Filtrar histórico anterior o igual a la fecha
  const validHistories = budgetHistory.filter(
    h => new Date(h.fromDate) <= new Date(date)
  );

  if (validHistories.length === 0) return null;

  // Ordenar por fecha descendente y tomar el más reciente
  const mostRecent = validHistories.sort(
    (a, b) => new Date(b.fromDate) - new Date(a.fromDate)
  )[0];

  return mostRecent.budget;
};

/**
 * Establece un nuevo presupuesto a partir de una fecha
 * @param {Array} budgetHistory - Array de histórico (se modifica)
 * @param {number} newBudget - Nuevo valor de presupuesto
 * @param {string} fromDate - Fecha desde la que aplica (ej: "2026-07-01")
 * @returns {Array} Array actualizado
 *
 * Lógica: Agrega nueva entrada al histórico
 * Si ya existe entrada para esa fecha, la reemplaza
 */
export const setBudgetFromDate = (budgetHistory, newBudget, fromDate) => {
  if (!budgetHistory) budgetHistory = [];

  // Verificar si ya existe entrada para esa fecha
  const existingIndex = budgetHistory.findIndex(h => h.fromDate === fromDate);

  if (existingIndex !== -1) {
    // Reemplazar entrada existente
    budgetHistory[existingIndex].budget = newBudget;
  } else {
    // Agregar nueva entrada
    budgetHistory.push({ fromDate, budget: newBudget });
  }

  // Ordenar por fecha para mantener consistencia
  return budgetHistory.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));
};

/**
 * Obtiene todo el historial de presupuestos
 * @param {Array} budgetHistory - Array de histórico
 * @returns {Array} Array ordenado cronológicamente
 */
export const getBudgetHistory = (budgetHistory) => {
  if (!budgetHistory) return [];
  return [...budgetHistory].sort(
    (a, b) => new Date(a.fromDate) - new Date(b.fromDate)
  );
};

/**
 * Obtiene el presupuesto total de un pilar para una fecha
 * @param {Array} allCats - Array de categorías (ej: ALL_CATS)
 * @param {string} pillarId - ID del pilar (ej: "fijos")
 * @param {string} date - Fecha en formato "YYYY-MM-DD"
 * @returns {number|null} Presupuesto total del pilar en esa fecha
 *
 * Lógica: Suma presupuestos de todas las categorías del pilar para esa fecha
 */
export const getPillarBudgetForDate = (allCats, pillarId, date) => {
  const pillarCats = allCats.filter(cat => cat.pillar === pillarId);

  // Filtrar categorías que tienen presupuesto en esa fecha
  const budgetsForDate = pillarCats
    .map(cat => getBudgetForDate(cat.budgetHistory, date))
    .filter(b => b !== null && b !== undefined);

  if (budgetsForDate.length === 0) return null;

  return budgetsForDate.reduce((sum, b) => sum + b, 0);
};

/**
 * Obtiene el presupuesto actual (hoy) de una categoría
 * Conveniencia: llama a getBudgetForDate con la fecha de hoy
 */
export const getCurrentBudget = (budgetHistory) => {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  return getBudgetForDate(budgetHistory, today);
};

/**
 * Obtiene el presupuesto actual (hoy) de un pilar
 * Conveniencia: llama a getPillarBudgetForDate con la fecha de hoy
 */
export const getCurrentPillarBudget = (allCats, pillarId) => {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  return getPillarBudgetForDate(allCats, pillarId, today);
};

/**
 * Obtiene el rango de fechas con cambios de presupuesto
 * Útil para mostrar "Desde cuándo y hasta cuándo" aplica cada presupuesto
 */
export const getBudgetDateRange = (budgetHistory) => {
  if (!budgetHistory || budgetHistory.length === 0) return null;

  const sorted = [...budgetHistory].sort(
    (a, b) => new Date(a.fromDate) - new Date(b.fromDate)
  );

  return {
    from: sorted[0].fromDate,
    to: sorted[sorted.length - 1].fromDate,
  };
};
