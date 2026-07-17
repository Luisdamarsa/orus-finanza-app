import PeriodSelector from "./PeriodSelectorService";
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
      {/* FAB - Lápiz (left) + Micrófono (right) */}
      <div style={{
        position: "absolute", bottom: 24, right: 22, zIndex: 35,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button
          onClick={() => setScreen("new-transaction")}
          onPointerDown={() => setPressingFAB("pencil")}
          onPointerUp={() => setPressingFAB(null)}
          onPointerLeave={() => setPressingFAB(null)}
          style={{
            width: 32, height: 32, borderRadius: "50%", border: "none",
            background: isDark ? "#3A3A52" : "#94A3B8",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(0,0,0,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transform: pressingFAB === "pencil" ? "scale(0.90)" : "scale(1)",
            opacity: pressingFAB === "pencil" ? 0.7 : 1,
            transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

        <button
          onPointerDown={() => setPressingFAB("mic")}
          onPointerUp={() => setPressingFAB(null)}
          onPointerLeave={() => setPressingFAB(null)}
          style={{
            width: 52, height: 52, borderRadius: "50%", border: "none",
            background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(155,109,255,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transform: pressingFAB === "mic" ? "scale(0.93)" : "scale(1)",
            opacity: pressingFAB === "mic" ? 0.8 : 1,
            transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none"/>
            <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
          </svg>
        </button>
      </div>

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
