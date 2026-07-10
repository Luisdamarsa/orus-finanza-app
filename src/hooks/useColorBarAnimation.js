import { useEffect } from "react";

/**
 * useColorBarAnimation.js
 *
 * Hook que maneja la inyección de keyframes para la animación de ColorBar
 * Separa la lógica de animación del componente visual
 *
 * Animación: ScaleX 0 → 1 (cada segmento crece de izquierda a derecha)
 * Características:
 * - Inyecta keyframes una sola vez
 * - Devuelve config de animación lista para usar en cada segmento
 * - Staggered delay entre segmentos
 * - Transform Origin: left (crece desde la izquierda)
 *
 * Returns: {
 *   getSegmentAnimation: (index) => objeto con estilo de animación
 * }
 */
export function useColorBarAnimation() {
  // ✅ Inyectar keyframes de animación UNA SOLA VEZ
  useEffect(() => {
    if (!document.getElementById("colorbar-animation-keyframes")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "colorbar-animation-keyframes";
      styleSheet.textContent = `
        @keyframes colorBarSegmentFill {
          from {
            transform: scaleX(0) !important;
            opacity: 0.5;
          }
          to {
            transform: scaleX(1) !important;
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  // Función para obtener la animación de un segmento
  // Duración: 0.6s, Delay staggered: 0.1s entre segmentos
  const getSegmentAnimation = (index) => ({
    animation: `colorBarSegmentFill 0.6s ease-out ${index * 0.1}s both`,
  });

  return { getSegmentAnimation };
}
