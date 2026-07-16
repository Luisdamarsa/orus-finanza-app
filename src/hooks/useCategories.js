import { useState, useCallback } from "react";
import * as categoryService from "../services/categoryService";

/**
 * useCategories.js - Hook de categorías del usuario.
 *
 * Orquesta el estado React; el acceso a datos vive en categoryService.
 * Sigue el contrato de hooks de datos:
 *   { categories, isLoading, error, addCategory, deleteCategory, editCategory }
 *
 * - isLoading / error se exponen desde ya (hoy constantes). Cuando el servicio
 *   se vuelva async (API/Supabase), los componentes ya los manejan → gratis.
 * - Acciones verbo-based, async-tolerant (no exponen setCategories crudo).
 */
export function useCategories() {
  const [categories, setCategories] = useState(() =>
    categoryService.getInitialCategories()
  );
  // Placeholders del contrato: hoy no hay I/O async, mañana sí.
  const [isLoading] = useState(false);
  const [error] = useState(null);

  const addCategory = useCallback((pillarId, categoryId) => {
    setCategories((prev) => categoryService.addCategory(prev, pillarId, categoryId));
  }, []);

  const deleteCategory = useCallback((categoryId, pillarId) => {
    setCategories((prev) => categoryService.removeCategory(prev, categoryId, pillarId));
  }, []);

  const editCategory = useCallback((categoryId, newPillarId) => {
    setCategories((prev) => categoryService.moveCategory(prev, categoryId, newPillarId));
  }, []);

  return {
    categories,
    isLoading,
    error,
    addCategory,
    deleteCategory,
    editCategory,
  };
}
