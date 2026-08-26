import { supabase } from './supabaseService';

/**
 * transactionService.js - REFACTORIZADO para Supabase
 * 
 * Ahora TODAS las funciones usan Supabase en lugar de localStorage
 */

// ✅ Obtener TODAS las transacciones del usuario
export async function getTransactionsByUser(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('transacciones')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    return [];
  }
  return data || [];
}

// ✅ Crear nueva transacción
export async function addTransaction(userId, txData) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('transacciones')
    .insert([
      {
        user_id: userId,
        date: txData.date,
        time: txData.time,
        description: txData.description,
        amount: txData.amount,
        pillar: txData.pillar,
        category: txData.category,
        category_name: txData.category_name || null, // 🆕 FASE 3C - Guardar nombre de categoría
        method: txData.method,
      }
    ])
    .select();

  if (error) {
    throw new Error(`Fallo al crear transacción: ${error.message}`);
  }
  return data?.[0] || null;
}

// ✅ Editar transacción
export async function editTransaction(transactionId, updates, categoryName = null, userId = null) {
  // 🆕 FASE 3C - Si se pasó categoryName, agregarlo a updates
  const updateData = { ...updates };
  if (categoryName !== undefined) {
    updateData.category_name = categoryName;
  }

  // 🆕 FASE 3C - Obtener datos antiguos para registrar historial
  let oldData = null;
  if (userId) {
    const { data: txData } = await supabase
      .from('transacciones')
      .select('*')
      .eq('id', transactionId)
      .single();
    oldData = txData;
  }

  const { data, error } = await supabase
    .from('transacciones')
    .update(updateData)
    .eq('id', transactionId)
    .select();

  if (error) {
    return null;
  }

  // 🆕 FASE 3C - Registrar cambios en historial
  if (userId && oldData && data?.[0]) {
    for (const [field, newValue] of Object.entries(updateData)) {
      const oldValue = oldData[field];
      if (oldValue !== newValue) {
        await addTransactionHistory(userId, transactionId, field, oldValue, newValue);
      }
    }
  }

  return data?.[0] || null;
}

// ✅ Eliminar transacción
export async function deleteTransaction(transactionId) {
  const { error } = await supabase
    .from('transacciones')
    .delete()
    .eq('id', transactionId);

  if (error) {
    return false;
  }
  return true;
}

// ✅ Guardar en localStorage (ya no se usa, pero lo dejamos por ahora)
export function saveToStorage(transactions) {
  // Ya no guardamos en localStorage, Supabase es la fuente de verdad
}

// ✅ Cargar desde localStorage (compatibilidad legacy)
export function loadFromStorage() {
  return null; // Ya no usamos localStorage
}

// 🆕 FASE 3C - HISTORIAL DE TRANSACCIONES en Supabase
/**
 * Agregar entrada al historial de cambios de una transacción
 */
export async function addTransactionHistory(userId, transactionId, field, oldValue, newValue) {
  if (!userId || !transactionId) return false;

  // Solo registrar si realmente cambió
  if (oldValue === newValue) return true;

  const { error } = await supabase
    .from('transaction_history')
    .insert([
      {
        user_id: userId,
        transaction_id: transactionId,
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
 * Obtener historial de cambios de una transacción
 */
export async function getTransactionHistory(userId, transactionId) {
  if (!userId || !transactionId) return [];

  const { data, error } = await supabase
    .from('transaction_history')
    .select('*')
    .eq('user_id', userId)
    .eq('transaction_id', transactionId)
    .order('changed_at', { ascending: false });

  if (error) {
    return [];
  }
  return data || [];
}