import { useState } from "react";
import { fmt } from "../utils/formatters";
import { PILLARS } from "../constants";
import { getAttributeAtDate } from "../services/attributeHistoryService";

/**
 * PillarCardsGrid.jsx
 *
 * ESTADO 1: Grid de tarjetas de pilares
 * Renderiza las tarjetas de cada pilar con:
 * - Nombre, icono, monto gastado
 * - Porcentaje (con presupuesto o % del total)
 * - Barra de progreso (si tiene presupuesto)
 * - Tarjeta de saldo (si existe)
 *
 * Props:
 *   PILLARS, chipPcts, pillarSpends, activeId, setActiveId
 *   selectedPeriod, customBudgets, getBudgetForMonth
 *   hasSaldo, saldo, saldoPctFinal, SALDO_COLOR
 *   setSelectedPillarDetail, setShowPillarBars
 *   isDark, t (tema)
 */
export default function PillarCardsGrid({
  PILLARS,
  chipPcts,
  pillarSpends,
  activeId,
  setActiveId,
  selectedPeriod,
  customBudgets,
  getBudgetForMonth,
  hasSaldo,
  saldo,
  saldoPctFinal,
  SALDO_COLOR,
  setSelectedPillarDetail,
  setShowPillarBars,
  isDark,
  t,
}) {
  // 🆕 Estado para trackear qué pilar está siendo presionado
  const [pressingId, setPressingId] = useState(null);

  // 🆕 Handlers mejorados usando state en lugar de classList
  const handlePillarPointerDown = (pillarId, pillar) => {
    console.log("🔻 POINTER DOWN - Presionando:", pillarId, "setPressingId:", pillarId);
    setPressingId(pillarId);
    setActiveId(pillarId);
    setSelectedPillarDetail(pillar);
    setShowPillarBars(true);
  };

  const handlePillarPointerUp = () => {
    console.log("🔺 POINTER UP - Soltado, setPressingId: null");
    setPressingId(null);
  };

  // 🆕 Cuando el mouse deja el elemento mientras está presionado, también soltar
  const handlePillarPointerLeave = () => {
    console.log("🚫 POINTER LEAVE - Mouse salió");
    setPressingId(null);
  };

  return (
    <>
      {/* Grid de tarjetas de pilares */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {PILLARS.map((p, i) => {
          const filteredSpent = pillarSpends[p.id];
          // 🆕 Obtener presupuesto del mes (personalizado o base)
          const currentMonth = selectedPeriod?.month || new Date().getMonth() + 1;
          const currentYear = selectedPeriod?.year || new Date().getFullYear();
          const budgetForMonth = getBudgetForMonth(p.id, currentMonth, currentYear, customBudgets);

          // 🆕 Obtener presupuesto histórico del pilar en la fecha del período
          let historicalBudget = budgetForMonth;
          if (selectedPeriod && selectedPeriod.month && selectedPeriod.year) {
            // Crear una fecha en el medio del mes seleccionado para consultar histórico
            const pillar = PILLARS.find(pillar => pillar.id === p.id);
            if (pillar) {
              const queryDate = `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}-15`;
              historicalBudget = getAttributeAtDate(pillar, "budget", queryDate);
            }
          }

          // 🆕 Si el periodo es "Todo el tiempo" (null) o "Todo el año" (month === null), no mostrar presupuestos
          const isAllTimeOrAllYear = !selectedPeriod || selectedPeriod?.month === null;
          const hasBudget = !isAllTimeOrAllYear && historicalBudget != null && historicalBudget > 0;
          // 🆕 Usar chipPcts (mismo cálculo que Estado 2) cuando no hay presupuesto, para consistencia
          // 🆕 Usar historicalBudget para cálculo
          const pc = hasBudget ? Math.round((filteredSpent / historicalBudget) * 100) : chipPcts[i];
          // 🆕 Diferenciar entre exactamente 100% (no está pasado) y > 100% (pasado)
          const over = hasBudget && pc > 100;
          const isAct = activeId === p.id;
          // 🎨 CAMBIO: Emoji diferente si Ahorro (🎉) o si otro pilar pasado (⚠️)
          // 🆕 Usar Math.ceil para redondear hacia arriba el exceso (ej: +0.5% → +1%)
          // 🆕 Consistencia: usar "del total" en lugar de "total"
          const badgeLabel = pc === 0 ? "0%" : !hasBudget ? `${pc}% del total` : over ? `+${Math.ceil(pc - 100)}% ${p.id === "ahorro" ? "🎉" : "⚠️"}` : `${pc}%`;

          // 🆕 ¿Este pilar está siendo presionado?
          const isPressingThisPillar = pressingId === p.id;

          return (
            <div
              key={p.id}
              onPointerDown={() => handlePillarPointerDown(p.id, p)}
              onPointerUp={handlePillarPointerUp}
              onPointerLeave={handlePillarPointerLeave}
              style={{
                // 🎨 CAMBIO: Resalta en verde (Ahorro) o rojo (otros) si pasa presupuesto
                background: over
                  ? p.id === "ahorro"
                    ? isDark ? p.color + "33" : p.color + "22"  // Verde para Ahorro
                    : isDark ? "#EF444433" : "#FCA5A522"  // Rojo para otros
                  : (isDark ? "#252535" : "#FFFFFF"),  // Sin overlay al presionar
                border: `1.5px solid ${isAct ? p.color + "88" : over ? (p.id === "ahorro" ? p.color + "88" : "#EF444488") : t.border}`,
                borderRadius: 11,
                padding: "1px 8px",
                cursor: "pointer",
                // 🆕 Transición suave para el efecto de hundimiento
                transform: isPressingThisPillar ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                boxShadow: isPressingThisPillar ? "inset 0 2px 6px rgba(0, 0, 0, 0.3)" : "none",
                transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1.5, marginBottom: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                  <span style={{ fontSize: 15, lineHeight: 1, display: "flex", alignItems: "center" }}>{p.icon}</span>
                  <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 700, color: t.text, display: "flex", alignItems: "center" }}>{p.label}</span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "2px 4px",
                    borderRadius: 6,
                    background: over ? (p.id === "ahorro" ? p.color + "33" : "#FCA5A522") : p.color + "22",
                    color: over ? (p.id === "ahorro" ? p.color : "#EF4444") : (isDark ? p.color : p.darkColor),
                  }}
                >
                  {badgeLabel}
                </span>
              </div>
              <div style={{ fontSize: 12, color: t.sub, marginBottom: 0 }}>{fmt(filteredSpent)}</div>
              {!hasBudget ? (
                <div style={{ fontSize: 10, color: t.sub, fontStyle: "italic" }}>Sin presupuesto</div>
              ) : (
                <div style={{ height: 8, marginTop: 0, marginBottom: 1.5, borderRadius: 2, background: isDark ? "#2D2D3A" : "#E5E7EB", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(pc, 100)}%`,
                      borderRadius: 2,
                      background: over ? (p.id === "ahorro" ? p.color : "#FCA5A5") : p.color,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Tarjeta de Saldo */}
        {hasSaldo && (
          <div
            onPointerDown={() => saldo >= 0 && setPressingId("saldo")}
            onPointerUp={() => setPressingId(null)}
            onPointerLeave={() => setPressingId(null)}
            style={{
              background: saldo < 0
                ? (isDark ? "#2a1111" : "#FEF2F2")
                : (isDark ? "#1E1E2E" : "#FFFFFF"), // Sin overlay al presionar
              border: `1.5px solid ${saldo < 0 ? "#EF444488" : t.border}`, // Sin glow en borde activo
              borderRadius: 11,
              padding: "1px 8px",
              cursor: saldo >= 0 ? "pointer" : "default",
              transform: pressingId === "saldo" ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
              boxShadow: pressingId === "saldo" ? "inset 0 2px 6px rgba(0, 0, 0, 0.3)" : "none",
              transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onClick={() => saldo >= 0 && setActiveId(activeId === "saldo" ? null : "saldo")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1.5, marginBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                <span style={{ fontSize: 15, lineHeight: 1, display: "flex", alignItems: "center" }}>{saldo < 0 ? "💰" : "💵"}</span>
                <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 700, color: t.text, display: "flex", alignItems: "center" }}>Saldo</span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "2px 4px",
                  borderRadius: 6,
                  background: saldo < 0 ? "#EF444422" : SALDO_COLOR + "33",
                  color: saldo < 0 ? "#EF4444" : "#64748B",
                  flexShrink: 0,
                }}
              >
                {saldo < 0 ? "en rojo" : `${saldoPctFinal}% del total`}
              </span>
            </div>
            <div style={{ fontSize: 12, color: saldo < 0 ? "#EF4444" : t.sub, marginBottom: 0 }}>
              {saldo < 0 ? "-$" + Math.abs(saldo).toLocaleString("es-CO") : fmt(saldo)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
