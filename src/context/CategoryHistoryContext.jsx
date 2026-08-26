import { createContext, useContext } from 'react';
import { useCategoriesWithHistory } from '../hooks/useCategoriesWithHistory';

/**
 * CategoryHistoryContext
 *
 * Context global que centraliza el estado de categorías CON historial.
 * Se recarga automáticamente cuando se edita una categoría (via refetch).
 *
 * Disponible en TODOS los componentes sin drilling de props.
 */
const CategoryHistoryContext = createContext(null);

/**
 * Provider que debe envolver la app
 */
export function CategoryHistoryProvider({ userId, children }) {
  const { categoriesWithHistory, isLoading, refetch } = useCategoriesWithHistory(userId);

  const value = {
    categoriesWithHistory,
    isLoading,
    refetch,
  };

  return (
    <CategoryHistoryContext.Provider value={value}>
      {children}
    </CategoryHistoryContext.Provider>
  );
}

/**
 * Hook para consumir el contexto
 *
 * Uso:
 * const { categoriesWithHistory, refetch } = useCategoryHistory();
 */
export function useCategoryHistory() {
  const context = useContext(CategoryHistoryContext);
  if (!context) {
    throw new Error('useCategoryHistory debe usarse dentro de CategoryHistoryProvider');
  }
  return context;
}
