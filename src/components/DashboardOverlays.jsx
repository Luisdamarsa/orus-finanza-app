import { useState, useRef } from "react";
import PeriodSelector from "./PeriodSelectorService";
import ErrorBoundary from "./ErrorBoundary";
import FloatingActionButtons from "./FloatingActionButtons";
import PillarBarsPopup from "./PillarBarsPopup";
import SaldoCard from "./SaldoCard";
import UpdateBalanceModal from "./UpdateBalanceModal";
import VoiceCapture from "./VoiceCapture";
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
    showUpdateBalance, saldo, setShowUpdateBalance, isMovementOpen, setIsMovementOpen,
    setFilterType, setMovementOpenedFrom, txnActions,
    setSearchOpen, setSearchQuery, searchOpen, searchQuery,
    setVoicePrefill,
  } = useDashboard();

  const [showVoice, setShowVoice] = useState(false);
  // Recuerda si al abrir la lupa ya estábamos en Estado 2 (movimientos abiertos)
  const wasMovementOpenRef = useRef(false);

  // Abrir búsqueda: recuerda el estado actual. Si venía de Estado 1, entra a Estado 2
  // (con filtros limpios). Si ya estaba en Estado 2, respeta su vista/filtros.
  const openSearch = () => {
    wasMovementOpenRef.current = isMovementOpen;
    setSearchQuery("");
    setSearchOpen(true);
    if (!isMovementOpen) {
      setFilteredPillar(null);
      setFilterType(null);
      setMovementOpenedFrom("search");
      setIsMovementOpen(true);
    }
  };

  // Cerrar búsqueda: vuelve al estado en que se abrió (Estado 1 o Estado 2)
  const closeSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
    if (!wasMovementOpenRef.current) setIsMovementOpen(false);
  };

  return (
    <>
      {/* FAB - Lápiz (left) + Micrófono (right) — boundary propio */}
      <ErrorBoundary fallback={null}>
        <FloatingActionButtons isDark={isDark} pressingFAB={pressingFAB} setPressingFAB={setPressingFAB} setScreen={setScreen} onMic={() => setShowVoice(true)} onSearch={openSearch} searchOpen={searchOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onCloseSearch={closeSearch} />
      </ErrorBoundary>

      {/* Dictado por voz (overlay): al terminar, pre-llena y navega a "nueva transacción" para confirmar */}
      {showVoice && (
        <ErrorBoundary fallback={null}>
          <VoiceCapture
            isDark={isDark}
            onClose={() => setShowVoice(false)}
            onResult={(prefill) => {
              setVoicePrefill(prefill);
              setShowVoice(false);
              setScreen("new-transaction");
            }}
          />
        </ErrorBoundary>
      )}

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
        <>
          {/* Si es Saldo, usar SaldoCard en lugar de PillarBarsPopup */}
          {selectedPillarDetail.id === "saldo" ? (
            <SaldoCard
              isDark={isDark}
              saldo={saldo}
              onClose={() => { setShowPillarBars(false); setActiveId(null); }}
            />
          ) : (
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
        </>
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
