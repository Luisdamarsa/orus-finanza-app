/**
 * PillarProgressBar.jsx
 *
 * Barra de progreso para pilares
 * Muestra:
 * - Barra sólida con fondo del color del pilar
 * - Progreso gastado vs presupuesto
 * - Indicador de presupuesto superado
 *
 * Props:
 *   pillarId - ID único del pilar
 *   pillarName - Nombre para mostrar
 *   spent - Monto gastado
 *   budget - Presupuesto (opcional)
 *   percentage - Porcentaje a mostrar (calculado fuera o aquí)
 *   pillarColor - Color del pilar
 *   pillarDarkColor - Color oscuro del pilar
 *   isDark - Tema oscuro
 *   isSelected - Si está seleccionada
 */
export default function PillarProgressBar({
  pillarId,
  pillarName,
  spent,
  budget = null,
  percentage = 0,
  pillarColor = "#22C55E",
  pillarDarkColor = "#16A34A",
  isDark = true,
  isSelected = false,
}) {
  // Detectar si pasó presupuesto
  const isOverBudget = budget && percentage > 100;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Barra de Progreso */}
      <div
        style={{
          flex: 1,
          height: 32,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.2s",
          // Background según estado
          background: isOverBudget
            ? isDark
              ? "#2a1111"
              : "#FEF2F2"
            : isSelected
              ? isDark
                ? pillarColor + "33"
                : pillarColor + "22"
              : isDark
                ? "#1E1E2E"
                : "#FFFFFF",
          border: `1.5px solid ${isSelected ? pillarColor + "88" : isOverBudget ? "#EF444488" : isDark ? "#2D2D3A" : "#E5E3F5"}`,
        }}
      >
        {/* Barra de relleno */}
        {budget && budget > 0 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${Math.min(percentage, 100)}%`,
              background: isOverBudget ? "#FCA5A5" : pillarColor,
              borderRadius: 8,
            }}
          />
        )}

        {/* Nombre del pilar */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: isDark ? "#F0EEFF" : "#1A1830",
            position: "relative",
            zIndex: 2,
          }}
        >
          {pillarName}
        </span>
      </div>

      {/* Info: gasto y porcentaje */}
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
        {budget && budget > 0 && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: isOverBudget ? "#EF4444" : pillarColor,
            }}
          >
            {isOverBudget ? `+${Math.ceil(percentage - 100)}%` : `${Math.round(percentage)}%`}
          </span>
        )}
      </div>
    </div>
  );
}
