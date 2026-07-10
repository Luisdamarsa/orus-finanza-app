/**
 * pageHeaders.js - Data centralizada para títulos y descripciones de páginas
 *
 * Estructura:
 * {
 *   icon: "emoji o icono",
 *   title: "Título de la página",
 *   description: "Descripción principal (texto largo)",
 *   hint: "Hint/ejemplos/ayuda (texto corto, opcional)"
 * }
 */

export const PAGE_HEADERS = {
  budgets: {
    icon: "💰",
    title: "Presupuestos",
    description: "Define cuánto quieres gastar en cada categoría y pilar. Los cambios se guardan automáticamente.",
    hint: "Expande el Pilar para ver presupuestos de cada categoría",
  },

  categories: {
    icon: "🏷️",
    title: "Categorías",
    description: "Organiza tus gastos en categorías personalizadas dentro de cada pilar financiero.",
    hint: 'Ejemplos: Edita "Arriendo" en Fijos o Cine en Ocio',
  },

  settings: {
    icon: "⚙️",
    title: "Configuración",
    description: "Administra tu perfil, temas y preferencias de la app.",
    hint: "Usa temas claros u oscuros según tu preferencia",
  },

  movements: {
    icon: "📊",
    title: "Movimientos",
    description: "Visualiza todas tus transacciones y filtra por categoría.",
    hint: "Filtra por múltiples categorías para análisis detallado",
  },

  dashboard: {
    icon: "📈",
    title: "Dashboard",
    description: "Resumen de tu situación financiera con gráficos y métricas clave.",
    hint: undefined, // Sin hint
  },

  addCategory: {
    icon: "➕",
    title: "Nueva Categoría",
    description: "Crea una categoría personalizada para organizar mejor tus gastos.",
    hint: undefined,
  },

  addTransaction: {
    icon: "➕",
    title: "Nuevo Movimiento",
    description: "Registra una transacción en tu categoría.",
    hint: undefined,
  },

  showIncomes: {
    icon: "📈",
    title: "Mostrar Ingresos",
    description: "Visualiza los ingresos que entran en el período seleccionado. Si el ingreso supera el gasto, también mostrará el saldo restante.",
    hint: "Útil para seguimiento de flujo de efectivo e ingresos mensuales",
  },
};
