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
 *   authProvider: string|null,// "google" | "apple" | null (registro normal) - del login
 *   currency: string,         // "COP" | "USD" | "EUR" (editable)
 *   language: string,         // "ES" | "EN" (editable)
 *   userId: string            // ID único del usuario (10 caracteres alfanuméricos) - generado al crear
 *   role: string,             // "user" | "admin" - rol del usuario (por defecto "user")
 *   subscription: string      // "FREE" | "PLUS" | "PRO" - plan activo (por defecto "FREE")
 * }
 */

const STORAGE_KEY = "orus_dev_user"; // 🔄 DEV: cambios se limpian al recargar

// Función para generar User ID único (10 caracteres alfanuméricos)
const generateUserId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let userId = '';
  for (let i = 0; i < 10; i++) {
    userId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return userId;
};

// Detecta el idioma soportado (ES/EN) desde el dispositivo. Fallback: ES.
export function detectLanguage() {
  if (typeof navigator === "undefined") return "ES";
  const lang = (navigator.language || "es").split("-")[0].toLowerCase();
  const supported = { es: "ES", en: "EN", fr: "FR", it: "IT", pt: "PT" };
  return supported[lang] || "ES";
}

// Detecta la región (país) del dispositivo/sesión: locale -> zona horaria. Fallback: null.
function detectRegion() {
  if (typeof navigator === "undefined") return null;
  try {
    const r = new Intl.Locale(navigator.language).region;
    if (r) return r.toUpperCase(); // ej "es-CO" -> "CO"
  } catch { /* noop */ }
  const part = (navigator.language || "").split("-")[1];
  if (part && part.length === 2) return part.toUpperCase();
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const tzToRegion = {
      "America/Bogota": "CO", "America/Guayaquil": "EC", "America/Panama": "PA",
      "America/New_York": "US", "America/Chicago": "US", "America/Los_Angeles": "US",
      "America/Mexico_City": "MX", "America/Lima": "PE", "America/Santiago": "CL",
      "America/Argentina/Buenos_Aires": "AR", "Europe/Madrid": "ES",
      "Europe/Paris": "FR", "Europe/Berlin": "DE",
    };
    if (tzToRegion[tz]) return tzToRegion[tz];
  } catch { /* noop */ }
  return null;
}

// Deriva la moneda soportada (COP/USD/EUR) desde la región. Fallback: COP.
export function detectCurrency() {
  const region = detectRegion();
  const byRegion = {
    CO: "COP",
    US: "USD", EC: "USD", PA: "USD", SV: "USD",
    ES: "EUR", FR: "EUR", DE: "EUR", IT: "EUR", PT: "EUR", NL: "EUR", IE: "EUR",
    GB: "GBP", JP: "JPY", CN: "CNY", AU: "AUD", CA: "CAD", CH: "CHF",
    HK: "HKD", SG: "SGD", IN: "INR", KR: "KRW", BR: "BRL", MX: "MXN",
  };
  const supported = ["COP", "USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD", "CHF", "HKD", "SGD", "INR", "KRW", "BRL", "MXN"];
  const cur = byRegion[region];
  return supported.includes(cur) ? cur : "COP";
}

const DEFAULT_USER = {
  displayName: "Luis Daniel",
  firstName: "Test",
  lastName: "TEST",
  email: "test@test.com",
  phone: "+57 1111111111",
  authProvider: "google", // "google" | "apple" | null (registro normal)
  currency: "COP", // demo colombiano fijo; detectCurrency() se usa en el onboarding real
  language: "ES",  // demo fijo; detectLanguage() se usa en el onboarding real
  userId: generateUserId(), // Genera un ID único
  role: "user",        // rol del usuario
  subscription: "FREE", // plan activo por defecto
  theme: "dark",       // "dark" | "light" (preferencia de tema)
};

// Planes válidos de suscripción
export const SUBSCRIPTIONS = ["FREE", "PLUS", "PRO"];

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
      const parsed = JSON.parse(stored);
      // Backfill: usuarios guardados antes de tener role/subscription/theme
      return { role: "user", subscription: "FREE", theme: "dark", ...parsed };
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

  /**
   * Obtiene el rol del usuario
   */
  getRole: () => {
    return userStorage.getUser().role || "user";
  },

  /**
   * Obtiene la suscripción activa ("FREE" | "PLUS" | "PRO")
   */
  getSubscription: () => {
    return userStorage.getUser().subscription || "FREE";
  },

  /**
   * Cambia la suscripción activa. Valida contra SUBSCRIPTIONS.
   */
  setSubscription: (plan) => {
    const value = SUBSCRIPTIONS.includes(plan) ? plan : "FREE";
    return userStorage.updateUser({ subscription: value });
  },

  /**
   * Obtiene el tema ("dark" | "light"). Default "dark".
   */
  getTheme: () => {
    return userStorage.getUser().theme || "dark";
  },

  /**
   * Cambia el tema. Solo acepta "dark" | "light".
   */
  setTheme: (theme) => {
    const value = theme === "light" ? "light" : "dark";
    return userStorage.updateUser({ theme: value });
  },
};
