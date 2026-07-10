import { forwardRef } from "react";

/**
 * HeaderService
 * Componente reutilizable para el header dinámico del Dashboard ORUS
 *
 * Props:
 * - isDark: boolean (tema)
 * - showIncomes: boolean (mostrar botones GASTADO/INGRESOS)
 * - setScreen: function (navegar a settings)
 * - isMovementOpen: boolean (si Estado 2 está abierto)
 * - movementOpenedFrom: string ("gastado" | "ingresos" | "bar" | null)
 * - filterType: string ("gastado" | "ingresos" | null)
 * - setFilterType: function
 * - setFilteredPillar: function
 * - setIsMovementOpen: function
 * - setMovementOpenedFrom: function
 * - totalSpent: number (gasto total)
 * - incomingTotal: number (ingreso total)
 * - t: object (colores por tema)
 * - fmt: function (formatear números)
 * - userStorage: object (datos del usuario)
 */

const HeaderService = forwardRef(({
  isDark,
  showIncomes,
  setScreen,
  isMovementOpen,
  movementOpenedFrom,
  filterType,
  setFilterType,
  setFilteredPillar,
  setIsMovementOpen,
  setMovementOpenedFrom,
  totalSpent,
  incomingTotal,
  t,
  fmt,
  userStorage,
}, ref) => {
  return (
    <div ref={ref} style={{ position: "absolute", top: 52, left: 0, right: 0, zIndex: 30, background: t.bg, padding: "8px 22px 15px", boxSizing: "border-box", borderBottom: `1px solid ${t.border}`, display: "flex", flexDirection: "column", justifyContent: showIncomes ? "space-between" : "flex-end" }}>
      {/* Row 1: Luis Daniel + Config (SIEMPRE visible) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 40, marginBottom: showIncomes ? 4 : 0, marginTop: showIncomes ? 0 : "auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <div style={{ fontSize: showIncomes ? 15 : 18, fontWeight: 800, color: t.text }}>{userStorage.getDisplayName()}</div>
          <div style={{ fontSize: showIncomes ? 10 : 12, color: t.sub }}>Buenos días 👋</div>
        </div>
        {/* Botón Settings (Engranaje) */}
        <button onClick={() => setScreen("settings")} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: showIncomes ? 28 : 34, height: showIncomes ? 28 : 34, borderRadius: "50%", border: "none",
          cursor: "pointer",
          background: isDark ? "#1E1E2E" : "#F0EFF8",
          outline: "1.5px solid transparent",
          transition: "all 0.15s",
        }}>
          <svg width={showIncomes ? "16" : "19"} height={showIncomes ? "16" : "19"} viewBox="0 0 24 24" fill="none" stroke={isDark ? "#C4C2E0" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
          </svg>
        </button>
      </div>

      {/* Row 2: GASTADO/INGRESOS (solo si showIncomes = true) */}
      {showIncomes && (
        <div style={{ display: "flex", gap: 6, height: 30 }}>
          <button onClick={() => {
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
          }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: filterType === "gastado" ? "#EF444433" : (isDark ? "#1f1010" : "#FEF2F2"), border: `1px solid ${filterType === "gastado" ? "#EF444488" : (isDark ? "#5c1a1a44" : "#FCA5A533")}`, borderRadius: 8, padding: "6px 7px", cursor: "pointer", transition: "all 0.15s", outline: "none" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: filterType === "gastado" ? "#EF4444" : t.sub }}>GASTADO</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#EF4444" }}>-{fmt(totalSpent)}</span>
          </button>
          <button onClick={() => {
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
          }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: filterType === "ingresos" ? "#22C55E33" : (isDark ? "#0a1a10" : "#F0FDF4"), border: `1px solid ${filterType === "ingresos" ? "#22C55E88" : (isDark ? "#16532d44" : "#86EFAC33")}`, borderRadius: 8, padding: "6px 7px", cursor: "pointer", transition: "all 0.15s", outline: "none" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: filterType === "ingresos" ? "#22C55E" : t.sub }}>INGRESOS</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#22C55E" }}>+{fmt(incomingTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
});

HeaderService.displayName = "HeaderService";

export default HeaderService;
