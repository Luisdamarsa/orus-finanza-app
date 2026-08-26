import { supabase } from './supabaseService';
import bcrypt from 'bcryptjs';

/**
 * authService.js - Autenticación con email + password
 *
 * Valida credenciales contra Supabase usando bcrypt.compare()
 */

/**
 * Buscar usuario por email y validar password
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Object|null} Usuario si es válido, null si no
 */
export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error('Email y contraseña son requeridos');
  }

  try {
    // Buscar usuario por email
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, phone, password, is_active') // 🆕 Traer is_active
      .eq('email', email)
      .single();

    if (userError || !user) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // 🆕 Validar que el usuario esté activo (no haya sido eliminado)
    if (!user.is_active) {
      throw new Error('Esta cuenta ha sido eliminada');
    }

    // Comparar password con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Usuario o contraseña incorrectos');
    }


    // Retornar usuario sin el password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
}

/**
 * Verificar si email ya está registrado
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
 * Crear nuevo usuario con password hasheado
 */
export async function registerUser(userData) {
  const { email, password, nombre, apellido, phone } = userData;

  if (!email || !password) {
    throw new Error('Email y contraseña son requeridos');
  }

  try {
    // Hashear password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario en Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          email,
          password: hashedPassword,
          nombre: nombre || '',
          apellido: apellido || '',
          phone: phone || '',
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Este email ya está registrado');
      }
      throw error;
    }

    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
}
