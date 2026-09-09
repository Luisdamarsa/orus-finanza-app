import { useState, useCallback } from "react";
import * as userService from "../services/userService"; // 🆕 FASE 3D - Para crear usuarios en Supabase
import { supabase } from "../services/supabaseService"; // 🆕 FASE 3F - Para reset password

/**
 * useAuth.js — Hook de autenticación
 *
 * Gestiona:
 * - Usuarios locales (para testing)
 * - Login/Logout
 * - Registro de usuarios
 * - Estado de autenticación
 *
 * TODO: Integrar con Supabase cuando esté configurado
 * Remplazar localStorage mock con Supabase Auth
 */

// ===== USUARIOS DE PRUEBA (LOCAL) =====
// 🆕 UUIDs v4 válidos (Supabase requiere UUID, no strings alphanuméricos)
const MOCK_USERS = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    username: "Luis Daniel",
    nombre: "Luis",
    apellido: "Daniel",
    email: "test@test.com",
    phone: "+57 3001111111",
    password: "password",
    createdAt: "2025-01-01"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    username: "María García",
    nombre: "María",
    apellido: "García",
    email: "test1@example.com",
    phone: "+57 3002222222",
    password: "password1",
    createdAt: "2026-01-15"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    username: "Carlos López",
    nombre: "Carlos",
    apellido: "López",
    email: "test2@example.com",
    phone: "+57 3003333333",
    password: "password2",
    createdAt: "2025-08-01"
  }
];

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * LOGIN — Autentica usuario con email y password
   * 🆕 FASE 3F - Integración completa con Supabase Auth
   * @param {string} username - Email del usuario
   * @param {string} password - Contraseña
   */
  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError("");

    try {
      // 🆕 FASE 3F - Usar Supabase Auth en lugar de simulación
      console.log("🔐 Intentando login con:", username);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (authError) {
        console.error("❌ Error Supabase Auth:", authError);
        throw authError;
      }

      if (!data.user) {
        console.error("❌ No se retornó user en data");
        throw new Error("No se pudo autenticar");
      }

      console.log("✅ Auth exitoso. User:", data.user.email);

      // 🆕 Verificar que la sesión fue creada
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("✅ Sesión creada:", sessionData?.session ? "SÍ" : "NO");

      // Obtener datos completos del usuario desde tabla usuarios
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", username)
        .single();

      if (userError) {
        console.error("❌ Error obteniendo usuario de BD:", userError);
        throw userError;
      }

      if (!userData) {
        console.error("❌ Usuario no encontrado en BD");
        throw new Error("Usuario no encontrado en BD");
      }

      console.log("✅ Datos del usuario cargados:", userData.email);

      const { password: _, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);

      // Guardar en localStorage
      localStorage.setItem("currentUserId", userData.id);
      localStorage.setItem("currentUserEmail", userData.email);

      console.log("✅ LOGIN EXITOSO:", userData.email);
      return { success: true, user: userWithoutPassword };
    } catch (err) {
      console.error("❌ Error en login:", err);
      const errorMsg = err.message || "Error al iniciar sesión";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * REGISTER — Registra un nuevo usuario
   * @param {object} userData - { username, nombre, apellido, email, password, phone }
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError("");

    try {
      const { username, nombre, apellido, email, password, phone } = userData;

      // Validar campos requeridos
      if (!username || !nombre || !apellido || !email || !password) {
        throw new Error("Todos los campos son requeridos");
      }

      // Validar que el username no existe
      if (MOCK_USERS.some((u) => u.username === username)) {
        throw new Error("El nombre de usuario ya existe");
      }

      // Validar que el email no existe
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("El correo electrónico ya está registrado");
      }

      // 🆕 Validar email duplicado en Supabase ANTES de registrar
      // TODO: Descomentar cuando Supabase Auth esté listo
      // try {
      //   const { data: existingUser, error } = await supabase
      //     .from('usuarios')
      //     .select('email')
      //     .eq('email', email)
      //     .maybeSingle();
      //
      //   if (error && error.code !== 'PGRST116') {
      //     throw error;
      //   }
      //
      //   if (existingUser) {
      //     throw new Error("El correo electrónico ya está registrado");
      //   }
      // } catch (err) {
      //   if (err.message.includes("ya está registrado")) {
      //     throw err;
      //   }
      // }

      // TODO: Remplazar con Supabase Auth
      // const { data, error } = await supabase.auth.signUp({
      //   email: email,
      //   password: password,
      //   options: {
      //     data: {
      //       username,
      //       nombre,
      //       apellido,
      //       phone
      //     }
      //   }
      // });

      // 🆕 FASE 3D - Crear usuario en Supabase
      const result = await userService.createUser({
        nombre,
        apellido,
        email,
        phone: phone || "",
        password,
        username
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Log in automáticamente
      setUser(result.user);

      // Guardar en localStorage
      localStorage.setItem("currentUserId", result.user.id);
      localStorage.setItem("currentUserEmail", result.user.email);

      return { success: true, user: result.user };
    } catch (err) {
      const errorMsg = err.message || "Error al registrar";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * LOGOUT — Cierra sesión
   * 🆕 FASE 3F - Integración con Supabase Auth
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // 🆕 FASE 3F - Usar Supabase Auth signOut
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setError("");
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("currentUserEmail");

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || "Error al cerrar sesión";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * RESET PASSWORD FOR EMAIL — Envía email de reset (Step 1)
   * @param {string} email - Email del usuario
   */
  const resetPasswordForEmail = useCallback(async (email) => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/reset-password",
      });

      if (error) throw error;

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || "Error al enviar email de reset";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * VERIFY OTP AND RESET PASSWORD — Verifica código + cambia contraseña (Step 2-3)
   * @param {string} email - Email del usuario
   * @param {string} token - Token OTP (6 dígitos)
   * @param {string} newPassword - Nueva contraseña
   */
  const verifyOtpAndReset = useCallback(async (email, token, newPassword) => {
    setIsLoading(true);
    setError("");

    try {
      // 🆕 FASE 3F - Verificar OTP con Supabase
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "recovery",
      });

      if (verifyError) throw verifyError;
      if (!data.session) throw new Error("Sesión no establecida");

      // 🆕 Cambiar contraseña usando la sesión verificada
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || "Error al cambiar contraseña";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * RESET PASSWORD (DEPRECATED - kept for backwards compat)
   * @param {string} email - Email del usuario
   * @param {string} newPassword - Nueva contraseña
   */
  const resetPassword = useCallback(async (email, newPassword) => {
    // Redirigir a verifyOtpAndReset
    return verifyOtpAndReset(email, "", newPassword);
  }, [verifyOtpAndReset]);

  /**
   * GET SESSION — Obtiene la sesión actual de Supabase Auth
   * 🆕 FASE 3F - Para debuggear y verificar sesión activa
   */
  const getSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session: data.session };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * GET ALL USERS — Retorna lista de todos los usuarios (solo para testing/admin)
   * TODO: remover cuando conectes Supabase
   */
  const getAllUsers = useCallback(() => {
    return MOCK_USERS.map(({ password: _, ...user }) => user);
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    resetPasswordForEmail, // 🆕 FASE 3F
    verifyOtpAndReset, // 🆕 FASE 3F
    getSession, // 🆕 FASE 3F - Para debuggear sesión
    getAllUsers, // Solo para testing
  };
}
