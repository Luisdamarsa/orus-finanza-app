import { useState, useRef, useEffect } from "react";
import { fmt } from "../utils/formatters";

/**
 * Función auxiliar para generar el path SVG de un arco
 * @param {number} cx - Centro X
 * @param {number} cy - Centro Y
 * @param {number} r - Radio
 * @param {number} startAngle - Ángulo inicial (grados)
 * @param {number} endAngle - Ángulo final (grados)
 * @returns {string} Path SVG del arco
 */
const arcPath = (cx, cy, r, startAngle, endAngle) => {
  const rad = ((startAngle - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad), y1 = cy + r * Math.sin(rad);
  const rad2 = ((endAngle - 90) * Math.PI) / 180;
  const x2 = cx + r * Math.cos(rad2), y2 = cy + r * Math.sin(rad2);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

/**
 * DonutChart.jsx
 *
 * ESTADO 1: Gráfico Donut interactivo con animación de llenado
 * Visualiza la distribución de gastos + saldo en un anillo circular
 * Con texto dinámico en el centro que cambia según selección
 *
 * Props:
 *   segments - Array de segmentos {id, label, color, pct}
 *   cx, cy - Centro X, Y del SVG
 *   outerR, innerR - Radios exterior e interior
 *   activeId - ID del segmento activo (seleccionado)
 *   onSelect - Callback cuando se selecciona un segmento
 *   isDark - Tema oscuro
 *   gastos, total, totalSpent, pillarSpends, hasSaldoAsignado, saldoValue
 *   selectedPeriod - Período actual para detectar cambios y animar
 *   SALDO_COLOR - Color del saldo (para estado inicial gris)
 */
export default function DonutChart({
  segments,
  cx,
  cy,
  outerR,
  innerR,
  activeId,
  onSelect,
  isDark,
  gastos,
  total,
  totalSpent,
  pillarSpends,
  hasSaldoAsignado,
  saldoValue,
  selectedPeriod,
  SALDO_COLOR,
}) {
  const [hovered, setHovered] = useState(null);

  // 🆕 Estado de animación del donut
  const [animatingSegments, setAnimatingSegments] = useState({});
  const previousPeriodRef = useRef(null);

  // 🆕 Orden de animación (mismo que en la barra del Estado 2)
  const ANIMATION_ORDER = ["fijos", "deuda", "ahorro", "ocio", "varios", "saldo"];
  const SEGMENT_DELAY = 70; // 70ms entre cada segmento (distribuido en 0.5s total)
  const ANIMATION_DURATION = 150; // 150ms por segmento
  // Total: 5 * 70 + 150 = 500ms (0.5s)

  // 🆕 Detectar cambio de período e iniciar animación
  useEffect(() => {
    const currentPeriodKey = selectedPeriod
      ? `${selectedPeriod.year}-${selectedPeriod.month}`
      : "all-time";

    const periodChanged = previousPeriodRef.current !== currentPeriodKey;

    if (periodChanged) {
      // Período cambió → resetear e iniciar animación
      setAnimatingSegments({});

      // Animar cada segmento en orden
      ANIMATION_ORDER.forEach((segmentId, index) => {
        setTimeout(() => {
          setAnimatingSegments(prev => ({
            ...prev,
            [segmentId]: true
          }));
        }, index * SEGMENT_DELAY);
      });

      previousPeriodRef.current = currentPeriodKey;
    }
  }, [selectedPeriod]);

  // 🆕 Obtener índice del segmento para calcular delay de animación
  const getSegmentIndex = (segmentId) => {
    return ANIMATION_ORDER.indexOf(segmentId);
  };

  // Calcular arcos basado en porcentajes
  let cursor = 0;
  const arcs = segments.map((seg) => {
    const start = cursor;
    const sweep = seg.pct * 3.6;
    cursor += sweep;
    return { ...seg, start, end: cursor - 0.3 };
  });

  // 🆕 Lógica de texto dinámico del donut
  let displayLabel = "Gastado";
  let displayValue = totalSpent;
  let displayReference = null;

  if (activeId === "saldo") {
    // 🆕 Saldo seleccionado: "Sobran X de Y"
    displayLabel = "Sobran";
    displayValue = saldoValue || 0;
    displayReference = total;
  } else if (activeId && activeId !== "saldo" && pillarSpends) {
    // Hay una sección seleccionada (pilar)
    const selectedSpend = pillarSpends[activeId] || 0;
    displayValue = selectedSpend;

    if (hasSaldoAsignado) {
      // Con presupuesto: Y = gasto total
      displayReference = totalSpent;
    } else {
      // Sin presupuesto: Y = gasto total
      displayReference = totalSpent;
    }
  } else {
    // Sin selección
    if (hasSaldoAsignado) {
      // Con presupuesto: Y = total disponible (saldo + gasto)
      displayReference = total;
    } else {
      // Sin presupuesto: no mostrar "de X"
      displayReference = null;
    }
  }

  return (
    <svg
      key={`donut-${selectedPeriod?.year}-${selectedPeriod?.month}`}
      width={cx * 2}
      height={cy * 2}
      style={{ overflow: "visible" }}>
      {/* Segmentos del donut */}
      {arcs.map((arc) => {
        const isActive = activeId === arc.id;
        const isHovered = hovered === arc.id;
        const scale = isActive ? 1.05 : isHovered ? 1.02 : 1;
        const op = activeId && !isActive ? 0.45 : 1;

        return (
          <g
            key={arc.id}
            style={{ cursor: "pointer", transition: "opacity 0.25s" }}
            onClick={() => onSelect(arc.id)}
            onMouseEnter={() => setHovered(arc.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Halo de selección - REMOVIDO */}
            {/* {isActive && (
              <path
                d={arcPath(cx, cy, outerR + 2, arc.start, arc.end)}
                fill="none"
                stroke={arc.color}
                strokeWidth={20}
                strokeOpacity={0.22}
                strokeLinecap="round"
                style={{ transition: "all 0.3s" }}
              />
            )} */}

            {/* Arco principal - con animación de trazo + cambio de color (negro → color) */}
            <style>{`
              @keyframes drawArc_${arc.id} {
                from {
                  stroke-dashoffset: 600px;
                  stroke: #000000;
                }
                to {
                  stroke-dashoffset: 0px;
                  stroke: ${arc.color};
                }
              }
            `}</style>
            <path
              d={arcPath(cx, cy, outerR, arc.start, arc.end)}
              fill="none"
              strokeWidth={isActive ? 31 : isHovered ? 28 : 24}
              strokeLinecap="round"
              strokeDasharray="600"
              opacity={op}
              style={{
                // 🆕 Animación combinada: se dibuja el arco EN NEGRO y luego cambia a color (0.15s cada una, 0.5s total)
                animation: `drawArc_${arc.id} 0.15s ease-out ${getSegmentIndex(arc.id) * SEGMENT_DELAY}ms forwards`,
                transformOrigin: `${cx}px ${cy}px`,
                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                transform: `scale(${scale})`,
              }}
            />
          </g>
        );
      })}

      {/* Centro negro del donut */}
      <circle cx={cx} cy={cy} r={innerR} fill="#000000" />

      {/* Texto dinámico en el centro */}
      {displayValue !== undefined && (
        <g>
          {/* Etiqueta (arriba si hay referencia, al medio si no) */}
          <text
            x={cx}
            y={displayReference !== null && displayReference > 0 ? cy - 18 : cy - 5}
            textAnchor="middle"
            style={{
              fontSize: 13,
              fontWeight: 600,
              fill: isDark ? "#7B7A99" : "#9896B0",
            }}
          >
            {displayLabel}
          </text>

          {/* Valor principal */}
          <text
            x={cx}
            y={displayReference !== null && displayReference > 0 ? cy + 8 : cy + 15}
            textAnchor="middle"
            style={{
              fontSize: 22,
              fontWeight: 800,
              fill: isDark ? "#F0EEFF" : "#1A1830",
            }}
          >
            {fmt(displayValue)}
          </text>

          {/* Referencia (cuando hay) */}
          {displayReference !== null && displayReference > 0 && (
            <text
              x={cx}
              y={cy + 26}
              textAnchor="middle"
              style={{
                fontSize: 15,
                fontWeight: 400,
                fill: isDark ? "#7B7A99" : "#9896B0",
              }}
            >
              de {fmt(displayReference)}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
