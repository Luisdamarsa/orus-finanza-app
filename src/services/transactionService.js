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
    console.error('Error fetching transactions:', error);
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
        method: txData.method,
      }
    ])
    .select();

  if (error) {
    console.error('Error adding transaction:', error);
    return null;
  }
  return data?.[0] || null;
}

// ✅ Editar transacción
export async function editTransaction(transactionId, updates) {
  const { data, error } = await supabase
    .from('transacciones')
    .update(updates)
    .eq('id', transactionId)
    .select();

  if (error) {
    console.error('Error editing transaction:', error);
    return null;
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
    console.error('Error deleting transaction:', error);
    return false;
  }
  return true;
}

// ✅ Guardar en localStorage (ya no se usa, pero lo dejamos por ahora)
export function saveToStorage(transactions) {
  // Ya no guardamos en localStorage, Supabase es la fuente de verdad
  console.log('💾 Datos guardados en Supabase automáticamente');
}

// ✅ Cargar desde localStorage (compatibilidad legacy)
export function loadFromStorage() {
  return null; // Ya no usamos localStorage
}