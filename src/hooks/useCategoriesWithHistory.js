import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseService';
import { getCategoryHistory } from '../services/categoryService';

/**
 * useCategoriesWithHistory.js
 *
 * Hook que carga categorías CON historial completo
 * Retorna {categoryId: categoryObject} donde cada objeto tiene:
 * - id, name, pillar, ...
 * - history: [{field, old, new, changedAt}]
 *
 * ✅ Uso: En TransactionsListService para getAttributeAtDate()
 */
export function useCategoriesWithHistory(userId) {
  const [categoriesWithHistory, setCategoriesWithHistory] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    if (!userId) {
      setCategoriesWithHistory({});
      return;
    }

    setIsLoading(true);
    try {
      // Traer todas las categorías del usuario
      const { data: categories, error } = await supabase
        .from('categorias_usuario')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null);

      if (error) {
        setCategoriesWithHistory({});
        return;
      }

      // Para cada categoría, cargar su historial
      const map = {};
      for (const category of categories || []) {
        const historyData = await getCategoryHistory(userId, category.id);

        // Agregar historial al formato correcto
        category.history = (historyData || []).map(h => ({
          field: h.field,
          old: h.old_value,
          new: h.new_value,
          changedAt: h.changed_at
        }));

        map[category.id] = category;
      }

      setCategoriesWithHistory(map);
    } catch (err) {
      setCategoriesWithHistory({});
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCategories();
  }, [userId, loadCategories]);

  return { categoriesWithHistory, isLoading, refetch: loadCategories };
}
