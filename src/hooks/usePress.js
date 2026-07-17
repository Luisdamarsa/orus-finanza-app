import { useState } from "react";

/**
 * usePress Hook
 *
 * Proporciona lógica de animación de press (hundimiento) para botones
 * Retorna: pressing state, handlers (onPointerDown/Up/Leave), y estilos base
 *
 * Uso:
 * const { pressing, handlers, getPressStyle } = usePress();
 *
 * <button {...handlers} style={{...getPressStyle()}}>Click me</button>
 */
export function usePress() {
  const [pressing, setPressing] = useState(false);

  const handlers = {
    onPointerDown: () => setPressing(true),
    onPointerUp: () => setPressing(false),
    onPointerLeave: () => setPressing(false),
  };

  /**
   * getPressStyle() - Retorna estilos base de press
   * Parámetros opcionales para personalizar:
   * - scale: factor de escala (default: 0.98)
   * - opacity: opacidad cuando se presiona (default: 0.7)
   * - darkColor: color oscuro para fondo (default: rgba(0, 0, 0, 0.3))
   */
  const getPressStyle = (options = {}) => {
    const {
      scale = 0.98,
      opacity = 0.7,
    } = options;

    return pressing
      ? {
          transform: `scale(${scale}) translateY(1px)`,
          opacity,
          boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.3)",
          transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        }
      : {
          transform: "scale(1) translateY(0)",
          opacity: 1,
          boxShadow: "none",
          transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        };
  };

  /**
   * getBackgroundStyle() - Retorna estilo de fondo condicional
   * Útil para cambiar el fondo cuando se presiona
   */
  const getBackgroundStyle = (normalBg, pressedBg = "rgba(0, 0, 0, 0.3)") => {
    return {
      background: pressing ? pressedBg : normalBg,
    };
  };

  return {
    pressing,
    setPressing,
    handlers,
    getPressStyle,
    getBackgroundStyle,
  };
}
