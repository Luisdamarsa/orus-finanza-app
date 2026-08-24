import { useState, useEffect, useCallback } from "react";
import * as budgetService from "../services/budgetService";

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

  // 🆕 Cargar presupuestos del usuario desde Supabase cuando userId o month cambia
  useEffect(() => {
    if (!userId) {
      setCustomBudgets({});
      return;
    }

    // Nota: Aquí podríamos cargar un mes específico si fuera necesario
    // Por ahora, inicializamos vacío y cargamos bajo demanda
    setCustomBudgets(prev => ({
      ...prev,
      [userId]: prev[userId] || {}
    }));
    console.log(`🎯 usePillarBudgets - userId cambió a: ${userId}`);
  }, [userId]);

  // 🆕 Obtener presupuesto para un mes específico (con fallback a BD)
  const getPillarBudgetForMonth = useCallback(
    async (pillarId, monthYear) => {
      if (!userId) return null;

      try {
        const budget = await budgetService.getPillarBudget(userId, pillarId, monthYear);
        return budget;
      } catch (err) {
        console.error("Error getting pillar budget:", err);
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
          console.log(`✅ Presupuesto pillar guardado: ${userId}/${pillarId}/${monthYear}=${amount}`);
        }
        return success;
      } catch (err) {
        console.error("Error setting pillar budget:", err);
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
