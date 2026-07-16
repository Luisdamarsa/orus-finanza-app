import { useState, useEffect } from "react";
import * as transactionService from "../services/transactionService";

/**
 * useTransactions.js - Hook de DATOS de transacciones (contrato completo).
 *
 * A diferencia de los hooks de UI (edición/navegación), este sí lleva el
 * contrato de datos completo:
 *   { transactions, isLoading, error,
 *     addTransaction, editTransaction, deleteTransaction, loadTransactions }
 *
 * - Datos vía transactionService (hoy localStorage, mañana API/Supabase).
 * - isLoading/error expuestos desde ya → el día del backend, gratis.
 * - Acciones verbo-based, async-tolerant (no exponen setTransactions crudo).
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(() =>
    transactionService.getInitialTransactions()
  );
  const [isLoading] = useState(false);
  const [error] = useState(null);

  // Persistir en cada cambio (hoy localStorage, mañana API/Supabase).
  useEffect(() => {
    transactionService.saveToStorage(transactions);
  }, [transactions]);

  const addTransaction = (txData) =>
    setTransactions((prev) => transactionService.addTransaction(prev, txData));

  const editTransaction = (id, updatedData) =>
    setTransactions((prev) => transactionService.editTransaction(prev, id, updatedData));

  const deleteTransaction = (id) =>
    setTransactions((prev) => transactionService.removeTransaction(prev, id));

  // Rehidratar desde persistencia (usado por el arranque DEV).
  const loadTransactions = (list) => setTransactions(list);

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    editTransaction,
    deleteTransaction,
    loadTransactions,
  };
}
