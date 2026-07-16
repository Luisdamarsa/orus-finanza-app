import { DUMMY_TRANSACTIONS } from "../constants";

/**
 * transactionService.js - Capa de datos de transacciones.
 *
 * HOY: transformaciones puras sobre el arreglo + persistencia en localStorage.
 * MAÑANA: este es el único archivo que cambia — cada función se vuelve una
 * llamada async a la API/Supabase (getAll/create/update/delete), scopeada por
 * usuario/workspace. El hook (useTransactions) no se entera.
 *
 * FASE 1.3 — capa de datos de transacciones.
 */
const STORAGE_KEY = "orus_transactions";

/** Semilla inicial. Mañana: `async getAll(userId)`. */
export function getInitialTransactions() {
  return DUMMY_TRANSACTIONS;
}

/** Agrega una transacción generando un id nuevo. Devuelve el arreglo nuevo. */
export function addTransaction(transactions, txData) {
  const id = Math.max(...transactions.map((t) => t.id || 0), 0) + 1;
  return [...transactions, { ...txData, id }];
}

/** Edita una transacción manteniendo id, fecha y hora. Devuelve el arreglo nuevo. */
export function editTransaction(transactions, id, updatedData) {
  const i = transactions.findIndex((tx) => tx.id === id);
  if (i === -1) return transactions;
  const copy = [...transactions];
  copy[i] = {
    ...transactions[i],
    ...updatedData,
    id: transactions[i].id,     // mantener ID
    date: transactions[i].date, // mantener fecha
    time: transactions[i].time, // mantener hora
  };
  return copy;
}

/** Elimina una transacción por id. Devuelve el arreglo nuevo. */
export function removeTransaction(transactions, id) {
  return transactions.filter((tx) => tx.id !== id);
}

/** Persiste el arreglo. Mañana: escritura a la API. */
export function saveToStorage(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

/** Lee el arreglo persistido (o null). Mañana: lectura desde la API. */
export function loadFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}
