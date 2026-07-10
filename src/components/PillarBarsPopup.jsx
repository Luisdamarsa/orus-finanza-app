import { useState } from "react";
import { usePress } from "../hooks/usePress";
import { fmt } from "../utils/formatters";
import CatBar from "./CatBar";
import { getCategoryName } from "../utils/categoryUtils";
import { ALL_CATS } from "../constants/index.js";
import { getAttributeAtDate } from "../services/attributeHistoryService";

/**
 * PillarBarsPopup.jsx
 *
 * ESTADO 1: Popup modal que muestra desglose de categorías de un pilar
 * Se abre al clickear una tarjeta en PillarCardsGrid
 *
 * Muestra:
 * - Nombre del pilar (con icono)
 * - Total gastado vs presupuesto
 * - Desglose por categoría (usando CatBar)
 * - Botón para ver movimientos del pilar
 *
 * Props:
 *   pillar - Objeto del pilar {id, label, icon, color, budget}
 *   categories - {pillarId: [cat1, cat2, ...]} categorías del usuario
 *   onClose - Callback para cerrar el popup
 *   onViewMovements - Callback al clickear "Ver movimientos"
 *   isDark - Tema oscuro
 *   transactions - Array de transacciones
 *   selectedPeriod - Período seleccionado
 */
export default function PillarBarsPopup({
  pillar,
  categories = {},
  onClose,
  onViewMovements,
  isDark,
  transactions,
  selectedPeriod,
}) {
  // 🆕 Hook para animación de press en botón de ver movimientos
  const pressViewMovements = usePress();

  const t = isDark
    ? { border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };

  // 🆕 Obtener categorías del pilar desde el prop (datos del usuario) - ahora con IDs
  const pillarCategoryIds = categories[pillar.id] || [];

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

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 18px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }@keyframes popIn  { from { transform:scale(0.92);opacity:0 } to { transform:scale(1);opacity:1 } }`}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 300,
          background: isDark ? "#1A1A2B" : "#FFFFFF",
          borderRadius: 20,
          border: `1px solid ${t.border}`,
          padding: "16px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          animation: "popIn 0.22s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        {/* Header: Nombre del pilar + botón cerrar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 18 }}>{pillar.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: t.text }}>{pillar.label}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: isDark ? "#2D2D3A" : "#F0EFF8",
              border: "none",
              fontSize: 11,
              cursor: "pointer",
              color: t.sub,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Presupuesto total (si existe) */}
        {pillar.budget != null && (
          <div style={{ textAlign: "center", marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 9, color: pillar.color, fontWeight: 700, letterSpacing: 0.4 }}>
              {pillar.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: t.text, lineHeight: 1.1, marginTop: 4 }}>
              {fmt(totalSpent)}
            </div>
            <div style={{ fontSize: 9, color: t.sub, marginTop: 2 }}>de {fmt(pillar.budget)}</div>
          </div>
        )}

        {/* Categorías - desde el prop categories (datos del usuario) - ahora con IDs */}
        <div style={{ marginBottom: 12 }}>
          {pillarCategoryIds
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

        {/* Botón Ver movimientos */}
        <button
          onClick={onViewMovements}
          {...pressViewMovements.handlers}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 10,
            border: "none",
            background: pillar.color + "22",
            color: pillar.color,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            ...pressViewMovements.getPressStyle(),
          }}
        >
          Ver movimientos →
        </button>
      </div>
    </div>
  );
}
