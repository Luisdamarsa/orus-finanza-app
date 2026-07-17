import { usePress } from "../hooks/usePress";

/**
 * GastadoIngresosBar.jsx
 *
 * Fila GASTADO/INGRESOS del header (solo visible cuando "mostrar ingresos" está ON).
 * Extraída de HeaderService para tener su propio ErrorBoundary. Falla como unidad (?fail=incomes).
 */
export default function GastadoIngresosBar({ isDark, t, fmt, filterType, setFilterType, setFilteredPillar, isMovementOpen, movementOpenedFrom, setIsMovementOpen, setMovementOpenedFrom, totalSpent, incomingTotal }) {
  const pressGastado = usePress();
  const pressIngresos = usePress();
  return (
    <div style={{ display: "flex", gap: 6, height: 30 }}>
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
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: filterType === "gastado" ? "#EF444433" : (isDark ? "#1f1010" : "#FEF2F2"), border: `1px solid ${filterType === "gastado" ? "#EF444488" : (isDark ? "#5c1a1a44" : "#FCA5A533")}`, borderRadius: 8, padding: "6px 7px", cursor: "pointer", outline: "none", ...pressGastado.getPressStyle() }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: filterType === "gastado" ? "#EF4444" : t.sub }}>GASTADO</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#EF4444" }}>-{fmt(totalSpent)}</span>
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
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: filterType === "ingresos" ? "#22C55E33" : (isDark ? "#0a1a10" : "#F0FDF4"), border: `1px solid ${filterType === "ingresos" ? "#22C55E88" : (isDark ? "#16532d44" : "#86EFAC33")}`, borderRadius: 8, padding: "6px 7px", cursor: "pointer", outline: "none", ...pressIngresos.getPressStyle() }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: filterType === "ingresos" ? "#22C55E" : t.sub }}>INGRESOS</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#22C55E" }}>+{fmt(incomingTotal)}</span>
          </button>
        </div>
  );
}
