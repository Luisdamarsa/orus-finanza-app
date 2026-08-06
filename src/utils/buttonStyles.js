/**
 * buttonStyles.js — Estilos reutilizables para botones CTA
 * Fuente de verdad para consistencia visual en toda la app
 */

// ===== GRADIENTE MORADO PRIMARIO (CTA) =====
export const primaryButtonGradient = "linear-gradient(155deg, #B18CFF 0%, #8B5CF6 100%)";
export const primaryButtonShadowEnabled = "0 14px 26px -10px rgba(139, 92, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.35)";
export const primaryButtonShadowDisabled = "0 2px 8px rgba(0, 0, 0, 0.3)";

// ===== ESTILOS BASE DE BOTÓN CTA =====
export const ctaButtonBase = {
  width: "100%",
  boxSizing: "border-box",
  padding: "16px",
  borderRadius: 16,
  border: "none",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 800,
  transition: "all 0.3s ease",
};

/**
 * Crear un objeto de estilo completo para botón CTA
 * @param {boolean} isEnabled - Si el botón está habilitado
 * @returns {object} Objeto de estilo para aplicar a <button>
 */
export const getCTAButtonStyle = (isEnabled = true) => ({
  ...ctaButtonBase,
  background: primaryButtonGradient,
  boxShadow: isEnabled ? primaryButtonShadowEnabled : primaryButtonShadowDisabled,
  opacity: isEnabled ? 1 : 0.5,
  cursor: isEnabled ? "pointer" : "not-allowed",
});

/**
 * Ejemplo de uso en un componente:
 *
 * import { getCTAButtonStyle } from "../utils/buttonStyles";
 *
 * <button
 *   disabled={!email || isLoading}
 *   style={getCTAButtonStyle(email && !isLoading)}
 * >
 *   Enviar
 * </button>
 */

// ===== BOTÓN SECUNDARIO (Gris) =====
export const secondaryButtonStyle = {
  ...ctaButtonBase,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.07)",
  color: "#F5F3FF",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
};

// ===== BOTÓN DESTRUCTIVO (Rojo) =====
export const destructiveButtonStyle = {
  ...ctaButtonBase,
  background: "linear-gradient(155deg, #FF8A8A 0%, #FF5757 100%)",
  boxShadow: "0 10px 22px -8px rgba(255, 87, 87, 0.4)",
};

// ===== BOTÓN EXITOSO (Verde) =====
export const successButtonStyle = {
  ...ctaButtonBase,
  background: "linear-gradient(155deg, #86EFAC 0%, #65E890 100%)",
  boxShadow: "0 10px 22px -8px rgba(101, 232, 144, 0.4)",
};
