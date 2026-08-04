import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import DonutChartComponent from "./DonutChart";
import BackButton from "./BackButton";
import { fmt } from "../utils/formatters";
import { DARK, LIGHT } from "../constants/tokens";

/**
 * ShowIncomesPage.jsx
 *
 * Página para gestionar la visualización de ingresos
 * Muestra descripción y toggle para activar/desactivar ingresos
 * Especificación: Layout con header, donut, tags, saldo, ingresos vs gastos, razones
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
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;

  const t = {
    bg: tokens.bg,
    surface: isDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    text: tokens.text,
    sub: tokens.sub,
    accent: isDark ? "#9B6DFF" : "#7C4DFF",
    accentSoft: isDark ? "rgba(155,109,255,0.2)" : "rgba(124,77,255,0.15)",
    raised: isDark ? "rgba(255,255,255,0.04)" : "rgba(30,20,60,0.04)",
    shadowSm: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
    danger: "#EF4444",
    okGreen: "#22C55E",
    saldoColor: isDark ? "#D4D4D8" : "#B9B5CC",
  };

  const pillarSoftBg = {
    fijos: isDark ? "rgba(147, 197, 253, 0.16)" : "rgba(147, 197, 253, 0.14)",
    deuda: isDark ? "rgba(252, 165, 165, 0.16)" : "rgba(252, 165, 165, 0.14)",
    ahorro: isDark ? "rgba(134, 239, 172, 0.16)" : "rgba(134, 239, 172, 0.14)",
    ocio: isDark ? "rgba(196, 181, 253, 0.16)" : "rgba(196, 181, 253, 0.14)",
    varios: isDark ? "rgba(253, 230, 138, 0.16)" : "rgba(253, 230, 138, 0.14)",
  };

  const pillarColors = {
    fijos: "#93C5FD",
    deuda: "#FCA5A5",
    ahorro: "#86EFAC",
    ocio: "#C4B5FD",
    varios: "#FDE68A",
  };

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Header fijo - BackButton + Título + Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "20px 22px 0px 22px", flexShrink: 0, zIndex: 10, fontFamily: "Manrope, system-ui, sans-serif" }}>
        {/* BackButton solo */}
        <div style={{ flexShrink: 0 }}>
          <BackButton onClick={onBack} />
        </div>

        {/* Título + Toggle separados a la derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Mostrar Ingresos</span>
        </div>

        {/* Toggle */}
        <button
          onClick={() => onToggleShowIncomes(!showIncomesEnabled)}
          style={{
            width: 44,
            height: 26,
            borderRadius: 13,
            border: "none",
            background: showIncomesEnabled ? "#9B6DFF" : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)",
            cursor: "pointer",
            position: "relative",
            padding: 0,
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: showIncomesEnabled ? 20 : 2,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#FFFFFF",
              boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
              transition: "left 0.2s",
            }}
          />
        </button>
      </div>

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 60px", boxSizing: "border-box" }}>

      {/* Descripción */}
      <div style={{ fontSize: "12px", fontWeight: 600, color: t.sub, lineHeight: 1.5, marginBottom: 24, marginTop: 0 }}>
        Visualiza los ingresos que entran en el período seleccionado. Si el ingreso supera el gasto, también mostrará el saldo restante.
      </div>

      {/* Dashboard Label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: "13.5px", fontWeight: 800, color: t.text, marginBottom: 10 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="20" x2="5" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="19" y1="20" x2="19" y2="7" />
        </svg>
        Dashboard
      </div>

      {/* Donut Chart */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 0 }}>
        <div style={{ filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.35))", margin: 0 }}>
          <DonutChartComponent
            segments={[
              { id: "fijos", label: "Fijos", color: "#93C5FD", pct: 17 },
              { id: "deuda", label: "Deuda", color: "#FCA5A5", pct: 10 },
              { id: "ahorro", label: "Ahorro", color: "#86EFAC", pct: 8 },
              { id: "ocio", label: "Ocio", color: "#C4B5FD", pct: 9 },
              { id: "varios", label: "Varios", color: "#FDE68A", pct: 8 },
              { id: "saldo", label: "Tu saldo", color: "#E5E7EB", pct: 48 },
            ]}
            cx={110}
            cy={110}
            outerR={86}
            innerR={66}
            strokeWidth={20}
            strokeLinecap="round"
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
      </div>

      {/* Pillar Tags - Single Row */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {Object.entries(pillarColors).map(([pillarId, color]) => (
          <div key={pillarId} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, padding: "2.5px 4px", borderRadius: 12, background: pillarSoftBg[pillarId], border: "none", outline: "none" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: "8.5px", fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {pillarId === "fijos" ? "Fijos" : pillarId === "deuda" ? "Deuda" : pillarId === "ahorro" ? "Ahorro" : pillarId === "ocio" ? "Ocio" : "Varios"}
            </span>
          </div>
        ))}
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, padding: "2.5px 4px", borderRadius: 12, background: t.raised, border: "none", outline: "none" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.saldoColor, flexShrink: 0 }} />
          <span style={{ fontSize: "8.5px", fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Tu saldo</span>
        </div>
      </div>

      {/* Bloque Saldo + Texto Explicativo */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <div style={{ flex: 1, fontSize: "11.5px", fontWeight: 600, color: t.sub, lineHeight: 1.5, textAlign: "left" }}>
          En el gráfico ves tu saldo en gris. La tarjeta de la derecha muestra exactamente cuánto dinero te sobra después de tus gastos.
        </div>
        <div style={{ padding: "12px 14px", borderRadius: 16, background: t.surface, boxShadow: t.shadowSm, minWidth: 140, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 22, height: 22, borderRadius: 7, background: t.raised, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 20V10" />
                <path d="M12 20V4" />
                <path d="M19 20v-7" />
              </svg>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 800, color: t.text, flex: 1 }}>Saldo</span>
            <span style={{ fontSize: "9.5px", fontWeight: 800, color: t.accent }}>37% del total</span>
          </div>
          <div style={{ fontSize: "15px", fontWeight: 800, color: t.text, textAlign: "left" }}>{fmt(1560000)}</div>
        </div>
      </div>

      {/* Ingresos vs Gastos */}
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontSize: "13px", fontWeight: 800, color: t.text, textAlign: "center", marginBottom: 12 }}>Ingresos vs Gastos</div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <div style={{ flex: 1, padding: 14, borderRadius: 16, background: isDark ? "linear-gradient(155deg,#262231,#17151f)" : "linear-gradient(155deg,#f5f3fa,#ede9f7)", boxShadow: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)", textAlign: "left" }}>
            <div style={{ fontSize: "10px", fontWeight: 800, color: t.sub, letterSpacing: ".3px", textTransform: "uppercase" }}>Gastado</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#FF8A8A", marginTop: 0 }}>-{fmt(1688000)}</div>
          </div>
          <div style={{ flex: 1, padding: 14, borderRadius: 16, background: isDark ? "linear-gradient(155deg,#262231,#17151f)" : "linear-gradient(155deg,#f5f3fa,#ede9f7)", boxShadow: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)", textAlign: "left" }}>
            <div style={{ fontSize: "10px", fontWeight: 800, color: t.sub, letterSpacing: ".3px", textTransform: "uppercase" }}>Ingresos</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#86EFAC", marginTop: 0 }}>+{fmt(2700000)}</div>
          </div>
        </div>
      </div>

      {/* Por qué activarlo */}
      <div>
        <div style={{ fontSize: "13px", fontWeight: 800, color: t.text, textAlign: "center", marginBottom: 12 }}>Por qué activarlo</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "Visión real", body: "No solo ves lo que gastas, sino también lo que entra. Entiendes si ese mes fue positivo o negativo." },
            { title: "Saldo disponible", body: "Sabes exactamente cuánto dinero libre tienes después de todos tus gastos. Sin suposiciones." },
            { title: "Decisiones mejores", body: "Con ingresos + gastos visibles, tomas decisiones financieras más precisas. ¿Puedo gastar más? ¿Debo ahorrar más?" },
          ].map((reason, idx) => (
            <div key={idx} style={{ padding: 16, borderRadius: 16, background: t.accentSoft, boxShadow: t.shadowSm, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  {reason.title === "Visión real" && (
                    <>
                      <line x1="5" y1="20" x2="5" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="19" y1="20" x2="19" y2="7" />
                    </>
                  )}
                  {reason.title === "Saldo disponible" && (
                    <>
                      <circle cx="12" cy="12" r="9" />
                      <line x1="12" y1="6" x2="12" y2="12" />
                      <line x1="12" y1="12" x2="15" y2="15" />
                      <line x1="12" y1="3" x2="12" y2="3.01" />
                      <line x1="18" y1="6" x2="18" y2="6.01" />
                      <line x1="21" y1="12" x2="21" y2="12.01" />
                      <line x1="18" y1="18" x2="18" y2="18.01" />
                      <line x1="12" y1="21" x2="12" y2="21.01" />
                      <line x1="6" y1="18" x2="6" y2="18.01" />
                      <line x1="3" y1="12" x2="3" y2="12.01" />
                      <line x1="6" y1="6" x2="6" y2="6.01" />
                    </>
                  )}
                  {reason.title === "Decisiones mejores" && (
                    <>
                      <polyline points="13 2 3 14 12 14 11 22 21 4 12 4" />
                    </>
                  )}
                </svg>
                <span style={{ fontSize: "12.5px", fontWeight: 800, color: t.accent }}>{reason.title}</span>
              </div>
              <div style={{ fontSize: "11.5px", fontWeight: 600, color: t.text, lineHeight: 1.5 }}>{reason.body}</div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
