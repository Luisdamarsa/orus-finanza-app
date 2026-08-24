import { useState, useEffect, useCallback } from "react";
import * as transactionService from "../services/transactionService";

/**
 * useTransactions.js - REFACTORIZADO para Supabase
 * 
 * Ahora carga transacciones desde Supabase en lugar de localStorage
 */

export function useTransactions(userId) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🆕 Cargar transacciones del usuario desde Supabase
  useEffect(() => {
    if (!userId) {
      setAllTransactions([]);
      return;
    }

    const loadTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const txs = await transactionService.getTransactionsByUser(userId);
        setAllTransactions(txs);
        console.log(`📦 Cargadas ${txs.length} transacciones de ${userId}`);
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [userId]);

  // 🆕 Agregar transacción a Supabase
  const addTransaction = useCallback(async (txData) => {
    if (!userId) return;
    try {
      const newTx = await transactionService.addTransaction(userId, txData);
      if (newTx) {
        setAllTransactions(prev => [newTx, ...prev]);
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.message);
    }
  }, [userId]);

  // 🆕 Editar transacción en Supabase
  const editTransaction = useCallback(async (id, updatedData) => {
    try {
      const updated = await transactionService.editTransaction(id, updatedData);
      if (updated) {
        setAllTransactions(prev =>
          prev.map(tx => tx.id === id ? updated : tx)
        );
      }
    } catch (err) {
      console.error('Error editing transaction:', err);
      setError(err.message);
    }
  }, []);

  // 🆕 Eliminar transacción de Supabase
  const deleteTransaction = useCallback(async (id) => {
    try {
      const success = await transactionService.deleteTransaction(id);
      if (success) {
        setAllTransactions(prev => prev.filter(tx => tx.id !== id));
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.message);
    }
  }, []);

  return {
    transactions: allTransactions,
    isLoading,
    error,
    addTransaction,
    editTransaction,
    deleteTransaction,
    loadTransactions: () => {} // Legacy compatibility
  };
}