import { useState } from "react";
import { fmt } from "../utils/formatters";
import { PILLARS } from "../constants";
import { getAttributeAtDate } from "../services/attributeHistoryService";
import { COLORS, withAlpha } from "../services/colorService";
import { DAY_PILLAR_COLOR } from "../constants";

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

  // 🆕 Handler para visual press (solo setPressingId, sin acción)
  const handlePillarPress = (pillarId) => {
    console.log("🔻 POINTER DOWN - Presionando visualmente:", pillarId);
    setPressingId(pillarId);
  };

  // 🆕 Handler para acción real (se ejecuta al SOLTAR / onClick)
  const handlePillarSelect = (pillarId, pillar) => {
    console.log("✅ CLICK - Seleccionando pilar:", pillarId);
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
          const dc = isDark ? p.color : (DAY_PILLAR_COLOR[p.id] || p.color); // 🆕 color día/noche
          // 🆕 Rediseño: % del total arriba (color pilar), barra auto-escalable, gastado, % presupuesto abajo.
          const pctTotal = chipPcts[i];
          const grayTrack = isDark ? "#2D2D3A" : "#E5E3F5"; // "no gastado"
          const overColor = p.id === "ahorro" ? "#22C55E" : "#EF4444"; // exceso: verde FUERTE en Ahorro (distinto del pastel), rojo en el resto
          // Barra que se escala sola: dentro del presupuesto → color + gris; pasado → color(presupuesto) + rojo(exceso).
          let coloredPct = 0, overSegPct = 0;
          if (hasBudget && historicalBudget > 0) {
            if (over) { coloredPct = (historicalBudget / filteredSpent) * 100; overSegPct = 100 - coloredPct; }
            else { coloredPct = Math.min((filteredSpent / historicalBudget) * 100, 100); }
          }

          // 🆕 ¿Este pilar está siendo presionado?
          const isPressingThisPillar = pressingId === p.id;
          // 🆕 Entrada escalonada por FILA (grid de 2 columnas): fila 0, 1, 2...
          const row = Math.floor(i / 2);

          return (
            <div key={p.id} className="orus-rise" style={{ animationDelay: `${0.12 + row * 0.08}s` }}>
            <div
              onClick={(e) => {
                e.stopPropagation(); // Detener click que resetea activeId
                handlePillarSelect(p.id, p); // 🆕 Ejecutar acción al hacer click (soltar)
              }}
              onPointerDown={(e) => {
                e.stopPropagation(); // Prevenir que el pointerDown se propague
                handlePillarPress(p.id); // 🆕 Solo efecto visual, sin acción
              }}
              onPointerUp={handlePillarPointerUp}
              onPointerLeave={handlePillarPointerLeave}
              style={{
                // 🎨 CAMBIO: Resalta en verde (Ahorro) o rojo (otros) si pasa presupuesto
                background: over
                  ? p.id === "ahorro"
                    ? isDark ? withAlpha(p.color, "33") : withAlpha(p.color, "22")  // Verde para Ahorro
                    : isDark ? withAlpha(COLORS.gasto, "33") : withAlpha(COLORS.overSoft, "22")  // Rojo para otros
                  : isAct
                    ? (isDark ? p.darkBg : p.bg)  // Con color cuando está activo
                    : (isDark ? "#252535" : "#FFFFFF"),  // Gris cuando no está activo
                border: `1.5px solid ${
                  over
                    ? (p.id === "ahorro" ? withAlpha(p.color, "88") : withAlpha(COLORS.gasto, "88"))  // Rojo/Verde si pasa presupuesto
                    : isAct
                    ? p.color  // 🆕 Color del pilar cuando está seleccionado
                    : t.border  // Gris cuando no está activo
                }`,
                borderRadius: 11,
                padding: "4px 10px",
                cursor: "pointer",
                outline: "none", // Quitar el outline del navegador al hacer click
                transform: isPressingThisPillar
                  ? "scale(0.98) translateY(1px)"  // Empequeñece al presionar
                  : isAct
                  ? "scale(1.10) translateY(-2px)"  // 🆕 Crece cuando está seleccionado
                  : "scale(1) translateY(0)",
                opacity: isPressingThisPillar ? 0.7 : 1,
                boxShadow: isPressingThisPillar
                  ? "inset 0 2px 6px rgba(0, 0, 0, 0.3)"  // Hundida al presionar
                  : isAct
                  ? `0 8px 16px ${isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.15)"}`  // 🆕 Sombra exterior para profundidad cuando está seleccionado
                  : "none !important",  // Sin shadow cuando no está seleccionado
                transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Fila 1: icono + nombre  ·  % del total (color del pilar) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{p.icon}</span>
                  <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: dc, whiteSpace: "nowrap", flexShrink: 0 }}>{pctTotal}% del total</span>
              </div>

              {/* Barra auto-escalable con 3 bolitas (inicio · gastado · fin de presupuesto).
                  Track 4px; bolitas 7px del color de su tramo (unidas, sin cortar la barra). */}
              {hasBudget && (() => {
                const gastadoPos = over ? 100 : coloredPct;       // dónde va lo gastado
                const budgetPos = over ? coloredPct : 100;         // dónde va el fin del presupuesto
                const gastadoColor = over ? overColor : dc;
                // Fin de presupuesto: gris dentro del presupuesto; en sobregiro va del color del pilar (se une al tramo anterior).
                const budgetDotColor = over ? dc : grayTrack;
                const dotL = (pos) => pos <= 0 ? "0px" : pos >= 100 ? "calc(100% - 7px)" : `calc(${pos}% - 3.5px)`;
                return (
                  <div style={{ position: "relative", height: 7, marginTop: 4, marginBottom: 1 }}>
                    <div style={{ position: "absolute", top: 1.5, left: 0, right: 0, height: 4, borderRadius: 4, background: grayTrack, overflow: "hidden", display: "flex" }}>
                      <div style={{ width: `${coloredPct}%`, background: dc }} />
                      {over && <div style={{ width: `${overSegPct}%`, background: overColor }} />}
                    </div>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 7, height: 7, borderRadius: "50%", background: dc }} />
                    <div style={{ position: "absolute", top: 0, left: dotL(budgetPos), width: 7, height: 7, borderRadius: "50%", background: budgetDotColor }} />
                    <div style={{ position: "absolute", top: 0, left: dotL(gastadoPos), width: 7, height: 7, borderRadius: "50%", background: gastadoColor }} />
                  </div>
                );
              })()}

              {/* Gastado */}
              <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.0, color: isDark ? "#F0EEFF" : "#1A1830", marginTop: 10, textAlign: "left" }}>{fmt(filteredSpent)}</div>

              {/* % del presupuesto (solo con presupuesto) */}
              {hasBudget && (
                <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.15, color: over ? overColor : dc, marginTop: 1, textAlign: "left" }}>
                  {over ? `+${Math.ceil(pc - 100)}% sobre presupuesto` : `${pc}% del presupuesto`}
                </div>
              )}
            </div>
            </div>
          );
        })}

        {/* Tarjeta de Saldo */}
        {hasSaldo && (
          <div className="orus-rise" style={{ animationDelay: `${0.12 + Math.floor(PILLARS.length / 2) * 0.08}s` }}>
          <div
            onClick={(e) => e.stopPropagation()} // Detener click que resetea activeId
            onPointerDown={(e) => {
              e.stopPropagation(); // Prevenir que el pointerDown se propague
              if (saldo >= 0) setPressingId("saldo");
            }}
            onPointerUp={() => setPressingId(null)}
            onPointerLeave={() => setPressingId(null)}
            style={{
              background: saldo < 0
                ? (isDark ? "#2a1111" : "#FEF2F2")
                : (isDark ? "#1E1E2E" : "#FFFFFF"),
              border: `1.5px solid ${
                saldo < 0
                  ? withAlpha(COLORS.gasto, "88")  // Rojo si saldo es negativo
                  : activeId === "saldo"
                  ? COLORS.neutral  // 🆕 Color gris/plata cuando está seleccionado
                  : t.border  // Gris normal cuando no está seleccionado
              }`,
              borderRadius: 11,
              padding: "4px 10px",
              cursor: saldo >= 0 ? "pointer" : "default",
              outline: "none",
              transform: pressingId === "saldo"
                ? "scale(0.98) translateY(1px)"  // Empequeñece al presionar
                : activeId === "saldo"
                ? "scale(1.10) translateY(-2px)"  // 🆕 Crece cuando está seleccionado
                : "scale(1) translateY(0)",
              opacity: pressingId === "saldo" ? 0.7 : 1,
              boxShadow: pressingId === "saldo"
                ? "inset 0 2px 6px rgba(0, 0, 0, 0.3)"  // Hundida al presionar
                : activeId === "saldo"
                ? `0 8px 16px ${isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.15)"}`  // 🆕 Sombra exterior cuando está seleccionado
                : "none !important",
              transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onClick={() => saldo >= 0 && setActiveId(activeId === "saldo" ? null : "saldo")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>{saldo < 0 ? "💰" : "💵"}</span>
                <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 700, color: t.text }}>Saldo</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, color: saldo < 0 ? COLORS.gasto : (isDark ? SALDO_COLOR : "#64748B") }}>
                {saldo < 0 ? "en rojo" : `${saldoPctFinal}% del total`}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.0, marginTop: 10, textAlign: "left", color: saldo < 0 ? COLORS.gasto : (isDark ? "#F0EEFF" : "#1A1830") }}>
              {saldo < 0 ? "-$" + Math.abs(saldo).toLocaleString("es-CO") : fmt(saldo)}
            </div>
          </div>
          </div>
        )}
      </div>
    </>
  );
}
