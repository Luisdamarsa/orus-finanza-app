/**
 * inputStyles.js — Estilos reutilizables para campos input
 * Garantiza consistencia visual de inputs en toda la app
 */

// ===== ESTILOS BASE DE INPUT =====
export const inputBase = {
  width: "100%",
  boxSizing: "border-box", // CRÍTICO: incluye padding en ancho total
  padding: "10px 18px",
  margin: 0,
  fontSize: 14,
  fontFamily: "inherit",
  borderRadius: 16,
  background: "#1e1b28",
  color: "#F5F3FF",
  outline: "none",
  boxShadow: "inset 0 6px 12px -8px rgba(0,0,0,0.5)",
  transition: "all 0.3s",
};

/**
 * Crear un objeto de estilo completo para input
 * @param {string} borderColor - Color del border (ej: "#FF8A8A" para error)
 * @returns {object} Objeto de estilo para aplicar a <input>
 */
export const getInputStyle = (borderColor = "rgba(255,255,255,0.07)") => ({
  ...inputBase,
  border: `1px solid ${borderColor}`,
});

/**
 * Ejemplo de uso en un componente:
 *
 * import { getInputStyle } from "../utils/inputStyles";
 *
 * <input
 *   type="email"
 *   style={getInputStyle(error ? "#FF8A8A" : undefined)}
 * />
 */
