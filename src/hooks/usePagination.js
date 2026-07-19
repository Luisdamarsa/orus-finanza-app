import { useState, useEffect, useRef, useCallback } from "react";

/**
 * usePagination.js — paginación acumulativa "cargar más" (scroll infinito).
 *
 * Muestra los primeros `pageSize` ítems y crece de a `pageSize` con loadMore().
 * Acumulativo: los ya mostrados se conservan (scrollear arriba es instantáneo).
 * `delay` simula latencia (para ver el spinner). Al conectar BD se reemplaza por
 * la latencia real del fetch — el patrón (offset/limit + spinner) es el mismo.
 *
 *   const { visibleItems, hasMore, loading, loadMore } = usePagination(items, 15, 350);
 */
export function usePagination(items, pageSize = 15, delay = 350) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const timerRef = useRef(null);

  // Reset al cambiar el conjunto (periodo/filtro/pilar): longitud + primer id
  const resetSignal = `${items.length}:${items[0]?.id ?? ""}`;
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    loadingRef.current = false;
    setLoading(false);
    setVisibleCount(pageSize);
  }, [resetSignal, pageSize]);

  // Limpieza al desmontar
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (loadingRef.current) return;
    if (visibleCount >= items.length) return;
    loadingRef.current = true;
    setLoading(true);
    timerRef.current = setTimeout(() => {
      setVisibleCount((c) => Math.min(c + pageSize, items.length));
      loadingRef.current = false;
      setLoading(false);
    }, delay);
  }, [visibleCount, items.length, pageSize, delay]);

  return { visibleItems: items.slice(0, visibleCount), hasMore, loading, loadMore };
}
