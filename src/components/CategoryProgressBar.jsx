import ProgressBar from "./ProgressBar";
import { getOverBudgetColor } from "../services/colorService";
import { fmt } from "../utils/formatters";

/**
 * CategoryProgressBar.jsx
 *
 * Barra de progreso para categorías
 * Muestra:
 * - Con presupuesto: Barra punteada vs presupuesto
 * - Sin presupuesto: Barra sólida con color del pilar vs maxSpent
 * - Click para filtrar transacciones
 *
 * Props:
 *   categoryId - ID único de la categoría
 *   categoryName - Nombre para mostrar
 *   spent - Monto gastado
 *   budget - Presupuesto (opcional)
 *   maxSpent - Máximo gasto entre categorías (para categorías sin presupuesto)
 *   pillarColor - Color del pilar
 *   isDark - Tema oscuro
 *   onClickBar - Callback cuando se hace click en la barra
 *   isSelected - Si está seleccionada
 */
export default function CategoryProgressBar({
  categoryName,
  spent,
  budget = null,
  maxSpent = 1,
  pillarColor = "#22C55E",
  pillarId = null,
  isDark = true,
  textColor = "#F0EEFF",
  onClickBar,
  isSelected = false,
}) {
  // 🆕 Grosor del borde punteado (sincronizado en ambos lugares)

  // 🆕 Factores de compensación para alineación visual de la barra azul
  // Primera categoría (100%): resta borderWidth * 5.5 = 11px
  // Otras categorías: resta borderWidth * 3.5 = 7px
  const FIRST_CATEGORY_REDUCTION_FACTOR = 5.5;
  const OTHER_CATEGORIES_REDUCTION_FACTOR = 3.5;

  // Determinar si tiene presupuesto
  const hasBudget = budget && budget > 0;

  // 🆕 Determinar si la categoría está deshabilitada (sin gasto)
  const isDisabled = spent === 0;

  // 🆕 Calcular porcentaje del presupuesto (vs presupuesto)
  const budgetPercentage = hasBudget ? (spent / budget) * 100 : 0;

  // 🆕 Determinar si ya se alcanzó el 50% del presupuesto
  const isOverHalfBudget = budgetPercentage > 50;

  // 🆕 Determinar si mostrar borde punteado
  // Solo mostrar si: tiene presupuesto Y está sobre 50%
  const showDashedBorder = hasBudget && isOverHalfBudget;

  // 🆕 Determinar color del % según pilar
  // Si es Ahorro: verde si se pasa, gris si no
  // Si no es Ahorro: rojo si se pasa, gris si no
  const isAhorrosPillar = pillarId === "ahorro";
  const getPercentageColor = () =>
    getOverBudgetColor({
      isOver: showDashedBorder && percentage > 100,
      isAhorros: isAhorrosPillar,
      fallback: textColor,
    });

  // 🆕 Calcular porcentajes relativos a maxSpent (para proporcionalidad)
  // 🆕 Determinar indicador de porcentaje a mostrar
  let percentage = 0;

  if (hasBudget && isOverHalfBudget) {
    // Modo presupuesto: mostrar progreso vs presupuesto (para el indicador)
    percentage = budgetPercentage;  // Puede ser > 100%
  } else {
    // Modo sin presupuesto: mostrar progreso relativo a maxSpent
    percentage = (spent / maxSpent) * 100;
  }

  return (
    <div style={{ width: "100%" }}>
      <ProgressBar
        spent={spent}
        budget={budget}
        maxSpent={maxSpent}
        pillarColor={pillarColor}
        isDark={isDark}
        isSelected={isSelected}
        onClickBar={onClickBar}
        categoryName={categoryName}
        amountText={fmt(spent)}
        percentageText={showDashedBorder ? `${Math.round(percentage)}%` : null}
        alwaysShowDashedBorder={false}
      />
    </div>
  );
}
