import { forwardRef } from "react";
import { usePress } from "../hooks/usePress";
import ErrorBoundary from "./ErrorBoundary";
import GastadoIngresosBar from "./GastadoIngresosBar";
import { FailProbe } from "../utils/failSwitch";

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
  // 🆕 Hooks para efecto de press en cada botón
  const pressSettings = usePress();

  return (
    <div ref={ref} style={{ position: "absolute", top: 52, left: 0, right: 0, zIndex: 30, background: t.bg, padding: "8px 22px 15px", boxSizing: "border-box", borderBottom: `1px solid ${t.border}`, display: "flex", flexDirection: "column", justifyContent: showIncomes ? "space-between" : "flex-end" }}>
      {/* Row 1: Luis Daniel + Config (SIEMPRE visible) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 40, marginBottom: showIncomes ? 4 : 0, marginTop: showIncomes ? 0 : "auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <div style={{ fontSize: showIncomes ? 15 : 18, fontWeight: 800, color: t.text }}>{userStorage.getDisplayName()}</div>
          <div style={{ fontSize: showIncomes ? 10 : 12, color: t.sub }}>Buenos días 👋</div>
        </div>
        {/* Botón Settings (Engranaje) */}
        <ErrorBoundary fallback={null}>
        <FailProbe section="settings" />
        <button
          onClick={() => setScreen("settings")}
          {...pressSettings.handlers}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: showIncomes ? 28 : 34, height: showIncomes ? 28 : 34, borderRadius: "50%", border: "none",
            cursor: "pointer",
            background: isDark ? "#1E1E2E" : "#F0EFF8",
            outline: "1.5px solid transparent",
            ...pressSettings.getPressStyle(),
          }}>
          <svg width={showIncomes ? "16" : "19"} height={showIncomes ? "16" : "19"} viewBox="0 0 24 24" fill="none" stroke={isDark ? "#C4C2E0" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
          </svg>
        </button>
        </ErrorBoundary>
      </div>

      {/* Row 2: GASTADO/INGRESOS (solo si showIncomes = true) */}
      {showIncomes && (
        <ErrorBoundary fallback={null}>
          <GastadoIngresosBar
            isDark={isDark}
            t={t}
            fmt={fmt}
            filterType={filterType}
            setFilterType={setFilterType}
            setFilteredPillar={setFilteredPillar}
            isMovementOpen={isMovementOpen}
            movementOpenedFrom={movementOpenedFrom}
            setIsMovementOpen={setIsMovementOpen}
            setMovementOpenedFrom={setMovementOpenedFrom}
            totalSpent={totalSpent}
            incomingTotal={incomingTotal}
          />
        </ErrorBoundary>
      )}
    </div>
  );
});

HeaderService.displayName = "HeaderService";

export default HeaderService;
