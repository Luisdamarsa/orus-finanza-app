import { PILLAR_MAP } from "../constants";
import { fmt } from "../utils/formatters";
import { getCategoryName } from "../utils/categoryUtils";

/**
 * NewTransactionToast.jsx
 *
 * Tag transitorio que confirma una transacción recién creada.
 * Aparece bajando en el hueco entre "Saldo actual" y el periodo, dura 1.5s y sale hacia arriba.
 *  - Gasto:   {icono pilar} · {categoría} · {monto rojo suave} — borde = color del pilar.
 *  - Ingreso: 💚 · {monto verde} — fondo verde suave + borde gris.
 *
 * Recibe `toast = { isIncome, pillarId, categoryId, amount }` o null.
 * Va posicionado absoluto y centrado dentro de la fila "Saldo y Mes" (que es position:relative).
 */
export default function NewTransactionToast({ toast }) {
  if (!toast) return null;

  const { isIncome, pillarId, categoryId, amount } = toast;
  const pillar = PILLAR_MAP[pillarId];
  const amountAbs = Math.abs(amount);

  const bg = isIncome ? "#22C55E22" : "#0D0D1A";
  const border = isIncome ? "#7B7A99" : (pillar?.color || "#9B6DFF");

  return (
    <>
      <style>{`@keyframes orusTxnToast {
        0%   { transform: translate(-50%, -190%); opacity: 0; }
        16%  { transform: translate(-50%, -50%);  opacity: 1; }
        84%  { transform: translate(-50%, -50%);  opacity: 1; }
        100% { transform: translate(-50%, -190%); opacity: 0; }
      }`}</style>
      <div
        style={{
          position: "absolute", top: "50%", left: "50%",
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 8px", borderRadius: 20,
          background: bg, border: `1.5px solid ${border}`,
          fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
          pointerEvents: "none", zIndex: 40,
          boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
          animation: "orusTxnToast 1.5s ease forwards",
        }}>
        {isIncome ? (
          <>
            <span style={{ fontSize: 13 }}>💚</span>
            <span style={{ color: "#22C55E" }}>+{fmt(amountAbs)}</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 13 }}>{pillar?.icon}</span>
            <span style={{ color: "#C4C2E0" }}>{getCategoryName(categoryId)}</span>
            <span style={{ color: "#F87171" }}>-{fmt(amountAbs)}</span>
          </>
        )}
      </div>
    </>
  );
}
