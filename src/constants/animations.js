/**
 * animations.js — Constantes de animaciones y transiciones Spatial UI
 * Estándar: clayRise, clayhover, claytap
 */

// Duración estándar de animaciones (ms)
export const ANIMATION_DURATIONS = {
  slow: 550,
  normal: 350,
  fast: 200,
  quick: 150,
};

// Curvas de easing
export const EASING = {
  clayRise: "cubic-bezier(0.34, 1.56, 0.64, 1)", // rebote ligero
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",         // suave
  snappy: "cubic-bezier(0.4, 0, 0.6, 1)",         // rápido
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // rebote fuerte
};

// Transformaciones estándar
export const TRANSFORMS = {
  clayRise: {
    from: "opacity: 0; transform: translateY(16px) scale(0.97);",
    to: "opacity: 1; transform: translateY(0) scale(1);",
  },
  clayhover: {
    enter: "transform: translateY(-3px);",
    leave: "transform: translateY(0);",
  },
  claytap: {
    press: "transform: scale(0.96) translateY(1px);",
    release: "transform: scale(1) translateY(0);",
  },
};

// Clases CSS predefinidas
export const ANIMATION_CLASSES = {
  clayRise: "orus-rise",
  clayHover: "clay-hoverable",
  clayTap: "clay-tap",
};

// Tiempo de delay para staggered animations (ms)
export const STAGGER_DELAY = 50; // cada elemento: idx * 50ms

/**
 * Generar estilo de delay para staggered animation
 * @param {number} index - índice del elemento en el array
 * @returns {string} CSS de animationDelay
 */
export function getStaggerDelay(index) {
  return `${index * STAGGER_DELAY}ms`;
}

/**
 * Generar estilos CSS para una animación clay completa
 * @param {string} type - tipo de animación ("clayRise", "clayhover", "claytap")
 * @param {number} duration - duración en ms
 * @param {string} easing - curva de easing
 * @returns {object} objeto con propiedades CSS para inline styles
 */
export function getAnimationStyle(type, duration = ANIMATION_DURATIONS.normal, easing = EASING.clayRise) {
  return {
    animation: `${type} ${duration}ms ${easing} forwards`,
  };
}

/**
 * Generar estilos de transición suave
 * @param {array<string>} properties - propiedades a animar (ej. ["transform", "opacity"])
 * @param {number} duration - duración en ms
 * @param {string} easing - curva de easing
 * @returns {object} objeto con propiedad transition
 */
export function getTransitionStyle(properties = ["all"], duration = ANIMATION_DURATIONS.fast, easing = EASING.smooth) {
  const transitionStr = properties.map(prop => `${prop} ${duration}ms ${easing}`).join(", ");
  return {
    transition: transitionStr,
  };
}
