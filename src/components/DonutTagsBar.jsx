import { useTheme } from "../hooks/useTheme";
import { getPillarColor, getPillarSoftBg } from "../utils/colorUtils";
import { RADIUS } from "../constants/tokens";
import { pillStyles, getClayShadow } from "../utils/clayStyles";

/**
 * DonutTagsBar.jsx
 *
 * ESTADO 1: Barra de tags pequeños debajo del donut
 * Renderiza los tags para cada segmento del donut (Fijos, Deuda, Ahorro, Ocio, Varios, Saldo)
 * Se usa en Dashboard Estado 1 para filtrar/seleccionar segmentos
 *
 * Props:
 *   segments - Array de segmentos {id, label, color, pct}
 *   activeId - ID del segmento activo (seleccionado)
 *   setActiveId - Callback para cambiar segmento activo
 *   pressingSegmentId - ID del segmento siendo presionado (para efecto visual)
 *   setPressingSegmentId - Callback para actualizar pressingSegmentId
 *   isMovementOpen - Si Estado 2 está abierto (para deshabilitar Saldo)
 *   isDark - Tema oscuro
 *   t - Objeto de colores del tema
 */
export default function DonutTagsBar({
  segments,
  activeId,
  setActiveId,
  pressingSegmentId,
  setPressingSegmentId,
  isMovementOpen,
  isDark, // Aún recibido como prop para compatibilidad
  t,
}) {
  // 🆕 Tema desde ThemeContext
  const { isDark: isDarkTheme } = useTheme();

  return (
    <div style={{ display: "flex", flexWrap: "nowrap", gap: 4, justifyContent: "center", margin: "8px 0", overflow: "hidden" }}>
      {segments.map(seg => {
        // Saldo no es clickeable en Estado 2
        const isSaldo = seg.id === "saldo";
        const isClickable = !isSaldo || !isMovementOpen;

        const isPressing = pressingSegmentId === seg.id; // Verificar si este tag está siendo presionado
        if (isPressing) console.log("🎯 RENDERING DONUT TAG PRESSED:", seg.id, "pressingSegmentId:", pressingSegmentId);

        // 🆕 Color dinámico del pilar
        const pillarColor = getPillarColor(seg.id, isDarkTheme);
        // 🆕 Fondo suave del pilar
        const pillarSoftBg = getPillarSoftBg(seg.id, isDarkTheme);

        return (
          <button
            key={seg.id}
            onMouseDown={() => {
              console.log("🔻 DONUT TAG MOUSE DOWN:", seg.id);
              isClickable && setPressingSegmentId(seg.id);
            }} // Al presionar (desktop)
            onMouseUp={() => {
              console.log("🔺 DONUT TAG MOUSE UP:", seg.id);
              setPressingSegmentId(null);
            }} // Al soltar (desktop)
            onMouseLeave={() => {
              console.log("🚫 DONUT TAG MOUSE LEAVE:", seg.id);
              setPressingSegmentId(null);
            }} // Si el mouse deja el elemento (desktop)
            onTouchStart={() => {
              console.log("👆 DONUT TAG TOUCH START:", seg.id);
              isClickable && setPressingSegmentId(seg.id);
            }} // Al presionar (móvil)
            onTouchEnd={() => {
              console.log("👆 DONUT TAG TOUCH END:", seg.id);
              setPressingSegmentId(null);
            }} // Al soltar (móvil)
            onTouchCancel={() => {
              console.log("👆 DONUT TAG TOUCH CANCEL:", seg.id);
              setPressingSegmentId(null);
            }} // Si se cancela el touch (móvil)
            onClick={() => isClickable && setActiveId(activeId === seg.id ? null : seg.id)}
            disabled={!isClickable}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 7px", borderRadius: "20px",
              border: `1px solid ${activeId === seg.id ? pillarColor : "transparent"}`,
              background: activeId === seg.id ? pillarSoftBg : isDarkTheme ? "#1E1E2E" : "#F0EFF8",
              color: activeId === seg.id ? pillarColor : t.sub, fontSize: 9.5, fontWeight: 700,
              cursor: isClickable ? "pointer" : "default",
              whiteSpace: "nowrap",
              opacity: isPressing ? 0.5 : (isClickable ? 1 : 0.6), // Más oscuro al presionar
              transform: isPressing ? "scale(0.88) translateY(0.5px)" : "scale(1) translateY(0)", // Empequeñecer más al presionar
              boxShadow: isPressing ? "inset 0 2px 4px rgba(0, 0, 0, 0.3)" : "none", // Efecto hundido
              transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)", // Transición suave
            }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: pillarColor, display: "inline-block" }} />
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
