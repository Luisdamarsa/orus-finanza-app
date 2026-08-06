import LoadingWrapper from "./LoadingWrapper";
import ErrorBoundary from "./ErrorBoundary";
import { DonutSkeleton, CardsGridSkeleton } from "./LoadingSkeleton";
import DonutTagsBar from "./DonutTagsBar";
import DonutChartComponent from "./DonutChart";
import PillarCardsGrid from "./PillarCardsGrid";
import PillarBarsPopup from "./PillarBarsPopup";
import SaldoCard from "./SaldoCard";
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
    chipPcts, directPcts, customBudgets, getBudgetForMonth, hasSaldo, saldo, saldoPctFinal, directSaldoPct,
    setSelectedPillarDetail, setShowPillarBars, showPillarBars,
    setSelectedPillarForMovements,
    donutRef, donutContainerRef, pillarsGridRef,
    transactions, setScreen,
    currentUserId, // 🆕 FASE 2 - Pasar userId para filtrar categorías
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
                directPcts={directPcts}
                pillarSpends={pillarSpends}
                activeId={activeId}
                setActiveId={setActiveId}
                selectedPeriod={selectedPeriod}
                customBudgets={customBudgets}
                getBudgetForMonth={getBudgetForMonth}
                hasSaldo={hasSaldo}
                saldo={saldo}
                saldoPctFinal={saldoPctFinal}
                directSaldoPct={directSaldoPct}
                SALDO_COLOR={SALDO_COLOR}
                setSelectedPillarDetail={setSelectedPillarDetail}
                setShowPillarBars={setShowPillarBars}
                showPillarBars={showPillarBars}
                isDark={isDark}
                t={t}
                currentUserId={currentUserId} // 🆕 FASE 2 - Pasar userId para presupuestos
              />
            </LoadingWrapper>
          ) : (
            // Tarjeta expandida (pilar seleccionado)
            activeId === "saldo" ? (
              <SaldoCard
                isDark={isDark}
                saldo={saldo}
                onClose={() => setActiveId(null)}
                isInline={true}
              />
            ) : (
              <PillarBarsPopup
                pillar={PILLARS.find(p => p.id === activeId)}
                onClose={() => setActiveId(null)}
                onViewMovements={() => {
                  setSelectedPillarForMovements(PILLARS.find(p => p.id === activeId));
                  setScreen("movimientos");
                }}
                isDark={isDark}
                transactions={transactions}
                selectedPeriod={selectedPeriod}
                isInline={true}
                currentUserId={currentUserId} // 🆕 FASE 2 - Pasar userId
                customBudgets={customBudgets} // 🆕 FASE 2 - Pasar presupuestos personalizados
                getBudgetForMonth={getBudgetForMonth} // 🆕 FASE 2 - Calcular presupuesto del mes
              />
            )
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
