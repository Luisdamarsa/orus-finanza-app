import { supabase } from './supabaseService';

/**
 * authService.js - Autenticacion con Supabase Auth
 *
 * FASE 3F FINAL - auth.users es la source of truth
 * Edge Function maneja creacion/cambios en auth.users
 */

/**
 * Login con Supabase Auth
 * @param {string} email - Email del usuario
 * @param {string} password - Contrasena en texto plano
 * @returns {Object} Usuario con datos personalizados
 */
export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error('Email y contrasena son requeridos');
  }

  try {
    // Autenticar con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData?.user) {
      throw new Error('Usuario o contrasena incorrectos');
    }

    const userId = authData.user.id;

    // Obtener datos personalizados de tabla usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, phone, is_active')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      throw new Error('Usuario no encontrado en sistema');
    }

    // Validar que el usuario este activo (soft delete)
    if (!userData.is_active) {
      throw new Error('Esta cuenta ha sido eliminada');
    }

    // Guardar email en localStorage para ChangePasswordModal
    localStorage.setItem('currentUserEmail', userData.email);

    return {
      id: userId,
      email: userData.email,
      nombre: userData.nombre,
      apellido: userData.apellido,
      phone: userData.phone,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Verificar si email ya esta registrado
 */
export async function checkEmailExists(email) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single();

  return !!data && !error;
}

/**
 * Crear nuevo usuario (usa Edge Function)
 */
export async function registerUser(userData) {
  // Este metodo ahora usa la Edge Function
  // Ver authManagementService.js para implementacion
  throw new Error('Use authManagementService.createUserInAuth() en su lugar');
}
