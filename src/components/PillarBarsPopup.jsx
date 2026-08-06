import { useEffect, useState, useRef } from "react";
import { usePress } from "../hooks/usePress";
import { DARK, LIGHT, SHADOWS } from "../constants/tokens";
import { fmt } from "../utils/formatters";
import CatBar from "./CatBar";
import { getCategoryName } from "../utils/categoryUtils";
import { ALL_CATS } from "../constants/index.js";
import { getAttributeAtDate } from "../services/attributeHistoryService";

/**
 * PillarBarsPopup.jsx
 *
 * Popup modal O tarjeta inline que muestra desglose de categorías de un pilar
 * - Modal: Se abre al clickear una tarjeta en PillarCardsGrid (isInline = false)
 * - Inline: Se renderiza reemplazando el grid en DashboardExpandedState (isInline = true)
 *
 * Muestra:
 * - Nombre del pilar (con icono)
 * - Total gastado vs presupuesto
 * - Desglose por categoría (usando CatBar)
 * - Botón para ver movimientos del pilar
 *
 * Props:
 *   pillar - Objeto del pilar {id, label, icon, color, budget}
 *   onClose - Callback para cerrar el popup
 *   onViewMovements - Callback al clickear "Ver movimientos"
 *   isDark - Tema oscuro
 *   transactions - Array de transacciones
 *   selectedPeriod - Período seleccionado
 *   isInline - Si true, renderiza solo la tarjeta sin overlay modal
 */
export default function PillarBarsPopup({
  pillar,
  onClose,
  onViewMovements,
  isDark,
  transactions,
  selectedPeriod,
  isInline = false,
  currentUserId, // 🆕 FASE 2 - Pasar userId para filtrar categorías
  customBudgets, // 🆕 FASE 2 - Pasar presupuestos personalizados
  getBudgetForMonth, // 🆕 FASE 2 - Calcular presupuesto del mes
}) {
  // 🆕 Hook para animación de press en botón de ver movimientos
  const pressViewMovements = usePress();

  // 🆕 Estado para expandir/colapsar bottom sheet
  const [isExpanded, setIsExpanded] = useState(false);
  const dragStartRef = useRef(null);
  const categoriesRef = useRef(null);

  // 🆕 Handlers para detectar drag
  const handleDragStart = (e) => {
    // Ignorar botones (cerrar + ver movimientos)
    if (e.target.closest("button")) return;
    // Ignorar categorías SOLO si NO está expandido (cuando está expandido, se puede jalar para colapsar)
    if (!isExpanded && categoriesRef.current?.contains(e.target)) return;
    // Almacenar posición Y + estado expandido actual
    dragStartRef.current = { y: e.clientY, wasExpanded: isExpanded };
    console.log(`🎯 Drag iniciado - Estado: ${isExpanded ? "EXPANDIDO" : "COLAPSADO"}`);
  };

  // 🆕 Detectar drag a nivel de documento
  useEffect(() => {
    const handleDragMove = (e) => {
      if (!dragStartRef.current) return;
      const diff = dragStartRef.current.y - e.clientY; // positivo = arriba, negativo = abajo
      const wasExpanded = dragStartRef.current.wasExpanded;

      if (diff > 8) {
        // Jalar hacia arriba → expandir
        console.log("⬆️  Jalado hacia ARRIBA - EXPANDIENDO");
        setIsExpanded(true);
        dragStartRef.current = null;
      } else if (diff < -8) {
        // Jalar hacia abajo
        if (wasExpanded) {
          // Si estaba expandido → colapsar
          console.log("⬇️  Jalado hacia ABAJO - COLAPSANDO (estaba expandido)");
          setIsExpanded(false);
        } else {
          // Si estaba colapsado → cerrar
          console.log("⬇️  Jalado hacia ABAJO - CERRANDO (estaba colapsado)");
          onClose();
        }
        dragStartRef.current = null;
      }
    };

    const handleDragEnd = () => {
      dragStartRef.current = null;
    };

    document.addEventListener("pointermove", handleDragMove);
    document.addEventListener("pointerup", handleDragEnd);
    document.addEventListener("pointerleave", handleDragEnd);

    return () => {
      document.removeEventListener("pointermove", handleDragMove);
      document.removeEventListener("pointerup", handleDragEnd);
      document.removeEventListener("pointerleave", handleDragEnd);
    };
  }, [onClose]);

  // 🆕 Bloquear scroll del documento cuando el bottom sheet está abierto
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflowY = "hidden";
    document.documentElement.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = originalBodyOverflow;
      document.documentElement.style.overflowY = originalHtmlOverflow;
    };
  }, []);

  const t = isDark
    ? { border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };

  // 🆕 Categorías del pilar que EXISTÍAN en el período visto (historización: createdAt/deletedAt)
  const periodKey = selectedPeriod && selectedPeriod.month && selectedPeriod.year
    ? `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}`
    : null;
  // ¿Es un mes específico? (si no: año o "todo el tiempo" → sin presupuesto)
  const isMonthPeriod = !!selectedPeriod && selectedPeriod.month != null;

  // 🆕 FASE 2 - Calcular presupuesto personalizado del pilar (no el base)
  const currentMonth = selectedPeriod?.month || new Date().getMonth() + 1;
  const currentYear = selectedPeriod?.year || new Date().getFullYear();
  const budgetForMonth = getBudgetForMonth
    ? getBudgetForMonth(pillar.id, currentMonth, currentYear, customBudgets, currentUserId)
    : pillar.budget;
  const pillarCategoryIds = ALL_CATS
    .filter((cat) => cat.pillar === pillar.id)
    .filter((cat) => cat.userId === currentUserId) // 🆕 FASE 2 - Filtrar por userId para evitar duplicados
    .filter((cat) => {
      if (!periodKey) return !cat.deletedAt;
      const createdOk = !cat.createdAt || cat.createdAt.slice(0, 7) <= periodKey;
      const notDeleted = !cat.deletedAt || cat.deletedAt.slice(0, 7) > periodKey;
      return createdOk && notDeleted;
    })
    .map((cat) => cat.id);

  // 🆕 Calcular gastos dinámicamente por período (usando IDs)
  const categorySpent = {};
  pillarCategoryIds.forEach((catId) => {
    categorySpent[catId] = 0;
  });

  if (transactions) {
    transactions.forEach((tx) => {
      const matchesPillar = tx.pillar === pillar.id;
      const matchesPeriod =
        !selectedPeriod ||
        (() => {
          const [txYear, txMonth] = tx.date.split("-").map(Number);
          // ✅ Si month es null, mostrar todo el año
          if (selectedPeriod.month === null) {
            return txYear === selectedPeriod.year;
          }
          return txYear === selectedPeriod.year && txMonth === selectedPeriod.month;
        })();

      if (matchesPillar && matchesPeriod && tx.amount < 0) {
        const catId = tx.category;
        if (catId) {
          categorySpent[catId] = (categorySpent[catId] || 0) + Math.abs(tx.amount);
        }
      }
    });
  }

  const totalSpent = Object.values(categorySpent).reduce((sum, v) => sum + v, 0);

  // Si es inline, solo renderizar la tarjeta sin overlay
  if (isInline) {
    return (
      <div style={{ borderRadius: 22, background: isDark ? "linear-gradient(155deg, #211d2c 0%, #141220 100%)" : "#FFFFFF", boxShadow: SHADOWS.shadowLg || "0 -20px 40px rgba(0,0,0,0.5)", animation: "clayRise 0.35s cubic-bezier(0.32, 0.72, 0.12, 1)", display: "flex", flexDirection: "column", padding: "18px" }}>
        <style>{`@keyframes clayRise { from { transform:translateY(20px);opacity:0 } to { transform:translateY(0);opacity:1 } }`}</style>
        {pillar.budget != null && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 12, background: pillar.color + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{pillar.icon}</div>
              <div><div style={{ fontSize: 15, fontWeight: 800, color: "#F5F3FF" }}>{pillar.label}</div></div>
            </div>
            {(() => { const isOver = totalSpent > budgetForMonth; const gastoColor = isOver ? (pillar.id === "ahorro" ? "#22C55E" : "#EF4444") : "#F5F3FF"; return <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800, color: gastoColor, lineHeight: 1.2 }}>{fmt(totalSpent)}</div>{isMonthPeriod && <div style={{ fontSize: 10, fontWeight: 700, color: "#8B87A3", lineHeight: 1.2 }}>de {fmt(budgetForMonth)}</div>}</div>; })()}
          </div>
        )}
        <div style={{ maxHeight: "230px", overflowY: "auto", scrollbarWidth: "none", paddingRight: 4, marginBottom: 12 }}><style>{`::-webkit-scrollbar { display: none; }`}</style>{Object.keys(categorySpent).sort((a, b) => (categorySpent[b] || 0) - (categorySpent[a] || 0)).map((catId) => { const category = ALL_CATS.find(cat => cat.id === catId); let catName = getCategoryName(catId); if (category && selectedPeriod && selectedPeriod.month && selectedPeriod.year) { const queryDate = `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}-15`; catName = getAttributeAtDate(category, "name", queryDate); } return <CatBar key={catId} catId={catId} catName={catName} spent={categorySpent[catId] || 0} budget={null} color={pillar.color} isDark={isDark} pillarSpent={totalSpent} />; })}</div>
        <button onClick={onViewMovements} {...pressViewMovements.handlers} style={{ width: "100%", padding: 13, borderRadius: 14, border: "none", background: "rgba(155,109,255,0.16)", color: "#9B6DFF", fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: "auto", flexShrink: 0, ...pressViewMovements.getPressStyle() }}>Ver movimientos →</button>
      </div>
    );
  }

  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.55)",
        animation: "fadeIn 0.25s ease",
        pointerEvents: "auto",
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }@keyframes clayRise { from { transform:translateY(100%);opacity:0 } to { transform:translateY(0);opacity:1 } }`}</style>

      <div
        onPointerDown={(e) => {
          e.stopPropagation();
          // Ignorar clicks en el botón de cerrar
          if (e.target.closest("button")) return;
          handleDragStart(e);
        }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          maxHeight: isExpanded ? "90vh" : "60vh",
          boxSizing: "border-box",
          background: isDark ? "linear-gradient(155deg, #211d2c, #141220)" : "#FFFFFF",
          borderRadius: "22px 22px 0 0",
          boxShadow: SHADOWS.shadowLg || "0 -20px 40px rgba(0,0,0,0.5)",
          animation: "clayRise 0.35s cubic-bezier(0.32, 0.72, 0.12, 1)",
          display: "flex",
          flexDirection: "column",
          zIndex: 51,
          pointerEvents: "auto",
          transition: "maxHeight 0.3s ease",
          padding: "18px",
        }}
      >
        {/* Header + Presupuesto en la misma línea */}
        {pillar.budget != null && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid rgba(255,255,255,0.07)`, cursor: "grab", userSelect: "none" }}>
            {/* Izquierda: Ícono + Nombre */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: pillar.color + "28",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}>
                {pillar.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#F5F3FF" }}>{pillar.label}</div>
              </div>
            </div>

            {/* Derecha: Monto + Presupuesto */}
            {(() => {
              const isOver = totalSpent > pillar.budget;
              const gastoColor = isOver ? (pillar.id === "ahorro" ? "#22C55E" : "#EF4444") : "#F5F3FF";
              return (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: gastoColor, lineHeight: 1.2 }}>
                    {fmt(totalSpent)}
                  </div>
                  {isMonthPeriod && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8B87A3", lineHeight: 1.2 }}>
                      de {fmt(pillar.budget)}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Categorías - scroll interno, máximo 5 visibles (o todas si expandido) */}
        <div ref={categoriesRef} style={{ maxHeight: isExpanded ? "calc(90vh - 280px)" : "230px", overflowY: "auto", scrollbarWidth: "none", paddingRight: 4, marginBottom: 12, transition: "maxHeight 0.3s ease" }}>
          <style>{`::-webkit-scrollbar { display: none; }`}</style>
          {/* Filas desde categorySpent (incluye categorías borradas con gasto) para cuadrar con el total y con Movimientos */}
          {Object.keys(categorySpent)
            .sort((a, b) => (categorySpent[b] || 0) - (categorySpent[a] || 0))
            .map((catId) => {
              // 🆕 Obtener nombre histórico de la categoría en la fecha del período
              const category = ALL_CATS.find(cat => cat.id === catId);
              let catName = getCategoryName(catId);

              if (category && selectedPeriod && selectedPeriod.month && selectedPeriod.year) {
                // Crear fecha en el medio del mes seleccionado
                const queryDate = `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}-15`;
                catName = getAttributeAtDate(category, "name", queryDate);
              }

              return (
                <CatBar
                  key={catId}
                  catId={catId}
                  catName={catName}
                  spent={categorySpent[catId] || 0}
                  budget={null}
                  color={pillar.color}
                  isDark={isDark}
                  pillarSpent={totalSpent}
                />
              );
            })}
        </div>

        {/* Botón Ver movimientos - FIJO AL FINAL */}
        <button
          onClick={onViewMovements}
          {...pressViewMovements.handlers}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 14,
            border: "none",
            background: "rgba(155,109,255,0.16)",
            color: "#9B6DFF",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            marginTop: "auto",
            flexShrink: 0,
            ...pressViewMovements.getPressStyle(),
          }}
        >
          Ver movimientos →
        </button>
      </div>
    </div>
  );
}
