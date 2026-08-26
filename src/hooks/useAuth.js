import { useState, useCallback } from "react";
import * as userService from "../services/userService"; // 🆕 FASE 3D - Para crear usuarios en Supabase

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
   * LOGIN — Autentica usuario con username/email y password
   * @param {string} username - Usuario o correo
   * @param {string} password - Contraseña
   */
  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError("");

    try {
      // TODO: Remplazar con Supabase Auth
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email: username,
      //   password: password
      // });

      // Simulación local (remove cuando conectes Supabase)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundUser = MOCK_USERS.find(
        (u) => u.email === username && u.password === password
      );

      if (foundUser) {
        // No guardar password en el estado
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setError("");
        return { success: true, user: userWithoutPassword };
      } else {
        setError("Usuario o contraseña incorrectos");
        return { success: false, error: "Usuario o contraseña incorrectos" };
      }
    } catch (err) {
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
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Remplazar con Supabase Auth
      // await supabase.auth.signOut();

      setUser(null);
      setError("");
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
   * RESET PASSWORD — Cambia la contraseña (simulado)
   * @param {string} email - Email del usuario
   * @param {string} newPassword - Nueva contraseña
   */
  const resetPassword = useCallback(async (email, newPassword) => {
    setIsLoading(true);
    setError("");

    try {
      // TODO: Remplazar con Supabase Auth
      // const { error } = await supabase.auth.updateUser({
      //   password: newPassword
      // });

      // Simulación local
      await new Promise((resolve) => setTimeout(resolve, 800));

      const userIndex = MOCK_USERS.findIndex((u) => u.email === email);
      if (userIndex === -1) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizar contraseña en mock
      MOCK_USERS[userIndex].password = newPassword;

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
    getAllUsers, // Solo para testing
  };
}
