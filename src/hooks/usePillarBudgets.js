import { useState, useEffect } from "react";

/**
 * usePillarBudgets.js - Hook independiente para gestionar presupuestos de pilares
 *
 * Maneja presupuestos personalizados de pilares por mes/año.
 * NO PERSISTE - se reinician siempre desde PILLARS.
 *
 * 🆕 FASE 2: Soporta multi-usuario con estructura anidada:
 *   customBudgets: { userId: { keyMesAño: { pillarId: presupuesto } } }
 *
 * Retorna:
 *   - customBudgets: {userId: {keyMesAño: {pillarId: presupuesto, ...}, ...}, ...}
 *   - setCustomBudgets: actualiza los presupuestos
 */

export function usePillarBudgets(userId) {
  // ⭐ IMPORTANTE: Sin useEffect para cargar/guardar storage
  // Los presupuestos se reinician siempre desde PILLARS
  // 🆕 Estructura anidada por userId
  const [customBudgets, setCustomBudgets] = useState({});

  // 🆕 FASE 2 - Resetear presupuestos cuando userId cambia
  // Cada usuario tiene sus propios presupuestos personalizados
  useEffect(() => {
    console.log(`\n🎯 usePillarBudgets - userId cambió a: ${userId}`);
    // Resetear a vacío para este usuario (sin datos precargados)
    // Cada usuario comienza sin presupuestos personalizados
    setCustomBudgets(prev => ({
      ...prev,
      [userId]: prev[userId] || {}  // Inicializar usuario si no existe
    }));
  }, [userId]);

  return {
    customBudgets,
    setCustomBudgets,
    userId  // 🆕 Pasar userId para que App.jsx lo use en sus funciones
  };
}
