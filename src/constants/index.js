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
    history: [],      // 🆕 Historial de cambios
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
    history: [],     // 🆕
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
    history: [],     // 🆕
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
    icon: "🎉",
    budget: 400000,  // 🆕
    history: [],     // 🆕
    get spent() { return getPillarTotals("ocio").spent; },
    get categories() { return getPillarCategories("ocio"); }
  },
  {
    id: "varios",
    label: "Varios",
    color: "#FDE68A",
    darkColor: "#FDE68A",
    bg: "#FFFBEB",
    darkBg: "#231c0d",
    icon: "🛒",
    budget: null,  // 🆕 Sin presupuesto fijo
    history: [],   // 🆕
    get spent() { return getPillarTotals("varios").spent; },
    get categories() { return getPillarCategories("varios"); }
  },
];

export const SALDO_COLOR = "#CBD5E1";

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
  ocio: { color: "#C4B5FD", icon: "🎉", label: "Ocio" },
  varios: { color: "#FDE68A", icon: "🛒", label: "Varios" },
  ingreso: { color: "#FCD34D", icon: "💵", label: "Ingreso" }
};

export const ALL_CATS = [
  // 🏠 FIJOS
  { id: "cat_arriendo",       name: "Arriendo",         pillar: "fijos", spent: 700000,   budget: 700000, history: [] },
  { id: "cat_internet",       name: "Internet",         pillar: "fijos", spent: 120000,   budget: 130000, history: [] },
  { id: "cat_servicios",      name: "Servicios",        pillar: "fijos", spent: 160000,   budget: 200000, history: [] },
  { id: "cat_suscripciones",  name: "Suscripciones",    pillar: "fijos", spent: 0,        budget: 170000, history: [] },
  // 💰 DEUDA
  { id: "cat_tarjeta_visa",   name: "Tarjeta Visa",     pillar: "deuda", spent: 300000,   budget: 300000, history: [] },
  { id: "cat_credito_banco",  name: "Crédito banco",    pillar: "deuda", spent: 200000,   budget: 200000, history: [] },
  // 🐖 AHORRO
  { id: "cat_fondo_emergencia", name: "Fondo emergencia", pillar: "ahorro", spent: 250000,  budget: 200000, history: [] },
  { id: "cat_meta_viaje",     name: "Meta viaje",       pillar: "ahorro", spent: 130000,  budget: 100000, history: [] },
  // 🎉 OCIO
  { id: "cat_restaurantes",   name: "Restaurantes",     pillar: "ocio", spent: 180000,   budget: 150000, history: [] },
  { id: "cat_domicilios",     name: "Domicilios",       pillar: "ocio", spent: 95000,    budget: 100000, history: [] },
  { id: "cat_cine_planes",    name: "Cine / Planes",    pillar: "ocio", spent: 65000,    budget: 80000, history: [] },
  { id: "cat_bares",          name: "Bares",            pillar: "ocio", spent: 50000,    budget: 70000, history: [] },
  // 🛒 VARIOS
  { id: "cat_supermercado",   name: "Supermercado",     pillar: "varios", spent: 90000,   budget: null, history: [] },
  { id: "cat_transporte",     name: "Transporte",       pillar: "varios", spent: 35000,   budget: null, history: [] },
  { id: "cat_salud",          name: "Salud",            pillar: "varios", spent: 20000,   budget: null, history: [] },
];

export const MANUAL_METHODS = [
  { id: "Llave",         icon: "🔑", color: "#D97706" },
  { id: "Banco",         icon: "🏦", color: "#64748B" },
  { id: "Tarjeta",       icon: "💳", color: "#4F8EF7" },
  { id: "Efectivo",      icon: "💵", color: "#22C55E" },
];

// Datos dummy para desarrollo (enero a mayo) - Variado y realista
export const DUMMY_TRANSACTIONS = [
  // ===== ENERO 2026 (8 transacciones - ~850K) =====
  { id: 100, date: "2026-01-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 101, date: "2026-01-05", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -42000, pillar: "ocio", category: "cat_domicilios" },
  { id: 102, date: "2026-01-10", time: "09:15", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 103, date: "2026-01-15", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -280000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 104, date: "2026-01-20", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 105, date: "2026-01-22", time: "18:15", description: "Restaurante Masa", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 106, date: "2026-01-25", time: "10:45", description: "Supermercado D1", method: "Tarjeta", amount: -95000, pillar: "varios", category: "cat_supermercado" },
  { id: 107, date: "2026-01-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== FEBRERO 2026 (17 transacciones - ~2.1M) =====
  { id: 108, date: "2026-02-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 109, date: "2026-02-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 110, date: "2026-02-04", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id: 111, date: "2026-02-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 112, date: "2026-02-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 113, date: "2026-02-10", time: "20:00", description: "El Corral Gourmet", method: "Tarjeta", amount: -88000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 114, date: "2026-02-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -320000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 115, date: "2026-02-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -112000, pillar: "varios", category: "cat_supermercado" },
  { id: 116, date: "2026-02-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id: 117, date: "2026-02-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_bares" },
  { id: 118, date: "2026-02-20", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -280000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id: 119, date: "2026-02-22", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "cat_transporte" },
  { id: 120, date: "2026-02-24", time: "12:30", description: "Domicilio iFood", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id: 121, date: "2026-02-26", time: "19:00", description: "Andrés Carne de Res", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 122, date: "2026-02-27", time: "09:15", description: "Fondo Emergencia", method: "Banco", amount: -250000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 123, date: "2026-02-28", time: "11:45", description: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 124, date: "2026-02-29", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2900000, pillar: "ingreso", category: null },

  // ===== MARZO 2026 (5 transacciones - ~1M) =====
  { id: 125, date: "2026-03-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 126, date: "2026-03-10", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 127, date: "2026-03-15", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -300000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 128, date: "2026-03-20", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 129, date: "2026-03-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== ABRIL 2026 (3-4 transacciones por CADA fecha) =====
  { id: 130, date: "2026-04-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 130.1, date: "2026-04-01", time: "14:30", description: "Rappi Comida", method: "Nequi", amount: -42000, pillar: "ocio", category: "cat_domicilios" },
  { id: 130.2, date: "2026-04-01", time: "19:00", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 130.3, date: "2026-04-01", time: "22:00", description: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "cat_bares" },
  { id: 131, date: "2026-04-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 131.1, date: "2026-04-02", time: "13:00", description: "iFood Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id: 131.2, date: "2026-04-02", time: "18:30", description: "Restaurante Wok", method: "Tarjeta", amount: -68000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 131.3, date: "2026-04-02", time: "21:15", description: "Bogotá Beer Company", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_bares" },
  { id: 132, date: "2026-04-05", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id: 132.1, date: "2026-04-05", time: "18:45", description: "Rappi Comida", method: "Nequi", amount: -38000, pillar: "ocio", category: "cat_domicilios" },
  { id: 132.2, date: "2026-04-05", time: "22:10", description: "iFood Postres", method: "Tarjeta", amount: -25000, pillar: "ocio", category: "cat_domicilios" },
  { id: 132.3, date: "2026-04-05", time: "23:30", description: "Netflix Película", method: "Tarjeta", amount: -8000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 133, date: "2026-04-08", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 133.1, date: "2026-04-08", time: "21:30", description: "Cinemark IMAX", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 133.2, date: "2026-04-08", time: "23:00", description: "Domicilio Rappi", method: "Nequi", amount: -42000, pillar: "ocio", category: "cat_domicilios" },
  { id: 133.3, date: "2026-04-08", time: "23:45", description: "Monserrate Bar", method: "Tarjeta", amount: -38000, pillar: "ocio", category: "cat_bares" },
  { id: 134, date: "2026-04-10", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 134.1, date: "2026-04-10", time: "12:30", description: "Almuerzo Restaurante", method: "Tarjeta", amount: -55000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 134.2, date: "2026-04-10", time: "19:00", description: "Uber Eats", method: "Nequi", amount: -52000, pillar: "ocio", category: "cat_domicilios" },
  { id: 134.3, date: "2026-04-10", time: "21:30", description: "Vintrash Bar", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_bares" },
  { id: 135, date: "2026-04-12", time: "12:30", description: "Leo's Restaurante", method: "Tarjeta", amount: -92000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 135.1, date: "2026-04-12", time: "19:00", description: "Restaurante Brasa", method: "Tarjeta", amount: -78000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 135.2, date: "2026-04-12", time: "22:00", description: "Andrés Carne de Res", method: "Tarjeta", amount: -85000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 135.3, date: "2026-04-12", time: "23:30", description: "BBC Copas", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_bares" },
  { id: 136, date: "2026-04-15", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -380000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 136.1, date: "2026-04-15", time: "14:00", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 136.2, date: "2026-04-15", time: "18:00", description: "iFood Comida", method: "Nequi", amount: -50000, pillar: "ocio", category: "cat_domicilios" },
  { id: 136.3, date: "2026-04-15", time: "20:30", description: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "cat_bares" },
  { id: 137, date: "2026-04-18", time: "11:00", description: "Makro Supermercado", method: "Tarjeta", amount: -128000, pillar: "varios", category: "cat_supermercado" },
  { id: 137.1, date: "2026-04-18", time: "14:30", description: "Rappi Comida", method: "Nequi", amount: -45000, pillar: "ocio", category: "cat_domicilios" },
  { id: 137.2, date: "2026-04-18", time: "18:00", description: "Restaurante Masa", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 137.3, date: "2026-04-18", time: "22:00", description: "Bar La Puerta", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_bares" },
  { id: 138, date: "2026-04-20", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id: 138.1, date: "2026-04-20", time: "17:00", description: "Cinemark", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 138.2, date: "2026-04-20", time: "19:30", description: "Uber Eats", method: "Nequi", amount: -58000, pillar: "ocio", category: "cat_domicilios" },
  { id: 138.3, date: "2026-04-20", time: "21:45", description: "Monserrate Bar", method: "Tarjeta", amount: -42000, pillar: "ocio", category: "cat_bares" },
  { id: 139, date: "2026-04-22", time: "18:15", description: "Monserrate Bar", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_bares" },
  { id: 139.1, date: "2026-04-22", time: "19:45", description: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "cat_bares" },
  { id: 139.2, date: "2026-04-22", time: "22:30", description: "Bogotá Beer Company", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_bares" },
  { id: 139.3, date: "2026-04-22", time: "23:45", description: "iFood Postres", method: "Nequi", amount: -28000, pillar: "ocio", category: "cat_domicilios" },
  { id: 140, date: "2026-04-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -320000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id: 140.1, date: "2026-04-25", time: "14:20", description: "Netflix Suscripción", method: "Tarjeta", amount: -18000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 140.2, date: "2026-04-25", time: "19:30", description: "Spotify Premium", method: "Tarjeta", amount: -12000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 140.3, date: "2026-04-25", time: "21:00", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 141, date: "2026-04-27", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -32000, pillar: "varios", category: "cat_transporte" },
  { id: 141.1, date: "2026-04-27", time: "20:00", description: "Concierto Artista Local", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 141.2, date: "2026-04-27", time: "22:00", description: "Rappi Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id: 141.3, date: "2026-04-27", time: "23:30", description: "Bar Entrada", method: "Tarjeta", amount: -38000, pillar: "ocio", category: "cat_bares" },
  { id: 142, date: "2026-04-30", time: "08:00", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 142.1, date: "2026-04-30", time: "13:00", description: "Almuerzo Especial", method: "Tarjeta", amount: -82000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 142.2, date: "2026-04-30", time: "19:00", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 142.3, date: "2026-04-30", time: "11:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 3100000, pillar: "ingreso", category: null },

  // ===== MAYO 2026 (11 transacciones - ~1.5M) =====
  { id: 150, date: "2026-05-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 151, date: "2026-05-05", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -50000, pillar: "ocio", category: "cat_domicilios" },
  { id: 152, date: "2026-05-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 153, date: "2026-05-10", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 154, date: "2026-05-12", time: "20:00", description: "Restaurante Wok", method: "Tarjeta", amount: -68000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 155, date: "2026-05-15", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -350000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 156, date: "2026-05-18", time: "11:00", description: "Carrefour", method: "Tarjeta", amount: -105000, pillar: "varios", category: "cat_supermercado" },
  { id: 157, date: "2026-05-20", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 158, date: "2026-05-22", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_bares" },
  { id: 159, date: "2026-05-25", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -200000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 160, date: "2026-05-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2700000, pillar: "ingreso", category: null },

  // ===== ENERO 2025 (12 transacciones - ~3.2M) =====
  { id: 200, date: "2025-01-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 201, date: "2025-01-03", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 202, date: "2025-01-05", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id: 203, date: "2025-01-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 204, date: "2025-01-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 205, date: "2025-01-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -420000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 206, date: "2025-01-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 207, date: "2025-01-18", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -125000, pillar: "varios", category: "cat_supermercado" },
  { id: 208, date: "2025-01-20", time: "18:15", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 209, date: "2025-01-22", time: "19:30", description: "Bar La Puerta", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_bares" },
  { id: 210, date: "2025-01-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -300000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id: 211, date: "2025-01-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== FEBRERO 2025 (14 transacciones - ~3.5M) =====
  { id: 212, date: "2025-02-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 213, date: "2025-02-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 214, date: "2025-02-04", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -62000, pillar: "ocio", category: "cat_domicilios" },
  { id: 215, date: "2025-02-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 216, date: "2025-02-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 217, date: "2025-02-10", time: "20:00", description: "El Corral Gourmet", method: "Tarjeta", amount: -105000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 218, date: "2025-02-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -480000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 219, date: "2025-02-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -135000, pillar: "varios", category: "cat_supermercado" },
  { id: 220, date: "2025-02-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id: 221, date: "2025-02-18", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -58000, pillar: "ocio", category: "cat_bares" },
  { id: 222, date: "2025-02-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -280000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 223, date: "2025-02-22", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "cat_transporte" },
  { id: 224, date: "2025-02-24", time: "12:30", description: "Andrés Carne de Res", method: "Tarjeta", amount: -128000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 225, date: "2025-02-28", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2900000, pillar: "ingreso", category: null },

  // ===== MARZO 2025 (10 transacciones - ~2.8M) =====
  { id: 226, date: "2025-03-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 227, date: "2025-03-03", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id: 228, date: "2025-03-05", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 229, date: "2025-03-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 230, date: "2025-03-10", time: "12:30", description: "Restaurante Wok", method: "Tarjeta", amount: -72000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 231, date: "2025-03-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -400000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 232, date: "2025-03-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 233, date: "2025-03-18", time: "11:00", description: "Makro Supermercado", method: "Tarjeta", amount: -145000, pillar: "varios", category: "cat_supermercado" },
  { id: 234, date: "2025-03-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -250000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id: 235, date: "2025-03-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== ABRIL 2025 (15 transacciones - ~4.2M) =====
  { id: 236, date: "2025-04-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 237, date: "2025-04-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 238, date: "2025-04-04", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id: 239, date: "2025-04-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 240, date: "2025-04-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 241, date: "2025-04-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -98000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 242, date: "2025-04-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -520000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 243, date: "2025-04-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -142000, pillar: "varios", category: "cat_supermercado" },
  { id: 244, date: "2025-04-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id: 245, date: "2025-04-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -65000, pillar: "ocio", category: "cat_bares" },
  { id: 246, date: "2025-04-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -350000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 247, date: "2025-04-22", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "cat_transporte" },
  { id: 248, date: "2025-04-24", time: "12:30", description: "Cinemark IMAX", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 249, date: "2025-04-26", time: "19:00", description: "Andrés Carne de Res", method: "Tarjeta", amount: -118000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 250, date: "2025-04-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 3000000, pillar: "ingreso", category: null },

  // ===== MAYO 2025 (11 transacciones - ~3.1M) =====
  { id: 251, date: "2025-05-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 252, date: "2025-05-03", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -52000, pillar: "ocio", category: "cat_domicilios" },
  { id: 253, date: "2025-05-05", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 254, date: "2025-05-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 255, date: "2025-05-10", time: "20:00", description: "Restaurante Wok", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 256, date: "2025-05-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -380000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 257, date: "2025-05-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 258, date: "2025-05-18", time: "11:00", description: "Carrefour", method: "Tarjeta", amount: -128000, pillar: "varios", category: "cat_supermercado" },
  { id: 259, date: "2025-05-22", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -58000, pillar: "ocio", category: "cat_bares" },
  { id: 260, date: "2025-05-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -280000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id: 261, date: "2025-05-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2750000, pillar: "ingreso", category: null },

  // ===== JUNIO 2025 (13 transacciones - ~3.6M) =====
  { id: 262, date: "2025-06-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 263, date: "2025-06-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 264, date: "2025-06-04", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "cat_domicilios" },
  { id: 265, date: "2025-06-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 266, date: "2025-06-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 267, date: "2025-06-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -92000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 268, date: "2025-06-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -420000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 269, date: "2025-06-14", time: "11:00", description: "Makro Supermercado", method: "Tarjeta", amount: -155000, pillar: "varios", category: "cat_supermercado" },
  { id: 270, date: "2025-06-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id: 271, date: "2025-06-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -60000, pillar: "ocio", category: "cat_bares" },
  { id: 272, date: "2025-06-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -300000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 273, date: "2025-06-24", time: "12:30", description: "Cinemark", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 274, date: "2025-06-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2850000, pillar: "ingreso", category: null },

  // ===== JULIO 2025 (9 transacciones - ~2.9M) =====
  { id: 275, date: "2025-07-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 276, date: "2025-07-05", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -50000, pillar: "ocio", category: "cat_domicilios" },
  { id: 277, date: "2025-07-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 278, date: "2025-07-10", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 279, date: "2025-07-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -400000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 280, date: "2025-07-15", time: "11:00", description: "Carrefour", method: "Tarjeta", amount: -105000, pillar: "varios", category: "cat_supermercado" },
  { id: 281, date: "2025-07-18", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -55000, pillar: "ocio", category: "cat_bares" },
  { id: 282, date: "2025-07-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -320000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id: 283, date: "2025-07-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== AGOSTO 2025 (12 transacciones - ~3.4M) =====
  { id: 284, date: "2025-08-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 285, date: "2025-08-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 286, date: "2025-08-04", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -52000, pillar: "ocio", category: "cat_domicilios" },
  { id: 287, date: "2025-08-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 288, date: "2025-08-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 289, date: "2025-08-10", time: "20:00", description: "El Corral Gourmet", method: "Tarjeta", amount: -85000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 290, date: "2025-08-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -450000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 291, date: "2025-08-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 292, date: "2025-08-18", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -130000, pillar: "varios", category: "cat_supermercado" },
  { id: 293, date: "2025-08-22", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -62000, pillar: "ocio", category: "cat_bares" },
  { id: 294, date: "2025-08-25", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -270000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 295, date: "2025-08-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2900000, pillar: "ingreso", category: null },

  // ===== SEPTIEMBRE 2025 (10 transacciones - ~3.1M) =====
  { id: 296, date: "2025-09-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 297, date: "2025-09-03", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -45000, pillar: "ocio", category: "cat_domicilios" },
  { id: 298, date: "2025-09-05", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 299, date: "2025-09-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 300, date: "2025-09-10", time: "20:00", description: "Restaurante Wok", method: "Tarjeta", amount: -70000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 301, date: "2025-09-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -380000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 302, date: "2025-09-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 303, date: "2025-09-18", time: "11:00", description: "Makro Supermercado", method: "Tarjeta", amount: -140000, pillar: "varios", category: "cat_supermercado" },
  { id: 304, date: "2025-09-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -300000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id: 305, date: "2025-09-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== OCTUBRE 2025 (14 transacciones - ~3.8M) =====
  { id: 306, date: "2025-10-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 307, date: "2025-10-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 308, date: "2025-10-04", time: "14:20", description: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "cat_domicilios" },
  { id: 309, date: "2025-10-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 310, date: "2025-10-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 311, date: "2025-10-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 312, date: "2025-10-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -500000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 313, date: "2025-10-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -145000, pillar: "varios", category: "cat_supermercado" },
  { id: 314, date: "2025-10-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id: 315, date: "2025-10-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -60000, pillar: "ocio", category: "cat_bares" },
  { id: 316, date: "2025-10-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -330000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 317, date: "2025-10-22", time: "16:20", description: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "cat_transporte" },
  { id: 318, date: "2025-10-24", time: "12:30", description: "Cinemark", method: "Tarjeta", amount: -50000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 319, date: "2025-10-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 3000000, pillar: "ingreso", category: null },

  // ===== NOVIEMBRE 2025 (11 transacciones - ~3.3M) =====
  { id: 320, date: "2025-11-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 321, date: "2025-11-03", time: "14:20", description: "iFood Comida", method: "Nequi", amount: -50000, pillar: "ocio", category: "cat_domicilios" },
  { id: 322, date: "2025-11-05", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 323, date: "2025-11-08", time: "19:45", description: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 324, date: "2025-11-10", time: "20:00", description: "Restaurante Wok", method: "Tarjeta", amount: -72000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 325, date: "2025-11-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -420000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 326, date: "2025-11-15", time: "15:30", description: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 327, date: "2025-11-18", time: "11:00", description: "Carrefour", method: "Tarjeta", amount: -125000, pillar: "varios", category: "cat_supermercado" },
  { id: 328, date: "2025-11-22", time: "18:15", description: "Stiefel Pub", method: "Tarjeta", amount: -58000, pillar: "ocio", category: "cat_bares" },
  { id: 329, date: "2025-11-25", time: "10:45", description: "Meta Viaje Deposito", method: "Banco", amount: -290000, pillar: "ahorro", category: "cat_meta_viaje" },
  { id: 330, date: "2025-11-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2850000, pillar: "ingreso", category: null },

  // ===== DICIEMBRE 2025 (13 transacciones - ~4.0M) =====
  { id: 331, date: "2025-12-01", time: "08:00", description: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "cat_arriendo" },
  { id: 332, date: "2025-12-02", time: "10:30", description: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "cat_internet" },
  { id: 333, date: "2025-12-04", time: "14:20", description: "Rappi Comida", method: "Nequi", amount: -52000, pillar: "ocio", category: "cat_domicilios" },
  { id: 334, date: "2025-12-06", time: "19:45", description: "Cine Royal", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "cat_cine_planes" },
  { id: 335, date: "2025-12-08", time: "08:00", description: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "cat_servicios" },
  { id: 336, date: "2025-12-10", time: "20:00", description: "Restaurante Masa", method: "Tarjeta", amount: -100000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 337, date: "2025-12-12", time: "08:30", description: "Pago Tarjeta Visa", method: "Banco", amount: -480000, pillar: "deuda", category: "cat_tarjeta_visa" },
  { id: 338, date: "2025-12-14", time: "11:00", description: "Carrefour Market", method: "Tarjeta", amount: -160000, pillar: "varios", category: "cat_supermercado" },
  { id: 339, date: "2025-12-16", time: "15:30", description: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "cat_servicios" },
  { id: 340, date: "2025-12-18", time: "18:15", description: "Bar La Puerta", method: "Tarjeta", amount: -65000, pillar: "ocio", category: "cat_bares" },
  { id: 341, date: "2025-12-20", time: "10:45", description: "Fondo Emergencia", method: "Banco", amount: -380000, pillar: "ahorro", category: "cat_fondo_emergencia" },
  { id: 342, date: "2025-12-24", time: "12:30", description: "Cena Navidad", method: "Tarjeta", amount: -120000, pillar: "ocio", category: "cat_restaurantes" },
  { id: 343, date: "2025-12-30", time: "12:00", description: "Sueldo Empresa ABC", method: "Banco", amount: 2950000, pillar: "ingreso", category: null },
];

// Transacciones del sistema
export const TRANSACTIONS = [
  { id:27, date:"2026-03-27", time:"16:40", description:"Transferencia de Carlos M.", method:"Nequi", amount:+50000, pillar:"ingreso", category:null },
  { id:28, date:"2026-03-14", time:"11:05", description:"Pago proyecto freelance", method:"Banco", amount:+200000, pillar:"ingreso", category:null },
  { id:29, date:"2026-02-18", time:"09:30", description:"Transferencia @llave1234", method:"Llave", amount:+38000, pillar:"ingreso", category:null },
  { id:1,  date:"2026-03-29", time:"09:12", description:"Recarga TransMilenio", method:"Llave", amount:-8000, pillar:"varios", category:"Transporte" },
  { id:2,  date:"2026-03-28", time:"20:14", description:"Rappi Comida", method:"Nequi", amount:-32000, pillar:"ocio", category:"Domicilios" },
  { id:3,  date:"2026-03-25", time:"19:55", description:"Cine Colombia · Usaquén", method:"Tarjeta", amount:-35000, pillar:"ocio", category:"Cine / Planes" },
  { id:4,  date:"2026-03-25", time:"11:30", description:"Éxito Supermercado", method:"Tarjeta", amount:-45000, pillar:"varios", category:"Supermercado" },
  { id:5,  date:"2026-03-22", time:"14:05", description:"El Corral Gourmet", method:"Tarjeta", amount:-42000, pillar:"ocio", category:"Restaurantes" },
  { id:6,  date:"2026-03-20", time:"10:00", description:"Ahorro Meta Viaje", method:"Banco", amount:-130000, pillar:"ahorro", category:"Meta viaje" },
  { id:7,  date:"2026-03-20", time:"22:30", description:"Bogotá Beer Company", method:"Tarjeta", amount:-25000, pillar:"ocio", category:"Bares" },
  { id:8,  date:"2026-03-18", time:"20:48", description:"iFood · Domicilio", method:"Nequi", amount:-28000, pillar:"ocio", category:"Domicilios" },
  { id:9,  date:"2026-03-15", time:"13:20", description:"Cruz Verde Farmacia", method:"Tarjeta", amount:-20000, pillar:"varios", category:"Salud" },
  { id:10, date:"2026-03-15", time:"21:10", description:"Cine Royal Films", method:"Tarjeta", amount:-30000, pillar:"ocio", category:"Cine / Planes" },
  { id:11, date:"2026-03-12", time:"10:00", description:"Fondo Emergencia", method:"Banco", amount:-250000, pillar:"ahorro", category:"Fondo emergencia" },
  { id:12, date:"2026-03-12", time:"23:30", description:"Vintrash Bar", method:"Tarjeta", amount:-25000, pillar:"ocio", category:"Bares" },
  { id:13, date:"2026-03-10", time:"13:45", description:"Andrés Carne de Res", method:"Tarjeta", amount:-55000, pillar:"ocio", category:"Restaurantes" },
  { id:14, date:"2026-03-08", time:"08:00", description:"Cuota Crédito Bancol.", method:"Banco", amount:-200000, pillar:"deuda", category:"Crédito banco" },
  { id:15, date:"2026-03-08", time:"17:35", description:"D1 Supermercado", method:"Tarjeta", amount:-45000, pillar:"varios", category:"Supermercado" },
  { id:16, date:"2026-03-05", time:"20:10", description:"Domicilio Rappi", method:"Nequi", amount:-35000, pillar:"ocio", category:"Domicilios" },
  { id:17, date:"2026-03-03", time:"07:00", description:"Internet Claro", method:"Banco", amount:-120000, pillar:"fijos", category:"Internet" },
  { id:18, date:"2026-03-01", time:"08:00", description:"Arriendo Apto 301", method:"Banco", amount:-700000, pillar:"fijos", category:"Arriendo" },
  { id:19, date:"2026-03-01", time:"09:15", description:"Pago Tarjeta Visa", method:"Banco", amount:-300000, pillar:"deuda", category:"Tarjeta Visa" },
  { id:20, date:"2026-02-27", time:"08:20", description:"Recarga TransMilenio", method:"Llave", amount:-15000, pillar:"varios", category:"Transporte" },
  { id:21, date:"2026-02-25", time:"13:55", description:"Restaurante Masa", method:"Tarjeta", amount:-45000, pillar:"ocio", category:"Restaurantes" },
  { id:22, date:"2026-02-22", time:"09:00", description:"Gas Natural Fenosa", method:"Banco", amount:-40000, pillar:"fijos", category:"Servicios" },
  { id:23, date:"2026-02-20", time:"08:30", description:"Luz EPM", method:"Banco", amount:-60000, pillar:"fijos", category:"Servicios" },
  { id:24, date:"2026-02-15", time:"12:30", description:"Restaurante Wok", method:"Voz", amount:-38000, pillar:"ocio", category:"Restaurantes" },
  { id:25, date:"2026-02-10", time:"08:00", description:"Agua EAAB", method:"Banco", amount:-60000, pillar:"fijos", category:"Servicios" },
  { id:26, date:"2026-02-05", time:"07:45", description:"Recarga TransMilenio", method:"Llave", amount:-12000, pillar:"varios", category:"Transporte" },
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
