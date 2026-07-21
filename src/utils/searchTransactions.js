/**
 * searchTransactions.js — Filtra transacciones por texto libre.
 * Busca en: descripción, tipo (gasto/ingreso), nombre de categoría y nombre/id de pilar.
 */
import { PILLARS } from "../constants";
import { getCategoryName } from "./categoryUtils";

// Normaliza: minúsculas + sin tildes, para comparar sin importar acentos
function norm(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const PILLAR_LABEL = PILLARS.reduce((acc, p) => { acc[p.id] = p.label; return acc; }, {});

/**
 * @param {Array} transactions
 * @param {string} query
 * @returns {Array} transacciones que coinciden con la búsqueda
 */
export function searchTransactions(transactions, query) {
  const q = norm(query).trim();
  if (!q) return transactions;

  return (transactions || []).filter((tx) => {
    const isIncome = tx.amount > 0;
    const tipo = isIncome ? "ingreso ingresos" : "gasto gastos egreso egresos";
    const catName = getCategoryName(tx.category) || "";
    const pillarLabel = PILLAR_LABEL[tx.pillar] || tx.pillar || "";

    const haystack = norm([
      tx.description,
      tx.method,
      tipo,
      catName,
      tx.pillar,      // id del pilar (ej. "fijos")
      pillarLabel,    // etiqueta del pilar (ej. "Fijos")
    ].join(" "));

    return haystack.includes(q);
  });
}
