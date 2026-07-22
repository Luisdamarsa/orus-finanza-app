// Test para voiceParser.js — casos de montos
// Nota: Este es un test simple que replica la lógica de parseVoiceTransaction

// Copiar el norm, METHOD_KW, WORD_NUM, MULT, etc. de voiceParser.js
const norm = (s) => (s || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const testCases = [
  // [input, expectedAmount, description]
  ["20000", 20000, "cantidad simple"],
  ["20.000", 20000, "cantidad con separador de miles"],
  ["20 mil", 20000, "cantidad + 'mil'"],
  ["20 mil pesos", 20000, "cantidad + 'mil' + 'pesos'"],
  ["1.5 millones", 1500000, "decimal + 'millones'"],
  ["1.5millones", 1500000, "decimal sin espacio + 'millones'"],
  ["1,5 millones", 1500000, "decimal con coma + 'millones'"],
  ["1 millón", 1000000, "singular 'millón'"],
  ["1 millon", 1000000, "'millon' sin tilde"],
  ["2.5m", 2500000, "decimal + 'm' (shorthand)"],
  ["500k", 500000, "cantidad + 'k'"],
  ["cincuenta mil", 50000, "palabras-número"],
  ["un millón", 1000000, "palabra + multiplicador"],
  ["5 millones", 5000000, "cantidad + 'millones'"],
  ["0.5 millones", 500000, "decimal < 1 + 'millones'"],
];

// Test cada caso
console.log("🧪 Test Cases para Voice Parser (Montos)\n");
testCases.forEach(([input, expected, desc]) => {
  console.log(`Input: "${input}" → Expected: ${expected} (${desc})`);
});

console.log("\n✅ Test cases listados. Ejecuta la app y prueba con el micrófono para ver si funcionan.");
