/**
 * resetPasswordService.js
 *
 * FASE 3F FINAL - Reset con OTP custom + Edge Function
 */

import { supabase } from './supabaseService';
import { resetPasswordInAuth } from './authManagementService';

/**
 * PASO 1: Generar OTP y guardar en BD
 * @param {string} email - Email del usuario
 * @returns {Object} { success, message }
 */
export async function sendPasswordResetCode(email) {
  if (!email) {
    throw new Error('Email es requerido');
  }

  try {
    // Generar OTP de 6 digitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Limpiar tokens antiguos
    await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('email', email)
      .lt('expires_at', new Date().toISOString());

    // Guardar nuevo token
    const { data: insertData, error: insertError } = await supabase
      .from('password_reset_tokens')
      .insert([{ email, token: otp }])
      .select();

    if (insertError || !insertData || insertData.length === 0) {
      throw insertError || new Error('No se pudo guardar el codigo');
    }

    // Para testing: mostrar OTP en consola
    console.log('\n' + '='.repeat(60));
    console.log('🔑 CODIGO DE RESET (testing)');
    console.log('='.repeat(60));
    console.log('Email: ' + email);
    console.log('Codigo: ' + otp);
    console.log('Valido por: 15 minutos');
    console.log('='.repeat(60) + '\n');

    return {
      success: true,
      message: 'Codigo de verificacion generado para ' + email,
    };
  } catch (error) {
    throw new Error(error.message || 'Error al enviar codigo de reset');
  }
}

/**
 * PASO 2: Verificar codigo OTP + cambiar contrasena (usa Edge Function)
 * @param {string} email - Email del usuario
 * @param {string} token - Codigo OTP
 * @param {string} newPassword - Nueva contrasena
 * @returns {Object} { success, message }
 */
export async function verifyResetCodeAndUpdatePassword(email, token, newPassword) {
  if (!email || !token || !newPassword) {
    throw new Error('Email, codigo y contrasena son requeridos');
  }

  try {
    // Verificar que el OTP existe y no ha expirado
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('email', email)
      .eq('token', token)
      .is('used_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !resetToken) {
      throw new Error('Codigo invalido o expirado');
    }

    // Verificar expiracion (15 minutos)
    const now = new Date();
    const expiresAt = new Date(resetToken.expires_at);

    if (now > expiresAt) {
      throw new Error('Codigo expirado. Solicita uno nuevo');
    }

    // Llamar Edge Function para cambiar contrasena en auth.users
    const result = await resetPasswordInAuth(email, token, newPassword);

    if (!result.success) {
      throw new Error(result.error || 'Error al cambiar contrasena');
    }

    return {
      success: true,
      message: 'Contrasena actualizada correctamente',
    };
  } catch (error) {
    throw new Error(error.message || 'Error al cambiar contrasena');
  }
}

/**
 * Limpiar tokens expirados
 */
export async function cleanupExpiredTokens() {
  try {
    const { error } = await supabase
      .from('password_reset_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error limpiando tokens expirados:', error);
    return { success: false, error: error.message };
  }
}
