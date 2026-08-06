import { useState } from "react";
import { fmt } from "../utils/formatters";
import { PILLARS } from "../constants";
import { getAttributeAtDate } from "../services/attributeHistoryService";
import { COLORS, withAlpha } from "../services/colorService";
import { DAY_PILLAR_COLOR } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { RADIUS } from "../constants/tokens";
import { cardStyles, getClayShadow, rowStyles } from "../utils/clayStyles";
import { getPillarColor, getPillarSoftBg } from "../utils/colorUtils";

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
 *   PILLARS, chipPcts, directPcts, pillarSpends, activeId, setActiveId
 *   selectedPeriod, customBudgets, getBudgetForMonth
 *   hasSaldo, saldo, saldoPctFinal, directSaldoPct, SALDO_COLOR
 *   setSelectedPillarDetail, setShowPillarBars
 *   isDark, t (tema)
 */
export default function PillarCardsGrid({
  PILLARS,
  chipPcts,
  directPcts,  // 🆕 FASE 2 - Porcentajes directos (sin Largest Remainder)
  pillarSpends,
  activeId,
  setActiveId,
  selectedPeriod,
  customBudgets,
  getBudgetForMonth,
  hasSaldo,
  saldo,
  saldoPctFinal,
  directSaldoPct,  // 🆕 FASE 2 - Saldo % directo
  SALDO_COLOR,
  setSelectedPillarDetail,
  setShowPillarBars,
  showPillarBars,
  isDark,
  t,
  currentUserId, // 🆕 FASE 2 - Pasar userId para filtrar presupuestos
}) {
  // 🆕 Tema desde ThemeContext para colores dinámicos
  const { isDark: isDarkTheme } = useTheme();

  // 🆕 DEBUG: Verificar que directPcts se está recibiendo correctamente
  console.log("🎯 PillarCardsGrid - chipPcts:", chipPcts, "directPcts:", directPcts, "saldoPctFinal:", saldoPctFinal, "directSaldoPct:", directSaldoPct);
  console.log("🎯 PillarCardsGrid - currentUserId:", currentUserId, "customBudgets:", customBudgets);

  // 🆕 Estado para trackear qué pilar está siendo presionado
  const [pressingId, setPressingId] = useState(null);

  // 🆕 Handler para visual press (solo setPressingId, sin acción)
  const handlePillarPress = (pillarId) => {
    console.log("🔻 POINTER DOWN - Presionando visualmente:", pillarId);
    setPressingId(pillarId);
  };

  // 🆕 Handler para acción real (toggle: mismo pilar = deselecciona, otro pilar = selecciona)
  const handlePillarSelect = (pillarId) => {
    console.log("✅ CLICK - Toggle pilar:", pillarId, "activeId actual:", activeId);
    // Toggle: si es el mismo pilar, deselecciona (null); si no, selecciona
    setActiveId((prev) => (prev === pillarId ? null : pillarId));
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

  // 🆕 Reorden personalizado: fijos, deuda, ocio, varios, ahorro
  const PILLARS_DISPLAY_ORDER = ["fijos", "deuda", "ocio", "varios", "ahorro"];
  const orderedPillars = PILLARS_DISPLAY_ORDER.map(id => PILLARS.find(p => p.id === id));

  // 🆕 Calcular si la última tarjeta debe ocupar 2 columnas
  const totalCards = orderedPillars.length + (hasSaldo ? 1 : 0);
  const isLastCardOdd = totalCards % 2 === 1;

  return (
    <>
      {/* Grid de tarjetas de pilares */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 0, width: "100%", boxSizing: "border-box", gridAutoRows: "max-content", alignItems: "stretch" }}>
        {orderedPillars.map((p, i) => {
          // 🆕 Si es la última tarjeta de pilares Y el total es impar, ocupar 2 columnas
          const isLastPillar = i === PILLARS.length - 1;
          const shouldSpan = isLastPillar && isLastCardOdd && !hasSaldo;
          const filteredSpent = pillarSpends[p.id];
          // 🆕 Obtener presupuesto del mes (personalizado o base)
          const currentMonth = selectedPeriod?.month || new Date().getMonth() + 1;
          const currentYear = selectedPeriod?.year || new Date().getFullYear();
          const budgetForMonth = getBudgetForMonth(p.id, currentMonth, currentYear, customBudgets, currentUserId); // 🆕 FASE 2 - Pasar userId

          // 🆕 Obtener presupuesto histórico del pilar en la fecha del período
          let historicalBudget = budgetForMonth;
          // 🆕 FASE 2 - Solo usar getAttributeAtDate si NO hay presupuesto personalizado
          // Si budgetForMonth ya devolvió un presupuesto personalizado, usarlo directamente
          const pillar = PILLARS.find(p2 => p2.id === p.id);
          const hasCustomBudget = budgetForMonth !== pillar?.budget;

          if (selectedPeriod && selectedPeriod.month && selectedPeriod.year && !hasCustomBudget && pillar) {
            // Solo consultar histórico si NO hay presupuesto personalizado
            const queryDate = `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}-15`;
            historicalBudget = getAttributeAtDate(pillar, "budget", queryDate);
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
          // 🆕 FASE 2 - Usar directPcts (sin Largest Remainder) para coincidir EXACTAMENTE con Estado 2
          // 🔴 FIX: Usar el índice REAL del pilar en PILLARS, no el índice de iteración
          const pillarIndex = PILLARS.findIndex(pillar => pillar.id === p.id);
          const pctTotal = directPcts[pillarIndex] || chipPcts[pillarIndex];  // Usar índice correcto
          console.log(`🎯 Pilar ${p.id} (iteración ${i}, PILLARS índice ${pillarIndex}): pctTotal=${pctTotal}, directPcts[${pillarIndex}]=${directPcts[pillarIndex]}, chipPcts[${pillarIndex}]=${chipPcts[pillarIndex]}, hasBudget=${hasBudget}, pc=${pc}`);
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
          // 🆕 Color dinámico del pilar según modo
          const pillarColor = getPillarColor(p.id, isDarkTheme);

          return (
            <div key={p.id} className="orus-rise" style={{ animationDelay: `${0.12 + row * 0.08}s`, gridColumn: shouldSpan ? "1 / -1" : "auto" }}>
            <div
              className="clay-hoverable"
              onClick={(e) => {
                e.stopPropagation(); // Detener click que resetea activeId
                handlePillarSelect(p.id); // 🆕 Toggle pilar seleccionado
              }}
              onPointerDown={(e) => {
                e.stopPropagation(); // Prevenir que el pointerDown se propague
                handlePillarPress(p.id); // 🆕 Solo efecto visual, sin acción
              }}
              onPointerUp={handlePillarPointerUp}
              onPointerLeave={handlePillarPointerLeave}
              style={{
                // 🆕 Estado EXCEDIDO (over) vs Normal
                background: over
                  ? p.id === "ahorro"
                    ? "rgba(34,197,94,0.24)"     // Ahorro excedido: verde positivo
                    : "rgba(239,68,68,0.24)"    // Otros: rojo gasto
                  : isAct
                    ? (isDark ? p.darkBg : p.bg)
                    : (isDark ? "linear-gradient(155deg, #211d2c 0%, #141220 100%)" : "linear-gradient(155deg, #ffffff 0%, #f5f3ff 100%)"),
                border: "none",
                borderRadius: "14px",
                padding: "8px",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                cursor: showPillarBars ? "default" : "pointer",
                outline: "none", // Quitar el outline del navegador al hacer click
                pointerEvents: showPillarBars ? "none" : "auto",
                transform: isPressingThisPillar
                  ? "scale(0.98) translateY(1px)"  // Empequeñece al presionar
                  : isAct
                  ? "scale(1.10) translateY(-2px)"  // 🆕 Crece cuando está seleccionado
                  : "scale(1) translateY(0)",
                opacity: showPillarBars ? 0.5 : (isPressingThisPillar ? 0.7 : 1),
                boxShadow: isPressingThisPillar
                  ? "inset 0 2px 6px rgba(0, 0, 0, 0.3)"  // Hundida al presionar
                  : isAct
                  ? `0 8px 16px ${isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.15)"}`  // 🆕 Sombra exterior para profundidad cuando está seleccionado
                  : "none !important",  // Sin shadow cuando no está seleccionado
                transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Fila 1: icono + nombre  ·  % del total (color del pilar) - solo si hay gasto > 0 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 8, background: getPillarSoftBg(p.id, isDarkTheme), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{p.icon}</span>
                  </div>
                  <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.label}</span>
                </div>
                {filteredSpent > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: dc, whiteSpace: "nowrap", flexShrink: 0 }}>{pctTotal}% del total</span>}
              </div>

              {/* Espaciador/Barra: reserva espacio incluso si no hay barra */}
              <div style={{ minHeight: 12, marginTop: 4, marginBottom: 2 }}>
                {/* Barra auto-escalable con 3 bolitas (inicio · gastado · fin de presupuesto).
                    Track 4px; bolitas 7px del color de su tramo (unidas, sin cortar la barra). Solo si hay gasto > 0 */}
                {hasBudget && filteredSpent > 0 && (() => {
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
              </div>

              {/* Fila: Monto (izq) + % presupuesto (der) - MISMO LINE */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4, marginTop: 6, minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.0, color: isDark ? "#F0EEFF" : "#1A1830", flexShrink: 0 }}>{fmt(filteredSpent)}</span>
                {hasBudget && filteredSpent > 0 && (
                  <span style={{ fontSize: 8.5, fontWeight: 700, lineHeight: 1.25, color: over ? overColor : dc, whiteSpace: "normal", textAlign: "right", minWidth: 0, maxWidth: "60px" }}>
                    {over ? `+${Math.ceil(pc - 100)}% sobre\npresupuesto` : `${pc}% presup.`}
                  </span>
                )}
              </div>
            </div>
            </div>
          );
        })}

        {/* Tarjeta de Saldo */}
        {hasSaldo && (
          <div className="orus-rise" style={{ animationDelay: `${0.12 + Math.floor(PILLARS.length / 2) * 0.08}s`, gridColumn: isLastCardOdd ? "1 / -1" : "auto" }}>
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
                ? "rgba(239,68,68,0.24)"  // Rojo si saldo es negativo (excedido)
                : (isDark ? "linear-gradient(155deg, #211d2c 0%, #141220 100%)" : "linear-gradient(155deg, #ffffff 0%, #f5f3ff 100%)"),
              border: "none",
              borderRadius: "14px",
              padding: "8px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
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
                <div style={{ width: 24, height: 24, borderRadius: 8, background: isDarkTheme ? "#2D2D3A" : "#E5E3F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{saldo < 0 ? "💰" : "💵"}</span>
                </div>
                <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 700, color: t.text }}>Saldo</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, color: saldo < 0 ? COLORS.gasto : (isDark ? SALDO_COLOR : "#64748B") }}>
                {saldo < 0 ? "en rojo" : `${directSaldoPct || saldoPctFinal}% del total`}
              </span>
            </div>
            <div style={{ minHeight: 12, marginTop: 4, marginBottom: 2 }} />
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.0, marginTop: 6, textAlign: "left", color: saldo < 0 ? COLORS.gasto : (isDark ? "#F0EEFF" : "#1A1830") }}>
              {saldo < 0 ? "-$" + Math.abs(saldo).toLocaleString("es-CO") : fmt(saldo)}
            </div>
          </div>
          </div>
        )}
      </div>
    </>
  );
}
