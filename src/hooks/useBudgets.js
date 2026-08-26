import { useState, useCallback } from "react";

/**
 * useBudgets.js - Hook independiente para gestionar presupuestos de categorías
 *
 * Maneja presupuestos de categorías EN MEMORIA durante la sesión.
 * Usa IDs de categoría, NO nombres.
 * NO PERSISTE - se reinician siempre vacío al recargar.
 *
 * Retorna:
 *   - categoryBudgets: {categoryId: presupuesto, ...}
 *   - handleCategoryBudgetChange: (categoryId, value) → actualiza presupuesto
 */

export function useBudgets() {
  // 🆕 FASE 3B - Inicializar VACÍO, no con ALL_CATS
  // Solo agregar presupuestos cuando el usuario realmente los edita
  const [categoryBudgets, setCategoryBudgets] = useState({});

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

  // 🆕 FASE 3B - No agregar categorías de test - solo mantener lo que el usuario editó
  const updateWithNewCategories = useCallback(() => {
    // No hacer nada - solo mantener los presupuestos que el usuario realmente editó
  }, []);

  return {
    categoryBudgets,
    handleCategoryBudgetChange,
    addCategoryBudget,
    updateWithNewCategories,
    setCategoryBudgets
  };
}
