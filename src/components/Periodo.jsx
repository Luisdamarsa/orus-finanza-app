import { getPeriodLabel } from "../utils/formatters";
import { DARK, LIGHT, SHADOWS, RADIUS } from "../constants/tokens";
import { Calendar, Users } from "lucide-react";
import NewTransactionToast from "./NewTransactionToast";

/**
 * Periodo.jsx
 *
 * Fila superior del dashboard: botón "Saldo actual" (inactivo por ahora) + selector de periodo.
 * Aloja también el tag transitorio de nueva transacción (centrado en el hueco).
 * Se llama "Periodo" porque el saldo está inactivo. Falla como unidad (?fail=period).
 */
export default function Periodo({ isDark, selectedPeriod, setShowUpdateBalance, setShowPeriodPicker, newTxnToast }) {
  const tokens = isDark ? DARK : LIGHT; // Seleccionar tokens según el tema
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 0, gap: 8 }}>
      <button
        disabled
        onClick={() => {}}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 11px",
          borderRadius: "12px",
          border: "none",
          cursor: "not-allowed",
          background: tokens.raised,
          boxShadow: SHADOWS.shadowSm,
          outline: "none",
          transition: "all 0.15s",
          fontSize: 10.5,
          fontWeight: 700,
          color: tokens.sub,
          opacity: 0.5
        }}>
        <Users size={12} strokeWidth={1.6} />
        <span>Espacio Compartido</span>
      </button>
      <button
        onClick={() => setShowPeriodPicker(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 11px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          background: selectedPeriod ? tokens.accentSoft : tokens.surfaceFlat,
          boxShadow: selectedPeriod ? SHADOWS.shadowSm : "none",
          outline: "none",
          transition: "all 0.15s",
          fontSize: 10.5,
          fontWeight: selectedPeriod ? 800 : 700,
          color: selectedPeriod ? tokens.accent : tokens.sub
        }}>
        <Calendar size={12} strokeWidth={1.6} />
        <span>{getPeriodLabel(selectedPeriod)}</span>
      </button>
      <NewTransactionToast toast={newTxnToast} isDark={isDark} />
    </div>
  );
}
