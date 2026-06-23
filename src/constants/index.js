// Pilares (categorías principales)
export const PILLARS = [
  { id: "fijos",   label: "Fijos",   color: "#93C5FD", darkColor: "#3B82F6", bg: "#EFF6FF", darkBg: "#1a2744", icon: "🏠", budget: 1200000, spent: 980000, categories: [{ name: "Arriendo", spent: 700000, budget: 700000 }, { name: "Internet", spent: 120000, budget: 130000 }, { name: "Servicios", spent: 160000, budget: 200000 }, { name: "Suscripciones", spent: 0, budget: 170000 }] },
  { id: "deuda",   label: "Deuda",   color: "#FCA5A5", darkColor: "#EF4444", bg: "#FEF2F2", darkBg: "#2a1111", icon: "💰", budget: 500000, spent: 500000, categories: [{ name: "Tarjeta Visa", spent: 300000, budget: 300000 }, { name: "Crédito banco", spent: 200000, budget: 200000 }] },
  { id: "ahorro",  label: "Ahorro",  color: "#86EFAC", darkColor: "#22C55E", bg: "#F0FDF4", darkBg: "#0d2118", icon: "🐖", budget: 300000, spent: 380000, categories: [{ name: "Fondo emergencia", spent: 250000, budget: 200000 }, { name: "Meta viaje", spent: 130000, budget: 100000 }] },
  { id: "ocio",    label: "Ocio",    color: "#C4B5FD", darkColor: "#8B5CF6", bg: "#F5F3FF", darkBg: "#1e1635", icon: "🎉", budget: 400000, spent: 390000, categories: [{ name: "Restaurantes", spent: 180000, budget: 150000 }, { name: "Domicilios", spent: 95000, budget: 100000 }, { name: "Cine / Planes", spent: 65000, budget: 80000 }, { name: "Bares", spent: 50000, budget: 70000 }] },
  { id: "varios",  label: "Varios",  color: "#FDE68A", darkColor: "#D97706", bg: "#FFFBEB", darkBg: "#231c0d", icon: "🛒", budget: null, spent: 145000, categories: [{ name: "Supermercado", spent: 90000, budget: null }, { name: "Transporte", spent: 35000, budget: null }, { name: "Salud", spent: 20000, budget: null }] },
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
  { name: "Arriendo",         pillar: "fijos"  },
  { name: "Internet",         pillar: "fijos"  },
  { name: "Servicios",        pillar: "fijos"  },
  { name: "Suscripciones",    pillar: "fijos"  },
  { name: "Tarjeta Visa",     pillar: "deuda"  },
  { name: "Crédito banco",    pillar: "deuda"  },
  { name: "Fondo emergencia", pillar: "ahorro" },
  { name: "Meta viaje",       pillar: "ahorro" },
  { name: "Restaurantes",     pillar: "ocio"   },
  { name: "Domicilios",       pillar: "ocio"   },
  { name: "Cine / Planes",    pillar: "ocio"   },
  { name: "Bares",            pillar: "ocio"   },
  { name: "Supermercado",     pillar: "varios" },
  { name: "Transporte",       pillar: "varios" },
  { name: "Salud",            pillar: "varios" },
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
  { id: 100, date: "2026-01-01", time: "08:00", desc: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "Arriendo" },
  { id: 101, date: "2026-01-05", time: "14:20", desc: "Rappi Comida", method: "Nequi", amount: -42000, pillar: "ocio", category: "Domicilios" },
  { id: 102, date: "2026-01-10", time: "09:15", desc: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "Servicios" },
  { id: 103, date: "2026-01-15", time: "08:30", desc: "Pago Tarjeta Visa", method: "Banco", amount: -280000, pillar: "deuda", category: "Tarjeta Visa" },
  { id: 104, date: "2026-01-20", time: "15:30", desc: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "Servicios" },
  { id: 105, date: "2026-01-22", time: "18:15", desc: "Restaurante Masa", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "Restaurantes" },
  { id: 106, date: "2026-01-25", time: "10:45", desc: "Supermercado D1", method: "Tarjeta", amount: -95000, pillar: "varios", category: "Supermercado" },
  { id: 107, date: "2026-01-30", time: "12:00", desc: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== FEBRERO 2026 (17 transacciones - ~2.1M) =====
  { id: 108, date: "2026-02-01", time: "08:00", desc: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "Arriendo" },
  { id: 109, date: "2026-02-02", time: "10:30", desc: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "Internet" },
  { id: 110, date: "2026-02-04", time: "14:20", desc: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "Domicilios" },
  { id: 111, date: "2026-02-06", time: "19:45", desc: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "Cine / Planes" },
  { id: 112, date: "2026-02-08", time: "08:00", desc: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "Servicios" },
  { id: 113, date: "2026-02-10", time: "20:00", desc: "El Corral Gourmet", method: "Tarjeta", amount: -88000, pillar: "ocio", category: "Restaurantes" },
  { id: 114, date: "2026-02-12", time: "08:30", desc: "Pago Tarjeta Visa", method: "Banco", amount: -320000, pillar: "deuda", category: "Tarjeta Visa" },
  { id: 115, date: "2026-02-14", time: "11:00", desc: "Carrefour Market", method: "Tarjeta", amount: -112000, pillar: "varios", category: "Supermercado" },
  { id: 116, date: "2026-02-16", time: "15:30", desc: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "Servicios" },
  { id: 117, date: "2026-02-18", time: "18:15", desc: "Bar La Puerta", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "Bares" },
  { id: 118, date: "2026-02-20", time: "10:45", desc: "Meta Viaje Deposito", method: "Banco", amount: -280000, pillar: "ahorro", category: "Meta viaje" },
  { id: 119, date: "2026-02-22", time: "16:20", desc: "TransMilenio Recarga", method: "Llave", amount: -35000, pillar: "varios", category: "Transporte" },
  { id: 120, date: "2026-02-24", time: "12:30", desc: "Domicilio iFood", method: "Nequi", amount: -48000, pillar: "ocio", category: "Domicilios" },
  { id: 121, date: "2026-02-26", time: "19:00", desc: "Andrés Carne de Res", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "Restaurantes" },
  { id: 122, date: "2026-02-27", time: "09:15", desc: "Fondo Emergencia", method: "Banco", amount: -250000, pillar: "ahorro", category: "Fondo emergencia" },
  { id: 123, date: "2026-02-28", time: "11:45", desc: "Cine Colombia", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "Cine / Planes" },
  { id: 124, date: "2026-02-29", time: "12:00", desc: "Sueldo Empresa ABC", method: "Banco", amount: 2900000, pillar: "ingreso", category: null },

  // ===== MARZO 2026 (5 transacciones - ~1M) =====
  { id: 125, date: "2026-03-01", time: "08:00", desc: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "Arriendo" },
  { id: 126, date: "2026-03-10", time: "08:00", desc: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "Servicios" },
  { id: 127, date: "2026-03-15", time: "08:30", desc: "Pago Tarjeta Visa", method: "Banco", amount: -300000, pillar: "deuda", category: "Tarjeta Visa" },
  { id: 128, date: "2026-03-20", time: "15:30", desc: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "Servicios" },
  { id: 129, date: "2026-03-30", time: "12:00", desc: "Sueldo Empresa ABC", method: "Banco", amount: 2800000, pillar: "ingreso", category: null },

  // ===== ABRIL 2026 (3-4 transacciones por CADA fecha) =====
  { id: 130, date: "2026-04-01", time: "08:00", desc: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "Arriendo" },
  { id: 130.1, date: "2026-04-01", time: "14:30", desc: "Rappi Comida", method: "Nequi", amount: -42000, pillar: "ocio", category: "Domicilios" },
  { id: 130.2, date: "2026-04-01", time: "19:00", desc: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "Cine / Planes" },
  { id: 130.3, date: "2026-04-01", time: "22:00", desc: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "Bares" },
  { id: 131, date: "2026-04-02", time: "10:30", desc: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "Internet" },
  { id: 131.1, date: "2026-04-02", time: "13:00", desc: "iFood Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "Domicilios" },
  { id: 131.2, date: "2026-04-02", time: "18:30", desc: "Restaurante Wok", method: "Tarjeta", amount: -68000, pillar: "ocio", category: "Restaurantes" },
  { id: 131.3, date: "2026-04-02", time: "21:15", desc: "Bogotá Beer Company", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "Bares" },
  { id: 132, date: "2026-04-05", time: "14:20", desc: "Uber Eats", method: "Nequi", amount: -55000, pillar: "ocio", category: "Domicilios" },
  { id: 132.1, date: "2026-04-05", time: "18:45", desc: "Rappi Comida", method: "Nequi", amount: -38000, pillar: "ocio", category: "Domicilios" },
  { id: 132.2, date: "2026-04-05", time: "22:10", desc: "iFood Postres", method: "Tarjeta", amount: -25000, pillar: "ocio", category: "Domicilios" },
  { id: 132.3, date: "2026-04-05", time: "23:30", desc: "Netflix Película", method: "Tarjeta", amount: -8000, pillar: "ocio", category: "Streaming" },
  { id: 133, date: "2026-04-08", time: "19:45", desc: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "Cine / Planes" },
  { id: 133.1, date: "2026-04-08", time: "21:30", desc: "Cinemark IMAX", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "Cine / Planes" },
  { id: 133.2, date: "2026-04-08", time: "23:00", desc: "Domicilio Rappi", method: "Nequi", amount: -42000, pillar: "ocio", category: "Domicilios" },
  { id: 133.3, date: "2026-04-08", time: "23:45", desc: "Monserrate Bar", method: "Tarjeta", amount: -38000, pillar: "ocio", category: "Bares" },
  { id: 134, date: "2026-04-10", time: "08:00", desc: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "Servicios" },
  { id: 134.1, date: "2026-04-10", time: "12:30", desc: "Almuerzo Restaurante", method: "Tarjeta", amount: -55000, pillar: "ocio", category: "Restaurantes" },
  { id: 134.2, date: "2026-04-10", time: "19:00", desc: "Uber Eats", method: "Nequi", amount: -52000, pillar: "ocio", category: "Domicilios" },
  { id: 134.3, date: "2026-04-10", time: "21:30", desc: "Vintrash Bar", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "Bares" },
  { id: 135, date: "2026-04-12", time: "12:30", desc: "Leo's Restaurante", method: "Tarjeta", amount: -92000, pillar: "ocio", category: "Restaurantes" },
  { id: 135.1, date: "2026-04-12", time: "19:00", desc: "Restaurante Brasa", method: "Tarjeta", amount: -78000, pillar: "ocio", category: "Restaurantes" },
  { id: 135.2, date: "2026-04-12", time: "22:00", desc: "Andrés Carne de Res", method: "Tarjeta", amount: -85000, pillar: "ocio", category: "Restaurantes" },
  { id: 135.3, date: "2026-04-12", time: "23:30", desc: "BBC Copas", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "Bares" },
  { id: 136, date: "2026-04-15", time: "08:30", desc: "Pago Tarjeta Visa", method: "Banco", amount: -380000, pillar: "deuda", category: "Tarjeta Visa" },
  { id: 136.1, date: "2026-04-15", time: "14:00", desc: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "Cine / Planes" },
  { id: 136.2, date: "2026-04-15", time: "18:00", desc: "iFood Comida", method: "Nequi", amount: -50000, pillar: "ocio", category: "Domicilios" },
  { id: 136.3, date: "2026-04-15", time: "20:30", desc: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "Bares" },
  { id: 137, date: "2026-04-18", time: "11:00", desc: "Makro Supermercado", method: "Tarjeta", amount: -128000, pillar: "varios", category: "Supermercado" },
  { id: 137.1, date: "2026-04-18", time: "14:30", desc: "Rappi Comida", method: "Nequi", amount: -45000, pillar: "ocio", category: "Domicilios" },
  { id: 137.2, date: "2026-04-18", time: "18:00", desc: "Restaurante Masa", method: "Tarjeta", amount: -75000, pillar: "ocio", category: "Restaurantes" },
  { id: 137.3, date: "2026-04-18", time: "22:00", desc: "Bar La Puerta", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "Bares" },
  { id: 138, date: "2026-04-20", time: "15:30", desc: "Gas Natural Fenosa", method: "Banco", amount: -40000, pillar: "fijos", category: "Servicios" },
  { id: 138.1, date: "2026-04-20", time: "17:00", desc: "Cinemark", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "Cine / Planes" },
  { id: 138.2, date: "2026-04-20", time: "19:30", desc: "Uber Eats", method: "Nequi", amount: -58000, pillar: "ocio", category: "Domicilios" },
  { id: 138.3, date: "2026-04-20", time: "21:45", desc: "Monserrate Bar", method: "Tarjeta", amount: -42000, pillar: "ocio", category: "Bares" },
  { id: 139, date: "2026-04-22", time: "18:15", desc: "Monserrate Bar", method: "Tarjeta", amount: -40000, pillar: "ocio", category: "Bares" },
  { id: 139.1, date: "2026-04-22", time: "19:45", desc: "Stiefel Pub", method: "Tarjeta", amount: -35000, pillar: "ocio", category: "Bares" },
  { id: 139.2, date: "2026-04-22", time: "22:30", desc: "Bogotá Beer Company", method: "Tarjeta", amount: -48000, pillar: "ocio", category: "Bares" },
  { id: 139.3, date: "2026-04-22", time: "23:45", desc: "iFood Postres", method: "Nequi", amount: -28000, pillar: "ocio", category: "Domicilios" },
  { id: 140, date: "2026-04-25", time: "10:45", desc: "Meta Viaje Deposito", method: "Banco", amount: -320000, pillar: "ahorro", category: "Meta viaje" },
  { id: 140.1, date: "2026-04-25", time: "14:20", desc: "Netflix Suscripción", method: "Tarjeta", amount: -18000, pillar: "ocio", category: "Streaming" },
  { id: 140.2, date: "2026-04-25", time: "19:30", desc: "Spotify Premium", method: "Tarjeta", amount: -12000, pillar: "ocio", category: "Streaming" },
  { id: 140.3, date: "2026-04-25", time: "21:00", desc: "Cine Royal", method: "Tarjeta", amount: -45000, pillar: "ocio", category: "Cine / Planes" },
  { id: 141, date: "2026-04-27", time: "16:20", desc: "TransMilenio Recarga", method: "Llave", amount: -32000, pillar: "varios", category: "Transporte" },
  { id: 141.1, date: "2026-04-27", time: "20:00", desc: "Concierto Artista Local", method: "Tarjeta", amount: -95000, pillar: "ocio", category: "Cine / Planes" },
  { id: 141.2, date: "2026-04-27", time: "22:00", desc: "Rappi Comida", method: "Nequi", amount: -48000, pillar: "ocio", category: "Domicilios" },
  { id: 141.3, date: "2026-04-27", time: "23:30", desc: "Bar Entrada", method: "Tarjeta", amount: -38000, pillar: "ocio", category: "Bares" },
  { id: 142, date: "2026-04-30", time: "08:00", desc: "Internet Claro", method: "Banco", amount: -120000, pillar: "fijos", category: "Internet" },
  { id: 142.1, date: "2026-04-30", time: "13:00", desc: "Almuerzo Especial", method: "Tarjeta", amount: -82000, pillar: "ocio", category: "Restaurantes" },
  { id: 142.2, date: "2026-04-30", time: "19:00", desc: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "Cine / Planes" },
  { id: 142.3, date: "2026-04-30", time: "11:00", desc: "Sueldo Empresa ABC", method: "Banco", amount: 3100000, pillar: "ingreso", category: null },

  // ===== MAYO 2026 (11 transacciones - ~1.5M) =====
  { id: 150, date: "2026-05-01", time: "08:00", desc: "Arriendo Apto 301", method: "Banco", amount: -700000, pillar: "fijos", category: "Arriendo" },
  { id: 151, date: "2026-05-05", time: "14:20", desc: "iFood Comida", method: "Nequi", amount: -50000, pillar: "ocio", category: "Domicilios" },
  { id: 152, date: "2026-05-08", time: "19:45", desc: "Cine Colombia", method: "Tarjeta", amount: -43000, pillar: "ocio", category: "Cine / Planes" },
  { id: 153, date: "2026-05-10", time: "08:00", desc: "Agua EAAB", method: "Banco", amount: -60000, pillar: "fijos", category: "Servicios" },
  { id: 154, date: "2026-05-12", time: "20:00", desc: "Restaurante Wok", method: "Tarjeta", amount: -68000, pillar: "ocio", category: "Restaurantes" },
  { id: 155, date: "2026-05-15", time: "08:30", desc: "Pago Tarjeta Visa", method: "Banco", amount: -350000, pillar: "deuda", category: "Tarjeta Visa" },
  { id: 156, date: "2026-05-18", time: "11:00", desc: "Carrefour", method: "Tarjeta", amount: -105000, pillar: "varios", category: "Supermercado" },
  { id: 157, date: "2026-05-20", time: "15:30", desc: "Luz EPM", method: "Banco", amount: -60000, pillar: "fijos", category: "Servicios" },
  { id: 158, date: "2026-05-22", time: "18:15", desc: "Stiefel Pub", method: "Tarjeta", amount: -52000, pillar: "ocio", category: "Bares" },
  { id: 159, date: "2026-05-25", time: "10:45", desc: "Fondo Emergencia", method: "Banco", amount: -200000, pillar: "ahorro", category: "Fondo emergencia" },
  { id: 160, date: "2026-05-30", time: "12:00", desc: "Sueldo Empresa ABC", method: "Banco", amount: 2700000, pillar: "ingreso", category: null },
];

export const DUMMY_BALANCES = [
  { year: 2026, month: 1, value: 500000 },  // Enero
  { year: 2026, month: 2, value: 450000 },  // Febrero
  { year: 2026, month: 3, value: 400000 },  // Marzo
  { year: 2026, month: 4, value: 420000 },  // Abril
  { year: 2026, month: 5, value: 480000 },  // Mayo
];

// Transacciones del sistema
export const TRANSACTIONS = [
  { id:27, date:"2026-03-27", time:"16:40", desc:"Transferencia de Carlos M.", method:"Nequi", amount:+50000, pillar:"ingreso", category:null },
  { id:28, date:"2026-03-14", time:"11:05", desc:"Pago proyecto freelance", method:"Banco", amount:+200000, pillar:"ingreso", category:null },
  { id:29, date:"2026-02-18", time:"09:30", desc:"Transferencia @llave1234", method:"Llave", amount:+38000, pillar:"ingreso", category:null },
  { id:1,  date:"2026-03-29", time:"09:12", desc:"Recarga TransMilenio", method:"Llave", amount:-8000, pillar:"varios", category:"Transporte" },
  { id:2,  date:"2026-03-28", time:"20:14", desc:"Rappi Comida", method:"Nequi", amount:-32000, pillar:"ocio", category:"Domicilios" },
  { id:3,  date:"2026-03-25", time:"19:55", desc:"Cine Colombia · Usaquén", method:"Tarjeta", amount:-35000, pillar:"ocio", category:"Cine / Planes" },
  { id:4,  date:"2026-03-25", time:"11:30", desc:"Éxito Supermercado", method:"Tarjeta", amount:-45000, pillar:"varios", category:"Supermercado" },
  { id:5,  date:"2026-03-22", time:"14:05", desc:"El Corral Gourmet", method:"Tarjeta", amount:-42000, pillar:"ocio", category:"Restaurantes" },
  { id:6,  date:"2026-03-20", time:"10:00", desc:"Ahorro Meta Viaje", method:"Banco", amount:-130000, pillar:"ahorro", category:"Meta viaje" },
  { id:7,  date:"2026-03-20", time:"22:30", desc:"Bogotá Beer Company", method:"Tarjeta", amount:-25000, pillar:"ocio", category:"Bares" },
  { id:8,  date:"2026-03-18", time:"20:48", desc:"iFood · Domicilio", method:"Nequi", amount:-28000, pillar:"ocio", category:"Domicilios" },
  { id:9,  date:"2026-03-15", time:"13:20", desc:"Cruz Verde Farmacia", method:"Tarjeta", amount:-20000, pillar:"varios", category:"Salud" },
  { id:10, date:"2026-03-15", time:"21:10", desc:"Cine Royal Films", method:"Tarjeta", amount:-30000, pillar:"ocio", category:"Cine / Planes" },
  { id:11, date:"2026-03-12", time:"10:00", desc:"Fondo Emergencia", method:"Banco", amount:-250000, pillar:"ahorro", category:"Fondo emergencia" },
  { id:12, date:"2026-03-12", time:"23:30", desc:"Vintrash Bar", method:"Tarjeta", amount:-25000, pillar:"ocio", category:"Bares" },
  { id:13, date:"2026-03-10", time:"13:45", desc:"Andrés Carne de Res", method:"Tarjeta", amount:-55000, pillar:"ocio", category:"Restaurantes" },
  { id:14, date:"2026-03-08", time:"08:00", desc:"Cuota Crédito Bancol.", method:"Banco", amount:-200000, pillar:"deuda", category:"Crédito banco" },
  { id:15, date:"2026-03-08", time:"17:35", desc:"D1 Supermercado", method:"Tarjeta", amount:-45000, pillar:"varios", category:"Supermercado" },
  { id:16, date:"2026-03-05", time:"20:10", desc:"Domicilio Rappi", method:"Nequi", amount:-35000, pillar:"ocio", category:"Domicilios" },
  { id:17, date:"2026-03-03", time:"07:00", desc:"Internet Claro", method:"Banco", amount:-120000, pillar:"fijos", category:"Internet" },
  { id:18, date:"2026-03-01", time:"08:00", desc:"Arriendo Apto 301", method:"Banco", amount:-700000, pillar:"fijos", category:"Arriendo" },
  { id:19, date:"2026-03-01", time:"09:15", desc:"Pago Tarjeta Visa", method:"Banco", amount:-300000, pillar:"deuda", category:"Tarjeta Visa" },
  { id:20, date:"2026-02-27", time:"08:20", desc:"Recarga TransMilenio", method:"Llave", amount:-15000, pillar:"varios", category:"Transporte" },
  { id:21, date:"2026-02-25", time:"13:55", desc:"Restaurante Masa", method:"Tarjeta", amount:-45000, pillar:"ocio", category:"Restaurantes" },
  { id:22, date:"2026-02-22", time:"09:00", desc:"Gas Natural Fenosa", method:"Banco", amount:-40000, pillar:"fijos", category:"Servicios" },
  { id:23, date:"2026-02-20", time:"08:30", desc:"Luz EPM", method:"Banco", amount:-60000, pillar:"fijos", category:"Servicios" },
  { id:24, date:"2026-02-15", time:"12:30", desc:"Restaurante Wok", method:"Voz", amount:-38000, pillar:"ocio", category:"Restaurantes" },
  { id:25, date:"2026-02-10", time:"08:00", desc:"Agua EAAB", method:"Banco", amount:-60000, pillar:"fijos", category:"Servicios" },
  { id:26, date:"2026-02-05", time:"07:45", desc:"Recarga TransMilenio", method:"Llave", amount:-12000, pillar:"varios", category:"Transporte" },
];
