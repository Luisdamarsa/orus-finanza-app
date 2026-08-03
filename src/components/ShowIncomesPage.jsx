import { useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import PageHeader from "./PageHeader";
import DonutChartComponent from "./DonutChart";
import { PAGE_HEADERS } from "../data/pageHeaders";
import { fmt } from "../utils/formatters";
import { DARK, LIGHT } from "../constants/tokens";

/**
 * ShowIncomesPage.jsx
 *
 * Página para gestionar la visualización de ingresos
 * Muestra descripción y toggle para activar/desactivar ingresos
 *
 * Props:
 *   onBack - Callback para volver atrás
 *   showIncomesEnabled - Estado actual del toggle
 *   onToggleShowIncomes - Callback cuando cambia el toggle
 */
export default function ShowIncomesPage({
  onBack,
  showIncomesEnabled,
  onToggleShowIncomes,
}) {
  // 🆕 Tema desde ThemeContext
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;

  // 🆕 Tokens del design (Spatial UI + Claymorfismo)
  const t = {
    bg: tokens.bg,
    card: tokens.surfaceFlat,
    border: tokens.border,
    text: tokens.text,
    sub: tokens.sub,
  };

  // 🆕 Estado para el top del contenido dinámico
  const [contentTop, setContentTop] = useState(220);
  // 🆕 Hook para animación de press en botón de atrás
  const pressBack = usePress();

  // 🆕 Callback cuando PageHeader notifica el cambio de altura de descripción
  const handleDescriptionHeightChange = (height) => {
    const newContentTop = 164 + height + 6;
    setContentTop(newContentTop);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, position: "relative" }}>
      {/* Header fijo (top: 52, height: 52) */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          height: 52,
          background: t.bg,
          padding: "8px 22px",
          boxSizing: "border-box",
          borderBottom: `1px solid ${t.border}`,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            {...pressBack.handlers}
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              border: "none",
              background: isDark ? "#1E1E2E" : "#EEE9FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              ...pressBack.getPressStyle(),
            }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#C4C2E0" : "#6B7280"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>Atrás</span>
        </div>
      </div>

      {/* PageHeader Component */}
      <PageHeader
        icon={PAGE_HEADERS.showIncomes.icon}
        title={PAGE_HEADERS.showIncomes.title}
        description={PAGE_HEADERS.showIncomes.description}
        hint={PAGE_HEADERS.showIncomes.hint}
        isDark={isDark}
        onDescriptionHeightChange={handleDescriptionHeightChange}
        showTitleToggle={true}
        toggleValue={showIncomesEnabled}
        onToggleChange={onToggleShowIncomes}
      />

      {/* Contenido scrolleable */}
      <div
        style={{
          position: "absolute",
          top: contentTop,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          padding: "20px 22px 40px 22px",
          boxSizing: "border-box",
        }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* Section 1: Qué ves - Donut */}
        <div className="orus-rise" style={{ marginBottom: 28, display: "flex", flexDirection: "column", alignItems: "center", animationDelay: "0.04s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 16px 0", textAlign: "center", width: "100%" }}>📊 Dashboard</h3>

          {/* Donut Component Real - No clickeable */}
          <div style={{ marginBottom: 12, pointerEvents: "none" }}>
            <DonutChartComponent
              segments={[
                { id: "fijos", label: "Fijos", color: "#93C5FD", pct: 17 },
                { id: "deuda", label: "Deuda", color: "#FCA5A5", pct: 10 },
                { id: "ahorro", label: "Ahorro", color: "#86EFAC", pct: 8 },
                { id: "ocio", label: "Ocio", color: "#C4B5FD", pct: 9 },
                { id: "varios", label: "Varios", color: "#FDE68A", pct: 8 },
                { id: "saldo", label: "Tu saldo", color: "#E5E7EB", pct: 48 },
              ]}
              cx={114}
              cy={114}
              outerR={90}
              innerR={54}
              activeId={null}
              onSelect={() => {}}
              isDark={isDark}
              total={3250000}
              totalSpent={1690000}
              pillarSpends={{ fijos: 552500, deuda: 325000, ahorro: 260000, ocio: 292500, varios: 260000 }}
              hasSaldoAsignado={true}
              saldoValue={1560000}
              selectedPeriod={null}
            />
          </div>

          {/* Tags de pilares - Formato Acerca de ORUS */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#93C5FD22", color: "#93C5FD" }}>Fijos</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#FCA5A522", color: "#FCA5A5" }}>Deuda</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#86EFAC22", color: "#86EFAC" }}>Ahorro</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#C4B5FD22", color: "#C4B5FD" }}>Ocio</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#FDE68A22", color: "#FDE68A" }}>Varios</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#E5E7EB22", color: "#E5E7EB" }}>Tu saldo</span>
          </div>

        </div>

        {/* Section 2: Tu Saldo - Layout dos columnas */}
        <div className="orus-rise" style={{ marginBottom: 28, display: "flex", gap: 8, alignItems: "flex-start", animationDelay: "0.12s" }}>
          {/* Columna izquierda: Texto explicativo */}
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.6 }}>
              <strong style={{ color: t.text, display: "block", marginBottom: 6 }}>En el donut verás tu saldo en gris.</strong>
              La tarjeta de la derecha muestra exactamente cuánto dinero te sobra después de tus gastos.
            </div>
          </div>

          {/* Columna derecha: Tarjeta Saldo - No clickeable */}
          <div style={{ pointerEvents: "none", flexShrink: 0 }}>
            <div style={{
              background: isDark ? "#1E1E2E" : "#FFFFFF",
              border: `1.5px solid ${t.border}`,
              borderRadius: 11,
              padding: "8px 10px",
              outline: "none",
              width: 160,
            }}>
              {/* Línea 1: icono + nombre (izquierda) + % del total (derecha) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4, marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>💵</span>
                  <span style={{ fontSize: 13, lineHeight: 1, fontWeight: 700, color: t.text }}>Saldo</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? "#CBD5E1" : "#64748B", whiteSpace: "nowrap", flexShrink: 0 }}>
                  48% del total
                </span>
              </div>
              {/* Línea 2: valor */}
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.0, textAlign: "left", color: isDark ? "#F0EEFF" : "#1A1830" }}>
                {fmt(1560000)}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Ingresos vs Gastos */}
        <div className="orus-rise" style={{ marginBottom: 24, animationDelay: "0.20s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 12px 0" }}>💰 Ingresos vs Gastos</h3>

          {/* Botones GASTADO / INGRESOS - No clickeables */}
          <div style={{ display: "flex", gap: 6, height: 36, marginBottom: 12 }}>
            {/* GASTADO */}
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: isDark ? "#1f1010" : "#FEF2F2",
              border: `1px solid ${isDark ? "#5c1a1a44" : "#FCA5A533"}`,
              borderRadius: 8,
              padding: "8px 10px",
              pointerEvents: "none",
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: t.sub }}>GASTADO</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#EF4444" }}>-{fmt(1690000)}</span>
            </div>

            {/* INGRESOS */}
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: isDark ? "#0a1a10" : "#F0FDF4",
              border: `1px solid ${isDark ? "#16532d44" : "#86EFAC33"}`,
              borderRadius: 8,
              padding: "8px 10px",
              pointerEvents: "none",
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: t.sub }}>INGRESOS</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#22C55E" }}>+{fmt(3250000)}</span>
            </div>
          </div>

          {/* Explicación */}
          <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.6 }}>
            Ve inmediatamente cuánto ingresó y cuánto gastaste en este período. Los números se actualizan en tiempo real.
          </div>
        </div>

        {/* Section 4: Por qué es útil */}
        <div className="orus-rise" style={{ marginBottom: 40, animationDelay: "0.28s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 12px 0", textAlign: "center" }}>✨ Por qué activarlo</h3>

          <div style={{ background: t.card, borderRadius: 12, padding: 12, fontSize: 11, color: t.sub, lineHeight: 1.6, border: `0.5px solid ${t.border}`, textAlign: "left" }}>
            <div style={{ marginBottom: 10 }}><strong style={{ color: t.text }}>📊 Visión real:</strong> No solo ves lo que gastas, sino también lo que entra. Entiendes si ese mes fue positivo o negativo.</div>
            <div style={{ marginBottom: 10 }}><strong style={{ color: t.text }}>💰 Saldo disponible:</strong> Sabes exactamente cuánto dinero libre tienes después de todos tus gastos. Sin suposiciones.</div>
            <div><strong style={{ color: t.text }}>🎯 Decisiones mejores:</strong> Con ingresos + gastos visibles, tomas decisiones financieras más precisas. ¿Puedo gastar más? ¿Debo ahorrar más?</div>
          </div>
        </div>

      </div>
    </div>
  );
}
