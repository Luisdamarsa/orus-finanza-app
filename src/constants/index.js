/**
 * 🆕 Genera dinámicamente las categorías de cada pilar desde ALL_CATS
 */
const getPillarCategories = (pillarId) => {
  return ALL_CATS.filter(cat => cat.pillar === pillarId).map(cat => ({
    name: cat.name,
    spent: cat.spent,
    budget: cat.budget
  }));
};

/**
 * 🆕 Calcula totales (spent y budget) de un pilar desde ALL_CATS
 */
const getPillarTotals = (pillarId) => {
  const cats = ALL_CATS.filter(cat => cat.pillar === pillarId);
  return {
    spent: cats.reduce((sum, cat) => sum + (cat.spent || 0), 0),
    budget: cats.every(cat => cat.budget === null || cat.budget === undefined)
      ? null
      : cats.reduce((sum, cat) => sum + (cat.budget || 0), 0)
  };
};

// Pilares (categorías principales) - Con presupuestos mutables y historial
export const PILLARS = [
  {
    id: "fijos",
    label: "Fijos",
    color: "#93C5FD",
    darkColor: "#3B82F6",
    bg: "#EFF6FF",
    darkBg: "#1a2744",
    icon: "🏠",
    budget: 1200000,  // 🆕 Presupuesto mutable del pilar
    history: [{ field: "budget", old: null, new: 1200000, changedAt: "2025-01-01T00:00:00Z" }],      // 🆕 Historial de cambios
    get spent() { return getPillarTotals("fijos").spent; },
    get categories() { return getPillarCategories("fijos"); }
  },
  {
    id: "deuda",
    label: "Deuda",
    color: "#FCA5A5",
    darkColor: "#EF4444",
    bg: "#FEF2F2",
    darkBg: "#2a1111",
    icon: "💰",
    budget: 500000,  // 🆕
    history: [{ field: "budget", old: null, new: 500000, changedAt: "2025-01-01T00:00:00Z" }],     // 🆕
    get spent() { return getPillarTotals("deuda").spent; },
    get categories() { return getPillarCategories("deuda"); }
  },
  {
    id: "ahorro",
    label: "Ahorro",
    color: "#86EFAC",
    darkColor: "#22C55E",
    bg: "#F0FDF4",
    darkBg: "#0d2118",
    icon: "🐖",
    budget: 300000,  // 🆕
    history: [{ field: "budget", old: null, new: 300000, changedAt: "2025-01-01T00:00:00Z" }],     // 🆕
    get spent() { return getPillarTotals("ahorro").spent; },
    get categories() { return getPillarCategories("ahorro"); }
  },
  {
    id: "ocio",
    label: "Ocio",
    color: "#C4B5FD",
    darkColor: "#8B5CF6",
    bg: "#F5F3FF",
    darkBg: "#1e1635",
    icon: "✨",
    budget: 400000,  // 🆕
    history: [{ field: "budget", old: null, new: 400000, changedAt: "2025-01-01T00:00:00Z" }],     // 🆕
    get spent() { return getPillarTotals("ocio").spent; },
    get categories() { return getPillarCategories("ocio"); }
  },
  {
    id: "varios",
    label: "Varios",
    color: "#FDE68A",
    darkColor: "#D97706",
    bg: "#FFFBEB",
    darkBg: "#231c0d",
    icon: "🎲",
    budget: null,  // 🆕 Sin presupuesto fijo
    history: [],   // 🆕 Sin historial inicial porque no tiene presupuesto
    get spent() { return getPillarTotals("varios").spent; },
    get categories() { return getPillarCategories("varios"); }
  },
];

export const SALDO_COLOR = "#CBD5E1";

// 🆕 MODO DÍA: colores saturados por pilar (los pasteles se lavan sobre fondo claro).
// varios pasa de amarillo pastel (#FDE68A) a ámbar (#D97706) para que se aprecie en blanco.
export const DAY_PILLAR_COLOR = {
  fijos: "#3B82F6", deuda: "#EF4444", ahorro: "#16A34A", ocio: "#8B5CF6", varios: "#D97706", ingreso: "#16A34A",
};
export const DAY_SALDO_COLOR = "#94A3B8";
// Devuelve el color del pilar según el tema (día = saturado, noche = pastel).
export const pillarColor = (pillarId, pastel, isDark) => isDark ? pastel : (DAY_PILLAR_COLOR[pillarId] || pastel);

export const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
export const MONTHS_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export const METHOD_META = {
  Banco: { color: "#64748B", bg: "#F1F5F9", darkBg: "#1E293B" },
  Tarjeta: { color: "#4F8EF7", bg: "#EFF6FF", darkBg: "#162A4E" },
  Nequi: { color: "#9B6DFF", bg: "#F5F3FF", darkBg: "#1e1635" },
  Llave: { color: "#D97706", bg: "#FFFBEB", darkBg: "#231c0d" },
  Voz: { color: "#22C55E", bg: "#F0FDF4", darkBg: "#0d2118" },
};

export const PILLAR_MAP = {
  fijos: { color: "#93C5FD", icon: "🏠", label: "Fijos" },
  deuda: { color: "#FCA5A5", icon: "💰", label: "Deuda" },
  ahorro: { color: "#86EFAC", icon: "🐖", label: "Ahorro" },
  ocio: { color: "#C4B5FD", icon: "✨", label: "Ocio" },
  varios: { color: "#FDE68A", icon: "🎲", label: "Varios" },
  ingreso: { color: "#FCD34D", icon: "💵", label: "Ingreso" }
};

export const ALL_CATS = [
  // 🏠 FIJOS - UA0001 (Luis Daniel)
  { id:"cat_arriendo",       name: "Arriendo",         pillar: "fijos", userId: "UA0001", spent: 700000,   budget: 700000, history: [{ field: "budget", old: null, new: 700000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_internet",       name: "Internet",         pillar: "fijos", userId: "UA0001", spent: 120000,   budget: 130000, history: [{ field: "budget", old: null, new: 130000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_servicios",      name: "Servicios",        pillar: "fijos", userId: "UA0001", spent: 160000,   budget: 200000, history: [{ field: "budget", old: null, new: 200000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_suscripciones",  name: "Suscripciones",    pillar: "fijos", userId: "UA0001", spent: 0,        budget: 170000, history: [{ field: "budget", old: null, new: 170000, changedAt: "2025-01-01T00:00:00Z" }] },
  // 💰 DEUDA - UA0001
  { id:"cat_tarjeta_visa",   name: "Tarjeta Visa",     pillar: "deuda", userId: "UA0001", spent: 300000,   budget: 300000, history: [{ field: "budget", old: null, new: 300000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_credito_banco",  name: "Crédito banco",    pillar: "deuda", userId: "UA0001", spent: 200000,   budget: 200000, history: [{ field: "budget", old: null, new: 200000, changedAt: "2025-01-01T00:00:00Z" }] },
  // 🐖 AHORRO - UA0001
  { id:"cat_fondo_emergencia", name: "Fondo emergencia", pillar: "ahorro", userId: "UA0001", spent: 250000,  budget: 200000, history: [{ field: "budget", old: null, new: 200000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_meta_viaje",     name: "Meta viaje",       pillar: "ahorro", userId: "UA0001", spent: 130000,  budget: 100000, history: [{ field: "budget", old: null, new: 100000, changedAt: "2025-01-01T00:00:00Z" }] },
  // 🎉 OCIO - UA0001
  { id:"cat_restaurantes",   name: "Restaurantes",     pillar: "ocio", userId: "UA0001", spent: 180000,   budget: 150000, history: [{ field: "budget", old: null, new: 150000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_domicilios",     name: "Domicilios",       pillar: "ocio", userId: "UA0001", spent: 95000,    budget: 100000, history: [{ field: "budget", old: null, new: 100000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_cine_planes",    name: "Cine / Planes",    pillar: "ocio", userId: "UA0001", spent: 65000,    budget: 80000, history: [{ field: "budget", old: null, new: 80000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_bares",          name: "Bares",            pillar: "ocio", userId: "UA0001", spent: 50000,    budget: 70000, history: [{ field: "budget", old: null, new: 70000, changedAt: "2025-01-01T00:00:00Z" }] },
  // 🛒 VARIOS - UA0001
  { id:"cat_supermercado",   name: "Supermercado",     pillar: "varios", userId: "UA0001", spent: 90000,   budget: null, history: [] },
  { id:"cat_transporte",     name: "Transporte",       pillar: "varios", userId: "UA0001", spent: 35000,   budget: null, history: [] },
  { id:"cat_salud",          name: "Salud",            pillar: "varios", userId: "UA0001", spent: 20000,   budget: null, history: [] },

  // 🆕 CATEGORÍAS DE UB0002 (María García) - Subset simplificado
  { id:"cat_arriendo_maria",     name: "Arriendo",         pillar: "fijos", userId: "UB0002", spent: 400000,   budget: 400000, history: [{ field: "budget", old: null, new: 400000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_servicios_maria",    name: "Servicios",        pillar: "fijos", userId: "UB0002", spent: 80000,    budget: 100000, history: [{ field: "budget", old: null, new: 100000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_restaurantes_maria", name: "Restaurantes",     pillar: "ocio", userId: "UB0002", spent: 90000,    budget: 100000, history: [{ field: "budget", old: null, new: 100000, changedAt: "2025-01-01T00:00:00Z" }] },
  { id:"cat_supermercado_maria", name: "Supermercado",     pillar: "varios", userId: "UB0002", spent: 45000,    budget: null, history: [] },
];

export const MANUAL_METHODS = [
  { id:"Llave",         icon: "🔑", color: "#D97706" },
  { id:"Banco",         icon: "🏦", color: "#64748B" },
  { id:"Tarjeta",       icon: "💳", color: "#4F8EF7" },
  { id:"Efectivo",      icon: "💵", color: "#22C55E" },
];

// Datos dummy para desarrollo (3 usuarios: UA0001, UB0002, UC0003) - Variado y realista
export const DUMMY_TRANSACTIONS = [
  // ===== USUARIO UA0001 (Luis Daniel) - Ene 2025 a May 2026 =====
  // ===== ENERO 2026 (8 transacciones - ~850K) =====
  { id:100, userId: "UA0001", date: "2026-01-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:101, userId: "UA0001",date: "2026-01-05", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -42000, pillar: "ocio", category: "cat_domicilios" },
  { id:102, userId: "UA0001",date: "2026-01-10", time: "09:15", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:103, userId: "UA0001",date: "2026-01-15", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -280000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:104, userId: "UA0001",date: "2026-01-20", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:105, userId: "UA0001",date: "2026-01-22", time: "18:15", description: "Restaurante Masa", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "cat_restaurantes" },
  { id:106, userId: "UA0001",date: "2026-01-25", time: "10:45", description: "Supermercado D1", method: "Tarjeta", amount: -95000, pillar: "varios", category: "cat_supermercado" },
  { id:107, userId: "UA0001",date: "2026-01-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== FEBRERO 2026 (17 transacciones - ~2.1M) =====
  { id:108, userId: "UA0001",date: "2026-02-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:109, userId: "UA0001",date: "2026-02-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:110, userId: "UA0001",date: "2026-02-04", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id:111, userId: "UA0001",date: "2026-02-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id:112, userId: "UA0001",date: "2026-02-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:113, userId: "UA0001",date: "2026-02-10", time: "20:00", description: "El Corral Gourmet", method: "Tarjeta", amount: -88000, pillar: "ocio", category: "cat_restaurantes" },
  { id:114, userId: "UA0001",date: "2026-02-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -320000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:115, userId: "UA0001",date: "2026-02-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -112000, pillar: "varios", category: "cat_supermercado" },
  { id:116, userId: "UA0001",date: "2026-02-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id:117, userId: "UA0001",date: "2026-02-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_bares" },
  { id:118, userId: "UA0001",date: "2026-02-20", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -280000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id:119, userId: "UA0001",date: "2026-02-22", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "cat_transporte" },
  { id:120, userId: "UA0001",date: "2026-02-24", time: "12:30", description: "Domicilio iFood", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id:121, userId: "UA0001",date: "2026-02-26", time: "19:00", description: "Andrés Carne de Res", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_restaurantes" },
  { id:122, userId: "UA0001",date: "2026-02-27", time: "09:15", description: "Fondo Emergencia", method: "Banco", amount: -250000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id:123, userId: "UA0001",date: "2026-02-28", time: "11:45", description: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_cine_planes" },
  { id:124, userId: "UA0001",date: "2026-02-29", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2900000, pillar: "ingreso", category: null },

  // ===== MARZO 2026 (5 transacciones - ~1M) =====
  { id:125, userId: "UA0001",date: "2026-03-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:126, userId: "UA0001",date: "2026-03-10", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:127, userId: "UA0001",date: "2026-03-15", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -300000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:128, userId: "UA0001",date: "2026-03-20", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:129, userId: "UA0001",date: "2026-03-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== ABRIL 2026 (3-4 transacciones por CADA fecha) =====
  { id:130, userId: "UA0001",date: "2026-04-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:130.1, userId: "UA0001",date: "2026-04-01", time: "14:30", description: "Rappi Comida", method: "Nequi", amount: -42000, pillar: "ocio", category: "cat_domicilios" },
  { id:130.2, userId: "UA0001",date: "2026-04-01", time: "19:00", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id:130.3, userId: "UA0001",date: "2026-04-01", time: "22:00", description: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "cat_bares" },
  { id:131, userId: "UA0001",date: "2026-04-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:131.1, userId: "UA0001",date: "2026-04-02", time: "13:00", description: "iFood Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id:131.2, userId: "UA0001",date: "2026-04-02", time: "18:30", description: "Restaurante Wok", method: "Tarjeta", amount: -68000, pillar: "ocio", category: "cat_restaurantes" },
  { id:131.3, userId: "UA0001",date: "2026-04-02", time: "21:15", description: "Bogotá Beer Company", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_bares" },
  { id:132, userId: "UA0001",date: "2026-04-05", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id:132.1, userId: "UA0001",date: "2026-04-05", time: "18:45", description: "Rappi Comida", method: "Nequi", amount: -38000, pillar: "ocio", category: "cat_domicilios" },
  { id:132.2, userId: "UA0001",date: "2026-04-05", time: "22:10", description: "iFood Postres", method: "Tarjeta", amount: -25000, pillar: "ocio", category: "cat_domicilios" },
  { id:132.3, userId: "UA0001",date: "2026-04-05", time: "23:30", description: "Netflix Película", method: "Tarjeta", amount: -8000, pillar: "ocio", category: "cat_restaurantes" },
  { id:133, userId: "UA0001",date: "2026-04-08", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id:133.1, userId: "UA0001",date: "2026-04-08", time: "21:30", description: "Cinemark IMAX", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_cine_planes" },
  { id:133.2, userId: "UA0001",date: "2026-04-08", time: "23:00", description: "Domicilio Rappi", method: "Nequi", amount: -42000, pillar: "ocio", category: "cat_domicilios" },
  { id:133.3, userId: "UA0001",date: "2026-04-08", time: "23:45", description: "Monserrate Bar", method: "Tarjeta", amount: -38000, pillar: "ocio", category: "cat_bares" },
  { id:134, userId: "UA0001",date: "2026-04-10", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:134.1, userId: "UA0001",date: "2026-04-10", time: "12:30", description: "Almuerzo Restaurante", method: "Tarjeta", amount: -55000, pillar: "ocio", category: "cat_restaurantes" },
  { id:134.2, userId: "UA0001",date: "2026-04-10", time: "19:00", description: "Uber Eats", method: "Nequi", amount: -52000, pillar: "ocio", category: "cat_domicilios" },
  { id:134.3, userId: "UA0001",date: "2026-04-10", time: "21:30", description: "Vintrash Bar", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_bares" },
  { id:135, userId: "UA0001",date: "2026-04-12", time: "12:30", description: "Leo's Restaurante", method: "Tarjeta", amount: -92000, pillar: "ocio", category: "cat_restaurantes" },
  { id:135.1, userId: "UA0001",date: "2026-04-12", time: "19:00", description: "Restaurante Brasa", method: "Tarjeta", amount: -78000, pillar: "ocio", category: "cat_restaurantes" },
  { id:135.2, userId: "UA0001",date: "2026-04-12", time: "22:00", description: "Andrés Carne de Res", method: "Tarjeta", amount: -85000, pillar: "ocio", category: "cat_restaurantes" },
  { id:135.3, userId: "UA0001",date: "2026-04-12", time: "23:30", description: "BBC Copas", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_bares" },
  { id:136, userId: "UA0001",date: "2026-04-15", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -380000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:136.1, userId: "UA0001",date: "2026-04-15", time: "14:00", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id:136.2, userId: "UA0001",date: "2026-04-15", time: "18:00", description: "iFood Comida", method: "Nequi", amount: -50000, pillar: "ocio", category: "cat_domicilios" },
  { id:136.3, userId: "UA0001",date: "2026-04-15", time: "20:30", description: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "cat_bares" },
  { id:137, userId: "UA0001",date: "2026-04-18", time: "11:00", description: "Makro Supermercado", method: "Tarjeta", amount: -128000, pillar: "varios", category: "cat_supermercado" },
  { id:137.1, userId: "UA0001",date: "2026-04-18", time: "14:30", description: "Rappi Comida", method: "Nequi", amount: -45000, pillar: "ocio", category: "cat_domicilios" },
  { id:137.2, userId: "UA0001",date: "2026-04-18", time: "18:00", description: "Restaurante Masa", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "cat_restaurantes" },
  { id:137.3, userId: "UA0001",date: "2026-04-18", time: "22:00", description: "Bar La Puerta", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_bares" },
  { id:138, userId: "UA0001",date: "2026-04-20", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id:138.1, userId: "UA0001",date: "2026-04-20", time: "17:00", description: "Cinemark", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id:138.2, userId: "UA0001",date: "2026-04-20", time: "19:30", description: "Uber Eats", method: "Nequi", amount: -58000, pillar: "ocio", category: "cat_domicilios" },
  { id:138.3, userId: "UA0001",date: "2026-04-20", time: "21:45", description: "Monserrate Bar", method: "Tarjeta", amount: -42000, pillar: "ocio", category: "cat_bares" },
  { id:139, userId: "UA0001",date: "2026-04-22", time: "18:15", description: "Monserrate Bar", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_bares" },
  { id:139.1, userId: "UA0001",date: "2026-04-22", time: "19:45", description: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "cat_bares" },
  { id:139.2, userId: "UA0001",date: "2026-04-22", time: "22:30", description: "Bogotá Beer Company", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_bares" },
  { id:139.3, userId: "UA0001",date: "2026-04-22", time: "23:45", description: "iFood Postres", method: "Nequi", amount: -28000, pillar: "ocio", category: "cat_domicilios" },
  { id:140, userId: "UA0001",date: "2026-04-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -320000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id:140.1, userId: "UA0001",date: "2026-04-25", time: "14:20", description: "Netflix Suscripción", method: "Tarjeta", amount: -18000, pillar: "ocio", category: "cat_restaurantes" },
  { id:140.2, userId: "UA0001",date: "2026-04-25", time: "19:30", description: "Spotify Premium", method: "Tarjeta", amount: -12000, pillar: "ocio", category: "cat_restaurantes" },
  { id:140.3, userId: "UA0001",date: "2026-04-25", time: "21:00", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id:141, userId: "UA0001",date: "2026-04-27", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -32000, pillar: "varios", category: "cat_transporte" },
  { id:141.1, userId: "UA0001",date: "2026-04-27", time: "20:00", description: "Concierto Artista Local", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_cine_planes" },
  { id:141.2, userId: "UA0001",date: "2026-04-27", time: "22:00", description: "Rappi Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id:141.3, userId: "UA0001",date: "2026-04-27", time: "23:30", description: "Bar Entrada", method: "Tarjeta", amount: -38000, pillar: "ocio", category: "cat_bares" },
  { id:142, userId: "UA0001",date: "2026-04-30", time: "08:00", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:142.1, userId: "UA0001",date: "2026-04-30", time: "13:00", description: "Almuerzo Especial", method: "Tarjeta", amount: -82000, pillar: "ocio", category: "cat_restaurantes" },
  { id:142.2, userId: "UA0001",date: "2026-04-30", time: "19:00", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id:142.3, userId: "UA0001",date: "2026-04-30", time: "11:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 3100000, pillar: "ingreso", category: null },

  // ===== MAYO 2026 (11 transacciones - ~1.5M) =====
  { id:150, userId: "UA0001",date: "2026-05-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:151, userId: "UA0001",date: "2026-05-05", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -50000, pillar: "ocio", category: "cat_domicilios" },
  { id:152, userId: "UA0001",date: "2026-05-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id:153, userId: "UA0001",date: "2026-05-10", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:154, userId: "UA0001",date: "2026-05-12", time: "20:00", description: "Restaurante Wok", method: "Tarjeta", amount: -68000, pillar: "ocio", category: "cat_restaurantes" },
  { id:155, userId: "UA0001",date: "2026-05-15", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:156, userId: "UA0001",date: "2026-05-18", time: "11:00", description: "Carrefour", method: "Tarjeta", amount: -105000, pillar: "varios", category: "cat_supermercado" },
  { id:157, userId: "UA0001",date: "2026-05-20", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:158, userId: "UA0001",date: "2026-05-22", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_bares" },
  { id:159, userId: "UA0001",date: "2026-05-25", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id:160, userId: "UA0001",date: "2026-05-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2700000, pillar: "ingreso", category: null },

  // ===== ENERO 2025 (12 transacciones - ~3.2M) =====
  { id:200, userId: "UA0001",date: "2025-01-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:201, userId: "UA0001",date: "2025-01-03", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:202, userId: "UA0001",date: "2025-01-05", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id:203, userId: "UA0001",date: "2025-01-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:204, userId: "UA0001",date: "2025-01-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_restaurantes" },
  { id:205, userId: "UA0001",date: "2025-01-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -420000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:206, userId: "UA0001",date: "2025-01-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:207, userId: "UA0001",date: "2025-01-18", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -125000, pillar: "varios", category: "cat_supermercado" },
  { id:208, userId: "UA0001",date: "2025-01-20", time: "18:15", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id:209, userId: "UA0001",date: "2025-01-22", time: "19:30", description: "Bar La Puerta", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_bares" },
  { id:210, userId: "UA0001",date: "2025-01-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -300000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id:211, userId: "UA0001",date: "2025-01-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== FEBRERO 2025 (14 transacciones - ~3.5M) =====
  { id:212, userId: "UA0001",date: "2025-02-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:213, userId: "UA0001",date: "2025-02-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:214, userId: "UA0001",date: "2025-02-04", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -62000, pillar: "ocio", category: "cat_domicilios" },
  { id:215, userId: "UA0001",date: "2025-02-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id:216, userId: "UA0001",date: "2025-02-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:217, userId: "UA0001",date: "2025-02-10", time: "20:00", description: "El Corral Gourmet", method: "Tarjeta", amount: -105000, pillar: "ocio", category: "cat_restaurantes" },
  { id:218, userId: "UA0001",date: "2025-02-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -480000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:219, userId: "UA0001",date: "2025-02-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -135000, pillar: "varios", category: "cat_supermercado" },
  { id:220, userId: "UA0001",date: "2025-02-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id:221, userId: "UA0001",date: "2025-02-18", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -58000, pillar: "ocio", category: "cat_bares" },
  { id:222, userId: "UA0001",date: "2025-02-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -280000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id:223, userId: "UA0001",date: "2025-02-22", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "cat_transporte" },
  { id:224, userId: "UA0001",date: "2025-02-24", time: "12:30", description: "Andrés Carne de Res", method: "Tarjeta", amount: -128000, pillar: "ocio", category: "cat_restaurantes" },
  { id:225, userId: "UA0001",date: "2025-02-28", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2900000, pillar: "ingreso", category: null },

  // ===== MARZO 2025 (10 transacciones - ~2.8M) =====
  { id:226, userId: "UA0001",date: "2025-03-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:227, userId: "UA0001",date: "2025-03-03", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id:228, userId: "UA0001",date: "2025-03-05", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:229, userId: "UA0001",date: "2025-03-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_cine_planes" },
  { id:230, userId: "UA0001",date: "2025-03-10", time: "12:30", description: "Restaurante Wok", method: "Tarjeta", amount: -72000, pillar: "ocio", category: "cat_restaurantes" },
  { id:231, userId: "UA0001",date: "2025-03-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -400000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:232, userId: "UA0001",date: "2025-03-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:233, userId: "UA0001",date: "2025-03-18", time: "11:00", description: "Makro Supermercado", method: "Tarjeta", amount: -145000, pillar: "varios", category: "cat_supermercado" },
  { id:234, userId: "UA0001",date: "2025-03-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -250000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id:235, userId: "UA0001",date: "2025-03-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== ABRIL 2025 (15 transacciones - ~4.2M) =====
  { id:236, userId: "UA0001",date: "2025-04-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:237, userId: "UA0001",date: "2025-04-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:238, userId: "UA0001",date: "2025-04-04", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id:239, userId: "UA0001",date: "2025-04-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id:240, userId: "UA0001",date: "2025-04-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:241, userId: "UA0001",date: "2025-04-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -98000, pillar: "ocio", category: "cat_restaurantes" },
  { id:242, userId: "UA0001",date: "2025-04-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -520000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:243, userId: "UA0001",date: "2025-04-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -142000, pillar: "varios", category: "cat_supermercado" },
  { id:244, userId: "UA0001",date: "2025-04-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id:245, userId: "UA0001",date: "2025-04-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -65000, pillar: "ocio", category: "cat_bares" },
  { id:246, userId: "UA0001",date: "2025-04-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -350000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id:247, userId: "UA0001",date: "2025-04-22", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "cat_transporte" },
  { id:248, userId: "UA0001",date: "2025-04-24", time: "12:30", description: "Cinemark IMAX", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_cine_planes" },
  { id:249, userId: "UA0001",date: "2025-04-26", time: "19:00", description: "Andrés Carne de Res", method: "Tarjeta", amount: -118000, pillar: "ocio", category: "cat_restaurantes" },
  { id:250, userId: "UA0001",date: "2025-04-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 3000000, pillar: "ingreso", category: null },

  // ===== MAYO 2025 (11 transacciones - ~3.1M) =====
  { id:251, userId: "UA0001",date: "2025-05-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:252, userId: "UA0001",date: "2025-05-03", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -52000, pillar: "ocio", category: "cat_domicilios" },
  { id:253, userId: "UA0001",date: "2025-05-05", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:254, userId: "UA0001",date: "2025-05-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id:255, userId: "UA0001",date: "2025-05-10", time: "20:00", description: "Restaurante Wok", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "cat_restaurantes" },
  { id:256, userId: "UA0001",date: "2025-05-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -380000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:257, userId: "UA0001",date: "2025-05-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:258, userId: "UA0001",date: "2025-05-18", time: "11:00", description: "Carrefour", method: "Tarjeta", amount: -128000, pillar: "varios", category: "cat_supermercado" },
  { id:259, userId: "UA0001",date: "2025-05-22", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -58000, pillar: "ocio", category: "cat_bares" },
  { id:260, userId: "UA0001",date: "2025-05-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -280000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id:261, userId: "UA0001",date: "2025-05-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2750000, pillar: "ingreso", category: null },

  // ===== JUNIO 2025 (13 transacciones - ~3.6M) =====
  { id:262, userId: "UA0001",date: "2025-06-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:263, userId: "UA0001",date: "2025-06-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:264, userId: "UA0001",date: "2025-06-04", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id:265, userId: "UA0001",date: "2025-06-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id:266, userId: "UA0001",date: "2025-06-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:267, userId: "UA0001",date: "2025-06-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -92000, pillar: "ocio", category: "cat_restaurantes" },
  { id:268, userId: "UA0001",date: "2025-06-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -420000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:269, userId: "UA0001",date: "2025-06-14", time: "11:00", description: "Makro Supermercado", method: "Tarjeta", amount: -155000, pillar: "varios", category: "cat_supermercado" },
  { id:270, userId: "UA0001",date: "2025-06-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id:271, userId: "UA0001",date: "2025-06-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -60000, pillar: "ocio", category: "cat_bares" },
  { id:272, userId: "UA0001",date: "2025-06-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -300000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id:273, userId: "UA0001",date: "2025-06-24", time: "12:30", description: "Cinemark", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id:274, userId: "UA0001",date: "2025-06-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2850000, pillar: "ingreso", category: null },

  // ===== JULIO 2025 (9 transacciones - ~2.9M) =====
  { id:275, userId: "UA0001",date: "2025-07-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:276, userId: "UA0001",date: "2025-07-05", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -50000, pillar: "ocio", category: "cat_domicilios" },
  { id:277, userId: "UA0001",date: "2025-07-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id:278, userId: "UA0001",date: "2025-07-10", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:279, userId: "UA0001",date: "2025-07-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -400000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:280, userId: "UA0001",date: "2025-07-15", time: "11:00", description: "Carrefour", method: "Tarjeta", amount: -105000, pillar: "varios", category: "cat_supermercado" },
  { id:281, userId: "UA0001",date: "2025-07-18", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -55000, pillar: "ocio", category: "cat_bares" },
  { id:282, userId: "UA0001",date: "2025-07-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -320000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id:283, userId: "UA0001",date: "2025-07-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== AGOSTO 2025 (12 transacciones - ~3.4M) =====
  { id:284, userId: "UA0001",date: "2025-08-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:285, userId: "UA0001",date: "2025-08-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:286, userId: "UA0001",date: "2025-08-04", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -52000, pillar: "ocio", category: "cat_domicilios" },
  { id:287, userId: "UA0001",date: "2025-08-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id:288, userId: "UA0001",date: "2025-08-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:289, userId: "UA0001",date: "2025-08-10", time: "20:00", description: "El Corral Gourmet", method: "Tarjeta", amount: -85000, pillar: "ocio", category: "cat_restaurantes" },
  { id:290, userId: "UA0001",date: "2025-08-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -450000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:291, userId: "UA0001",date: "2025-08-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:292, userId: "UA0001",date: "2025-08-18", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -130000, pillar: "varios", category: "cat_supermercado" },
  { id:293, userId: "UA0001",date: "2025-08-22", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -62000, pillar: "ocio", category: "cat_bares" },
  { id:294, userId: "UA0001",date: "2025-08-25", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -270000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id:295, userId: "UA0001",date: "2025-08-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2900000, pillar: "ingreso", category: null },

  // ===== SEPTIEMBRE 2025 (10 transacciones - ~3.1M) =====
  { id:296, userId: "UA0001",date: "2025-09-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:297, userId: "UA0001",date: "2025-09-03", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -45000, pillar: "ocio", category: "cat_domicilios" },
  { id:298, userId: "UA0001",date: "2025-09-05", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:299, userId: "UA0001",date: "2025-09-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_cine_planes" },
  { id:300, userId: "UA0001",date: "2025-09-10", time: "20:00", description: "Restaurante Wok", method: "Tarjeta", amount: -70000, pillar: "ocio", category: "cat_restaurantes" },
  { id:301, userId: "UA0001",date: "2025-09-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -380000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:302, userId: "UA0001",date: "2025-09-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:303, userId: "UA0001",date: "2025-09-18", time: "11:00", description: "Makro Supermercado", method: "Tarjeta", amount: -140000, pillar: "varios", category: "cat_supermercado" },
  { id:304, userId: "UA0001",date: "2025-09-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -300000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id:305, userId: "UA0001",date: "2025-09-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== OCTUBRE 2025 (14 transacciones - ~3.8M) =====
  { id:306, userId: "UA0001",date: "2025-10-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:307, userId: "UA0001",date: "2025-10-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:308, userId: "UA0001",date: "2025-10-04", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id:309, userId: "UA0001",date: "2025-10-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id:310, userId: "UA0001",date: "2025-10-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:311, userId: "UA0001",date: "2025-10-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_restaurantes" },
  { id:312, userId: "UA0001",date: "2025-10-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -500000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:313, userId: "UA0001",date: "2025-10-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -145000, pillar: "varios", category: "cat_supermercado" },
  { id:314, userId: "UA0001",date: "2025-10-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id:315, userId: "UA0001",date: "2025-10-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -60000, pillar: "ocio", category: "cat_bares" },
  { id:316, userId: "UA0001",date: "2025-10-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -330000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id:317, userId: "UA0001",date: "2025-10-22", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "cat_transporte" },
  { id:318, userId: "UA0001",date: "2025-10-24", time: "12:30", description: "Cinemark", method: "Tarjeta", amount: -50000, pillar: "ocio", category: "cat_cine_planes" },
  { id:319, userId: "UA0001",date: "2025-10-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 3000000, pillar: "ingreso", category: null },

  // ===== NOVIEMBRE 2025 (11 transacciones - ~3.3M) =====
  { id:320, userId: "UA0001",date: "2025-11-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:321, userId: "UA0001",date: "2025-11-03", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -50000, pillar: "ocio", category: "cat_domicilios" },
  { id:322, userId: "UA0001",date: "2025-11-05", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:323, userId: "UA0001",date: "2025-11-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_cine_planes" },
  { id:324, userId: "UA0001",date: "2025-11-10", time: "20:00", description: "Restaurante Wok", method: "Tarjeta", amount: -72000, pillar: "ocio", category: "cat_restaurantes" },
  { id:325, userId: "UA0001",date: "2025-11-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -420000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:326, userId: "UA0001",date: "2025-11-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:327, userId: "UA0001",date: "2025-11-18", time: "11:00", description: "Carrefour", method: "Tarjeta", amount: -125000, pillar: "varios", category: "cat_supermercado" },
  { id:328, userId: "UA0001",date: "2025-11-22", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -58000, pillar: "ocio", category: "cat_bares" },
  { id:329, userId: "UA0001",date: "2025-11-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -290000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id:330, userId: "UA0001",date: "2025-11-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2850000, pillar: "ingreso", category: null },

  // ===== DICIEMBRE 2025 (13 transacciones - ~4.0M) =====
  { id:331, userId: "UA0001",date: "2025-12-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id:332, userId: "UA0001",date: "2025-12-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id:333, userId: "UA0001",date: "2025-12-04", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -52000, pillar: "ocio", category: "cat_domicilios" },
  { id:334, userId: "UA0001",date: "2025-12-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id:335, userId: "UA0001",date: "2025-12-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id:336, userId: "UA0001",date: "2025-12-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -100000, pillar: "ocio", category: "cat_restaurantes" },
  { id:337, userId: "UA0001",date: "2025-12-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -480000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id:338, userId: "UA0001",date: "2025-12-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -160000, pillar: "varios", category: "cat_supermercado" },
  { id:339, userId: "UA0001",date: "2025-12-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id:340, userId: "UA0001",date: "2025-12-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -65000, pillar: "ocio", category: "cat_bares" },
  { id:341, userId: "UA0001",date: "2025-12-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -380000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id:342, userId: "UA0001",date: "2025-12-24", time: "12:30", description: "Cena Navidad", method: "Tarjeta", amount: -120000, pillar: "ocio", category: "cat_restaurantes" },
  { id:343, userId: "UA0001",date: "2025-12-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2950000, pillar: "ingreso", category: null },

  // ===== USUARIO UB0002 (Maria) - Ene 2026 a Jul 2026 =====
  { id: 1000, userId: "UB0002", date: "2026-01-05", time: "19:00", description: "Cena con amigas", method: "Tarjeta", amount: -85000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1001, userId: "UB0002", date: "2026-01-08", time: "14:30", description: "Uber Eats", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id: 1002, userId: "UB0002", date: "2026-01-12", time: "20:00", description: "Cine Royal", method: "Tarjeta", amount: -50000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 1003, userId: "UB0002", date: "2026-01-18", time: "15:00", description: "Compras Ropa Éxito", method: "Tarjeta", amount: -120000, pillar: "varios", category: "cat_ropa" },
  { id: 1004, userId: "UB0002", date: "2026-01-22", time: "18:30", description: "Restaurante Andrés", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1005, userId: "UB0002", date: "2026-01-25", time: "20:00", description: "Concierto Artista", method: "Tarjeta", amount: -120000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 1006, userId: "UB0002", date: "2026-01-28", time: "14:00", description: "Compras Supermercado", method: "Tarjeta", amount: -85000, pillar: "varios", category: "cat_supermercado" },
  { id: 1007, userId: "UB0002", date: "2026-01-30", time: "12:00", description: "Sueldo XYZ", method: "Banco", amount: 2200000, pillar: "ingreso", category: null },
  { id: 1008, userId: "UB0002", date: "2026-02-05", time: "19:00", description: "Cena restaurante", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1009, userId: "UB0002", date: "2026-02-08", time: "14:30", description: "Uber Eats", method: "Nequi", amount: -42000, pillar: "ocio", category: "cat_domicilios" },
  { id: 1010, userId: "UB0002", date: "2026-02-12", time: "20:00", description: "Cine Colombia", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 1011, userId: "UB0002", date: "2026-02-15", time: "18:00", description: "Happy Hour Bar", method: "Tarjeta", amount: -65000, pillar: "ocio", category: "cat_bares" },
  { id: 1012, userId: "UB0002", date: "2026-02-18", time: "15:00", description: "Compras Tienda", method: "Tarjeta", amount: -110000, pillar: "varios", category: "cat_ropa" },
  { id: 1013, userId: "UB0002", date: "2026-02-22", time: "19:30", description: "Cena especial", method: "Tarjeta", amount: -145000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1014, userId: "UB0002", date: "2026-02-25", time: "14:00", description: "Supermercado Carrefour", method: "Tarjeta", amount: -95000, pillar: "varios", category: "cat_supermercado" },
  { id: 1015, userId: "UB0002", date: "2026-02-28", time: "12:00", description: "Sueldo XYZ", method: "Banco", amount: 2200000, pillar: "ingreso", category: null },
  { id: 1016, userId: "UB0002", date: "2026-03-05", time: "19:00", description: "Cena con amigas", method: "Tarjeta", amount: -80000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1017, userId: "UB0002", date: "2026-03-08", time: "14:30", description: "Rappi Comida", method: "Nequi", amount: -38000, pillar: "ocio", category: "cat_domicilios" },
  { id: 1018, userId: "UB0002", date: "2026-03-12", time: "20:00", description: "Cine Royal", method: "Tarjeta", amount: -50000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 1019, userId: "UB0002", date: "2026-03-15", time: "18:00", description: "Bar Encuentros", method: "Tarjeta", amount: -70000, pillar: "ocio", category: "cat_bares" },
  { id: 1020, userId: "UB0002", date: "2026-03-18", time: "15:00", description: "Compras Moda", method: "Tarjeta", amount: -130000, pillar: "varios", category: "cat_ropa" },
  { id: 1021, userId: "UB0002", date: "2026-03-22", time: "19:00", description: "Restaurante Fusion", method: "Tarjeta", amount: -105000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1022, userId: "UB0002", date: "2026-03-25", time: "14:00", description: "Makro Compras", method: "Tarjeta", amount: -100000, pillar: "varios", category: "cat_supermercado" },
  { id: 1023, userId: "UB0002", date: "2026-03-30", time: "12:00", description: "Sueldo XYZ", method: "Banco", amount: 2200000, pillar: "ingreso", category: null },
  { id: 1024, userId: "UB0002", date: "2026-04-05", time: "19:00", description: "Cena Restaurante", method: "Tarjeta", amount: -85000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1025, userId: "UB0002", date: "2026-04-08", time: "14:30", description: "Uber Eats", method: "Nequi", amount: -42000, pillar: "ocio", category: "cat_domicilios" },
  { id: 1026, userId: "UB0002", date: "2026-04-12", time: "20:00", description: "Cine Colombia", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 1027, userId: "UB0002", date: "2026-04-15", time: "18:00", description: "Happy Hour", method: "Tarjeta", amount: -65000, pillar: "ocio", category: "cat_bares" },
  { id: 1028, userId: "UB0002", date: "2026-04-18", time: "15:00", description: "Compras Ropa", method: "Tarjeta", amount: -125000, pillar: "varios", category: "cat_ropa" },
  { id: 1029, userId: "UB0002", date: "2026-04-22", time: "19:30", description: "Cena especial", method: "Tarjeta", amount: -140000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1030, userId: "UB0002", date: "2026-04-25", time: "14:00", description: "Supermercado", method: "Tarjeta", amount: -90000, pillar: "varios", category: "cat_supermercado" },
  { id: 1031, userId: "UB0002", date: "2026-04-30", time: "12:00", description: "Sueldo XYZ", method: "Banco", amount: 2200000, pillar: "ingreso", category: null },
  { id: 1032, userId: "UB0002", date: "2026-05-05", time: "19:00", description: "Cena con amigas", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1033, userId: "UB0002", date: "2026-05-08", time: "14:30", description: "iFood Comida", method: "Nequi", amount: -35000, pillar: "ocio", category: "cat_domicilios" },
  { id: 1034, userId: "UB0002", date: "2026-05-12", time: "20:00", description: "Cine Royal", method: "Tarjeta", amount: -50000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 1035, userId: "UB0002", date: "2026-05-15", time: "18:00", description: "Bar Social", method: "Tarjeta", amount: -60000, pillar: "ocio", category: "cat_bares" },
  { id: 1036, userId: "UB0002", date: "2026-05-18", time: "15:00", description: "Compras Tienda", method: "Tarjeta", amount: -115000, pillar: "varios", category: "cat_ropa" },
  { id: 1037, userId: "UB0002", date: "2026-05-22", time: "19:00", description: "Restaurante Gourmet", method: "Tarjeta", amount: -130000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1038, userId: "UB0002", date: "2026-05-25", time: "14:00", description: "Carrefour Compras", method: "Tarjeta", amount: -98000, pillar: "varios", category: "cat_supermercado" },
  { id: 1039, userId: "UB0002", date: "2026-05-30", time: "12:00", description: "Sueldo XYZ", method: "Banco", amount: 2200000, pillar: "ingreso", category: null },
  { id: 1040, userId: "UB0002", date: "2026-06-05", time: "19:00", description: "Cena Restaurante", method: "Tarjeta", amount: -88000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1041, userId: "UB0002", date: "2026-06-08", time: "14:30", description: "Rappi Comida", method: "Nequi", amount: -40000, pillar: "ocio", category: "cat_domicilios" },
  { id: 1042, userId: "UB0002", date: "2026-06-12", time: "20:00", description: "Cine Colombia", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 1043, userId: "UB0002", date: "2026-06-15", time: "18:00", description: "Happy Hour Pub", method: "Tarjeta", amount: -68000, pillar: "ocio", category: "cat_bares" },
  { id: 1044, userId: "UB0002", date: "2026-06-18", time: "15:00", description: "Compras Moda", method: "Tarjeta", amount: -122000, pillar: "varios", category: "cat_ropa" },
  { id: 1045, userId: "UB0002", date: "2026-06-22", time: "19:30", description: "Cena especial", method: "Tarjeta", amount: -135000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1046, userId: "UB0002", date: "2026-06-25", time: "14:00", description: "Supermercado D1", method: "Tarjeta", amount: -92000, pillar: "varios", category: "cat_supermercado" },
  { id: 1047, userId: "UB0002", date: "2026-06-30", time: "12:00", description: "Sueldo XYZ", method: "Banco", amount: 2200000, pillar: "ingreso", category: null },
  { id: 1048, userId: "UB0002", date: "2026-07-05", time: "19:00", description: "Cena social", method: "Tarjeta", amount: -78000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 1049, userId: "UB0002", date: "2026-07-08", time: "14:30", description: "Uber Eats", method: "Nequi", amount: -38000, pillar: "ocio", category: "cat_domicilios" },
  { id: 1050, userId: "UB0002", date: "2026-07-12", time: "20:00", description: "Cine Royal", method: "Tarjeta", amount: -50000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 1051, userId: "UB0002", date: "2026-07-15", time: "18:00", description: "Bar Encuentro", method: "Tarjeta", amount: -62000, pillar: "ocio", category: "cat_bares" },
  { id: 1052, userId: "UB0002", date: "2026-07-18", time: "15:00", description: "Compras Tienda", method: "Tarjeta", amount: -118000, pillar: "varios", category: "cat_ropa" },
  { id: 1053, userId: "UB0002", date: "2026-07-10", time: "19:00", description: "Gasto social", method: "Tarjeta", amount: -60000, pillar: "ocio", category: "cat_domicilios" },
  { id: 1054, userId: "UB0002", date: "2026-07-31", time: "12:00", description: "Sueldo XYZ", method: "Banco", amount: 2200000, pillar: "ingreso", category: null },

  // ===== USUARIO UC0003 (Carlos) - Ago 2025 a Ago 1 2026 =====
  { id: 2000, userId: "UC0003", date: "2025-08-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2000, userId: "UC0003", date: "2025-08-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
  { id: 2001, userId: "UC0003", date: "2025-08-10", time: "11:00", description: "Gasto", method: "Tarjeta", amount: -120000, pillar: "varios", category: "cat_supermercado" },
  { id: 2002, userId: "UC0003", date: "2025-08-15", time: "14:00", description: "Ahorro", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 2003, userId: "UC0003", date: "2025-08-20", time: "11:00", description: "Gasto", method: "Tarjeta", amount: -120000, pillar: "varios", category: "cat_supermercado" },
  { id: 2004, userId: "UC0003", date: "2025-08-25", time: "09:00", description: "Sueldo Empresa", method: "Banco", amount: 2600000, pillar: "ingreso", category: null },
  { id: 2005, userId: "UC0003", date: "2025-09-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2006, userId: "UC0003", date: "2025-09-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
  { id: 2007, userId: "UC0003", date: "2025-09-10", time: "15:30", description: "Compras", method: "Tarjeta", amount: -95000, pillar: "varios", category: "cat_supermercado" },
  { id: 2008, userId: "UC0003", date: "2025-09-15", time: "14:00", description: "Ahorro Fondo", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 2009, userId: "UC0003", date: "2025-09-20", time: "11:00", description: "Gasto Varios", method: "Tarjeta", amount: -115000, pillar: "varios", category: "cat_supermercado" },
  { id: 2010, userId: "UC0003", date: "2025-09-25", time: "09:00", description: "Sueldo Empresa", method: "Banco", amount: 2600000, pillar: "ingreso", category: null },
  { id: 2011, userId: "UC0003", date: "2025-10-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2012, userId: "UC0003", date: "2025-10-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
  { id: 2013, userId: "UC0003", date: "2025-10-10", time: "16:00", description: "Compra Comestibles", method: "Tarjeta", amount: -105000, pillar: "varios", category: "cat_supermercado" },
  { id: 2014, userId: "UC0003", date: "2025-10-15", time: "14:00", description: "Ahorro Deposito", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 2015, userId: "UC0003", date: "2025-10-20", time: "11:30", description: "Compras Varias", method: "Tarjeta", amount: -125000, pillar: "varios", category: "cat_supermercado" },
  { id: 2016, userId: "UC0003", date: "2025-10-25", time: "09:00", description: "Sueldo Empresa", method: "Banco", amount: 2600000, pillar: "ingreso", category: null },
  { id: 2017, userId: "UC0003", date: "2025-11-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2018, userId: "UC0003", date: "2025-11-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
  { id: 2019, userId: "UC0003", date: "2025-11-10", time: "17:00", description: "Mercado", method: "Tarjeta", amount: -110000, pillar: "varios", category: "cat_supermercado" },
  { id: 2020, userId: "UC0003", date: "2025-11-15", time: "14:00", description: "Fondo Emergencia", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 2021, userId: "UC0003", date: "2025-11-20", time: "12:00", description: "Gasto Diario", method: "Tarjeta", amount: -130000, pillar: "varios", category: "cat_supermercado" },
  { id: 2022, userId: "UC0003", date: "2025-11-25", time: "09:00", description: "Sueldo Empresa", method: "Banco", amount: 2600000, pillar: "ingreso", category: null },
  { id: 2023, userId: "UC0003", date: "2025-12-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2024, userId: "UC0003", date: "2025-12-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
  { id: 2025, userId: "UC0003", date: "2025-12-10", time: "18:00", description: "Compras Navidad", method: "Tarjeta", amount: -200000, pillar: "varios", category: "cat_supermercado" },
  { id: 2026, userId: "UC0003", date: "2025-12-15", time: "14:00", description: "Ahorro Navidad", method: "Banco", amount: -300000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 2027, userId: "UC0003", date: "2025-12-20", time: "13:00", description: "Cena Navidad", method: "Tarjeta", amount: -150000, pillar: "varios", category: "cat_supermercado" },
  { id: 2028, userId: "UC0003", date: "2025-12-25", time: "09:00", description: "Sueldo Empresa", method: "Banco", amount: 2600000, pillar: "ingreso", category: null },
  { id: 2029, userId: "UC0003", date: "2026-01-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2030, userId: "UC0003", date: "2026-01-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
  { id: 2031, userId: "UC0003", date: "2026-01-10", time: "16:30", description: "Mercado", method: "Tarjeta", amount: -98000, pillar: "varios", category: "cat_supermercado" },
  { id: 2032, userId: "UC0003", date: "2026-01-15", time: "14:00", description: "Ahorro Fondo", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 2033, userId: "UC0003", date: "2026-01-20", time: "11:45", description: "Compras Varias", method: "Tarjeta", amount: -120000, pillar: "varios", category: "cat_supermercado" },
  { id: 2034, userId: "UC0003", date: "2026-01-25", time: "09:00", description: "Sueldo Empresa", method: "Banco", amount: 2600000, pillar: "ingreso", category: null },
  { id: 2035, userId: "UC0003", date: "2026-02-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2036, userId: "UC0003", date: "2026-02-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
  { id: 2037, userId: "UC0003", date: "2026-02-10", time: "17:15", description: "Mercado Compras", method: "Tarjeta", amount: -112000, pillar: "varios", category: "cat_supermercado" },
  { id: 2038, userId: "UC0003", date: "2026-02-15", time: "14:00", description: "Ahorro Deposito", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 2039, userId: "UC0003", date: "2026-02-20", time: "12:30", description: "Gasto Diario", method: "Tarjeta", amount: -135000, pillar: "varios", category: "cat_supermercado" },
  { id: 2040, userId: "UC0003", date: "2026-02-25", time: "09:00", description: "Sueldo Empresa", method: "Banco", amount: 2600000, pillar: "ingreso", category: null },
  { id: 2041, userId: "UC0003", date: "2026-03-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2042, userId: "UC0003", date: "2026-03-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
  { id: 2043, userId: "UC0003", date: "2026-03-10", time: "18:00", description: "Compras Supermercado", method: "Tarjeta", amount: -105000, pillar: "varios", category: "cat_supermercado" },
  { id: 2044, userId: "UC0003", date: "2026-03-15", time: "14:00", description: "Ahorro Fondo", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 2045, userId: "UC0003", date: "2026-03-20", time: "13:15", description: "Gasto Mercado", method: "Tarjeta", amount: -128000, pillar: "varios", category: "cat_supermercado" },
  { id: 2046, userId: "UC0003", date: "2026-03-25", time: "09:00", description: "Sueldo Empresa", method: "Banco", amount: 2600000, pillar: "ingreso", category: null },
  { id: 2047, userId: "UC0003", date: "2026-04-01", time: "08:00", description: "Arriendo", method: "Banco", amount: -650000, pillar: "fijos", category: "cat_arriendo" },
  { id: 2048, userId: "UC0003", date: "2026-04-05", time: "10:00", description: "Cuota Deuda", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_credito_banco" },
];

// 🌎 Monedas soportadas (value, label, symbol). El símbolo lo usa fmt() y se
// propaga por toda la app. Editar aquí cambia el catálogo en todos lados.
export const CURRENCIES = [
  { value: "COP", label: "Peso Colombiano (COP) - $", symbol: "$" },
  { value: "USD", label: "Dólar Estadounidense (USD) - $", symbol: "$" },
  { value: "EUR", label: "Euro (EUR) - €", symbol: "€" },
  { value: "GBP", label: "Libra Esterlina (GBP) - £", symbol: "£" },
  { value: "JPY", label: "Yen Japonés (JPY) - ¥", symbol: "¥" },
  { value: "CNY", label: "Yuan Chino (CNY) - CN¥", symbol: "CN¥" },
  { value: "AUD", label: "Dólar Australiano (AUD) - A$", symbol: "A$" },
  { value: "CAD", label: "Dólar Canadiense (CAD) - C$", symbol: "C$" },
  { value: "CHF", label: "Franco Suizo (CHF) - CHF", symbol: "CHF" },
  { value: "HKD", label: "Dólar de Hong Kong (HKD) - HK$", symbol: "HK$" },
  { value: "SGD", label: "Dólar de Singapur (SGD) - S$", symbol: "S$" },
  { value: "INR", label: "Rupia India (INR) - ₹", symbol: "₹" },
  { value: "KRW", label: "Won Surcoreano (KRW) - ₩", symbol: "₩" },
  { value: "BRL", label: "Real Brasileño (BRL) - R$", symbol: "R$" },
  { value: "MXN", label: "Peso Mexicano (MXN) - MX$", symbol: "MX$" },
];

// Mapa código -> símbolo (derivado de CURRENCIES).
export const CURRENCY_SYMBOLS = Object.fromEntries(CURRENCIES.map(c => [c.value, c.symbol]));

// 🗣️ Idiomas soportados.
export const LANGUAGES = [
  { value: "ES", label: "Español (ES)" },
  { value: "EN", label: "English (EN)" },
  { value: "FR", label: "Français (FR)" },
  { value: "IT", label: "Italiano (IT)" },
  { value: "PT", label: "Português (PT)" },
];
