/**
 * User Storage Adapter - DEV VERSION
 * Maneja toda la lógica de lectura/escritura de datos del usuario en localStorage
 *
 * ⚠️ DEV VERSION: Usa prefijo "orus_dev_user" que se limpia al recargar
 *
 * Estructura:
 * {
 *   displayName: string,      // Nombre que elige el usuario (editable)
 *   firstName: string,        // Nombre(s) - del login (read-only)
 *   lastName: string,         // Apellido(s) - del login (read-only)
 *   email: string,            // Correo - del login (read-only)
 *   phone: string,            // Teléfono - del login (read-only)
 *   currency: string,         // "COP" | "USD" | "EUR" (editable)
 *   language: string          // "ES" | "EN" (editable)
 * }
 */

const STORAGE_KEY = "orus_dev_user"; // 🔄 DEV: cambios se limpian al recargar

const DEFAULT_USER = {
  displayName: "Luis Daniel",
  firstName: "Test",
  lastName: "TEST",
  email: "test@test.com",
  phone: "+57 1111111111",
  currency: "COP",
  language: "ES",
};

export const userStorage = {
  /**
   * Obtiene los datos del usuario completos
   */
  getUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Primera vez: guardar y retornar defaults
        userStorage.initUser();
        return DEFAULT_USER;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      return DEFAULT_USER;
    }
  },

  /**
   * Actualiza datos específicos del usuario
   * @param {Object} updates - Los campos a actualizar
   */
  updateUser: (updates) => {
    try {
      const current = userStorage.getUser();
      const updated = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error updating user in localStorage:", error);
      return null;
    }
  },

  /**
   * Inicializa el usuario con valores por defecto
   */
  initUser: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  },

  /**
   * Resetea el usuario a valores por defecto
   */
  resetUser: () => {
    userStorage.initUser();
    return DEFAULT_USER;
  },

  /**
   * Obtiene solo el displayName (usado en Home)
   */
  getDisplayName: () => {
    return userStorage.getUser().displayName || "Usuario";
  },

  /**
   * Actualiza solo el displayName
   */
  setDisplayName: (name) => {
    return userStorage.updateUser({ displayName: name });
  },

  /**
   * Obtiene la moneda actual
   */
  getCurrency: () => {
    return userStorage.getUser().currency || "COP";
  },

  /**
   * Actualiza la moneda
   */
  setCurrency: (currency) => {
    return userStorage.updateUser({ currency });
  },

  /**
   * Obtiene el idioma actual
   */
  getLanguage: () => {
    return userStorage.getUser().language || "ES";
  },

  /**
   * Actualiza el idioma
   */
  setLanguage: (language) => {
    return userStorage.updateUser({ language });
  },
};
