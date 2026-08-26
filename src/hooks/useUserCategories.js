import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseService';

// 🆕 Contexto global para invalidar cache cuando se crea/edita/borra categoría
let categoryMapRefreshCounter = 0;
const listeners = new Set();

export function invalidateCategoryMap() {
  categoryMapRefreshCounter++;
  listeners.forEach((fn) => fn());
}

/**
 * useUserCategories.js
 *
 * Hook personalizado para cargar y cachear categorías del usuario desde Supabase.
 * Devuelve un mapping {categoryId: categoryName} para lookup rápido en transacciones.
 *
 * Props:
 * - userId: UUID del usuario (si es null, no carga)
 *
 * Retorna:
 * - {categoryId: categoryName} - mapping para buscar nombres por UUID
 */
export function useUserCategories(userId) {
  const [categoryMap, setCategoryMap] = useState({});
  const [refreshCounter, setRefreshCounter] = useState(0);

  // 🆕 Suscribirse a invalidaciones globales
  useEffect(() => {
    const handleRefresh = () => {
      setRefreshCounter((prev) => prev + 1);
    };
    listeners.add(handleRefresh);
    return () => listeners.delete(handleRefresh);
  }, []);

  const loadCategories = useCallback(async () => {
    if (!userId) {
      setCategoryMap({});
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categorias_usuario')
        .select('id, name')
        .eq('user_id', userId)
        .is('deleted_at', null); // 🆕 Excluir categorías soft-deleted

      if (error) {
        setCategoryMap({});
        return;
      }

      // Crear mapping {id: name}
      const map = {};
      (data || []).forEach(({ id, name }) => {
        map[id] = name;
      });
      setCategoryMap(map);
    } catch (err) {
      setCategoryMap({});
    }
  }, [userId]);

  // 🆕 Recargar cuando userId cambia O cuando hay invalidación
  useEffect(() => {
    loadCategories();
  }, [userId, refreshCounter, loadCategories]);

  return categoryMap;
}

/**
 * Función helper para obtener nombre de categoría
 * ✅ 100% Supabase - sin fallbacks a ALL_CATS
 */
export function getCategoryNameWithFallback(categoryId, categoryMap = {}) {
  if (!categoryId) return 'Sin categoría';

  // Buscar en categoryMap de Supabase
  if (categoryMap[categoryId]) {
    return categoryMap[categoryId];
  }

  // 🆕 Si no está en categoryMap, retornar UUID
  // Esto es normal si categoryMap aún se está recargando desde Supabase
  return categoryId;
}
