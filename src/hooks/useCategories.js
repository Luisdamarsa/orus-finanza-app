import { useState, useCallback, useEffect } from "react";
import * as categoryService from "../services/categoryService";

/**
 * useCategories.js - REFACTORIZADO para Supabase
 *
 * Ahora carga categorías desde Supabase en lugar de localStorage
 */

export function useCategories(userId) {
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🆕 Cargar categorías del usuario desde Supabase
  useEffect(() => {
    if (!userId) {
      setCategories({});
      return;
    }

    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cats = await categoryService.getInitialCategories(userId);
        setCategories(cats);
        const totalCats = Object.values(cats).flat().length;
        console.log(`📦 Cargadas ${totalCats} categorías de ${userId}`);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [userId]);

  // 🆕 Crear categoría en Supabase
  const createCategory = useCallback(
    async (pillarId, categoryName) => {
      if (!userId) return null;
      try {
        const newId = await categoryService.createCategory(
          userId,
          pillarId,
          categoryName
        );
        if (newId) {
          setCategories(prev =>
            categoryService.addCategory(prev, pillarId, newId)
          );
        }
        return newId;
      } catch (err) {
        console.error('Error creating category:', err);
        setError(err.message);
        return null;
      }
    },
    [userId]
  );

  // 🆕 Obtener o crear categoría (evita duplicados)
  const getOrCreateCategory = useCallback(
    async (pillarId, categoryName) => {
      if (!userId) return null;
      try {
        const existing = await categoryService.findCategoryByNameAndPillar(
          userId,
          pillarId,
          categoryName
        );
        if (existing) {
          return existing.id;
        }
        return await createCategory(pillarId, categoryName);
      } catch (err) {
        console.error('Error in getOrCreateCategory:', err);
        setError(err.message);
        return null;
      }
    },
    [userId, createCategory]
  );

  // 🆕 Asegurar categoría "Varios"
  const ensureVariosCategory = useCallback(
    () => getOrCreateCategory("varios", "Varios"),
    [getOrCreateCategory]
  );

  // 🆕 Editar categoría
  const editCategory = useCallback(
    async (categoryId, updates) => {
      if (!userId) return;
      try {
        await categoryService.editCategory(categoryId, userId, updates);
        // Recargar categorías
        const cats = await categoryService.getInitialCategories(userId);
        setCategories(cats);
      } catch (err) {
        console.error('Error editing category:', err);
        setError(err.message);
      }
    },
    [userId]
  );

  // 🆕 Eliminar categoría
  const deleteCategory = useCallback(
    async (categoryId) => {
      if (!userId) return;
      try {
        await categoryService.deleteCategory(categoryId, userId);
        // Recargar categorías
        const cats = await categoryService.getInitialCategories(userId);
        setCategories(cats);
      } catch (err) {
        console.error('Error deleting category:', err);
        setError(err.message);
      }
    },
    [userId]
  );

  return {
    categories,
    isLoading,
    error,
    createCategory,
    getOrCreateCategory,
    ensureVariosCategory,
    editCategory,
    deleteCategory,
  };
}
