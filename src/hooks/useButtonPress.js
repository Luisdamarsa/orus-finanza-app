import { useRef } from "react";

/**
 * Hook para manejar el efecto de presión en botones
 * Agrega/remueve clase CSS "pressed" al hacer click
 *
 * @param {Function} callback - Función a ejecutar al presionar
 * @param {number} duration - Duración del efecto en ms (default: 300)
 * @returns {Function} Función para usar en onClick
 */
export function useButtonPress(callback, duration = 300) {
  const buttonRef = useRef(null);

  const handlePress = (e) => {
    const button = e.currentTarget;

    // Agregar clase pressed
    button.classList.add("pressed");

    // Ejecutar callback
    if (callback) {
      callback(e);
    }

    // Remover clase después de la duración
    setTimeout(() => {
      button.classList.remove("pressed");
    }, duration);
  };

  return handlePress;
}
