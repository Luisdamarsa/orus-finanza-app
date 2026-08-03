import { usePress } from "../hooks/usePress";
import { DARK, LIGHT } from "../constants/tokens";
import { fmt } from "../utils/formatters";
import { PILLARS, SALDO_COLOR } from "../constants";
import { ALL_CATS } from "../constants/index.js";

/**
 * PillarDetailCard.jsx
 *
 * Tarjeta expandida inline que reemplaza el grid cuando un pilar está seleccionado.
 * Muestra el desglose de categorías del pilar.
 *
 * Props:
 * - pillarId: ID del pilar seleccionado
 * - transactions: Array de transacciones
 * - selectedPeriod: Período seleccionado
 * - isDark: Tema oscuro
 * - onViewMovements: Callback para abrir los movimientos
 */
export default function PillarDetailCard({
  pillarId,
  transactions,
  selectedPeriod,
  isDark,
  onViewMovements,
}) {
  const tokens = isDark ? DARK : LIGHT;
  const pressViewMovements = usePress();

  // Obtener pilar
  const pillar = PILLARS.find(p => p.id === pillarId);
  if (!pillar) return null;

  // Obtener color del pilar
  const pillarColor = pillar.color;

  // Categorías del pilar
  const pillarCategoryIds = ALL_CATS
    .filter(cat => cat.pillar === pillarId)
    .map(cat => cat.id);

  // Calcular gastos por categoría
  const categorySpent = {};
  pillarCategoryIds.forEach(catId => {
    categorySpent[catId] = 0;
  });

  if (transactions) {
    transactions.forEach(tx => {
      const matchesPillar = tx.pillar === pillarId;
      const matchesPeriod =
        !selectedPeriod ||
        (() => {
          const [txYear, txMonth] = tx.date.split("-").map(Number);
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
  const budget = pillar.budget || 0;

  // Obtener nombre de categoría
  const getCatName = (catId) => {
    const cat = ALL_CATS.find(c => c.id === catId);
    return cat?.name || catId;
  };

  // Ordenar categorías por gasto (descendente)
  const sortedCategories = Object.keys(categorySpent)
    .sort((a, b) => (categorySpent[b] || 0) - (categorySpent[a] || 0));

  return (
    <div
      style={{
        borderRadius: 22,
        background: isDark ? "linear-gradient(155deg, #211d2c 0%, #141220 100%)" : "#FFFFFF",
        boxShadow: "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        padding: 18,
        animation: "clayRise 0.35s ease both",
      }}>
      {/* Header: Ícono + Nombre + Monto */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Izquierda: Ícono + Nombre */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: pillarColor + "28",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}>
            {pillar.icon}
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#F5F3FF" }}>
            {pillar.label}
          </span>
        </div>

        {/* Derecha: Monto + Presupuesto */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#F5F3FF", lineHeight: 1.2 }}>
            {fmt(totalSpent)}
          </div>
          {budget > 0 && (
            <div style={{ fontSize: 10, fontWeight: 700, color: "#8B87A3", lineHeight: 1.2 }}>
              de {fmt(budget)}
            </div>
          )}
        </div>
      </div>

      {/* Categorías */}
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {sortedCategories.map(catId => (
          <div key={catId}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#F5F3FF", marginBottom: 5 }}>
              <span>{getCatName(catId)}</span>
              <span>{fmt(categorySpent[catId])} · {budget > 0 ? Math.round((categorySpent[catId] / budget) * 100) : 0}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: budget > 0 ? `${Math.min((categorySpent[catId] / budget) * 100, 100)}%` : "0%",
                  background: pillarColor,
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botón Ver movimientos */}
      <button
        onClick={onViewMovements}
        {...pressViewMovements.handlers}
        style={{
          width: "100%",
          padding: 13,
          borderRadius: 14,
          border: "none",
          background: "rgba(155,109,255,0.16)",
          color: "#9B6DFF",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          ...pressViewMovements.getPressStyle(),
        }}>
        Ver movimientos
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
