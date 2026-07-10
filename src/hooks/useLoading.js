import { useState, useCallback } from "react";

/**
 * useLoading.js
 *
 * Hook para manejar estados de carga en diferentes secciones
 * Permite mostrar skeleton screens + spinner mientras se cargan datos
 *
 * Uso:
 *   const { isLoading, startLoading, stopLoading } = useLoading();
 *
 *   // Simular carga
 *   startLoading();
 *   setTimeout(() => stopLoading(), 2000);
 */

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoading = useCallback((value) => {
    setIsLoading(value);
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading,
  };
};

/**
 * Hook para manejar múltiples estados de carga (para diferentes secciones)
 */
export const useMultipleLoading = (sections = {}) => {
  const [loadingStates, setLoadingStates] = useState(sections);

  const setLoading = useCallback((section, value) => {
    setLoadingStates((prev) => ({
      ...prev,
      [section]: value,
    }));
  }, []);

  const startLoading = useCallback((section) => {
    setLoading(section, true);
  }, [setLoading]);

  const stopLoading = useCallback((section) => {
    setLoading(section, false);
  }, [setLoading]);

  const isLoading = useCallback((section) => {
    return loadingStates[section] || false;
  }, [loadingStates]);

  return {
    loadingStates,
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
  };
};

/**
 * Hook para simular carga con delay (útil para testing)
 */
export const useSimulatedLoading = (delayMs = 1500) => {
  const { isLoading, startLoading, stopLoading } = useLoading(false);

  const simulateLoading = useCallback(() => {
    startLoading();
    setTimeout(() => {
      stopLoading();
    }, delayMs);
  }, [startLoading, stopLoading, delayMs]);

  return {
    isLoading,
    simulateLoading,
    startLoading,
    stopLoading,
  };
};
