/**
 * ThemeContext.jsx — Contexto centralizado para tema (dark/light)
 * Maneja: isDark (booleano), setIsDark (setter), tema computed
 * Persistencia: userStorage
 * Inyecta: keyframes, sombras clay, estilos globales
 */

import { createContext, useState, useEffect } from "react";
import { DARK, LIGHT, KEYFRAMES, SHADOWS, RADIUS, TYPOGRAPHY } from "../constants/tokens";
import { userStorage } from "../utils/userStorage";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Inicializar desde userStorage (por defecto: dark mode)
  const [isDark, setIsDarkState] = useState(() => {
    const stored = userStorage.getTheme?.();
    return stored !== undefined ? stored : true; // default: dark mode
  });

  // Inyectar keyframes + estilos globales en <head> (una sola vez)
  useEffect(() => {
    if (!document.getElementById("clay-theme-styles")) {
      const style = document.createElement("style");
      style.id = "clay-theme-styles";
      style.textContent = `
        ${KEYFRAMES}

        /* Estilos globales Spatial UI */
        * {
          font-family: ${TYPOGRAPHY.family};
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        body {
          background: #000000;
        }

        /* Animación clayRise (predeterminada) */
        .orus-rise {
          animation: clayRise 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-fill-mode: both;
        }

        /* Hover clay (desktop only) */
        @media (hover: hover) and (pointer: fine) {
          .clay-hoverable:hover {
            transform: translateY(-3px);
            transition: transform 0.2s ease;
          }
        }

        /* Tap/press clay */
        .clay-tap:active {
          transform: scale(0.96) translateY(1px);
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Setter que persiste
  const setIsDark = (newValue) => {
    const value = typeof newValue === "function" ? newValue(isDark) : newValue;
    setIsDarkState(value);
    userStorage.setTheme?.(value); // Persistencia
  };

  // Objeto de tema computed (incluye sombras y radios)
  const tokens = isDark ? DARK : LIGHT;
  const theme = {
    ...tokens,
    shadows: SHADOWS,
    radius: RADIUS,
    typography: TYPOGRAPHY,
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
