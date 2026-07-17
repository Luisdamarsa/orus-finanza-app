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

/**
 * 🆕 Calcula saldos acumulativos para TODOS los meses basado en transacciones
 *
 * Lógica:
 * - Enero 2025 (o primer mes) inicia con saldo = 0
 * - Cada mes: Saldo anterior + Ingresos - Gastos = Nuevo saldo
 * - Si saldo <= 0, ese mes NO tiene saldo (no se muestra tarjeta)
 * - Si un mes sin transacciones tiene saldo > 0 del mes anterior, lo mantiene
 *
 * @param {array} transactions - Array de transacciones (debe tener field 'date': "YYYY-MM-DD")
 * @returns {array} Array de balances { year, month, value } calculados acumulativamente
 */
/**
 * Busca el balance de un mes específico en el array de balances calculados
 * @param {array} balances - Array de balances { year, month, value }
 * @param {object} selectedPeriod - Período seleccionado { year, month }
 * @returns {object|null} Balance si existe, null si no
 */
export const findBalanceByPeriod = (balances, selectedPeriod) => {
  if (!balances || !Array.isArray(balances) || !selectedPeriod) return null;

  return balances.find(
    balance => balance.year === selectedPeriod.year && balance.month === selectedPeriod.month
  ) || null;
};

/**
 * 🆕 Calcula saldos acumulativos para TODOS los meses basado en transacciones
 *
 * Lógica:
 * - Enero 2025 (o primer mes) inicia con saldo = 0
 * - Cada mes: Saldo anterior + Ingresos - Gastos = Nuevo saldo
 * - Si saldo <= 0, ese mes NO tiene saldo (no se muestra tarjeta)
 * - Si un mes sin transacciones tiene saldo > 0 del mes anterior, lo mantiene
 *
 * @param {array} transactions - Array de transacciones (debe tener field 'date': "YYYY-MM-DD")
 * @returns {array} Array de balances { year, month, value } calculados acumulativamente
 */
export const calculateAccumulativeBalances = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  // 1. Extraer todos los meses únicos y ordenarlos ascendente (primero a último)
  const months = new Set();
  transactions.forEach(tx => {
    const [year, month] = tx.date.split("-").map(Number);
    months.add(JSON.stringify({ year, month }));
  });

  const sortedMonths = Array.from(months)
    .map(m => JSON.parse(m))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

  if (sortedMonths.length === 0) return [];

  // 2. Calcular ingresos y gastos por mes
  const monthData = {};
  sortedMonths.forEach(({ year, month }) => {
    const key = `${year}-${month}`;
    monthData[key] = { ingresos: 0, gastos: 0 };
  });

  transactions.forEach(tx => {
    const [year, month] = tx.date.split("-").map(Number);
    const key = `${year}-${month}`;

    if (monthData[key]) {
      if (tx.amount > 0) {
        monthData[key].ingresos += tx.amount;
      } else if (tx.amount < 0 && tx.pillar !== "ingreso") {
        monthData[key].gastos += Math.abs(tx.amount);
      }
    }
  });

  // 3. Calcular saldos acumulativos
  const balances = [];
  let previousSaldo = 0; // Enero 2025 comienza en 0

  console.log("🔍 Calculando saldos acumulativos mes a mes:");
  sortedMonths.forEach(({ year, month }) => {
    const key = `${year}-${month}`;
    const { ingresos, gastos } = monthData[key];

    // Nuevo saldo = saldo anterior + ingresos - gastos
    const nuevoSaldo = previousSaldo + ingresos - gastos;

    console.log(`  ${year}-${String(month).padStart(2, '0')}: Saldo anterior=${previousSaldo} + Ingresos=${ingresos} - Gastos=${gastos} = ${nuevoSaldo}`);

    // Solo agregar al array si saldo > 0
    if (nuevoSaldo > 0) {
      balances.push({ year, month, value: nuevoSaldo });
      previousSaldo = nuevoSaldo;
      console.log(`    ✅ Agregado al array`);
    } else {
      // Si saldo <= 0, no agregamos pero mantenemos previousSaldo en 0 para próximos meses
      previousSaldo = 0;
      console.log(`    ❌ NO agregado (saldo <= 0), reset a 0`);
    }
  });

  console.log("📊 Balances finales:", balances);
  return balances;
};
