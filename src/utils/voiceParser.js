/**
 * voiceParser.js — Interpreta una frase hablada y saca { amount, desc, isIncome }.
 * SIN IA: usa reglas + expresiones regulares. Suficiente para frases simples como
 * "gasté 20 mil en el súper" o "recibí cincuenta mil de sueldo".
 * Los casos ambiguos los corrige el usuario en la pantalla de confirmación.
 */

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
  "recibi", "recibí", "recibir", "cobre", "cobré", "cobrar", "ingreso", "ingreso",
  "me", "pagaron", "en", "de", "del", "la", "el", "los", "las", "un", "una", "por",
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

  // ¿Ingreso? por palabras clave
  const INCOME_KW = ["recibi", "recibí", "ingreso", "sueldo", "salario", "pagaron", "cobre", "cobré", "deposito", "depósito", "abono", "entro", "entró", "llego", "llegó"];
  const isIncome = INCOME_KW.some((k) => lower.includes(k));

  let amount = 0;

  // 1) Monto en dígitos: "20.000", "20000", "20 mil", "$20.000", "1.5 millones"
  const digitMatch = lower.match(/\$?\s*(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)\s*(mil(?:es)?|millon(?:es)?|millón|k)?/);
  if (digitMatch) {
    let num = parseFloat(digitMatch[1].replace(/\.(?=\d{3}\b)/g, "").replace(/,(?=\d{3}\b)/g, "").replace(",", "."));
    const mult = digitMatch[2];
    if (mult) {
      if (/^k$/.test(mult) || /^mil/.test(mult)) num *= 1000;
      else num *= 1000000;
    }
    amount = Math.round(num);
  }

  // 2) Si no hubo dígitos, intentar palabras-número
  if (!amount) {
    const numTokens = tokens.filter((tk) => tk in WORD_NUM || tk in MULT);
    const w = wordsToNumber(numTokens);
    if (w) amount = w;
  }

  // Descripción: quitar rellenos y palabras-número, quedarse con lo demás
  const descTokens = tokens.filter(
    (tk) => !FILLERS.has(tk) && !(tk in WORD_NUM) && !(tk in MULT) && !/^\d+$/.test(tk) && !/^\$/.test(tk)
  );
  let desc = descTokens.join(" ").trim();
  // Capitalizar primera letra
  if (desc) desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  if (!desc) desc = "Varios";

  return { amount, desc, isIncome, raw };
}
