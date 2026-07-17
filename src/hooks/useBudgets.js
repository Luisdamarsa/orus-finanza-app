import { useState, useCallback } from "react";
import { ALL_CATS } from "../constants";

/**
 * useBudgets.js - Hook independiente para gestionar presupuestos de categorías
 *
 * Maneja presupuestos de categorías EN MEMORIA durante la sesión.
 * Usa IDs de categoría, NO nombres.
 * NO PERSISTE - se reinician siempre desde ALL_CATS al recargar.
 *
 * Retorna:
 *   - categoryBudgets: {categoryId: presupuesto, ...}
 *   - handleCategoryBudgetChange: (categoryId, value) → actualiza presupuesto
 */

export function useBudgets() {
  // 🔄 Estado de presupuestos de categorías - SIEMPRE iniciar desde ALL_CATS
  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    // Inicializar siempre desde ALL_CATS usando IDs
    const budgets = {};
    ALL_CATS.forEach(cat => {
      budgets[cat.id] = cat.budget;
    });
    return budgets;
  });

  // ⭐ IMPORTANTE: Sin useEffect para guardar en storage
  // Los presupuestos se reinician siempre desde ALL_CATS al recargar

  // 🆕 Cambiar presupuesto de categoría (por ID) - Soportar decimales
  const handleCategoryBudgetChange = useCallback((categoryId, value) => {
    // Convertir coma a punto para parseFloat y mantener decimales
    const numValue = parseFloat(value.replace(",", ".").replace(/[^\d.]/g, "")) || 0;
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: numValue
    }));
  }, []);

  // Agregar nuevas categorías al presupuesto (por ID)
  const addCategoryBudget = useCallback((categoryId, initialBudget = 0) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: initialBudget
    }));
  }, []);

  // Agregar múltiples categorías (ej: cuando vienen del hook useCategories)
  const updateWithNewCategories = useCallback(() => {
    setCategoryBudgets(prev => {
      const updated = { ...prev };

      // Agregar categorías de ALL_CATS que no estén (por ID)
      ALL_CATS.forEach(cat => {
        if (!updated.hasOwnProperty(cat.id)) {
          updated[cat.id] = cat.budget;
        }
      });

      return updated;
    });
  }, []);

  return {
    categoryBudgets,
    handleCategoryBudgetChange,
    addCategoryBudget,
    updateWithNewCategories,
    setCategoryBudgets
  };
}
