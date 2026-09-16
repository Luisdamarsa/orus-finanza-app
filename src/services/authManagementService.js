/**
 * authManagementService.js
 *
 * FASE 3F HYBRID - Servicio que llama Edge Function
 * La Edge Function tiene Service Role Key para manejar auth.users
 *
 * Acciones soportadas:
 * - create: crear usuario en auth.users + usuarios
 * - change-password: cambiar contraseña en auth.users
 * - reset-password: reset con OTP
 * - delete-account: soft delete
 */

const EDGE_FUNCTION_URL = "https://iwipnbyoufyvboqlokdg.supabase.co/functions/v1/manage-auth";

/**
 * Llamar Edge Function con action y data
 * @param {string} action - create, change-password, reset-password, delete-account
 * @param {object} data - { email, password, newPassword, nombre, apellido, phone, token }
 * @returns {object} { success, userId, error }
 */
export async function callManageAuth(action, data) {
  try {
    const payload = {
      action,
      ...data,
    };

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`[authManagementService] Error (${response.status}):`, result.error);
      throw new Error(result.error || "Error en Edge Function");
    }

    return result;
  } catch (error) {
    console.error(`[authManagementService] Error:`, error.message);
    throw error;
  }
}

/**
 * Crear nuevo usuario
 */
export async function createUserInAuth(email, password, nombre, apellido, phone) {
  return callManageAuth("create", {
    email,
    password,
    nombre,
    apellido,
    phone,
  });
}

/**
 * Cambiar contraseña
 */
export async function changePasswordInAuth(email, newPassword) {
  return callManageAuth("change-password", {
    email,
    newPassword,
  });
}

/**
 * Reset contraseña con OTP
 */
export async function resetPasswordInAuth(email, token, newPassword) {
  return callManageAuth("reset-password", {
    email,
    token,
    newPassword,
  });
}

/**
 * Eliminar cuenta (soft delete)
 */
export async function deleteAccountInAuth(email) {
  return callManageAuth("delete-account", {
    email,
  });
}
