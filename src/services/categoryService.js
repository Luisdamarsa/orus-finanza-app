/**
 * categoryService.js
 *
 * Capa de acceso a datos de categorías. HOY opera sobre estado local
 * (transformaciones puras: estado actual → estado nuevo). MAÑANA, cuando la
 * app tenga backend, ESTE es el único archivo que cambia: cada función se
 * vuelve una llamada async a la API/Supabase (get/create/update/delete),
 * scopeada por usuario/workspace. El hook (useCategories) no se entera.
 *
 * Contrato de la capa de datos:
 * - Funciones verbo-based (get/add/remove/move), no setters crudos.
 * - Diseñadas para poder volverse `async` sin romper a quien las llama.
 *
 * FASE 1.3 — separación hook ↔ servicio.
 */
import { ALL_CATS } from "../constants";

/**
 * Estructura inicial de categorías: { pillarId: [categoryId, ...] }.
 * 🆕 FASE 2: Filtra por userId. Mañana: `async getAll(userId)` → fetch a la BD del usuario.
 * @param {string} userId - ID del usuario (ej: "UA0001")
 */
export function getInitialCategories(userId) {
  console.log(`\n🎯 categoryService.getInitialCategories INICIO - userId: ${userId}`);

  const categories = {};
  // 🆕 Filtrar solo categorías del usuario actual
  console.log(`  ALL_CATS: `, ALL_CATS.length, ` categorías`);
  console.log(`  Filtrando por userId === "${userId}"`);

  const userCats = ALL_CATS.filter(cat => {
    const match = cat.userId === userId;
    if (match) console.log(`    ✓ ${cat.name} (${cat.userId})`);
    return match;
  });

  console.log(`  RESULTADO: ${userCats.length} categorías filtradas`);

  userCats.forEach((cat) => {
    if (!categories[cat.pillar]) categories[cat.pillar] = [];
    categories[cat.pillar].push(cat.id);
  });

  console.log(`  RETORNANDO:`, categories);
  return categories;
}

/**
 * Agrega una categoría a un pilar, respetando el orden de ALL_CATS.
 * Devuelve el nuevo estado (no muta). Mañana: `async create(userId, ...)`.
 */
export function addCategory(categories, pillarId, categoryId) {
  const pillarCats = categories[pillarId] || [];
  if (pillarCats.includes(categoryId)) return categories;

  const ordered = ALL_CATS.filter((c) => c.pillar === pillarId).map((c) => c.id);
  const newCats = ordered.filter((id) => pillarCats.includes(id) || id === categoryId);

  return { ...categories, [pillarId]: newCats };
}

/**
 * Elimina una categoría de un pilar. Devuelve el nuevo estado.
 * Mañana: `async remove(userId, categoryId)`.
 */
export function removeCategory(categories, categoryId, pillarId) {
  return {
    ...categories,
    [pillarId]: (categories[pillarId] || []).filter((id) => id !== categoryId),
  };
}

/**
 * Mueve una categoría a otro pilar, respetando el orden de ALL_CATS.
 * Devuelve el nuevo estado. Mañana: `async update(userId, categoryId, { pillar })`.
 */
export function moveCategory(categories, categoryId, newPillarId) {
  const updated = { ...categories };
  Object.keys(updated).forEach((pid) => {
    updated[pid] = updated[pid].filter((id) => id !== categoryId);
  });

  const ordered = ALL_CATS.filter((c) => c.pillar === newPillarId).map((c) => c.id);
  const target = updated[newPillarId] || [];
  updated[newPillarId] = ordered.filter((id) => target.includes(id) || id === categoryId);

  return updated;
}
