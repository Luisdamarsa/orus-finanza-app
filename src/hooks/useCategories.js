import { useState, useCallback } from "react";
import { ALL_CATS } from "../constants";

/**
 * useCategories.js - Hook independiente para gestionar categorías del usuario
 *
 * Este hook encapsula toda la lógica de categorías.
 * En el futuro, aquí es donde se conectaría a la BD del usuario.
 *
 * Retorna:
 *   - categories: {pillarId: [cat1, cat2, ...]}
 *   - addCategory: (pillarId, categoryName) → agrega categoría
 *   - deleteCategory: (categoryName, pillarId) → elimina categoría
 *   - editCategory: (oldName, newName, oldPillarId, newPillarId) → edita categoría
 */

// 🆕 Función auxiliar para inicializar categorías desde ALL_CATS
function initializeCategoriesFromAllCats(allCats) {
  const categories = {};

  allCats.forEach((cat) => {
    const pillarId = cat.pillar;
    if (!categories[pillarId]) {
      categories[pillarId] = [];
    }
    categories[pillarId].push(cat.id);  // ✅ Usar ID, no nombre
  });

  return categories;
}

export function useCategories() {
  // 🆕 Estado de categorías - aquí es donde se conectaría a la BD del usuario
  const [categories, setCategories] = useState(() =>
    initializeCategoriesFromAllCats(ALL_CATS)
  );

  // 🆕 Agregar categoría (mantener orden de ALL_CATS)
  const addCategory = useCallback((pillarId, categoryId) => {
    setCategories((prev) => {
      const pillarCats = prev[pillarId] || [];

      // Si ya existe, no agregar
      if (pillarCats.includes(categoryId)) {
        return prev;
      }

      // Obtener todas las categorías de este pilar de ALL_CATS en orden
      const orderedCats = ALL_CATS
        .filter(cat => cat.pillar === pillarId)
        .map(cat => cat.id);

      // Combinar: categorías existentes + nueva categoría, ordenadas según ALL_CATS
      const newCats = orderedCats.filter(id =>
        pillarCats.includes(id) || id === categoryId
      );

      return {
        ...prev,
        [pillarId]: newCats,
      };
    });
  }, []);

  // 🆕 Eliminar categoría
  const deleteCategory = useCallback((categoryId, pillarId) => {
    setCategories((prev) => ({
      ...prev,
      [pillarId]: (prev[pillarId] || []).filter((cat) => cat !== categoryId),
    }));
  }, []);

  // 🆕 Editar categoría (cambiar pilar, manteniendo orden de ALL_CATS)
  const editCategory = useCallback((categoryId, newPillarId) => {
    setCategories((prev) => {
      const updated = { ...prev };

      // Remover de todos los pilares
      Object.keys(updated).forEach(pillarId => {
        updated[pillarId] = updated[pillarId].filter(id => id !== categoryId);
      });

      // Agregar al nuevo pilar en el orden correcto de ALL_CATS
      const orderedCats = ALL_CATS
        .filter(cat => cat.pillar === newPillarId)
        .map(cat => cat.id);

      const newPillarCats = updated[newPillarId] || [];
      updated[newPillarId] = orderedCats.filter(id =>
        newPillarCats.includes(id) || id === categoryId
      );

      return updated;
    });
  }, []);

  return {
    categories,
    addCategory,
    deleteCategory,
    editCategory,
  };
}
