/**
 * budgetService.js
 *
 * Capa agnóstica de datos para presupuestos y categorías
 * Ahora: Lee/escribe en constants/index.js
 * Futuro: Cambia para leer/escribir en BD/API
 *
 * IMPORTANTE: Ahora usa IDs en lugar de nombres para identificar
 * El resto de la app NO cambia - solo este archivo es reemplazado
 */

import { ALL_CATS, PILLARS } from "../constants";
import { setBudgetFromDate } from "../utils/budgetUtils";
import {
  getCategoryById,
  getCategoriesByPillar,
  recordCategoryEdit,
  generateCategoryId
} from "../utils/categoryUtils";
import {
  getPillarById,
  recordPillarEdit
} from "../utils/pillarUtils";

/**
 * INICIALIZAR presupuestos (primera carga)
 * Retorna copia profunda de ALL_CATS desde constants
 */
export const budgetService = {
  /**
   * Obtener todos los presupuestos
   * @returns {Array} Copia de categorías con presupuestos
   */
  async getAllBudgets() {
    // Ahora: Devolver copia de ALL_CATS
    return JSON.parse(JSON.stringify(ALL_CATS));

    // Futuro (BD):
    // const response = await fetch("/api/budgets");
    // return response.json();
  },

  /**
   * Obtener presupuestos de un pilar
   * @param {string} pillarId - ID del pilar (ej: "fijos")
   * @returns {Array} Categorías del pilar
   */
  async getBudgetsByPillar(pillarId) {
    const budgets = await this.getAllBudgets();
    return budgets.filter(cat => cat.pillar === pillarId);

    // Futuro (BD):
    // const response = await fetch(`/api/budgets/pillar/${pillarId}`);
    // return response.json();
  },

  /**
   * Obtener una categoría específica POR ID
   * @param {string} categoryId - ID de la categoría
   * @returns {Object} Categoría con budgetHistory
   */
  async getCategory(categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) {
      throw new Error(`Categoría con ID "${categoryId}" no encontrada`);
    }
    return JSON.parse(JSON.stringify(category));

    // Futuro (BD):
    // const response = await fetch(`/api/budgets/category/${categoryId}`);
    // return response.json();
  },

  /**
   * GUARDAR cambio de presupuesto POR ID
   * @param {string} categoryId - ID de la categoría
   * @param {number} newBudget - Nuevo valor
   * @param {string} fromDate - Fecha desde la que aplica (ej: "2026-07-07")
   * @returns {Promise<Object>} Categoría actualizada
   */
  async updateBudget(categoryId, newBudget, fromDate) {
    // Actualizar en memory (en ALL_CATS)
    const category = getCategoryById(categoryId);

    if (!category) {
      throw new Error(`Categoría con ID "${categoryId}" no encontrada`);
    }

    // Usar setBudgetFromDate correctamente
    category.budgetHistory = setBudgetFromDate(
      category.budgetHistory,
      newBudget,
      fromDate
    );

    // Registrar en editHistory
    recordCategoryEdit(categoryId, {
      budgetHistory: {
        action: "update",
        fromDate,
        budget: newBudget
      }
    });

    console.log(`✅ Presupuesto de ${category.name} (${categoryId}) actualizado a ${newBudget} desde ${fromDate}`);

    return JSON.parse(JSON.stringify(category));

    // Futuro (BD):
    // const response = await fetch(`/api/budgets/category/${categoryId}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ newBudget, fromDate })
    // });
    // return response.json();
  },

  /**
   * OBTENER historial completo de cambios de presupuesto
   * @param {string} categoryId - ID de la categoría
   * @returns {Promise<Array>} Array de cambios históricos
   */
  async getBudgetHistory(categoryId) {
    const category = getCategoryById(categoryId);
    return category?.budgetHistory || [];

    // Futuro (BD):
    // const response = await fetch(`/api/budgets/category/${categoryId}/history`);
    // return response.json();
  },

  /**
   * REVERTIR a presupuesto inicial (para desarrollo/testing)
   * Reinicia ALL_CATS a valores originales
   */
  async resetBudgets() {
    // ⚠️ SOLO para desarrollo
    // En producción, borrar o hacer que requiera autenticación
    console.warn("⚠️ Reseteando presupuestos a valores iniciales");

    // Reimportar no es posible en JS, así que recreamos manualmente
    // En BD, sería: DELETE FROM budget_history; INSERT INTO ... (valores iniciales)

    throw new Error("resetBudgets debe ser reemplazado al migrar a BD");

    // Futuro (BD):
    // const response = await fetch("/api/budgets/reset", { method: "POST" });
    // return response.json();
  },

  /**
   * OBTENER presupuesto para una fecha específica
   * @param {string} categoryId - ID de la categoría
   * @param {string} date - Fecha (ej: "2026-07-07")
   */
  async getBudgetForDate(categoryId, date) {
    const { getBudgetForDate } = await import("../utils/budgetUtils.js");
    const category = getCategoryById(categoryId);
    if (!category) {
      throw new Error(`Categoría con ID "${categoryId}" no encontrada`);
    }
    return getBudgetForDate(category.budgetHistory, date);
  },

  /**
   * OBTENER presupuesto actual (hoy)
   * @param {string} categoryId - ID de la categoría
   */
  async getCurrentBudget(categoryId) {
    const { getCurrentBudget } = await import("../utils/budgetUtils.js");
    const category = getCategoryById(categoryId);
    if (!category) {
      throw new Error(`Categoría con ID "${categoryId}" no encontrada`);
    }
    return getCurrentBudget(category.budgetHistory);
  },

  /**
   * GUARDAR cambio de presupuesto de un PILAR
   * @param {string} pillarId - ID del pilar (ej: "fijos")
   * @param {number} newBudget - Nuevo valor
   * @param {string} fromDate - Fecha desde la que aplica (ej: "2026-07-07")
   * @returns {Promise<Object>} Pilar actualizado
   */
  async updateBudgetForPillar(pillarId, newBudget, fromDate) {
    // Encontrar el pilar en PILLARS
    const pillar = PILLARS.find(p => p.id === pillarId);

    if (!pillar) {
      throw new Error(`Pilar "${pillarId}" no encontrado`);
    }

    // Usar setBudgetFromDate para actualizar el budgetHistory
    pillar.budgetHistory = setBudgetFromDate(
      pillar.budgetHistory,
      newBudget,
      fromDate
    );

    return JSON.parse(JSON.stringify(pillar));

    // Futuro (BD):
    // const response = await fetch(`/api/budgets/pillar/${pillarId}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ newBudget, fromDate })
    // });
    // return response.json();
  },

  /**
   * GUARDAR cambio de presupuesto de una CATEGORÍA POR ID
   * @param {string} categoryId - ID de la categoría
   * @param {number} newBudget - Nuevo valor
   * @param {string} fromDate - Fecha desde la que aplica (ej: "2026-07-07")
   * @returns {Promise<Object>} Categoría actualizada
   */
  async updateBudgetForCategory(categoryId, newBudget, fromDate) {
    // Encontrar la categoría en ALL_CATS por ID
    const category = getCategoryById(categoryId);

    if (!category) {
      throw new Error(`Categoría con ID "${categoryId}" no encontrada`);
    }

    // Usar setBudgetFromDate para actualizar el budgetHistory
    category.budgetHistory = setBudgetFromDate(
      category.budgetHistory,
      newBudget,
      fromDate
    );

    // Registrar en editHistory
    recordCategoryEdit(categoryId, {
      budgetHistory: {
        action: "update",
        fromDate,
        budget: newBudget
      }
    });

    console.log(`💾 Presupuesto de ${category.name} (${categoryId}) actualizado a ${newBudget} desde ${fromDate}`);
    console.log(`   Historial: ${JSON.stringify(category.budgetHistory)}`);

    return JSON.parse(JSON.stringify(category));

    // Futuro (BD):
    // const response = await fetch(`/api/budgets/category/${categoryId}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ newBudget, fromDate })
    // });
    // return response.json();
  },

  /**
   * ACTUALIZAR NOMBRE de una categoría
   * @param {string} categoryId - ID de la categoría
   * @param {string} newName - Nuevo nombre
   */
  async updateCategoryName(categoryId, newName) {
    const category = getCategoryById(categoryId);
    if (!category) {
      throw new Error(`Categoría con ID "${categoryId}" no encontrada`);
    }

    const oldName = category.name;
    category.name = newName;

    recordCategoryEdit(categoryId, {
      name: { from: oldName, to: newName }
    });

    console.log(`✏️  Nombre de categoría actualizado: "${oldName}" → "${newName}"`);
    return JSON.parse(JSON.stringify(category));
  },

  /**
   * ACTUALIZAR PILAR de una categoría
   * @param {string} categoryId - ID de la categoría
   * @param {string} newPillarId - Nuevo ID de pilar
   */
  async updateCategoryPillar(categoryId, newPillarId) {
    const category = getCategoryById(categoryId);
    if (!category) {
      throw new Error(`Categoría con ID "${categoryId}" no encontrada`);
    }

    const pillar = getPillarById(newPillarId);
    if (!pillar) {
      throw new Error(`Pilar con ID "${newPillarId}" no encontrado`);
    }

    const oldPillarId = category.pillar;
    category.pillar = newPillarId;

    recordCategoryEdit(categoryId, {
      pillar: { from: oldPillarId, to: newPillarId }
    });

    console.log(`🏠 Pilar de categoría actualizado: "${oldPillarId}" → "${newPillarId}"`);
    return JSON.parse(JSON.stringify(category));
  },

  /**
   * CREAR nueva categoría
   * @param {string} pillarId - ID del pilar
   * @param {string} categoryName - Nombre de la categoría
   * @param {number} initialBudget - Presupuesto inicial (default 0)
   * @returns {Promise<Object>} Categoría creada
   */
  async createCategory(pillarId, categoryName, initialBudget = 0) {
    const pillar = getPillarById(pillarId);
    if (!pillar) {
      throw new Error(`Pilar con ID "${pillarId}" no encontrado`);
    }

    const newId = generateCategoryId(categoryName, pillarId);
    const today = new Date().toISOString().split('T')[0];

    const newCategory = {
      id: newId,
      name: categoryName,
      pillar: pillarId,
      spent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      budgetHistory: [
        { fromDate: today, budget: initialBudget }
      ],
      editHistory: []
    };

    ALL_CATS.push(newCategory);

    console.log(`✨ Categoría creada: ${newId} (${categoryName}) en ${pillarId}`);
    return JSON.parse(JSON.stringify(newCategory));
  },

  /**
   * ELIMINAR categoría
   * @param {string} categoryId - ID de la categoría
   */
  async deleteCategory(categoryId) {
    const index = ALL_CATS.findIndex(cat => cat.id === categoryId);
    if (index === -1) {
      throw new Error(`Categoría con ID "${categoryId}" no encontrada`);
    }

    const deleted = ALL_CATS[index];
    ALL_CATS.splice(index, 1);

    console.log(`🗑️  Categoría eliminada: ${categoryId} (${deleted.name})`);
    return JSON.parse(JSON.stringify(deleted));
  },
};
