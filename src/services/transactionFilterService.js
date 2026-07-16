/**
 * transactionFilterService.js
 *
 * Fuente única de verdad para filtrar transacciones por período, pilar y tipo
 * (gastado / ingresos). Antes esta lógica estaba duplicada en App.jsx
 * (getFilteredTransactionsForDashboard) y en el componente Movimientos.
 *
 * FASE 1 de refactorización — elimina duplicación de filtrado.
 */

/**
 * ¿La transacción es un ingreso?
 * @param {{ amount: number, pillar: string }} tx
 * @returns {boolean}
 */
export function isIngreso(tx) {
  return tx.amount > 0 || tx.pillar === "ingreso";
}

/**
 * ¿La transacción cae dentro del período seleccionado?
 * Si selectedPeriod es null/undefined → true (mostrar todo).
 * Si selectedPeriod.month es null → todo el año.
 * @param {{ date: string }} tx  fecha en formato "YYYY-MM-..."
 * @param {{ year: number, month: number|null }|null} selectedPeriod
 * @returns {boolean}
 */
export function matchesPeriod(tx, selectedPeriod) {
  if (!selectedPeriod) return true;
  const [txYear, txMonth] = tx.date.split("-").map(Number);
  if (selectedPeriod.month === null) {
    return txYear === selectedPeriod.year;
  }
  return txYear === selectedPeriod.year && txMonth === selectedPeriod.month;
}

/**
 * Filtra transacciones por período, pilar y tipo.
 * @param {Array} transactions
 * @param {Object} filters
 * @param {{ year: number, month: number|null }|null} [filters.selectedPeriod]
 * @param {string|null} [filters.filteredPillar]
 * @param {"gastado"|"ingresos"|null} [filters.filterType]
 * @returns {Array} transacciones filtradas
 */
export function filterTransactions(
  transactions,
  { selectedPeriod = null, filteredPillar = null, filterType = null } = {}
) {
  return transactions.filter(tx => {
    if (!matchesPeriod(tx, selectedPeriod)) return false;
    if (filteredPillar && tx.pillar !== filteredPillar) return false;

    if (filterType === "gastado") return !isIngreso(tx);
    if (filterType === "ingresos") return isIngreso(tx);
    return true;
  });
}
