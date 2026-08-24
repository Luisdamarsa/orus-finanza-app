import { supabase } from './supabaseService';

/**
 * budgetService.js - NUEVO para FASE 3B
 *
 * Maneja presupuestos de pilares y categorías en Supabase
 * Con historial de cambios para auditoría
 */

// ✅ PRESUPUESTOS DE PILARES

/**
 * Obtener presupuesto de pilar para un mes específico
 */
export async function getPillarBudget(userId, pillarId, monthYear) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('pillar_budgets')
    .select('amount')
    .eq('user_id', userId)
    .eq('pillar_id', pillarId)
    .eq('month_year', monthYear)
    .single();

  if (error) {
    console.error('Error fetching pillar budget:', error);
    return null;
  }
  return data?.amount || null;
}

/**
 * Obtener todos los presupuestos de pilares de un usuario para un mes
 */
export async function getPillarBudgetsForMonth(userId, monthYear) {
  if (!userId) return {};

  const { data, error } = await supabase
    .from('pillar_budgets')
    .select('pillar_id, amount')
    .eq('user_id', userId)
    .eq('month_year', monthYear);

  if (error) {
    console.error('Error fetching pillar budgets:', error);
    return {};
  }

  // Convertir a {pillarId: amount}
  const result = {};
  (data || []).forEach(({ pillar_id, amount }) => {
    result[pillar_id] = amount;
  });
  return result;
}

/**
 * Establecer presupuesto de pilar (crea o actualiza)
 */
export async function setPillarBudget(userId, pillarId, monthYear, amount) {
  if (!userId) return false;

  // 1. Obtener valor anterior (para historial)
  const oldData = await supabase
    .from('pillar_budgets')
    .select('amount')
    .eq('user_id', userId)
    .eq('pillar_id', pillarId)
    .eq('month_year', monthYear)
    .single();

  const oldAmount = oldData.data?.amount || null;

  // 2. Upsert del nuevo presupuesto
  const { data, error } = await supabase
    .from('pillar_budgets')
    .upsert(
      {
        user_id: userId,
        pillar_id: pillarId,
        month_year: monthYear,
        amount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,pillar_id,month_year' }
    )
    .select();

  if (error) {
    console.error('Error setting pillar budget:', error);
    return false;
  }

  // 3. Agregar al historial (si cambió)
  if (oldAmount !== amount) {
    await addBudgetHistory(userId, 'pillar', pillarId, 'amount', oldAmount, amount);
  }

  return true;
}

// ✅ PRESUPUESTOS DE CATEGORÍAS

/**
 * Obtener presupuesto de categoría
 */
export async function getCategoryBudget(userId, categoryId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('category_budgets')
    .select('amount')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .single();

  if (error) {
    // Categoría sin presupuesto es normal
    return null;
  }
  return data?.amount || null;
}

/**
 * Obtener todos los presupuestos de categorías de un usuario
 */
export async function getCategoryBudgetsForUser(userId) {
  if (!userId) return {};

  const { data, error } = await supabase
    .from('category_budgets')
    .select('category_id, amount')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching category budgets:', error);
    return {};
  }

  // Convertir a {categoryId: amount}
  const result = {};
  (data || []).forEach(({ category_id, amount }) => {
    result[category_id] = amount;
  });
  return result;
}

/**
 * Establecer presupuesto de categoría (crea o actualiza)
 */
export async function setCategoryBudget(userId, categoryId, amount) {
  if (!userId || !categoryId) return false;

  // 🆕 Validar que amount sea un número válido
  const numAmount = parseInt(amount) || 0;
  if (numAmount < 0) {
    console.warn(`❌ Presupuesto negativo no permitido: ${numAmount}`);
    return false;
  }

  // 1. Obtener valor anterior (para historial)
  const oldData = await supabase
    .from('category_budgets')
    .select('amount')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .single();

  const oldAmount = oldData.data?.amount || null;

  // 2. Upsert del nuevo presupuesto
  const { data, error } = await supabase
    .from('category_budgets')
    .upsert(
      {
        user_id: userId,
        category_id: categoryId,
        amount: numAmount,  // 🆕 Asegurar que es un número válido
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,category_id' }
    )
    .select();

  if (error) {
    console.error('Error setting category budget:', error);
    return false;
  }

  console.log(`✅ Presupuesto categoría guardado: ${categoryId}=${numAmount}`);

  // 3. Agregar al historial (si cambió)
  if (oldAmount !== numAmount) {
    await addBudgetHistory(userId, 'category', categoryId, 'amount', oldAmount, numAmount);
  }

  return true;
}

// ✅ HISTORIAL

/**
 * Agregar entrada al historial de cambios
 */
export async function addBudgetHistory(userId, entityType, entityId, field, oldValue, newValue) {
  if (!userId) return false;

  const { error } = await supabase
    .from('budget_history')
    .insert([
      {
        user_id: userId,
        entity_type: entityType,
        entity_id: entityId,
        field,
        old_value: oldValue,
        new_value: newValue,
        changed_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error('Error adding budget history:', error);
    return false;
  }
  return true;
}

/**
 * Obtener historial de cambios de un presupuesto
 */
export async function getBudgetHistory(userId, entityType, entityId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('budget_history')
    .select('*')
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('changed_at', { ascending: false });

  if (error) {
    console.error('Error fetching budget history:', error);
    return [];
  }
  return data || [];
}

/**
 * Obtener todo el historial de presupuestos de un usuario
 */
export async function getAllBudgetHistory(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('budget_history')
    .select('*')
    .eq('user_id', userId)
    .order('changed_at', { ascending: false });

  if (error) {
    console.error('Error fetching all budget history:', error);
    return [];
  }
  return data || [];
}
