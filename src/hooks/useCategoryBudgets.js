import { useState, useEffect, useCallback } from "react";
import * as budgetService from "../services/budgetService";

/**
 * useCategoryBudgets.js - FASE 3D
 *
 * Maneja presupuestos de categorías (MENSUALES como pilares).
 * Estructura: { userId: { monthYear: { categoryId: amount } } }
 *
 * Igual que pilares, varían por mes.
 */

export function useCategoryBudgets(userId, monthYear) {
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🆕 FASE 3D - Cargar presupuestos de categorías para un mes específico
  useEffect(() => {
    if (!userId || !monthYear) {
      setCategoryBudgets({});
      return;
    }

    const loadCategoryBudgetsForMonth = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const budgets = await budgetService.getCategoryBudgetsForUser(userId, monthYear);

        // Estructura: { userId: { monthYear: { categoryId: amount } } }
        setCategoryBudgets({
          [userId]: {
            [monthYear]: budgets
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryBudgetsForMonth();
  }, [userId, monthYear]);

  // 🆕 Obtener presupuesto de una categoría para el mes
  const getCategoryBudgetValue = useCallback(
    async (categoryId) => {
      if (!userId || !monthYear) return null;

      try {
        const budget = await budgetService.getCategoryBudget(userId, categoryId, monthYear);
        return budget;
      } catch (err) {
        return null;
      }
    },
    [userId, monthYear]
  );

  // 🆕 Establecer presupuesto de categoría (persiste en BD)
  const setCategoryBudgetValue = useCallback(
    async (categoryId, amount) => {
      if (!userId || !monthYear) return false;

      setIsLoading(true);
      setError(null);

      try {
        const success = await budgetService.setCategoryBudget(userId, categoryId, monthYear, amount);

        if (success) {
          // Actualizar estado local también
          setCategoryBudgets(prev => ({
            ...prev,
            [userId]: {
              ...prev[userId],
              [monthYear]: {
                ...prev[userId]?.[monthYear],
                [categoryId]: amount
              }
            }
          }));
        }
        return success;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, monthYear]
  );

  return {
    categoryBudgets,
    setCategoryBudgets,
    isLoading,
    error,
    getCategoryBudgetValue,
    setCategoryBudgetValue,
    userId
  };
}
