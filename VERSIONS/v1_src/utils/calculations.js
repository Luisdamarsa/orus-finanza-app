/**
 * Calcula el saldo efectivo para un período específico
 * @param {object} balance - Objeto de balance con year, month, value
 * @param {object} selectedPeriod - Período seleccionado con year, month
 * @returns {number|null} Saldo si coincide el período, null en caso contrario
 */
export const getEffectiveBalance = (balance, selectedPeriod) => {
  if (!balance || !selectedPeriod) return null;
  if (balance.year === selectedPeriod.year && balance.month === selectedPeriod.month) {
    return balance.value;
  }
  return null;
};

/**
 * Calcula el saldo actual basado en el balance inicial, ingresos y gastos
 * @param {number} effectiveBalance - Saldo efectivo del período
 * @param {number} totalSpent - Total gastado
 * @param {number} incomingTotal - Total de ingresos
 * @returns {number|null} Saldo actual o null si no hay balance
 */
export const calculateSaldo = (effectiveBalance, totalSpent, incomingTotal) => {
  if (effectiveBalance == null) return null;
  return effectiveBalance - totalSpent + incomingTotal;
};

/**
 * Calcula el total disponible para el donut (saldo + gastos)
 * @param {number} saldo - Saldo actual
 * @returns {number} Total disponible (saldo si es positivo, 0 si es null)
 */
export const calculateSaldoForDonut = (saldo) => {
  return saldo != null && saldo > 0 ? saldo : 0;
};

/**
 * Calcula el total del donut (gastos + saldo disponible)
 * @param {number} totalSpent - Total gastado
 * @param {number} saldoForDonut - Saldo para el donut
 * @returns {number} Total del donut
 */
export const calculateDonutTotal = (totalSpent, saldoForDonut) => {
  return totalSpent + saldoForDonut;
};

/**
 * Calcula el porcentaje de saldo respecto al total disponible
 * @param {number} saldo - Saldo actual
 * @param {number} donutTotal - Total disponible
 * @returns {number|string} Porcentaje o "0" si total es 0
 */
export const calculateSaldoPercentage = (saldo, donutTotal) => {
  if (donutTotal === 0) return 0;
  return Math.round((saldo / donutTotal) * 100);
};

/**
 * Determina si un balance debería cargarse del localStorage
 * (solo si es de un mes anterior, no el mes actual)
 * @param {object} savedBalance - Balance guardado
 * @param {Date} now - Fecha actual
 * @returns {boolean} true si debería cargarse
 */
export const shouldLoadBalance = (savedBalance, now = new Date()) => {
  if (!savedBalance || !savedBalance.month || !savedBalance.year) {
    return false;
  }

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const isCurrentMonth = savedBalance.month === currentMonth && savedBalance.year === currentYear;
  const isPastMonth = savedBalance.year < currentYear ||
    (savedBalance.year === currentYear && savedBalance.month < currentMonth);

  return isPastMonth;
};

/**
 * Agrega información de mes/año a un balance para persisten en localStorage
 * @param {object} balance - Balance a persistir
 * @returns {object} Balance con mes y año agregados
 */
export const addDateToBalance = (balance, date = new Date()) => {
  return {
    ...balance,
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

/**
 * 🆕 Encuentra el último mes con datos en las transacciones
 * @param {array} transactions - Array de transacciones
 * @returns {object} { year, month } del último mes con datos, o null si está vacío
 */
export const getLastMonthWithData = (transactions) => {
  if (!transactions || transactions.length === 0) return null;

  // Extraer todos los meses únicos y ordenarlos
  const months = new Set();
  transactions.forEach(tx => {
    const [year, month] = tx.date.split("-").map(Number);
    months.add(JSON.stringify({ year, month }));
  });

  if (months.size === 0) return null;

  // Convertir a array y ordenar por año/mes descendente
  const sortedMonths = Array.from(months)
    .map(m => JSON.parse(m))
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

  return sortedMonths[0]; // Primer elemento = último mes
};
