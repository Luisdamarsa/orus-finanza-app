/**
 * oauthService.js
 *
 * Maneja login/signup con Google y Apple via Supabase OAuth
 * IMPORTANTE: Después de OAuth, crear usuario en tabla usuarios si no existe
 */

import { supabase } from './supabaseService';

/**
 * Iniciar flujo OAuth con Google o Apple
 * Redirige a Supabase Auth → proveedor → callback
 *
 * @param {string} provider - 'google' o 'apple'
 */
export async function signInWithOAuth(provider) {
  try {
    console.error(`[oauthService] Iniciando OAuth con ${provider}`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider, // 'google' | 'apple'
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(`[oauthService] Error OAuth ${provider}:`, error.message);
      throw error;
    }

    console.error(`[oauthService] ✅ Redirigiendo a ${provider}...`);
    return data;
  } catch (error) {
    console.error(`[oauthService] Error en signInWithOAuth:`, error.message);
    throw error;
  }
}

/**
 * Después de OAuth callback, sincronizar usuario en tabla usuarios
 * Llamar esto en useEffect cuando la sesión se actualiza
 *
 * @returns {Object} { user, wasReactivated } - wasReactivated = true si se reactivó una cuenta eliminada
 */
export async function syncOAuthUserToDatabase() {
  try {
    // Obtener sesión actual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData?.session) {
      throw new Error('No hay sesión OAuth activa');
    }

    const authUser = sessionData.session.user;

    // authUser.id = UUID de auth.users
    // authUser.email = email del proveedor
    // authUser.user_metadata.name = nombre del proveedor (si existe)

    console.error(`[oauthService] Sincronizando usuario OAuth: ${authUser.email}`);

    // Verificar si usuario ya existe en tabla usuarios
    const { data: existingUser, error: checkError } = await supabase
      .from('usuarios')
      .select('id, is_active') // 🆕 Traer is_active
      .eq('id', authUser.id)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // 🆕 Si existe pero está inactivo, REACTIVAR automáticamente (solo para OAuth)
    if (existingUser && !existingUser.is_active) {
      console.error(`[oauthService] Cuenta inactiva detectada, reactivando...`);

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ is_active: true })
        .eq('id', authUser.id);

      if (updateError) {
        throw updateError;
      }

      console.error(`[oauthService] ✅ Cuenta reactivada automáticamente`);
      return { user: { ...existingUser, is_active: true }, wasReactivated: true };
    }

    // Si no existe, crear registro en usuarios
    if (!existingUser) {
      console.error(`[oauthService] Usuario nuevo, creando en tabla usuarios...`);

      // Extraer nombre completo de OAuth
      const fullName = authUser.user_metadata?.name
        || authUser.user_metadata?.full_name
        || authUser.email?.split('@')[0]
        || 'Usuario';

      // 🆕 Separar nombre y apellido (primera palabra = nombre, última palabra = apellido)
      const nameParts = fullName.trim().split(' ');
      const rawNombre = nameParts[0] || 'Usuario';
      const rawApellido = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

      // Capitalizar correctamente (primera letra mayúscula, resto minúscula)
      const nombre = rawNombre.charAt(0).toUpperCase() + rawNombre.slice(1).toLowerCase();
      const apellido = rawApellido.charAt(0).toUpperCase() + rawApellido.slice(1).toLowerCase();

      const { data: newUser, error: createError } = await supabase
        .from('usuarios')
        .insert({
          id: authUser.id,
          email: authUser.email,
          nombre: nombre,
          apellido: apellido,
          username: nombre.toLowerCase(),
          phone: '',
          is_active: true,
        })
        .select()
        .single();

      if (createError) {
        console.error(`[oauthService] Error creando usuario:`, createError.message);
        throw createError;
      }

      console.error(`[oauthService] ✅ Usuario creado en tabla usuarios`);
      return { user: newUser, wasReactivated: false };
    }

    console.error(`[oauthService] ✅ Usuario ya existe en tabla usuarios`);
    return { user: existingUser, wasReactivated: false };
  } catch (error) {
    console.error(`[oauthService] Error en syncOAuthUserToDatabase:`, error.message);
    throw error;
  }
}
