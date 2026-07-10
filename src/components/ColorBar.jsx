import { useState, useEffect, useRef } from "react";

/**
 * ColorBar.jsx
 *
 * ESTADO 2: Barra de colores de pilares + saldo CON ANIMACIÓN
 * Visualiza la distribución proporcional de gastos/saldo como una barra horizontal segmentada
 *
 * ANIMACIÓN:
 * - Las secciones cambian de color progresivamente (1s total)
 * - Se ejecuta cuando se entra a Estado 2
 * - Se ejecuta cuando cambias de periodo (mes/año realmente cambia)
 * - NO se ejecuta al abrir el pop-up de selección
 * - NO se ejecuta con nueva transacción o selección de tag
 * - Mientras estés en Estado 2: barra estática
 * - Al salir: se anima de nuevo cuando vuelves
 *
 * Props:
 *   segments - Array de segmentos {id, color, pct}
 *   filteredPillar - ID del pilar actual filtrado (null si no hay filtro)
 *   setFilteredPillar - Callback para cambiar filtro
 *   setFilterType - Callback para limpiar filtro de tipo
 *   isActive - Boolean: true cuando Estado 2 está abierto
 *   selectedPeriod - Objeto con periodo {month, year} para detectar cambios
 */
export default function ColorBar({
  segments,
  filteredPillar,
  setFilteredPillar,
  setFilterType,
  isActive,
  selectedPeriod,
}) {
  // 🆕 Estado para track de animación
  const [animatingSegments, setAnimatingSegments] = useState(new Set());

  // 🆕 Estado para trackear qué segmento está siendo presionado
  const [pressingSegmentId, setPressingSegmentId] = useState(null);

  // 🆕 Ref para guardar el período anterior (detectar cambios reales)
  const previousPeriodRef = useRef(null);

  // 🆕 Detectar si el período cambió realmente (no solo por abrir pop-up)
  const periodChanged = () => {
    if (!previousPeriodRef.current) return false;

    const prev = previousPeriodRef.current;
    const current = selectedPeriod;

    // Cambió si month o year son diferentes
    return prev.month !== current?.month || prev.year !== current?.year;
  };

  // 🆕 Iniciar animación cuando se abre Estado 2 O cuando REALMENTE cambia el periodo
  useEffect(() => {
    if (isActive) {
      const shouldAnimate = previousPeriodRef.current === null || periodChanged();

      if (shouldAnimate) {
        // Resetear animación primero (volver a gris)
        setAnimatingSegments(new Set());

        // Animar cada segmento con delay progresivo
        segments.forEach((seg, index) => {
          setTimeout(() => {
            setAnimatingSegments(prev => new Set(prev).add(seg.id));
          }, index * 160); // 160ms de delay entre cada segmento (1s total)
        });
      }

      // Guardar período actual como referencia
      previousPeriodRef.current = {
        month: selectedPeriod?.month,
        year: selectedPeriod?.year,
      };
    } else {
      // Al salir de Estado 2, resetear animación (volver a gris)
      setAnimatingSegments(new Set());
      previousPeriodRef.current = null; // Reset para la próxima vez
    }
  }, [isActive, selectedPeriod?.month, selectedPeriod?.year, segments]);

  // 🆕 Color gris de saldo (cuando no está animado)
  const SALDO_GRAY = "#4B5563";

  return (
    <div style={{
      display: "flex",
      height: 7,
      borderRadius: 5,
      overflow: "hidden",
      gap: 2,
    }}>
      {segments.map((seg, index) => {
        const isAnimated = animatingSegments.has(seg.id);
        const displayColor = isAnimated ? seg.color : SALDO_GRAY;

        // 🆕 ¿Este segmento está siendo presionado?
        const isPressingThisSegment = pressingSegmentId === seg.id;

        return (
          <div
            key={seg.id}
            onClick={() => {
              // Filtros mutuamente excluyentes: limpiar filterType
              if (filteredPillar !== seg.id) {
                setFilterType(null);
              }
              setFilteredPillar(filteredPillar === seg.id ? null : seg.id);
            }}
            onPointerDown={() => setPressingSegmentId(seg.id)}
            onPointerUp={() => setPressingSegmentId(null)}
            onPointerLeave={() => setPressingSegmentId(null)}
            style={{
              flex: seg.pct,
              background: displayColor, // Sin overlay al presionar
              borderRadius: 3,
              cursor: "pointer",
              opacity: isPressingThisSegment ? 0.6 : (filteredPillar && filteredPillar !== seg.id ? 0.28 : 1),
              // 🆕 Transición rápida para press, lenta para animación
              transition: isPressingThisSegment
                ? "all 0.08s cubic-bezier(0.4, 0, 0.2, 1)"
                : (isActive && !isAnimated ? "none" : "opacity 0.25s, background 0.3s ease-in-out"),
              transform: isPressingThisSegment ? "scaleY(1.5)" : "scaleY(1)",
              boxShadow: isPressingThisSegment ? "inset 0 2px 4px rgba(0, 0, 0, 0.5)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}
