import { fmt } from "../utils/formatters";

/**
 * CatBar.jsx
 *
 * Componente que renderiza una barra de categoría dentro de un pilar
 * Muestra: nombre, monto gastado, presupuesto, barra de progreso
 *
 * Acepta ambos formatos:
 * - Antiguo: cat={cat}
 * - Nuevo: catName, spent, budget
 *
 * Props:
 *   catName - Nombre de la categoría
 *   spent - Monto gastado
 *   budget - Presupuesto de la categoría
 *   color - Color del pilar
 *   isDark - Tema oscuro
 *   pillarSpent - Gasto total del pilar (para calcular %)
 *   cat - (Antiguo) Objeto de categoría
 */
export default function CatBar({ catName, spent, budget, color, isDark, pillarSpent, cat }) {
  // 🆕 Aceptar tanto formato antiguo (cat) como nuevo (catName, spent, budget)
  const actualName = catName || cat?.name;
  const actualSpent = spent !== undefined ? spent : (cat?.spent || 0);
  const actualBudget = budget !== undefined ? budget : (cat?.budget);
  const hasBudget = actualBudget != null && actualBudget > 0;
  const p = hasBudget ? Math.round((actualSpent / actualBudget) * 100) : null;
  const pOfPillar = pillarSpent > 0 ? Math.round((actualSpent / pillarSpent) * 100) : 0;
  const barColor = hasBudget && p >= 100 ? "#FCA5A5" : color;

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Nombre + Monto */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: isDark ? "#E2E0F5" : "#374151", fontWeight: 500 }}>
          {actualName}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#A0A0C0" : "#6B7280" }}>
          {fmt(actualSpent)}
          {hasBudget ? (
            <span style={{ fontWeight: 400, opacity: 0.6 }}> / {fmt(actualBudget)}</span>
          ) : (
            <span style={{ fontWeight: 400, opacity: 0.6 }}> · {pOfPillar}%</span>
          )}
        </span>
      </div>

      {/* Barra de progreso */}
      <div style={{ height: 6, borderRadius: 3, background: isDark ? "#2D2D3A" : "#E5E7EB", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: hasBudget ? `${Math.min(p, 100)}%` : `${pOfPillar}%`,
            borderRadius: 3,
            background: barColor,
            transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}
