import { useRef, useEffect } from "react";

/**
 * useButtonPress
 * Hook para manejar efecto de hundimiento mientras se presiona
 * Similar a un botón físico: se hunde mientras presionas, vuelve al soltar
 *
 * Uso:
 * const buttonRef = useRef(null);
 * useButtonPress(buttonRef);
 * <div ref={buttonRef} onClick={handleClick}>...</div>
 */
export function useButtonPress(elementRef) {
  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const handleMouseDown = () => {
      console.log("🔻 MouseDown - Agregando 'pressed'");
      element.classList.add("pressed");
    };

    const handleMouseUp = () => {
      console.log("🔺 MouseUp - Removiendo 'pressed'");
      element.classList.remove("pressed");
    };

    // Remover también cuando el mouse sale del elemento
    const handleMouseLeave = () => {
      console.log("🚫 MouseLeave - Removiendo 'pressed'");
      element.classList.remove("pressed");
    };

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [elementRef]);
}

/**
 * useTemporaryPress (versión anterior - mantenida para compatibilidad)
 * DEPRECATED: Usar useButtonPress en su lugar
 */
export function useTemporaryPress(duration = 200) {
  const timeoutRef = useRef(null);

  const handlePress = (e) => {
    const element = e.currentTarget;
    console.log("🎯 handlePress called on:", element.tagName, element.className);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      element.classList.remove("pressed");
    }

    console.log("➕ Adding 'pressed' class");
    element.classList.add("pressed");

    timeoutRef.current = setTimeout(() => {
      console.log("➖ Removing 'pressed' class");
      element.classList.remove("pressed");
      timeoutRef.current = null;
    }, duration);
  };

  return handlePress;
}
