import { useTheme } from "../hooks/useTheme";
import { DARK, LIGHT, SHADOWS } from "../constants/tokens";
import { getPillarColor } from "../utils/colorUtils";

/**
 * MovementsBar.jsx
 *
 * ESTADO 1: Barra colapsable de Movimientos
 * Muestra contador de movimientos y filtros activos
 * Se expande/contrae para mostrar la lista de movimientos
 *
 * Props:
 *   movementsCount - Número de movimientos
 *   isExpanded - Si está expandida
 *   onToggleExpand - Callback al hacer click
 *   filteredPillar - ID del pilar filtrado (null si no hay filtro)
 *   filteredType - "gastado" | "ingresos" | null
 *   PILLARS - Array de pilares para obtener nombres
 *   isDark - Tema oscuro (legacy)
 */
export default function MovementsBar({
  movementsCount = 0,
  isExpanded = false,
  onToggleExpand = () => {},
  filteredPillar = null,
  filteredType = null,
  PILLARS = [],
  isDark = true,
}) {
  // 🆕 Tema desde ThemeContext
  const { isDark: isDarkTheme } = useTheme();
  const tokens = isDarkTheme ? DARK : LIGHT;

  // Obtener nombre del pilar si está filtrado
  const pillarName = filteredPillar
    ? PILLARS.find(p => p.id === filteredPillar)?.label
    : null;

  // Color del pilar filtrado
  const pillarColor = filteredPillar ? getPillarColor(filteredPillar, isDarkTheme) : null;

  return (
    <div style={{
      marginTop: "8px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "9px 15px",
      borderRadius: "16px",
      background: "linear-gradient(155deg, #262231 0%, #17151f 100%)",
      boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
      border: "none",
      boxSizing: "border-box",
    }}>
      {/* Label + Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <button
          onClick={onToggleExpand}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 0,
            outline: "none",
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 800, color: "#F5F3FF" }}>Movimientos</span>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#9B6DFF",
            background: "rgba(155,109,255,0.16)",
            padding: "1px 6px",
            borderRadius: "10px",
            whiteSpace: "nowrap",
          }}>
            {movementsCount}
          </span>
        </button>
      </div>

      {/* Chevron */}
      <button
        onClick={onToggleExpand}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
          padding: 0,
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8B87A3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="M5 9l7 7 7-7" />
        </svg>
      </button>
    </div>
  );
}
