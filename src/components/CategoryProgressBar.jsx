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
  // Determinar si tiene presupuesto
  const hasBudget = budget && budget > 0;

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
    // Relleno: relativo a maxSpent (proporcional)
    barFillPercentage = spentPercentageOfMax;
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
        gap: 12,
      }}
    >
      {/* Contenedor de la Barra (para posicionar el borde punteado) */}
      <div
        style={{
          flex: 1,
          position: "relative",
          height: 32,
        }}
      >
        {/* Barra de Progreso */}
        <div
          onClick={onClickBar}
          style={{
            width: "100%",
            height: 32,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.2s",
            background: isDark ? "#000000" : "#1A1830",
            backgroundColor: isSelected
              ? pillarColor + "22"
              : isDark
                ? "#000000"
                : "#1A1830",
          }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        {/* Barra de relleno - Siempre mostrar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${barFillPercentage}%`,
            background: showDashedBorder && percentage > 100 ? "#EF4444" : pillarColor,
            borderRadius: 6,
            opacity: 0.6,
            transition: "width 0.2s",
          }}
        />

          {/* Nombre de la categoría */}
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? "#F0EEFF" : "#FFFFFF",
              position: "relative",
              zIndex: 2,
            }}
          >
            {categoryName}
          </span>
        </div>

        {/* 🆕 Borde punteado blanco (solo cuando showDashedBorder) */}
        {showDashedBorder && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${budgetLinePercentage}%`,
              height: 32,
              border: `2px dashed #FFFFFF`,
              borderRadius: 8,
              boxSizing: "border-box",
              pointerEvents: "none",
              zIndex: 3,
              transition: "width 0.2s",
            }}
          />
        )}
      </div>

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
