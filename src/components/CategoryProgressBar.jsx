import ProgressBar from "./ProgressBar";

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
  categoryId,
  categoryName,
  spent,
  budget = null,
  maxSpent = 1,
  pillarColor = "#22C55E",
  isDark = true,
  onClickBar,
  isSelected = false,
}) {
  // 🆕 Grosor del borde punteado (sincronizado en ambos lugares)
  const borderWidth = 2; // px

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

  // 🆕 Calcular porcentajes relativos a maxSpent (para proporcionalidad)
  const spentPercentageOfMax = (spent / maxSpent) * 100;
  const budgetPercentageOfMax = hasBudget ? (budget / maxSpent) * 100 : 0;

  // 🆕 Determinar indicador de porcentaje a mostrar
  let percentage = 0;
  let barFillPercentage = 0;
  let budgetLinePercentage = 0;  // Hasta dónde llega la línea punteada

  if (hasBudget && isOverHalfBudget) {
    // Modo presupuesto: mostrar progreso vs presupuesto (para el indicador)
    percentage = budgetPercentage;  // Puede ser > 100%

    // 🆕 Si sobrepasó presupuesto: barra crece libremente
    // Si está dentro del presupuesto: barra limitada al presupuesto
    if (percentage > 100) {
      barFillPercentage = spentPercentageOfMax; // Crece proporcional al gasto real
    } else {
      barFillPercentage = Math.min(spentPercentageOfMax, budgetPercentageOfMax);
    }

    // Línea punteada: hasta el presupuesto relativo a maxSpent
    budgetLinePercentage = budgetPercentageOfMax;
  } else {
    // Modo sin presupuesto: mostrar progreso relativo a maxSpent
    percentage = (spent / maxSpent) * 100;
    barFillPercentage = percentage;
    budgetLinePercentage = 0;  // Sin línea punteada
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* 🆕 Componente ProgressBar - Renderiza las barras (azul + punteada) + nombre */}
      <ProgressBar
        spent={spent}
        budget={budget}
        maxSpent={maxSpent}
        pillarColor={pillarColor}
        isDark={isDark}
        isSelected={isSelected}
        onClickBar={onClickBar}
        categoryName={categoryName}
      />

      {/* Info: gasto y presupuesto */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 2,
          minWidth: 80,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          ${spent.toLocaleString("es-CO")}
        </span>
        {/* Mostrar porcentaje solo cuando está en modo presupuesto (>50%) */}
        {showDashedBorder && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: percentage > 100 ? "#EF4444" : pillarColor,
            }}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
}
