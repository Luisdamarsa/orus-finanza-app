import { MONTHS_SHORT } from "../constants";
import { userStorage } from "./userStorage";

/**
 * Formatea un número a moneda según la preferencia del usuario
 * @param {number} n - Número a formatear
 * @returns {string} Número formateado con símbolo de moneda ("$X.XXX.XXX", "€X.XXX.XXX", etc.)
 */
export const fmt = (n) => {
  const currency = userStorage.getCurrency();
  const symbols = {
    COP: "$",
    USD: "$",
    EUR: "€",
  };
  const symbol = symbols[currency] || "$";
  return symbol + Math.abs(n).toLocaleString("es-CO");
};

/**
 * Formatea una fecha ISO a formato "Mié 15 Mar"
 * @param {string} dateStr - Fecha en formato "YYYY-MM-DD"
 * @returns {string} Fecha formateada
 */
export const fmtDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dayNames = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const date = new Date(y, m - 1, d);
  return `${dayNames[date.getDay()]} ${d} ${MONTHS_SHORT[m - 1]}`;
};

/**
 * Obtiene la etiqueta del período (mes, año o "Todo")
 * @param {object} period - Objeto con year y month
 * @returns {string} Etiqueta del período
 */
export const getPeriodLabel = (period) => {
  if (!period) return "Todo";
  // ✅ Si month es null, mostrar el año
  if (period.month === null) return period.year.toString();
  // Si month existe, mostrar el mes
  return MONTHS_SHORT[period.month - 1];
};

/**
 * Agrupa transacciones por fecha
 * @param {array} txns - Array de transacciones
 * @returns {array} Transacciones agrupadas por fecha
 */
export const groupByDate = (txns) => {
  const map = {};
  txns.forEach(tx => {
    (map[tx.date] = map[tx.date] || []).push(tx);
  });
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({
      date,
      label: fmtDate(date),
      items: items.sort((a, b) => b.time.localeCompare(a.time)),
      // 🆕 Calcular suma total del día
      dayTotal: items.reduce((sum, tx) => sum + tx.amount, 0),
    }));
};
