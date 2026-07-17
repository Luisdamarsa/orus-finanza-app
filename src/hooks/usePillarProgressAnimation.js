import { useEffect } from "react";

/**
 * usePillarProgressAnimation.js
 *
 * Hook que proporciona la lógica de animación para PillarProgressBar
 *
 * Características:
 * - Animación suave de relleno (width 0% → target-width)
 * - Solo anima en primer load (shouldAnimate = true)
 * - Sin animación al filtrar (shouldAnimate = false)
 * - Staggered animation (cada segmento se anima con delay)
 * - Inyecta keyframes globales automáticamente
 *
 * Returns: {
 *   animationStyles,     // Estilos CSS para cada segmento (no usado ahora)
 *   containerStyle       // Estilos para el contenedor
 * }
 */
export function usePillarProgressAnimation() {
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
  };

  // ✅ Inyectar keyframes globales una sola vez
  useEffect(() => {
    if (!document.getElementById("pillar-progress-animation-keyframes")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "pillar-progress-animation-keyframes";
      styleSheet.textContent = `
        @keyframes pillarFill {
          from {
            width: 0 !important;
            opacity: 0.7;
          }
          to {
            width: var(--target-width, 100%) !important;
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  return {
    animationStyles: {}, // Ya no se usa (animación en componente)
    containerStyle,
  };
}
