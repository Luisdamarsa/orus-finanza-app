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
 *   amountText - Monto formateado a mostrar dentro
 *   percentageText - Porcentaje formateado a mostrar dentro
 */
import { useRef, useEffect } from 'react';

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
  amountText = null,
  percentageText = null,
  barHeight = 52,
  isPillar = false,
}) {
  const containerRef = useRef(null);
  // 🆕 Grosor del borde punteado (sincronizado en ambos lugares)
  const borderWidth = 2; // px

  // 🆕 Factores de compensación para alineación visual de la barra azul
  // Primera categoría (100%): resta borderWidth * 6 = 12px
  // Otras categorías: resta borderWidth * 4 = 8px
  const FIRST_CATEGORY_REDUCTION_FACTOR = 6;
  const OTHER_CATEGORIES_REDUCTION_FACTOR = 4;

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

  // 🆕 Medir ancho real del contenedor y calcular ancho exacto de la barra en px
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const barWidthPx = (barFillPercentage / 100) * containerWidth - (showDashedBorder ? 4 : 0);
      console.log(`[ProgressBar] ${categoryName}: containerWidth=${containerWidth.toFixed(1)}px, barFillPercentage=${barFillPercentage.toFixed(1)}%, barWidthPx=${barWidthPx.toFixed(1)}px, showDashedBorder=${showDashedBorder}`);
    }
  }, [categoryName, barFillPercentage, showDashedBorder]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        position: "relative",
        height: showDashedBorder ? barHeight - 4 : barHeight,
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Barra de Progreso - Contenedor clickeable */}
      <div
        onClick={clickable ? onClickBar : undefined}
        style={{
          flex: 1,
          height: "100%",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          cursor: isDisabled ? "not-allowed" : (clickable ? "pointer" : "default"),
          transition: "all 0.2s",
          // Track (parte sin llenar): noche negro; día SIN fondo
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
        {/* Barra de relleno - Solo si hay presupuesto (para pilares) o siempre (para categorías) */}
        {(!isPillar || hasBudget) && (
          <div
            style={{
              position: "absolute",
              left: showDashedBorder ? "1px" : 0,
              top: showDashedBorder ? "1px" : 0,
              height: showDashedBorder ? "calc(100% - 4px)" : "100%",
              width: `${barFillPercentage}%`,
              background: pillarColor,
              borderRadius: 8,
              opacity: isSelected ? 1 : 0.6,
              transition: "width 0.2s, opacity 0.2s",
              zIndex: 2,
              boxSizing: "border-box",
              maxWidth: "100%",
              overflow: "hidden",
            }}
          />
        )}

        {/* 🆕 Nombre de la categoría - Si se proporciona */}
        {categoryName && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              // Día: oscuro siempre (como la punteada) — se lee sobre el relleno y sobre el fondo claro
              // donde el relleno no llega. Noche: claro como antes.
              color: isDark ? "#F0EEFF" : "#1A1830",
              position: "relative",
              zIndex: 2,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              paddingLeft: 10,
            }}
          >
            {icon && <span>{icon}</span>}
            {categoryName}
          </span>
        )}

        {/* 🆕 Contenedor Monto + Porcentaje (juntos en dos líneas) */}
        {amountText && (
          <div
            style={{
              marginLeft: "auto",
              paddingRight: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#ffffff",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {amountText}
            </span>
            {percentageText && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#8B87A3",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                {percentageText}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 🆕 Borde punteado (solo cuando showDashedBorder) */}
      {/* Llega exactamente al borde útil de la página */}
      {showDashedBorder && (
        <div
          style={{
            position: "absolute",
            top: 1,
            left: 0,
            width: `${Math.min(budgetLinePercentage, 100)}%`,
            height: "calc(100% - 4px)",
            maxWidth: "calc(100% - 2px)",
            // Línea punteada del presupuesto: nueva color rgba(255,255,255,0.85)
            border: `${borderWidth}px dashed rgba(255,255,255,0.85)`,
            borderRadius: 8,
            pointerEvents: "none",
            zIndex: 1,
            transition: "width 0.2s",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
}
