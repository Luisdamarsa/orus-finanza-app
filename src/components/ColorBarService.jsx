import { forwardRef } from "react";
import ColorBar from "./ColorBar";
import LoadingWrapper from "./LoadingWrapper";
import { ColorBarSkeleton } from "./LoadingSkeleton";

/**
 * ColorBarService.jsx
 *
 * ESTADO 2: Servicio de la barra de colores
 * Barra segmentada que muestra la distribución de pilares
 *
 * Props:
 *   - segments: Array de segmentos {id, color, pct}
 *   - filteredPillar: ID del pilar filtrado
 *   - setFilteredPillar: Callback para cambiar filtro
 *   - setFilterType: Callback para cambiar filtro de tipo
 *   - isDark: Tema oscuro
 *   - isLoading: Función para verificar si está cargando
 */
const ColorBarService = forwardRef(({
  segments,
  filteredPillar,
  setFilteredPillar,
  setFilterType,
  isDark,
  isLoading,
}, ref) => {
  return (
    <div ref={ref} style={{ marginBottom: 9 }}>
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
        />
      </LoadingWrapper>
    </div>
  );
});

ColorBarService.displayName = "ColorBarService";

export default ColorBarService;
