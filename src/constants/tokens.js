/**
 * tokens.js — Design tokens centralizados (Spatial UI + Claymorfismo)
 * Basado en README.md § 1 (Design Tokens)
 * Modo oscuro (pastel) + Modo claro (vívido)
 */

// ═══════════════════════════════════════════════════════════════════
// 1. COLORES BASE — MODO OSCURO (principal)
// ═══════════════════════════════════════════════════════════════════

export const DARK = {
  // Superficies y fondos
  bg: "#000000",
  surface: "linear-gradient(155deg, #211d2c 0%, #141220 100%)",
  surfaceFlat: "#1a1725",
  raised: "linear-gradient(155deg, #262231 0%, #17151f 100%)",
  border: "rgba(255,255,255,0.07)",

  // Tipografía
  text: "#F5F3FF",
  sub: "#8B87A3",
  muted: "#5F5C74",

  // Accento
  accent: "#9B6DFF",
  accentSoft: "rgba(155,109,255,0.16)",

  // Estado
  danger: "#FF8A8A",
  positiveGreen: "#86EFAC",

  // Inputs
  inputBg: "#1e1b28",
};

// ═══════════════════════════════════════════════════════════════════
// 2. COLORES BASE — MODO CLARO (vívido)
// ═══════════════════════════════════════════════════════════════════

export const LIGHT = {
  // Superficies y fondos
  bg: "#F3F1FA",
  surface: "linear-gradient(155deg, #ffffff 0%, #eeeaf7 100%)",
  surfaceFlat: "#ffffff",
  raised: "linear-gradient(155deg, #ffffff 0%, #f1edfa 100%)",
  border: "rgba(30,20,60,0.08)",

  // Tipografía
  text: "#1A1830",
  sub: "#726E8C",
  muted: "#A6A2BC",

  // Accento
  accent: "#7C4DFF",
  accentSoft: "rgba(124,77,255,0.12)",

  // Estado
  danger: "#E4574B",
  positiveGreen: "#16A34A",

  // Inputs
  inputBg: "#ECE8F7",
};

// ═══════════════════════════════════════════════════════════════════
// 3. PILARES — Color + Icono (por pilar)
// ═══════════════════════════════════════════════════════════════════

export const PILLARS = {
  fijos: {
    name: "Fijos",
    icon: "home", // Lucide icon name
    dark: "#93C5FD",
    light: "#2563EB",
  },
  deuda: {
    name: "Deuda",
    icon: "credit-card",
    dark: "#FCA5A5",
    light: "#E11D48",
  },
  ahorro: {
    name: "Ahorro",
    icon: "arrow-up",
    dark: "#86EFAC",
    light: "#16A34A",
  },
  ocio: {
    name: "Ocio",
    icon: "sparkles",
    dark: "#C4B5FD",
    light: "#9333EA",
  },
  varios: {
    name: "Varios",
    icon: "grid-2x2",
    dark: "#FDE68A",
    light: "#D97706",
  },
  saldo: {
    name: "Saldo",
    icon: "bar-chart-3",
    dark: "#D4D4D8",
    light: "#B9B5CC",
  },
};

// ═══════════════════════════════════════════════════════════════════
// 4. MÉTODOS DE PAGO — Color (por método)
// ═══════════════════════════════════════════════════════════════════

export const PAYMENT_METHODS = {
  llave: {
    name: "Llave",
    dark: "#F5B44D",
    light: "#D97706",
  },
  banco: {
    name: "Banco",
    dark: "#93C5FD",
    light: "#2563EB",
  },
  tarjeta: {
    name: "Tarjeta",
    dark: "#7DD3FC",
    light: "#0891B2",
  },
  efectivo: {
    name: "Efectivo",
    dark: "#86EFAC",
    light: "#16A34A",
  },
};

// ═══════════════════════════════════════════════════════════════════
// 5. SOMBRAS ("clay")
// ═══════════════════════════════════════════════════════════════════

export const SHADOWS = {
  // Tarjetas principales, FABs
  shadow: "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",

  // Filas, pills, barra de movimientos
  shadowSm: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",

  // Inputs, controles "hundidos"
  shadowPressed: "0 6px 12px -8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(0,0,0,0.3)",

  // 🆕 Modo claro: valores exactos del design-tokens.json
  shadowLight: "0 18px 36px -16px rgba(120,105,170,0.35), 0 2px 6px rgba(120,105,170,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
  shadowSmLight: "0 10px 20px -10px rgba(120,105,170,0.28), inset 0 1px 0 rgba(255,255,255,0.8)",
  shadowPressedLight: "0 6px 10px -8px rgba(120,105,170,0.25), inset 0 1px 1px rgba(255,255,255,0.6)",
};

// ═══════════════════════════════════════════════════════════════════
// 6. ANIMACIONES
// ═══════════════════════════════════════════════════════════════════

export const ANIMATIONS = {
  // clayRise: fade + translateY + scale (0.35–0.4s)
  clayRise: "clayRise 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",

  // clayhover: translateY -3px (desktop)
  clayhover: "transform 0.2s ease",

  // claytap: scale + translateY (active, 0.15s)
  claytap: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
};

// ═══════════════════════════════════════════════════════════════════
// 7. TIPOGRAFÍA
// ═══════════════════════════════════════════════════════════════════

export const TYPOGRAPHY = {
  family: '"Manrope", system-ui, sans-serif',
  weights: {
    regular: 500,
    semi: 600,
    bold: 700,
    extrabold: 800,
  },
};

// ═══════════════════════════════════════════════════════════════════
// 8. RADIOS
// ═══════════════════════════════════════════════════════════════════

export const RADIUS = {
  md: "16px",
  lg: "24px",
  pill: "999px",
  circle: "50%",
};

// ═══════════════════════════════════════════════════════════════════
// HELPER: obtener color de pilar según isDark
// ═══════════════════════════════════════════════════════════════════

export function getPillarColor(pillarKey, isDark) {
  const pillar = PILLARS[pillarKey];
  if (!pillar) return "#8B87A3";
  return isDark ? pillar.dark : pillar.light;
}

// Helper: obtener softBg (tinta débil del color del pilar)
export function getPillarSoftBg(pillarKey, isDark) {
  const color = getPillarColor(pillarKey, isDark);
  // Convertir hex a rgba con alpha 0.16 (oscuro) / 0.14 (claro)
  const alpha = isDark ? 0.16 : 0.14;
  return hexToRgba(color, alpha);
}

// Helper: hex a rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper: obtener color de método de pago
export function getPaymentMethodColor(methodKey, isDark) {
  const method = PAYMENT_METHODS[methodKey];
  if (!method) return "#8B87A3";
  return isDark ? method.dark : method.light;
}

// ═══════════════════════════════════════════════════════════════════
// INLINE STYLES (keyframes para CSS-in-JS)
// ═══════════════════════════════════════════════════════════════════

// Inyectar en <head> o usar styled-components / Tailwind
export const KEYFRAMES = `
@keyframes clayRise {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
`;
