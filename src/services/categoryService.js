import { supabase } from './supabaseService';

/**
 * categoryService.js - REFACTORIZADO para Supabase
 * 
 * Maneja categorías del usuario desde la tabla categorias_usuario
 */

// ✅ Obtener categorías iniciales del usuario
export async function getInitialCategories(userId) {
  if (!userId) return {};

  const { data, error } = await supabase
    .from('categorias_usuario')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null); // Excluir borradas

  if (error) {
    return {};
  }

  // 🆕 Convertir a formato: { pillarId: [{ id, name }, ...] }
  const categories = {};
  (data || []).forEach(cat => {
    if (!categories[cat.pillar]) {
      categories[cat.pillar] = [];
    }
    // Guardar objeto completo con id y name
    categories[cat.pillar].push({
      id: cat.id,
      name: cat.name,
      spent: cat.spent || 0,
      budget: cat.budget || null
    });
  });

  return categories;
}

// ✅ Obtener todas las categorías del usuario con detalles
export async function getCategoriesByUser(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('categorias_usuario')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null);

  if (error) {
    return [];
  }
  return data || [];
}

// ✅ Crear nueva categoría
export async function createCategory(userId, pillarId, categoryName) {
  if (!userId) throw new Error('No userId provided');

  // 🆕 Generar UUID válido en lugar de string personalizado
  const newId = crypto.randomUUID();

  const { data, error } = await supabase
    .from('categorias_usuario')
    .insert([
      {
        id: newId,
        user_id: userId,
        name: categoryName,
        pillar: pillarId,
        spent: 0,
        budget: null,
      }
    ])
    .select();

  if (error) {
    throw new Error(`Fallo al crear categoría: ${error.message}`);
  }
  return data?.[0]?.id || newId;
}

// ✅ Buscar categoría por nombre y pilar
export async function findCategoryByNameAndPillar(userId, pillarId, categoryName) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('categorias_usuario')
    .select('*')
    .eq('user_id', userId)
    .eq('pillar', pillarId)
    .eq('name', categoryName)
    .is('deleted_at', null)
    .maybeSingle(); // 🆕 Usar maybeSingle para evitar 406 cuando no existe

  if (error) return null; // No encontrada
  return data;
}

// ✅ Editar categoría
export async function editCategory(categoryId, userId, updates) {
  // 🆕 FASE 3C - Obtener datos antiguos para registrar historial
  let oldData = null;
  const { data: catData } = await supabase
    .from('categorias_usuario')
    .select('*')
    .eq('id', categoryId)
    .eq('user_id', userId)
    .maybeSingle(); // 🆕 Usar maybeSingle para evitar 406
  oldData = catData;

  const { data, error } = await supabase
    .from('categorias_usuario')
    .update(updates)
    .eq('id', categoryId)
    .eq('user_id', userId)
    .select();

  if (error) {
    return null;
  }

  // 🆕 FASE 3C - Registrar cambios en historial
  if (oldData && data?.[0]) {
    for (const [field, newValue] of Object.entries(updates)) {
      const oldValue = oldData[field];
      if (oldValue !== newValue) {
        await addCategoryHistory(userId, categoryId, field, oldValue, newValue);
      }
    }
  }

  return data?.[0] || null;
}

// ✅ Eliminar categoría (soft delete)
export async function deleteCategory(categoryId, userId) {
  const { error } = await supabase
    .from('categorias_usuario')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', categoryId)
    .eq('user_id', userId);

  if (error) {
    return false;
  }
  return true;
}

// ✅ Funciones de estado local (para compatibilidad)
export function addCategory(categories, pillarId, categoryObj) {
  return {
    ...categories,
    [pillarId]: [...(categories[pillarId] || []), categoryObj]
  };
}

export function removeCategory(categories, categoryId, pillarId) {
  return {
    ...categories,
    [pillarId]: (categories[pillarId] || []).filter(cat => {
      const id = typeof cat === 'string' ? cat : cat.id;
      return id !== categoryId;
    })
  };
}

export function moveCategory(categories, categoryId, newPillarId) {
  const updated = {};
  for (const pillar in categories) {
    updated[pillar] = (categories[pillar] || []).filter(cat => {
      const id = typeof cat === 'string' ? cat : cat.id;
      return id !== categoryId;
    });
  }
  // Encontrar el objeto de categoría para moverlo
  let categoryObj = categoryId;
  for (const pillar in categories) {
    const found = (categories[pillar] || []).find(cat => {
      const id = typeof cat === 'string' ? cat : cat.id;
      return id === categoryId;
    });
    if (found) {
      categoryObj = found;
      break;
    }
  }
  updated[newPillarId] = [...(updated[newPillarId] || []), categoryObj];
  return updated;
}

// 🆕 FASE 3C - HISTORIAL DE CATEGORÍAS en Supabase
/**
 * Agregar entrada al historial de cambios de una categoría
 */
export async function addCategoryHistory(userId, categoryId, field, oldValue, newValue) {
  if (!userId || !categoryId) return false;

  // Solo registrar si realmente cambió
  if (oldValue === newValue) return true;


  const { error } = await supabase
    .from('category_history')
    .insert([
      {
        user_id: userId,
        category_id: categoryId,
        field,
        old_value: String(oldValue ?? ''),
        new_value: String(newValue ?? ''),
        changed_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    return false;
  }
  return true;
}

/**
 * Obtener historial de cambios de una categoría
 */
export async function getCategoryHistory(userId, categoryId) {
  if (!userId || !categoryId) return [];

  const { data, error } = await supabase
    .from('category_history')
    .select('*')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .order('changed_at', { ascending: false });

  if (error) {
    return [];
  }
  return data || [];
}

/**
 * Obtener categoría completa CON historial (para getAttributeAtDate)
 * ✅ NUEVO - Trae la categoría + su historial en formato compatible
 */
export async function getCategoryWithHistory(categoryId, userId) {
  if (!categoryId || !userId) return null;

  try {
    // Traer categoría completa
    const { data: category, error: catError } = await supabase
      .from('categorias_usuario')
      .select('*')
      .eq('id', categoryId)
      .eq('user_id', userId)
      .single();

    if (catError || !category) {
      return null;
    }

    // Traer historial de cambios
    const historyData = await getCategoryHistory(userId, categoryId);

    // Convertir al formato de attributeHistoryService
    category.history = (historyData || []).map(h => ({
      field: h.field,
      old: h.old_value,
      new: h.new_value,
      changedAt: h.changed_at
    }));

    return category;
  } catch (err) {
    return null;
  }
}