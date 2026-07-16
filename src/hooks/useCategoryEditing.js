import { useState, useCallback } from "react";

/**
 * useCategoryEditing.js - Estado de UI para "qué categoría estoy editando".
 *
 * Estado EFÍMERO de interfaz (no es dato persistible), por eso NO lleva
 * service/isLoading/error: sería cargo-culting. Solo agrupa el racimo de
 * estados de edición que estaba suelto en Dashboard, con acciones claras.
 *
 * Retorna:
 *   { editingCategoryId, editingCategoryName, editingPillarId, isEditing,
 *     startEditing(id, name, pillarId), resetEditing() }
 */
export function useCategoryEditing() {
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState(null);
  const [editingPillarId, setEditingPillarId] = useState(null);

  const startEditing = useCallback((categoryId, categoryName, pillarId) => {
    setEditingCategoryId(categoryId);
    setEditingCategoryName(categoryName);
    setEditingPillarId(pillarId);
  }, []);

  const resetEditing = useCallback(() => {
    setEditingCategoryId(null);
    setEditingCategoryName(null);
    setEditingPillarId(null);
  }, []);

  return {
    editingCategoryId,
    editingCategoryName,
    editingPillarId,
    isEditing: editingCategoryName !== null,
    startEditing,
    resetEditing,
  };
}
