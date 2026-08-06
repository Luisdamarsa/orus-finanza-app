import { useState, useEffect, useMemo } from "react";
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
 *
 * 🆕 FASE 2 - Soporte para userId:
 * - Si se pasa userId, filtra automáticamente las transacciones de ese usuario.
 * - Si NO se pasa userId, devuelve todas (para compatibilidad).
 */
export function useTransactions(userId) {
  const [allTransactions, setAllTransactions] = useState(() =>
    transactionService.getInitialTransactions()
  );
  const [isLoading] = useState(false);
  const [error] = useState(null);

  // 🆕 Filtrar por userId si se proporciona
  const transactions = useMemo(() => {
    if (userId) {
      return transactionService.getTransactionsByUser(allTransactions, userId);
    }
    return allTransactions; // Compatibilidad: si no hay userId, devolver todas
  }, [allTransactions, userId]);

  // Persistir en cada cambio (hoy localStorage, mañana API/Supabase).
  useEffect(() => {
    transactionService.saveToStorage(allTransactions);
  }, [allTransactions]);

  // 🆕 Al agregar transacción, agregar userId automáticamente
  const addTransaction = (txData) => {
    const txWithUserId = userId ? { ...txData, userId } : txData;
    setAllTransactions((prev) => transactionService.addTransaction(prev, txWithUserId));
  };

  const editTransaction = (id, updatedData) =>
    setAllTransactions((prev) => transactionService.editTransaction(prev, id, updatedData));

  const deleteTransaction = (id) =>
    setAllTransactions((prev) => transactionService.removeTransaction(prev, id));

  // Rehidratar desde persistencia (usado por el arranque DEV).
  const loadTransactions = (list) => setAllTransactions(list);

  return {
    transactions, // 🆕 Transacciones filtradas por userId (o todas si no hay userId)
    isLoading,
    error,
    addTransaction,
    editTransaction,
    deleteTransaction,
    loadTransactions,
  };
}
