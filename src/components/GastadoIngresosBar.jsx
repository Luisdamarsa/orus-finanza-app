import { usePress } from "../hooks/usePress";
import { DARK, LIGHT, SHADOWS, RADIUS } from "../constants/tokens";

/**
 * GastadoIngresosBar.jsx
 *
 * Fila GASTADO/INGRESOS del header (solo visible cuando "mostrar ingresos" está ON).
 * Extraída de HeaderService para tener su propio ErrorBoundary. Falla como unidad (?fail=incomes).
 */
export default function GastadoIngresosBar({ isDark, t, fmt, filterType, setFilterType, setFilteredPillar, isMovementOpen, movementOpenedFrom, setIsMovementOpen, setMovementOpenedFrom, totalSpent, incomingTotal }) {
  const pressGastado = usePress();
  const pressIngresos = usePress();
  const tokens = isDark ? DARK : LIGHT;
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button
            onClick={() => {
              // Lógica: toggle solo si se abrió desde GASTADO, si no solo cambiar filtro
              if (isMovementOpen && movementOpenedFrom === "gastado") {
                // Cerrar Estado 2 (toggle)
                setIsMovementOpen(false);
                setFilterType(null);
                setMovementOpenedFrom(null);
              } else if (isMovementOpen && movementOpenedFrom === "bar") {
                // Estado 2 abierto desde la barra, solo cambiar filtro, NO cerrar
                setFilterType(filterType === "gastado" ? null : "gastado");
                setFilteredPillar(null); // Limpiar filtros de pilares
              } else {
                // Estado 2 cerrado, abrir desde GASTADO
                setFilterType("gastado");
                setFilteredPillar(null); // Limpiar filtros de pilares
                setIsMovementOpen(true);
                setMovementOpenedFrom("gastado");
              }
            }}
            {...pressGastado.handlers}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: filterType === "gastado" ? "rgba(255,138,138,0.2)" : tokens.surfaceFlat,
              border: `1.5px solid ${filterType === "gastado" ? "#FF8A8A" : tokens.border}`,
              borderRadius: "12px",
              padding: "8px 12px",
              cursor: "pointer",
              outline: "none",
              boxShadow: filterType === "gastado" ? SHADOWS.shadowSm : "none",
              ...pressGastado.getPressStyle()
            }}>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: filterType === "gastado" ? "#FF8A8A" : tokens.sub }}>GASTADO</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FF8A8A" }}>-{fmt(totalSpent)}</span>
          </button>
          <button
            onClick={() => {
              // Lógica: toggle solo si se abrió desde INGRESOS, si no solo cambiar filtro
              if (isMovementOpen && movementOpenedFrom === "ingresos") {
                // Cerrar Estado 2 (toggle)
                setIsMovementOpen(false);
                setFilterType(null);
                setMovementOpenedFrom(null);
              } else if (isMovementOpen && movementOpenedFrom === "bar") {
                // Estado 2 abierto desde la barra, solo cambiar filtro, NO cerrar
                setFilterType(filterType === "ingresos" ? null : "ingresos");
                setFilteredPillar(null); // Limpiar filtros de pilares
              } else {
                // Estado 2 cerrado, abrir desde INGRESOS
                setFilterType("ingresos");
                setFilteredPillar(null); // Limpiar filtros de pilares
                setIsMovementOpen(true);
                setMovementOpenedFrom("ingresos");
              }
            }}
            {...pressIngresos.handlers}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: filterType === "ingresos" ? "rgba(134,239,172,0.2)" : tokens.surfaceFlat,
              border: `1px solid ${filterType === "ingresos" ? "#86EFAC" : tokens.border}`,
              borderRadius: "12px",
              padding: "4px 6px",
              cursor: "pointer",
              outline: "none",
              boxShadow: filterType === "ingresos" ? SHADOWS.shadowSm : "none",
              ...pressIngresos.getPressStyle()
            }}>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: filterType === "ingresos" ? "#86EFAC" : tokens.sub }}>INGRESOS</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#86EFAC" }}>+{fmt(incomingTotal)}</span>
          </button>
        </div>
  );
}
