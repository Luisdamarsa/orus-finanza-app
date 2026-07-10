/**
 * dashboardCalculations.js
 *
 * Centraliza TODOS los cálculos del Dashboard (Estado 1)
 * Una única fuente de verdad para porcentajes, saldos y segmentos
 *
 * Entrada: transacciones filtradas, balance, pilares
 * Salida: todos los valores necesarios para el dashboard
 */

/**
 * Calcula TODOS los valores del dashboard de una sola vez
 * @param {array} filteredByPeriod - Transacciones del período seleccionado
 * @param {array} PILLARS - Array de pilares
 * @param {number} SALDO_COLOR - Color para el saldo en el donut
 * @param {boolean} isDark - Tema oscuro
 * @param {boolean} showIncomes - Si debe mostrar saldo (toggle de Settings)
 * @returns {object} Objeto con todos los cálculos
 */
export const calculateDashboard = (filteredByPeriod, PILLARS, SALDO_COLOR, isDark, showIncomes = false) => {
  // ============================================================
  // PASO 1: CALCULAR TOTALES BASE (de transacciones)
  // ============================================================

  const totalSpent = filteredByPeriod
    .filter(tx => tx.amount < 0 && tx.pillar !== "ingreso")
    .reduce((s, tx) => s + Math.abs(tx.amount), 0);

  const incomingTotal = filteredByPeriod
    .filter(tx => tx.amount > 0 || tx.pillar === "ingreso")
    .reduce((s, tx) => s + (tx.amount > 0 ? tx.amount : 0), 0);

  // Gasto por pilar
  const pillarSpends = {};
  PILLARS.forEach(p => pillarSpends[p.id] = 0);
  filteredByPeriod
    .filter(tx => tx.amount < 0 && tx.pillar !== "ingreso")
    .forEach(tx => {
      if (pillarSpends[tx.pillar] !== undefined) {
        pillarSpends[tx.pillar] += Math.abs(tx.amount);
      }
    });

  // ============================================================
  // PASO 2: CALCULAR SALDO Y DONUT TOTAL
  // ============================================================

  // 🆕 LÓGICA SIMPLIFICADA: Saldo mes = Ingresos - Gastos (sin acumular)
  // 🆕 Solo mostrar saldo si showIncomes === true
  const saldo = showIncomes ? (incomingTotal - totalSpent) : 0;
  const saldoForDonut = saldo > 0 ? saldo : 0;
  const donutTotal = totalSpent + saldoForDonut;
  const hasSaldo = saldo > 0;

  // ============================================================
  // PASO 3: CALCULAR PORCENTAJES (La lógica CRÍTICA)
  // ============================================================

  // Base común: siempre usar donutTotal
  // Esto aplica a ESTADO 1 y ESTADO 2
  const rawPcts = PILLARS.map(p =>
    donutTotal > 0 ? (pillarSpends[p.id] / donutTotal) * 100 : 0
  );

  const saldoPct = donutTotal > 0 ? (saldoForDonut / donutTotal) * 100 : 0;
  const allRawPcts = [...rawPcts, saldoPct];

  // Aplicar Largest Remainder Method para que sumen exactamente 100%
  const allFloorPcts = allRawPcts.map(Math.floor);
  const toAdd = 100 - allFloorPcts.reduce((a, b) => a + b, 0);
  const allByRem = allRawPcts.map((v, i) => ({ i, rem: v - Math.floor(v) })).sort((a, b) => b.rem - a.rem);

  const allChipPcts = [...allFloorPcts];
  for (let k = 0; k < toAdd && k < allByRem.length; k++) {
    allChipPcts[allByRem[k].i]++;
  }

  const chipPcts = allChipPcts.slice(0, PILLARS.length);
  const saldoPctFinal = allChipPcts[PILLARS.length];

  // ============================================================
  // PASO 4: CALCULAR SEGMENTOS DEL DONUT
  // ============================================================

  let segments = donutTotal === 0
    ? [{ id: "_empty", label: "Sin datos", color: isDark ? "#2D2D3A" : "#D5D3E8", pct: 100 }]
    : PILLARS.filter(p => pillarSpends[p.id] > 0).map(p => ({
        id: p.id,
        label: p.label,
        color: p.color,
        pct: (pillarSpends[p.id] / donutTotal) * 100
      }));

  if (saldoForDonut > 0 && donutTotal > 0) {
    segments.push({
      id: "saldo",
      label: "Tu saldo",
      color: SALDO_COLOR,
      pct: (saldoForDonut / donutTotal) * 100
    });
  }

  // ============================================================
  // RETORNAR TODOS LOS VALORES CALCULADOS
  // ============================================================

  return {
    // Base
    totalSpent,
    incomingTotal,
    pillarSpends,

    // Saldo
    saldo,
    saldoForDonut,
    donutTotal,
    hasSaldo,

    // Porcentajes (para tarjetas sin presupuesto)
    chipPcts,        // [25%, 25%, 25%, 25%] para pilares
    saldoPctFinal,   // [25%] para saldo

    // Donut
    segments,        // Segmentos del gráfico donut
  };
};

/**
 * Calcula el porcentaje de un pilar para ESTADO 1 (tarjetas)
 *
 * Lógica:
 * - Si tiene presupuesto: gasto / presupuesto * 100
 * - Si no tiene presupuesto: usa chipPct (porcentaje del donutTotal)
 *
 * @param {number} pillarSpend - Gasto del pilar
 * @param {number} pillarBudget - Presupuesto del pilar (null si no tiene)
 * @param {number} chipPct - Porcentaje del chipPcts (si no tiene presupuesto)
 * @returns {number} Porcentaje a mostrar
 */
export const getPillarPercentage = (pillarSpend, pillarBudget, chipPct) => {
  if (pillarBudget != null && pillarBudget > 0) {
    // Tiene presupuesto: mostrar % de presupuesto usado
    return Math.round((pillarSpend / pillarBudget) * 100);
  } else {
    // No tiene presupuesto: mostrar % del total (chipPct)
    return chipPct;
  }
};

/**
 * Calcula el porcentaje de un pilar para ESTADO 2 (tags)
 *
 * Lógica IGUAL al Estado 1:
 * - Si tiene presupuesto: gasto / presupuesto * 100
 * - Si no tiene presupuesto: usa chipPct (porcentaje del donutTotal)
 *
 * @param {number} pillarSpend - Gasto del pilar
 * @param {number} pillarBudget - Presupuesto del pilar (null si no tiene)
 * @param {number} chipPct - Porcentaje del chipPcts (si no tiene presupuesto)
 * @returns {number} Porcentaje a mostrar
 */
export const getTagPercentage = (pillarSpend, pillarBudget, chipPct) => {
  // EXACTAMENTE igual a getPillarPercentage
  // Estado 1 y Estado 2 usan los MISMOS números
  return getPillarPercentage(pillarSpend, pillarBudget, chipPct);
};
