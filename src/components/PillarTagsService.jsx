import { forwardRef } from "react";
import PillarTagsBar from "./PillarTagsBar";
import LoadingWrapper from "./LoadingWrapper";
import { TagsBarSkeleton } from "./LoadingSkeleton";

/**
 * PillarTagsService.jsx
 *
 * ESTADO 2: Servicio de los tags/botones de pilares
 * Botones para filtrar por pilar
 *
 * Props:
 *   - PILLARS: Array de pilares
 *   - chipPcts: Porcentajes de pilares
 *   - saldoPctFinal: Porcentaje del saldo
 *   - hasSaldo: Si existe saldo
 *   - SALDO_COLOR: Color del saldo
 *   - filteredPillar: ID del pilar filtrado
 *   - setFilteredPillar: Callback para cambiar filtro
 *   - filterType: Tipo de filtro actual
 *   - setFilterType: Callback para cambiar filtro de tipo
 *   - isDark: Tema oscuro
 *   - t: Objeto de colores/temas
 *   - isLoading: Función para verificar si está cargando
 */
const PillarTagsService = forwardRef(({
  PILLARS,
  chipPcts,
  saldoPctFinal,
  hasSaldo,
  SALDO_COLOR,
  filteredPillar,
  setFilteredPillar,
  filterType,
  setFilterType,
  isDark,
  t,
  isLoading,
}, ref) => {
  return (
    <div ref={ref}>
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
  );
});

PillarTagsService.displayName = "PillarTagsService";

export default PillarTagsService;
