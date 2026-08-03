/**
 * useTheme.js — Hook para acceder al tema (isDark, setIsDark, theme)
 * Uso: const { isDark, setIsDark, theme } = useTheme();
 */

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme() debe usarse dentro de <ThemeProvider>");
  }
  return context;
}
