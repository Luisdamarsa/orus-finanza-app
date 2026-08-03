import LoadingWrapper from "./LoadingWrapper";
import ErrorBoundary from "./ErrorBoundary";
import { DonutSkeleton, CardsGridSkeleton } from "./LoadingSkeleton";
import DonutTagsBar from "./DonutTagsBar";
import DonutChartComponent from "./DonutChart";
import PillarCardsGrid from "./PillarCardsGrid";
import PillarBarsPopup from "./PillarBarsPopup";
import { PILLARS, SALDO_COLOR } from "../constants";
import { useDashboard } from "../contexts/DashboardContext";

/**
 * DashboardExpandedState.jsx
 *
 * Estado 1 (EXPANDED) del dashboard: Donut + tags del donut + tarjetas de pilares.
 * Consume el DashboardContext. Refactor del Dashboard — HU-3.
 * Extraído tal cual desde App.jsx (comportamiento idéntico).
 */
export default function DashboardExpandedState() {
  const {
    isDark, t, isLoading, isMovementOpen, filterType,
    segments, activeId, setActiveId, handleSelectPillar,
    totalSpent, saldoForDonut, pillarSpends, selectedPeriod,
    pressingSegmentId, setPressingSegmentId,
    chipPcts, customBudgets, getBudgetForMonth, hasSaldo, saldo, saldoPctFinal,
    setSelectedPillarDetail, setShowPillarBars, showPillarBars,
    donutRef, donutContainerRef, pillarsGridRef,
    transactions, setScreen,
  } = useDashboard();

  return (
    <div style={{ overflow: "visible" }}>
      {/* 🆕 Contenedor del donut + botones para detectar click outside */}
      <div ref={donutContainerRef}>
        {/* Donut */}
        <div ref={donutRef} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px 0 0" }}>
          <ErrorBoundary fallback={null} resetKey={selectedPeriod}>
<LoadingWrapper
            isLoading={isLoading("donut")}
            skeleton={<DonutSkeleton isDark={isDark} />}
            isDark={isDark}
          >
            <DonutChartComponent segments={segments} cx={114} cy={114} outerR={90} innerR={54} activeId={activeId} onSelect={handleSelectPillar} isDark={isDark} gastos={totalSpent} total={totalSpent + saldoForDonut} totalSpent={totalSpent} pillarSpends={pillarSpends} hasSaldoAsignado={saldoForDonut > 0} saldoValue={saldoForDonut} selectedPeriod={selectedPeriod} SALDO_COLOR={SALDO_COLOR} />
          </LoadingWrapper>
</ErrorBoundary>
        </div>

        {/* Botones/Tags del donut - Componente separado (entra desde abajo) */}
        <div className="orus-rise" style={{ animationDelay: "0.04s", margin: "8px 0 0" }}>
        <ErrorBoundary fallback={null} resetKey={selectedPeriod}>
<DonutTagsBar
          segments={segments}
          activeId={activeId}
          setActiveId={setActiveId}
          pressingSegmentId={pressingSegmentId}
          setPressingSegmentId={setPressingSegmentId}
          isMovementOpen={isMovementOpen}
          isDark={isDark}
          t={t}
        />
</ErrorBoundary>
        </div>
      </div>

      {/* 🆕 Condicional: Grid de tarjetas O Tarjeta expandida */}
      <div ref={pillarsGridRef} style={{ display: filterType === "ingresos" ? "none" : "block", marginTop: 8, overflow: "hidden", paddingX: 0 }}>
        <ErrorBoundary fallback={null} resetKey={selectedPeriod}>
          {!activeId ? (
            // Grid normal (sin pilar seleccionado)
            <LoadingWrapper
              isLoading={isLoading("cardsGrid")}
              skeleton={<CardsGridSkeleton isDark={isDark} />}
              isDark={isDark}
            >
              <PillarCardsGrid
                PILLARS={PILLARS}
                chipPcts={chipPcts}
                pillarSpends={pillarSpends}
                activeId={activeId}
                setActiveId={setActiveId}
                selectedPeriod={selectedPeriod}
                customBudgets={customBudgets}
                getBudgetForMonth={getBudgetForMonth}
                hasSaldo={hasSaldo}
                saldo={saldo}
                saldoPctFinal={saldoPctFinal}
                SALDO_COLOR={SALDO_COLOR}
                setSelectedPillarDetail={setSelectedPillarDetail}
                setShowPillarBars={setShowPillarBars}
                showPillarBars={showPillarBars}
                isDark={isDark}
                t={t}
              />
            </LoadingWrapper>
          ) : (
            // Tarjeta expandida (pilar seleccionado) - reutilizando PillarBarsPopup inline
            <PillarBarsPopup
              pillar={PILLARS.find(p => p.id === activeId)}
              onClose={() => setActiveId(null)}
              onViewMovements={() => {
                setScreen("movimientos");
                setSelectedPillarDetail(PILLARS.find(p => p.id === activeId));
              }}
              isDark={isDark}
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              isInline={true}
            />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
