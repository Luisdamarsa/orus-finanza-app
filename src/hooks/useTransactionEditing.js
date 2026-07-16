import { useState, useCallback } from "react";

/**
 * useTransactionEditing.js - Estado de UI para "qué transacción estoy editando".
 *
 * Estado EFÍMERO de interfaz (no persistible) → sin service/isLoading/error,
 * igual que useCategoryEditing. Agrupa el racimo que estaba suelto en Dashboard.
 *
 * Retorna:
 *   { editingTransactionId, selectedTransactionForEdit, isEditing,
 *     startEditing(transaction), resetEditing() }
 */
export function useTransactionEditing() {
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [selectedTransactionForEdit, setSelectedTransactionForEdit] = useState(null);

  const startEditing = useCallback((transaction) => {
    setSelectedTransactionForEdit(transaction);
    setEditingTransactionId(transaction.id);
  }, []);

  const resetEditing = useCallback(() => {
    setEditingTransactionId(null);
    setSelectedTransactionForEdit(null);
  }, []);

  return {
    editingTransactionId,
    selectedTransactionForEdit,
    isEditing: Boolean(editingTransactionId && selectedTransactionForEdit),
    startEditing,
    resetEditing,
  };
}
