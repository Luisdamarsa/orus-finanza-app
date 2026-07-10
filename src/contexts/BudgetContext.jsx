/**
 * BudgetContext.jsx
 *
 * Context global para presupuestos
 * Maneja estado mutable de presupuestos
 *
 * Agnóstico: Usa budgetService (que puede venir de constants o BD)
 */

import { createContext, useState, useCallback, useEffect, useContext } from "react";
import { budgetService } from "../services/budgetService";
import { PILLARS } from "../constants";

export const BudgetContext = createContext();

/**
 * Provider que envuelve la app
 * Carga presupuestos y proporciona métodos para actualizarlos
 *
 * Almacena tanto categorías (ALL_CATS) como pilares (PILLARS)
 */
export function BudgetProvider({ children }) {
  // Estado: trigger para forzar re-render cuando cambien los presupuestos
  // Los presupuestos reales se obtienen de PILLARS
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Inicializar - cargar PILLARS
   */
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setLoading(true);
        console.log("✅ BudgetContext cargando PILLARS");
        setError(null);
      } catch (err) {
        console.error("❌ Error loading budgets:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, []);

  /**
   * Actualizar presupuesto de un PILAR
   * @param {string} pillarId - ID del pilar (ej: "fijos", "deuda")
   * @param {number} newBudget - Nuevo valor
   * @param {string} fromDate - Fecha desde la que aplica (ej: "2026-07-07")
   */
  const updateBudget = useCallback(
    async (pillarId, newBudget, fromDate) => {
      try {
        setError(null);

        // Actualizar presupuesto del pilar en PILLARS
        // El servicio modifica el pilar en PILLARS
        const updatedPillar = await budgetService.updateBudgetForPillar(
          pillarId,
          newBudget,
          fromDate
        );

        console.log("✅ BudgetContext actualizando pilar:", pillarId, "nuevo presupuesto:", newBudget, "budgetHistory:", updatedPillar.budgetHistory);

        // Forzar re-render para que se recalcuen los getters
        setUpdateTrigger(prev => prev + 1);

        return updatedPillar;
      } catch (err) {
        console.error("❌ Error updating budget:", err);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  /**
   * Obtener presupuesto para una fecha específica
   */
  const getBudgetForDate = useCallback(
    async (categoryName, date) => {
      return await budgetService.getBudgetForDate(categoryName, date);
    },
    []
  );

  /**
   * Obtener presupuesto actual (hoy)
   */
  const getCurrentBudget = useCallback(
    async (categoryName) => {
      return await budgetService.getCurrentBudget(categoryName);
    },
    []
  );

  /**
   * Obtener presupuestos de un pilar
   */
  const getBudgetsByPillar = useCallback(
    async (pillarId) => {
      return await budgetService.getBudgetsByPillar(pillarId);
    },
    []
  );

  /**
   * Obtener historial de cambios de una categoría
   */
  const getHistory = useCallback(
    async (categoryName) => {
      return await budgetService.getBudgetHistory(categoryName);
    },
    []
  );

  // Valor del contexto
  // Los presupuestos provienen directamente de PILLARS (que tienen getters intactos)
  // updateTrigger fuerza re-renders cuando cambien
  const value = {
    // Estado
    budgets: PILLARS,  // Devolver PILLARS directamente con sus getters
    loading,
    error,
    updateTrigger,  // Incluir en dependencias para forzar re-renders

    // Métodos
    updateBudget,
    getBudgetForDate,
    getCurrentBudget,
    getBudgetsByPillar,
    getHistory,
  };

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
}

/**
 * Hook para usar el context
 * Uso: const { budgets, updateBudget } = useBudgets();
 */
export function useBudgets() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgets debe usarse dentro de BudgetProvider");
  }
  return context;
}
