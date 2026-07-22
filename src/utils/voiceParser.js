/**
 * voiceParser.js — Interpreta una frase hablada y saca
 * { amount, desc, isIncome, method, concept, pillarId }.
 * SIN IA: usa reglas + expresiones regulares. Suficiente para frases simples como
 * "20 mil en cine con tarjeta" o "recibí cincuenta mil de sueldo".
 * Los casos ambiguos los corrige el usuario en la pantalla de nueva transacción.
 */
import { ALL_CATS } from "../constants";

// minúsculas + sin tildes (para comparar sin importar acentos)
const norm = (s) => (s || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Palabra dicha → método de pago (los válidos: Llave, Banco, Tarjeta, Efectivo)
const METHOD_KW = {
  tarjeta: "Tarjeta", tarjetas: "Tarjeta", credito: "Tarjeta", debito: "Tarjeta",
  efectivo: "Efectivo", cash: "Efectivo", billete: "Efectivo",
  llave: "Llave",
  banco: "Banco", transferencia: "Banco", transferi: "Banco", nequi: "Banco", daviplata: "Banco",
};

// Busca la primera categoría de GASTO (activa) cuyo nombre coincide con alguna palabra dicha.
// Coincide por palabra exacta o por prefijo (≥4 letras): "super" → "Supermercado", "cine" → "Cine / Planes".
function findCategoryByWords(normWords) {
  const cats = ALL_CATS.filter((c) => !c.deletedAt && c.pillar !== "ingreso");
  for (const cat of cats) {
    const catWords = norm(cat.name).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length >= 3);
    for (const cw of catWords) {
      for (const tw of normWords) {
        if (tw === cw) return cat;
        if (tw.length >= 4 && (cw.startsWith(tw) || tw.startsWith(cw))) return cat;
      }
    }
  }
  return null;
}

// Palabras-número en español (unidades, decenas, centenas)
// Nota: "un"/"una"/"uno" se omiten a propósito (casi siempre son artículos: "un café").
// "un millón" / "un mil" igual funciona porque los multiplicadores asumen 1 si no hay número.
const WORD_NUM = {
  cero: 0, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
  siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13, catorce: 14,
  quince: 15, dieciseis: 16, "dieciséis": 16, diecisiete: 17, dieciocho: 18, diecinueve: 19,
  veinte: 20, veintiuno: 21, veintidos: 22, "veintidós": 22, veintitres: 23, "veintitrés": 23,
  veinticuatro: 24, veinticinco: 25, veintiseis: 26, "veintiséis": 26, veintisiete: 27,
  veintiocho: 28, veintinueve: 29, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60,
  setenta: 70, ochenta: 80, noventa: 90, cien: 100, ciento: 100, doscientos: 200,
  trescientos: 300, cuatrocientos: 400, quinientos: 500, seiscientos: 600, setecientos: 700,
  ochocientos: 800, novecientos: 900,
};
const MULT = { mil: 1000, miles: 1000, "millón": 1000000, millon: 1000000, millones: 1000000 };

// Palabras de relleno que quitamos de la descripción
const FILLERS = new Set([
  "gaste", "gasté", "gastar", "pague", "pagué", "pagar", "compre", "compré", "comprar",
  "recibi", "recibí", "recibir", "cobre", "cobré", "cobrar", "ingreso",
  "me", "pagaron", "mandaron", "mando", "mandó", "cuenta", "deposito", "depósito",
  "abono", "entro", "entró", "llego", "llegó", "acabo", "acabé", "acaba",
  "en", "de", "del", "la", "el", "los", "las", "un", "una", "por",
  "pesos", "peso", "plata", "dinero", "y", "con", "para", "mil", "millon", "millón",
  "millones", "miles", "fue", "son", "es", "a", "al",
]);

// Convierte una secuencia de palabras-número en un valor (maneja "mil"/"millón")
function wordsToNumber(tokens) {
  let total = 0, current = 0, found = false;
  for (const tk of tokens) {
    if (tk in WORD_NUM) { current += WORD_NUM[tk]; found = true; }
    else if (tk in MULT) {
      const m = MULT[tk];
      current = current === 0 ? 1 : current;
      if (m === 1000000) { total += current * m; current = 0; }
      else { current = current * m; total += current; current = 0; }
      found = true;
    }
  }
  return found ? total + current : null;
}

/**
 * Parsea el texto hablado. Devuelve { amount:Number, desc:String, isIncome:Boolean, raw }.
 */
export function parseVoiceTransaction(text) {
  const raw = (text || "").trim();
  const lower = raw.toLowerCase();
  const tokens = lower.replace(/[.,;:!?$]/g, " ").split(/\s+/).filter(Boolean);

  const normWords = tokens.map(norm);

  // ¿Ingreso? por palabras clave
  const INCOME_KW = ["recibi", "recibí", "ingreso", "sueldo", "salario", "pagaron", "mandaron", "mando", "mandó", "cobre", "cobré", "deposito", "depósito", "abono", "entro", "entró", "llego", "llegó"];
  const isIncome = INCOME_KW.some((k) => lower.includes(k));

  // Método de pago (primera palabra que coincida)
  let method = null;
  for (const w of normWords) { if (METHOD_KW[w]) { method = METHOD_KW[w]; break; } }

  // Categoría (solo gastos) → deriva el pilar de la categoría encontrada
  let concept = null, pillarId = null;
  if (!isIncome) {
    const cat = findCategoryByWords(normWords);
    if (cat) { concept = cat.id; pillarId = cat.pillar; }
  }

  let amount = 0;

  // 1) Monto en dígitos con multiplicador: "20.000", "20000", "20 mil", "$20.000", "1.5 millones", "1.5m"
  // Busca patrón: $? número (decimales o miles) multiplicador?
  const digitMatch = lower.match(/\$?\s*(\d+(?:[.,]\d+)?)\s*(mil|miles|millon|millones|m)\s*(?:pesos)?/i) ||
                     lower.match(/\$?\s*(\d{1,3}(?:[.,]\d{3})+)\s*(mil|miles|millon|millones|m|k)?\s*(?:pesos)?/i) ||
                     lower.match(/\$?\s*(\d+(?:[.,]\d+)?)\s*(?:mil|miles|millon|millones|m|k)?\s*(?:pesos)?/i);

  if (digitMatch) {
    // Extraer número: reemplazar separadores de miles, convertir coma decimal a punto
    let numStr = digitMatch[1].replace(/\.(?=\d{3}(?:[^0-9]|$))/g, "").replace(/,(?=\d{3}(?:[^0-9]|$))/g, "").replace(",", ".");
    let num = parseFloat(numStr);

    // Buscar multiplicador (mil, millones, m, k)
    const multMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(mil|miles|millon|millones|m|k)\b/i);
    if (multMatch) {
      const mult = norm(multMatch[2]);
      if (mult === "mil" || mult === "miles" || mult === "k") num *= 1000;
      else if (mult === "millon" || mult === "millones" || mult === "m") num *= 1000000;
    }

    amount = Math.round(num);
  }

  // 2) Si no hubo dígitos, intentar palabras-número
  if (!amount) {
    const numTokens = tokens.filter((tk) => tk in WORD_NUM || tk in MULT);
    const w = wordsToNumber(numTokens);
    if (w) amount = w;
  }

  // Descripción: quitar rellenos, métodos y palabras-número, quedarse con lo demás
  const descTokens = tokens.filter(
    (tk) => !FILLERS.has(tk) && !METHOD_KW[norm(tk)] && !(tk in WORD_NUM) && !(tk in MULT) && !/^\d+$/.test(tk) && !/^\$/.test(tk)
  );
  let desc = descTokens.join(" ").trim();
  // Capitalizar primera letra
  if (desc) desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  if (!desc) desc = "Varios";

  return { amount, desc, isIncome, method, concept, pillarId, raw };
}
