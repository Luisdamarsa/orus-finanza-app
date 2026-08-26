import { useState } from "react";

/**
 * useDashboardFilters.js - Estado de "vista" del dashboard.
 *
 * Agrupa el racimo que controla QUÉ se ve: período, filtro gastado/ingresos,
 * pilar filtrado, pilar activo del donut y el estado de la barra de Movimientos.
 * Es estado de UI (configuración de vista), no dato persistible → sin
 * service/isLoading/error.
 *
 * Devuelve estado + setters con los MISMOS nombres que antes vivían en
 * Dashboard, para no tocar los ~50 sitios que los consumen.
 */
export function useDashboardFilters() {
  // 🆕 FASE 3B - Iniciar con el mes ACTUAL, no con el último mes con datos
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const today = new Date();
    return {
      month: today.getMonth() + 1,
      year: today.getFullYear()
    };
  });
  const [filterType, setFilterType] = useState(null);            // null | "gastado" | "ingresos"
  const [filteredPillar, setFilteredPillar] = useState(null);
  const [activeId, setActiveId] = useState(null);                // pilar activo del donut
  const [isMovementOpen, setIsMovementOpen] = useState(false);
  const [movementOpenedFrom, setMovementOpenedFrom] = useState(null); // null | "gastado" | "ingresos" | "bar"

  return {
    selectedPeriod, setSelectedPeriod,
    filterType, setFilterType,
    filteredPillar, setFilteredPillar,
    activeId, setActiveId,
    isMovementOpen, setIsMovementOpen,
    movementOpenedFrom, setMovementOpenedFrom,
  };
}
