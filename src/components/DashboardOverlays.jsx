import PeriodSelector from "./PeriodSelectorService";
import ErrorBoundary from "./ErrorBoundary";
import FloatingActionButtons from "./FloatingActionButtons";
import PillarBarsPopup from "./PillarBarsPopup";
import UpdateBalanceModal from "./UpdateBalanceModal";
import { useDashboard } from "../contexts/DashboardContext";

/**
 * DashboardOverlays.jsx
 *
 * Capa de overlays del dashboard: FABs (lápiz/micrófono), selector de período y
 * popups (barras de pilar, actualizar saldo). Consume el DashboardContext.
 *
 * Refactor del Dashboard — HU-2. Extraído tal cual desde App.jsx (idéntico).
 */
export default function DashboardOverlays() {
  const {
    isDark, setScreen, setPressingFAB, pressingFAB,
    showPeriodPicker, selectedPeriod, setSelectedPeriod, setFilteredPillar,
    setActiveId, setShowPeriodPicker, monthHasData,
    showPillarBars, selectedPillarDetail, categories, setShowPillarBars,
    setSelectedPillarForMovements, transactions,
    showUpdateBalance, saldo, setShowUpdateBalance, setIsMovementOpen,
    setFilterType, setMovementOpenedFrom,
  } = useDashboard();

  return (
    <>
      {/* FAB - Lápiz (left) + Micrófono (right) — boundary propio */}
      <ErrorBoundary fallback={null}>
        <FloatingActionButtons isDark={isDark} pressingFAB={pressingFAB} setPressingFAB={setPressingFAB} setScreen={setScreen} />
      </ErrorBoundary>

      {/* Period Picker */}
      {showPeriodPicker && (
        <PeriodSelector
          isDark={isDark}
          selectedPeriod={selectedPeriod}
          onSelect={p => { setSelectedPeriod(p); setFilteredPillar(null); setActiveId(null); }}
          onClose={() => setShowPeriodPicker(false)}
          monthHasData={monthHasData}
        />
      )}

      {/* Popups */}
      {showPillarBars && selectedPillarDetail && (
        <PillarBarsPopup
          pillar={selectedPillarDetail}
          categories={categories}
          onClose={() => { setShowPillarBars(false); setActiveId(null); }}
          onViewMovements={() => {
            setShowPillarBars(false);
            setActiveId(null); // Resetear la tarjeta seleccionada al abrir movimientos
            setSelectedPillarForMovements(selectedPillarDetail);
            setScreen("movimientos");
          }}
          isDark={isDark}
          transactions={transactions}
          selectedPeriod={selectedPeriod}
        />
      )}

      {showUpdateBalance && (
        <UpdateBalanceModal
          isDark={isDark}
          currentSaldo={saldo}
          onClose={() => setShowUpdateBalance(false)}
          onDone={val => {
            const now = new Date();
            const newBalance = { year: now.getFullYear(), month: now.getMonth() + 1, value: val };
            setBalance(newBalance);
            setSelectedPeriod({ year: now.getFullYear(), month: now.getMonth() + 1 });
            setShowUpdateBalance(false);
            // 🆕 Volver a Estado 1 automáticamente al actualizar saldo
            setIsMovementOpen(false);
            setFilterType(null);
            setMovementOpenedFrom(null);
          }}
        />
      )}
    </>
  );
}
