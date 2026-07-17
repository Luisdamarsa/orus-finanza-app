import { useEffect } from "react";

/**
 * useColorRevealAnimation.js
 *
 * Hook que maneja la animación de "color reveal" para ColorBar
 * Separa la lógica de animación del componente visual
 *
 * Funcionalidad:
 * - Cada segmento comienza con color gris (saldo)
 * - Se anima a su color real de pilar
 * - Secuencia: Fijos → Deuda → Ahorro → Ocio → Varios → Saldo
 * - Delay staggered entre segmentos
 *
 * Returns: {
 *   getSegmentAnimation: (index) => objeto con estilo de animación
 * }
 */
export function useColorRevealAnimation() {
  // ✅ Inyectar keyframes UNA SOLA VEZ
  useEffect(() => {
    if (!document.getElementById("colorbar-reveal-animation-keyframes")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "colorbar-reveal-animation-keyframes";
      styleSheet.textContent = `
        @keyframes colorReveal {
          from {
            background-color: var(--saldo-color) !important;
          }
          to {
            background-color: var(--segment-color) !important;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  // Función para obtener la animación de un segmento
  // Duración: 0.1s, Delay staggered: 0.1s entre segmentos
  // Total: 0.6s (0.1s + 5 segmentos × 0.1s)
  const getSegmentAnimation = (index) => ({
    animation: `colorReveal 0.1s ease-out ${index * 0.1}s both`,
  });

  return { getSegmentAnimation };
}
