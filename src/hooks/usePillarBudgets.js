import { useState, useEffect, useCallback } from "react";
import * as budgetService from "../services/budgetService";
import { supabase } from "../services/supabaseService";

/**
 * usePillarBudgets.js - REFACTORIZADO para Supabase (FASE 3B)
 *
 * Maneja presupuestos de pilares por mes/año, sincronizado con Supabase.
 * Estructura: { userId: { monthYear: { pillarId: amount } } }
 *
 * 🆕 FASE 3B:
 * - Carga async desde Supabase
 * - isLoading y error estados funcionales
 * - setPillarBudget persiste en BD
 */

export function usePillarBudgets(userId) {
  const [customBudgets, setCustomBudgets] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🆕 FASE 3B - Cargar TODOS los presupuestos de pilares del usuario desde Supabase
  useEffect(() => {
    if (!userId) {
      setCustomBudgets({});
      return;
    }

    const loadAllPillarBudgets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('pillar_budgets')
          .select('*')
          .eq('user_id', userId);

        if (supabaseError) throw supabaseError;

        // Agrupar presupuestos por monthYear y pillarId
        const budgetsByMonth = {};
        (data || []).forEach(record => {
          const { month_year, pillar_id, amount } = record;
          if (!budgetsByMonth[month_year]) {
            budgetsByMonth[month_year] = {};
          }
          budgetsByMonth[month_year][pillar_id] = amount;
        });

        setCustomBudgets({
          [userId]: budgetsByMonth
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllPillarBudgets();
  }, [userId]);

  // 🆕 Obtener presupuesto para un mes específico (con fallback a BD)
  const getPillarBudgetForMonth = useCallback(
    async (pillarId, monthYear) => {
      if (!userId) return null;

      try {
        const budget = await budgetService.getPillarBudget(userId, pillarId, monthYear);
        return budget;
      } catch (err) {
        return null;
      }
    },
    [userId]
  );

  // 🆕 Establecer presupuesto (persiste en BD)
  const setPillarBudgetValue = useCallback(
    async (pillarId, monthYear, amount) => {
      if (!userId) return false;

      setIsLoading(true);
      setError(null);

      try {
        const success = await budgetService.setPillarBudget(userId, pillarId, monthYear, amount);

        if (success) {
          // Actualizar estado local también
          setCustomBudgets(prev => ({
            ...prev,
            [userId]: {
              ...prev[userId],
              [monthYear]: {
                ...prev[userId]?.[monthYear],
                [pillarId]: amount
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
    [userId]
  );

  return {
    customBudgets,
    setCustomBudgets,
    isLoading,
    error,
    getPillarBudgetForMonth,
    setPillarBudgetValue,
    userId
  };
}
