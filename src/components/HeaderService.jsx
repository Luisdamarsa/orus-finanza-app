import { forwardRef } from "react";
import { usePress } from "../hooks/usePress";
import { DARK, LIGHT, SHADOWS, RADIUS } from "../constants/tokens";
import ErrorBoundary from "./ErrorBoundary";
import GastadoIngresosBar from "./GastadoIngresosBar";

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
  currentUser, // 🆕 FASE 2 - Usuario actual
}, ref) => {
  // 🆕 Hooks para efecto de press en cada botón
  const pressSettings = usePress();
  // 🆕 Seleccionar tokens según el tema
  const tokens = isDark ? DARK : LIGHT;

  return (
    <div ref={ref} style={{ position: "absolute", top: 52, left: 0, right: 0, zIndex: 30, background: t.bg, padding: "0 22px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: showIncomes ? "space-between" : "flex-start" }}>
      {/* Row 1: Nombre del usuario + Config (SIEMPRE visible) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 34, marginBottom: 0, marginTop: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <div style={{ fontSize: showIncomes ? 15 : 17, fontWeight: 800, color: t.text }}>
            {currentUser?.username || userStorage.getDisplayName()}
          </div>
          <div style={{ fontSize: showIncomes ? 10.5 : 11.5, fontWeight: 600, color: tokens.accent }}>Buenos días</div>
        </div>
        {/* Botón Settings (Engranaje) - FAB style: 48x48px circular */}
        <ErrorBoundary fallback={null}>
        <button
          onClick={() => setScreen("settings")}
          {...pressSettings.handlers}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: tokens.raised,
            boxShadow: SHADOWS.shadowSm,
            outline: "none",
            ...pressSettings.getPressStyle(),
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: tokens.sub }}>
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
