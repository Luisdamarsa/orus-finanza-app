import { useState } from "react";
import { fmt } from "../utils/formatters";

/**
 * UpdateBalanceModal.jsx
 *
 * Popup para actualizar el saldo manualmente: el usuario ingresa su saldo
 * disponible actual. Muestra el saldo calculado como referencia.
 *
 * Props:
 *   onDone(numeric)  - confirma el nuevo saldo
 *   onClose()        - cierra sin guardar
 *   isDark           - tema
 *   currentSaldo     - saldo calculado actual (referencia; opcional)
 */
export default function UpdateBalanceModal({ onDone, onClose, isDark, currentSaldo }) {
  const [raw, setRaw] = useState("");
  const t = isDark ? { border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" } : { border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };
  const numeric = parseInt((raw || "").replace(/\D/g, "")) || 0;
  const isValid = raw.trim().length > 0 && numeric > 0;

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px", animation: "fadeIn 0.2s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }@keyframes popIn  { from { transform:scale(0.92);opacity:0 } to { transform:scale(1);opacity:1 } }`}</style>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: isDark ? "#1A1A2B" : "#FFFFFF", borderRadius: 24, border: `1px solid ${t.border}`, padding: "20px", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", animation: "popIn 0.22s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: t.text }}>💰 Actualizar saldo</div>
            <div style={{ fontSize: 11, color: t.sub, marginTop: 3 }}>¿Cuánto tienes disponible ahora?</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: isDark ? "#2D2D3A" : "#F0EFF8", border: "none", fontSize: 13, cursor: "pointer", color: t.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ position: "relative", marginBottom: currentSaldo != null ? 10 : 16 }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, fontWeight: 700, color: t.sub, pointerEvents: "none" }}>$</div>
          <input
            type="text" inputMode="numeric" placeholder="0" autoFocus
            value={raw ? parseInt(raw.replace(/\D/g, "")).toLocaleString("es-CO") : ""}
            onChange={e => setRaw(e.target.value)}
            style={{ width: "100%", padding: "12px 12px 12px 28px", borderRadius: 12, border: `1.5px solid ${isValid ? "#86EFAC" : t.border}`, background: isDark ? "#252535" : "#F8F7FF", color: t.text, fontSize: 18, fontWeight: 700, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
          />
        </div>
        {currentSaldo != null && (
          <div style={{ fontSize: 11, color: t.sub, marginBottom: 14, textAlign: "center" }}>
            Saldo calculado actualmente:{" "}
            <strong style={{ color: currentSaldo < 0 ? "#EF4444" : "#22C55E" }}>
              {currentSaldo < 0 ? "-" : ""}{fmt(Math.abs(currentSaldo))}
            </strong>
          </div>
        )}
        <button
          onClick={() => { if (isValid) onDone(numeric); }}
          style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: isValid ? "linear-gradient(135deg, #9B6DFF, #4F8EF7)" : (isDark ? "#2D2D3A" : "#E5E3F5"), color: isValid ? "#fff" : t.sub, fontSize: 14, fontWeight: 700, cursor: isValid ? "pointer" : "default", transition: "all 0.2s" }}
        >
          Confirmar nuevo saldo →
        </button>
      </div>
    </div>
  );
}
