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
    console.error('Error fetching categories:', error);
    return {};
  }

  // Convertir a formato: { pillarId: [categoryId, ...] }
  const categories = {};
  (data || []).forEach(cat => {
    if (!categories[cat.pillar]) {
      categories[cat.pillar] = [];
    }
    categories[cat.pillar].push(cat.id);
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
    console.error('Error fetching user categories:', error);
    return [];
  }
  return data || [];
}

// ✅ Crear nueva categoría
export async function createCategory(userId, pillarId, categoryName) {
  if (!userId) return null;

  const newId = `cat_${categoryName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

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
    console.error('Error creating category:', error);
    return null;
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
    .single();

  if (error) return null; // No encontrada
  return data;
}

// ✅ Editar categoría
export async function editCategory(categoryId, userId, updates) {
  const { data, error } = await supabase
    .from('categorias_usuario')
    .update(updates)
    .eq('id', categoryId)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('Error editing category:', error);
    return null;
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
    console.error('Error deleting category:', error);
    return false;
  }
  return true;
}

// ✅ Funciones de estado local (para compatibilidad)
export function addCategory(categories, pillarId, categoryId) {
  return {
    ...categories,
    [pillarId]: [...(categories[pillarId] || []), categoryId]
  };
}

export function removeCategory(categories, categoryId, pillarId) {
  return {
    ...categories,
    [pillarId]: (categories[pillarId] || []).filter(id => id !== categoryId)
  };
}

export function moveCategory(categories, categoryId, newPillarId) {
  const updated = {};
  for (const pillar in categories) {
    updated[pillar] = categories[pillar].filter(id => id !== categoryId);
  }
  updated[newPillarId] = [...(updated[newPillarId] || []), categoryId];
  return updated;
}