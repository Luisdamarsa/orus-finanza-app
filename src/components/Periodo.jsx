import { getPeriodLabel } from "../utils/formatters";
import NewTransactionToast from "./NewTransactionToast";

/**
 * Periodo.jsx
 *
 * Fila superior del dashboard: botón "Saldo actual" (inactivo por ahora) + selector de periodo.
 * Aloja también el tag transitorio de nueva transacción (centrado en el hueco).
 * Se llama "Periodo" porque el saldo está inactivo. Falla como unidad (?fail=period).
 */
export default function Periodo({ isDark, selectedPeriod, setShowUpdateBalance, setShowPeriodPicker, newTxnToast }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <button disabled onClick={() => setShowUpdateBalance(true)} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "4px 8px", borderRadius: 20, border: "none", cursor: "not-allowed", background: isDark ? "#1E1E2E" : "#F0EFF8", outline: `1.5px solid transparent`, transition: "all 0.15s", justifyContent: "center", opacity: 0.5 }}>
        <span style={{ fontSize: 13 }}>💰</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#C4C2E0" : "#6B7280" }}>Saldo actual</span>
      </button>
      <button onClick={() => setShowPeriodPicker(true)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "4px 8px", borderRadius: 20, border: "none", cursor: "pointer", background: selectedPeriod ? "#9B6DFF22" : (isDark ? "#1E1E2E" : "#F0EFF8"), outline: `1.5px solid ${selectedPeriod ? "#9B6DFF88" : "transparent"}`, transition: "all 0.15s" }}>
        <span style={{ fontSize: 13 }}>📅</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: selectedPeriod ? "#9B6DFF" : (isDark ? "#C4C2E0" : "#6B7280") }}>{getPeriodLabel(selectedPeriod)}</span>
      </button>
      <NewTransactionToast toast={newTxnToast} isDark={isDark} />
    </div>
  );
}
