import { useState } from "react";

/**
 * usePillarBudgets.js - Hook independiente para gestionar presupuestos de pilares
 *
 * Maneja presupuestos personalizados de pilares por mes/año.
 * NO PERSISTE - se reinician siempre desde PILLARS.
 *
 * Retorna:
 *   - customBudgets: {keyMesAño: {pillarId: presupuesto, ...}, ...}
 *   - setCustomBudgets: actualiza los presupuestos
 */

export function usePillarBudgets() {
  // ⭐ IMPORTANTE: Sin useEffect para cargar/guardar storage
  // Los presupuestos se reinician siempre desde PILLARS
  const [customBudgets, setCustomBudgets] = useState({});

  return {
    customBudgets,
    setCustomBudgets
  };
}
