import { useState } from "react";

/**
 * useDashboardNavigation.js - Navegación y overlays del dashboard.
 *
 * Agrupa: la pantalla activa (screen), las selecciones asociadas
 * (selectedPillarDetail, selectedPillarForMovements), los paneles/popups
 * abiertos (showPillarBars, showUpdateBalance, showPeriodPicker) y el toggle
 * de la sección de ingresos (showIncomes). Estado de UI puro → sin
 * service/isLoading/error.
 *
 * Devuelve estado + setters con los MISMOS nombres que vivían en Dashboard,
 * para no tocar los sitios que los consumen.
 */
export function useDashboardNavigation() {
  const [screen, setScreen] = useState("dashboard");
  const [selectedPillarDetail, setSelectedPillarDetail] = useState(null);
  const [selectedPillarForMovements, setSelectedPillarForMovements] = useState(null);
  const [showPillarBars, setShowPillarBars] = useState(false);
  const [showUpdateBalance, setShowUpdateBalance] = useState(false);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [showIncomes, setShowIncomes] = useState(false);

  return {
    screen, setScreen,
    selectedPillarDetail, setSelectedPillarDetail,
    selectedPillarForMovements, setSelectedPillarForMovements,
    showPillarBars, setShowPillarBars,
    showUpdateBalance, setShowUpdateBalance,
    showPeriodPicker, setShowPeriodPicker,
    showIncomes, setShowIncomes,
  };
}
