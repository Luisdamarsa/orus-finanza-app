import LoadingWrapper from "./LoadingWrapper";
import { ColorBarSkeleton, TagsBarSkeleton } from "./LoadingSkeleton";
import ColorBar from "./ColorBar";
import PillarTagsBar from "./PillarTagsBar";
import { PILLARS, SALDO_COLOR } from "../constants";
import { useDashboard } from "../contexts/DashboardContext";

/**
 * DashboardCollapsedState.jsx
 *
 * Estado 2 (COLLAPSED) del dashboard: barra de colores + botones/tags de pilares.
 * Consume el DashboardContext. Refactor del Dashboard — HU-4.
 * Extraído tal cual desde App.jsx (comportamiento idéntico).
 */
export default function DashboardCollapsedState() {
  const {
    isDark, t, isLoading, segments, filteredPillar, setFilteredPillar,
    setFilterType, selectedPeriod, chipPcts, saldoPctFinal, hasSaldo, filterType,
    colorBarRef, pillarButtonsRef,
  } = useDashboard();

  return (
    <div style={{ overflow: "visible", marginBottom: 12 }}>
      {/* Barra de colores */}
      <div ref={colorBarRef} style={{ marginBottom: 9 }}>
        <LoadingWrapper
          isLoading={isLoading("colorBar")}
          skeleton={<ColorBarSkeleton isDark={isDark} />}
          isDark={isDark}
        >
          <ColorBar
            segments={segments}
            filteredPillar={filteredPillar}
            setFilteredPillar={setFilteredPillar}
            setFilterType={setFilterType}
            isActive={true}
            selectedPeriod={selectedPeriod}
          />
        </LoadingWrapper>
      </div>

      {/* Botones de pilares */}
      <div ref={pillarButtonsRef}>
        <LoadingWrapper
          isLoading={isLoading("tagsBar")}
          skeleton={<TagsBarSkeleton isDark={isDark} />}
          isDark={isDark}
        >
          <PillarTagsBar
            PILLARS={PILLARS}
            chipPcts={chipPcts}
            saldoPctFinal={saldoPctFinal}
            hasSaldo={hasSaldo}
            SALDO_COLOR={SALDO_COLOR}
            filteredPillar={filteredPillar}
            setFilteredPillar={setFilteredPillar}
            filterType={filterType}
            setFilterType={setFilterType}
            isDark={isDark}
            t={t}
          />
        </LoadingWrapper>
      </div>
    </div>
  );
}
