import { ALL_CATS, PILLARS } from "../constants";
import { addHistoryEntry } from "./attributeHistoryService";

/**
 * categoryCatalogService.js
 *
 * Escrituras del CATÁLOGO de categorías y pilares (nombre, pilar, presupuesto,
 * borrado) + su historial. HOY muta el arreglo global ALL_CATS/PILLARS en memoria;
 * MAÑANA (backend) este es el único archivo que cambia a llamadas async a la BD.
 *
 * La sincronización del estado React (hooks) se queda en el componente: estas
 * funciones solo tocan el catálogo y devuelven lo que el componente necesita
 * para sincronizar.
 */

/**
 * Busca una categoría ACTIVA (no borrada) por nombre + pilar (case-insensitive).
 * Devuelve la categoría o null. Se usa para reutilizar en vez de duplicar.
 */
export function findCategoryByNameAndPillar(pillarId, name) {
  const norm = (s) => (s || "").toLowerCase().trim();
  return ALL_CATS.find(
    (cat) => cat.pillar === pillarId && !cat.deletedAt && norm(cat.name) === norm(name)
  ) || null;
}

/**
 * Crea una categoría en el catálogo (genera id único, timestamps). Devuelve el id.
 */
export function createCategoryEntry(pillarId, categoryName) {
  const baseName = categoryName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  // Id GLOBALMENTE único (antes solo evitaba duplicados dentro del mismo pilar, lo que
  // hacía que "Transporte" en Varios y en Fijos colisionaran con el mismo id).
  let newId = `cat_${baseName}`;
  let n = 1;
  while (ALL_CATS.some((cat) => cat.id === newId)) {
    newId = `cat_${baseName}_${n++}`;
  }
  const now = new Date().toISOString();

  ALL_CATS.push({
    id: newId,
    name: categoryName,
    pillar: pillarId,
    spent: 0,
    budget: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });

  return newId;
}

/**
 * Renombra y/o mueve de pilar una categoría (con historial). Devuelve
 * { pillarChanged } para que el componente sincronice el estado si cambió el pilar.
 */
export function renameOrMoveCategory(categoryId, updates) {
  const category = ALL_CATS.find((cat) => cat.id === categoryId);
  if (!category) return null;

  const oldPillar = category.pillar;

  if (updates.name && updates.name !== category.name) {
    addHistoryEntry(category, "name", category.name, updates.name);
    category.name = updates.name;
  }

  if (updates.pillar && updates.pillar !== category.pillar) {
    addHistoryEntry(category, "pillar", category.pillar, updates.pillar);
    category.pillar = updates.pillar;
  }

  category.updatedAt = new Date().toISOString();
  return { pillarChanged: !!(updates.pillar && oldPillar !== updates.pillar) };
}

/**
 * Borrado suave: marca deletedAt (conserva para históricos). Devuelve el pillarId.
 */
export function softDeleteCategory(categoryId) {
  const category = ALL_CATS.find((cat) => cat.id === categoryId);
  if (!category) return null;
  category.deletedAt = new Date().toISOString();
  return category.pillar;
}

/**
 * Actualiza el presupuesto de una categoría (con historial).
 * 🆕 FASE 3B: Ahora async, persiste en Supabase
 */
export async function setCategoryBudget(categoryId, newBudget, userId) {
  // Versión en memoria (para compatibilidad)
  const category = ALL_CATS.find((cat) => cat.id === categoryId);
  if (!category) return false;

  // Actualizar en Supabase si userId está disponible
  if (userId) {
    try {
      const { budgetService } = await import('./budgetService');
      return await budgetService.setCategoryBudget(userId, categoryId, newBudget);
    } catch (err) {
      console.error("Error updating budget in Supabase:", err);
      // Fallback: actualizar en memoria si falla Supabase
    }
  }

  // Fallback: actualizar en memoria (si no hay userId o falla Supabase)
  if (newBudget !== category.budget) {
    addHistoryEntry(category, "budget", category.budget, newBudget);
    category.budget = newBudget;
  }
  return true;
}

/**
 * Actualiza el presupuesto de un pilar (con historial).
 */
export function setPillarBudget(pillarId, newBudget) {
  const pillar = PILLARS.find((p) => p.id === pillarId);
  if (!pillar) return;
  if (newBudget !== pillar.budget) {
    addHistoryEntry(pillar, "budget", pillar.budget, newBudget);
    pillar.budget = newBudget;
  }
}
