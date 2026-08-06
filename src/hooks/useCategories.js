import { useState, useCallback, useEffect } from "react";
import * as categoryService from "../services/categoryService";
import * as catalog from "../services/categoryCatalogService";

/**
 * useCategories.js - Hook de categorías del usuario (única fuente de la lógica de categorías).
 *
 * Orquesta el estado React + el catálogo (categoryCatalogService). Antes las acciones de
 * alto nivel (createCategory, getOrCreateCategory, editCategory, deleteCategory,
 * ensureVariosCategory) vivían sueltas en App.jsx; ahora viven aquí, donde está el estado.
 *
 * Contrato de la capa de datos:
 * - `categories` = { pillarId: [categoryId, ...] } (lo que leen Categorías, Presupuestos, dropdown).
 * - Acciones verbo-based; async-tolerant (no exponen setCategories crudo).
 * - Cuando el servicio se vuelva async (API/Supabase), solo cambian catalog/service; los
 *   componentes ya manejan isLoading/error → gratis.
 *
 * 🆕 FASE 2: Recibe userId para filtrar categorías por usuario.
 */
export function useCategories(userId) {
  const [categories, setCategories] = useState(() =>
    categoryService.getInitialCategories(userId)  // 🆕 Pasar userId
  );
  // Placeholders del contrato: hoy no hay I/O async, mañana sí.
  const [isLoading] = useState(false);
  const [error] = useState(null);

  // 🆕 FASE 2 - Actualizar categorías cuando userId cambia
  useEffect(() => {
    console.log(`\n🔄 useCategories - userId cambió a: ${userId}`);
    setCategories(categoryService.getInitialCategories(userId));
  }, [userId]);

  // 🆕 DEBUG: Loguear categorías cargadas
  useEffect(() => {
    const totalCats = Object.values(categories).flat().length;
    console.log(`\n📦 useCategories(${userId})`);
    console.log(`  Total categorías: ${totalCats}`);
    console.log(`  Pilares: `, Object.keys(categories));
    console.log(`  Detalles por pilar:`, categories);
  }, [userId, categories]);

  // ── Sincronizadores del estado React (bajo nivel, internos) ────────────────
  const syncAdd = useCallback((pillarId, categoryId) => {
    setCategories((prev) => categoryService.addCategory(prev, pillarId, categoryId));
  }, []);
  const syncRemove = useCallback((categoryId, pillarId) => {
    setCategories((prev) => categoryService.removeCategory(prev, categoryId, pillarId));
  }, []);
  const syncMove = useCallback((categoryId, newPillarId) => {
    setCategories((prev) => categoryService.moveCategory(prev, categoryId, newPillarId));
  }, []);

  // ── Acciones de alto nivel: catálogo (ALL_CATS) + sync del estado React ─────

  /** Crea una categoría en el catálogo y la refleja en el estado. Devuelve el id nuevo. */
  const createCategory = useCallback((pillarId, categoryName) => {
    const newId = catalog.createCategoryEntry(pillarId, categoryName);
    syncAdd(pillarId, newId);
    return newId;
  }, [syncAdd]);

  /**
   * Reutiliza una categoría existente (mismo nombre+pilar) o la crea. Devuelve el id real.
   * Usado al crear categoría desde el dropdown de una transacción (evita duplicados).
   */
  const getOrCreateCategory = useCallback((pillarId, categoryName) => {
    const existing = catalog.findCategoryByNameAndPillar(pillarId, categoryName);
    if (existing) {
      syncAdd(pillarId, existing.id); // idempotente si ya está en el mapa
      return existing.id;
    }
    return createCategory(pillarId, categoryName);
  }, [syncAdd, createCategory]);

  /** Resuelve/crea la categoría "Varios" del pilar Varios (gastos sin categoría caen ahí). */
  const ensureVariosCategory = useCallback(
    () => getOrCreateCategory("varios", "Varios"),
    [getOrCreateCategory]
  );

  /** Renombra y/o mueve de pilar una categoría (con historial en el catálogo). */
  const editCategory = useCallback((categoryId, updates) => {
    const res = catalog.renameOrMoveCategory(categoryId, updates);
    if (res && res.pillarChanged) syncMove(categoryId, updates.pillar);
  }, [syncMove]);

  /** Borrado suave en el catálogo + lo quita del estado. */
  const deleteCategory = useCallback((categoryId) => {
    const pillarId = catalog.softDeleteCategory(categoryId);
    if (pillarId) syncRemove(categoryId, pillarId);
  }, [syncRemove]);

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
