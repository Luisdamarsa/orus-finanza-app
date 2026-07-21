/**
 * ProgressBar.jsx
 *
 * Componente reutilizable de barra de progreso
 * Renderiza las barras (azul de relleno + borde punteado de presupuesto)
 * Puede incluir el nombre de la categoría opcionalmente
 * Incluye toda la lógica de cálculos y alineación
 *
 * Props:
 *   spent - Monto gastado
 *   budget - Presupuesto (opcional)
 *   maxSpent - Máximo gasto entre categorías (para proporcionalidad)
 *   pillarColor - Color de la barra de relleno
 *   isDark - Tema oscuro
 *   isSelected - Si está seleccionada (afecta opacidad)
 *   onClickBar - Callback cuando se hace click
 *   categoryName - Nombre de la categoría a mostrar (opcional)
 *   icon - Ícono a mostrar junto al nombre (opcional, puede ser emoji o componente)
 *   alwaysShowDashedBorder - Si true, muestra borde punteado siempre (para pilares)
 */
export default function ProgressBar({
  spent,
  budget = null,
  maxSpent = 1,
  pillarColor = "#22C55E",
  isDark = true,
  isSelected = false,
  onClickBar,
  categoryName = null,
  icon = null,
  alwaysShowDashedBorder = false,
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
  // Solo se ve/comporta clickeable si recibe un onClickBar real
  const clickable = !isDisabled && typeof onClickBar === "function";

  // 🆕 Calcular porcentaje del presupuesto (vs presupuesto)
  const budgetPercentage = hasBudget ? (spent / budget) * 100 : 0;

  // 🆕 Determinar si ya se alcanzó el 50% del presupuesto
  const isOverHalfBudget = budgetPercentage > 50;

  // 🆕 Determinar si mostrar borde punteado
  // Si alwaysShowDashedBorder: mostrar si tiene presupuesto (sin límite de %)
  // Si no: mostrar si tiene presupuesto Y está sobre 50%
  const showDashedBorder = alwaysShowDashedBorder ? hasBudget : (hasBudget && isOverHalfBudget);

  // 🆕 Calcular porcentajes relativos a maxSpent (para proporcionalidad)
  const spentPercentageOfMax = (spent / maxSpent) * 100;
  const budgetPercentageOfMax = hasBudget ? (budget / maxSpent) * 100 : 0;

  // 🆕 Determinar indicador de porcentaje a mostrar
  let percentage = 0;
  let barFillPercentage = 0;
  let budgetLinePercentage = 0; // Hasta dónde llega la línea punteada

  if (hasBudget && (alwaysShowDashedBorder || isOverHalfBudget)) {
    // Modo presupuesto: mostrar progreso vs presupuesto (para el indicador)
    percentage = budgetPercentage; // Puede ser > 100%

    // 🆕 Si sobrepasó presupuesto: barra crece libremente
    // Si está dentro del presupuesto: barra limitada al presupuesto
    if (percentage > 100) {
      barFillPercentage = spentPercentageOfMax; // Crece proporcional al gasto real
    } else {
      // Relleno proporcional al presupuesto: gasto/presupuesto respecto a la punteada
      barFillPercentage = (budgetPercentage / 100) * Math.min(budgetPercentageOfMax, 100);
    }

    // Línea punteada: hasta el presupuesto relativo a maxSpent
    budgetLinePercentage = budgetPercentageOfMax;
  } else {
    // Modo sin presupuesto: mostrar progreso relativo a maxSpent
    percentage = (spent / maxSpent) * 100;
    barFillPercentage = percentage;
    budgetLinePercentage = 0; // Sin línea punteada
  }

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        height: 32,
        maxWidth: "calc(100% - 10px)",
      }}
    >
      {/* Barra de Progreso - Contenedor clickeable */}
      <div
        onClick={clickable ? onClickBar : undefined}
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
          cursor: isDisabled ? "not-allowed" : (clickable ? "pointer" : "default"),
          transition: "all 0.2s",
          // Track (parte sin llenar): noche negro; día SIN fondo (el usuario pidió quitar la "sombra gris").
          background: isDark ? "#000000" : "transparent",
          opacity: isDisabled ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (clickable) e.currentTarget.style.opacity = "0.8";
        }}
        onMouseLeave={(e) => {
          if (clickable) e.currentTarget.style.opacity = "1";
        }}
      >
        {/* Barra de relleno - Siempre mostrar */}
        {/* 🆕 Cuando showDashedBorder: resta diferente si es primera categoría o no */}
        <div
          style={{
            position: "absolute",
            left: showDashedBorder ? "1px" : 0,
            top: showDashedBorder ? "1px" : 0,
            height: showDashedBorder ? "calc(100% - 2px)" : "100%",
            width: showDashedBorder
              ? barFillPercentage > 100
                ? `calc(${barFillPercentage}% - ${borderWidth * 1.5}px)`  // Sobrepasa: factor menor (3px)
                : barFillPercentage === 100
                ? `calc(${barFillPercentage}% - ${borderWidth * FIRST_CATEGORY_REDUCTION_FACTOR}px)`
                : `calc(${barFillPercentage}% - ${borderWidth * OTHER_CATEGORIES_REDUCTION_FACTOR}px)`
              : `${barFillPercentage}%`,
            background: pillarColor,
            borderRadius: 8,
            opacity: isSelected ? 1 : 0.6,
            transition: "width 0.2s, opacity 0.2s",
          }}
        />

        {/* 🆕 Nombre de la categoría - Si se proporciona */}
        {categoryName && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              // Sobre el relleno (color saturado) → blanco. Deshabilitada (todo track claro) → oscuro.
              color: isDark ? "#F0EEFF" : (isDisabled ? "#1A1830" : "#FFFFFF"),
              position: "relative",
              zIndex: 2,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {icon && <span>{icon}</span>}
            {categoryName}
          </span>
        )}
      </div>

      {/* 🆕 Borde punteado blanco (solo cuando showDashedBorder) */}
      {/* Borde llega hasta 100% del contenedor (que ya tiene maxWidth: 100% - 10px) */}
      {/* borderWidth está sincronizado con la barra azul para compensar visualmente */}
      {/* 🆕 Resta borderWidth * 2 para que el border no se sobrepase del contenedor */}
      {showDashedBorder && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `calc(${Math.min(budgetLinePercentage, 100)}% - ${borderWidth * 2}px)`,
            height: 28,
            // Línea punteada del presupuesto: blanca en noche, oscura en día (si no, invisible en claro).
            border: `${borderWidth}px dashed ${isDark ? "#FFFFFF" : "#1A1830"}`,
            borderRadius: 8,
            pointerEvents: "none",
            zIndex: 3,
            transition: "width 0.2s",
          }}
        />
      )}
    </div>
  );
}
