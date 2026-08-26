import { supabase } from './supabaseService';
import bcryptjs from 'bcryptjs'; // 🆕 Para hashear contraseñas

/**
 * userService.js
 *
 * Gestiona datos del usuario en Supabase
 */

/**
 * Obtener usuario por ID
 */
export async function getUserById(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }
  return data;
}

/**
 * Actualizar perfil de usuario
 */
export async function updateUserProfile(userId, updates) {
  if (!userId) return false;

  const { data, error } = await supabase
    .from('usuarios')
    .update(updates)
    .eq('id', userId)
    .select();

  if (error) {
    return false;
  }
  return data?.[0] || false;
}

/**
 * Actualizar username específicamente
 */
export async function updateUsername(userId, username) {
  return updateUserProfile(userId, { username });
}

/**
 * Actualizar nombre y apellido
 */
export async function updateUserName(userId, nombre, apellido) {
  const username = `${nombre} ${apellido}`.trim();
  return updateUserProfile(userId, { nombre, apellido, username });
}

/**
 * 🆕 Obtener todos los usuarios (para selector en App.jsx)
 */
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, username, nombre, apellido, email, phone')
      .order('created_at', { ascending: true });

    if (error) {
      return [];
    }

    return data || [];
  } catch (err) {
    return [];
  }
}

/**
 * 🆕 FASE 3D - Soft delete: marcar usuario como inactivo
 * El usuario queda en BD 90 días, pero no puede loguearse
 */
export async function softDeleteUser(userId) {
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ is_active: false })
      .eq('id', userId);

    if (error) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 🆕 FASE 3D - Crear nuevo usuario en Supabase
 * Valida email duplicado y crea el usuario con contraseña hasheada
 */
export async function createUser(userData) {
  const { nombre, apellido, email, phone, password, username } = userData;

  if (!nombre || !apellido || !email || !password || !username) {
    throw new Error('Faltan campos requeridos');
  }

  try {
    // 1️⃣ Validar que el email NO existe
    const { data: existingUser, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error('Error al validar email');
    }

    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // 2️⃣ Hashear contraseña
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 3️⃣ Crear usuario en Supabase
    const newId = crypto.randomUUID();
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          id: newId,
          username,
          nombre,
          apellido,
          email,
          phone: phone || '',
          password: hashedPassword, // 🆕 Nombre correcto de columna (no password_hash)
          created_at: new Date().toISOString(),
        }
      ])
      .select('id, username, nombre, apellido, email, phone');

    if (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }

    const user = data?.[0];
    if (!user) throw new Error('No se retornó el usuario creado');

    // 4️⃣ Crear registro en configuraciones_usuario con defaults
    const { error: configError } = await supabase
      .from('configuraciones_usuario')
      .insert([
        {
          user_id: newId,
          show_incomes: false,
          microphoneenabled: true,
          notificationlistenerenabled: false,
          iosshortcutsenabled: false,
          isdark: true,
          idioma: 'es',
          moneda: 'COP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);

    if (configError) {
      // No lanzar error, el usuario ya existe
    }

    return { success: true, user };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Error al registrar usuario'
    };
  }
}

/**
 * 🆕 FASE 3D - Cargar preferencias del usuario
 * @param {string} userId - ID del usuario
 * @returns {Object|null} Preferencias o null si error
 */
export async function getUserPreferences(userId) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('configuraciones_usuario')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (err) {
    return null;
  }
}

/**
 * 🆕 FASE 3D - Guardar preferencias del usuario
 * @param {string} userId - ID del usuario
 * @param {Object} preferences - { show_incomes, microphoneenabled, notificationlistenerenabled, iosshortcutsenabled, isdark, idioma, moneda }
 * @returns {boolean} true si éxito
 */
export async function saveUserPreferences(userId, preferences) {
  if (!userId || !preferences) return false;

  try {
    const { error } = await supabase
      .from('configuraciones_usuario')
      .update({
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}
