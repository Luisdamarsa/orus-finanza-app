import { usePress } from "../hooks/usePress";
import { SHADOWS } from "../constants/tokens";
import { fmt } from "../utils/formatters";

/**
 * SaldoCard.jsx
 *
 * Tarjeta especial para el pilar "Saldo"
 * - No tiene categorías, solo muestra: ingresos - gastos
 * - Si el saldo es negativo, cambia a color danger
 * - Mensaje explicativo: "Lo que te queda disponible tras tus gastos del período."
 *
 * Props:
 *   isDark - Tema oscuro
 *   saldo - Monto del saldo (ingresos - gastos)
 *   onClose - Callback para cerrar la tarjeta
 *   isInline - Si true, renderiza solo la tarjeta sin overlay modal
 */
export default function SaldoCard({
  isDark,
  saldo,
  onClose,
  isInline = false,
}) {
  const pressClose = usePress();

  // Tokens de diseño para Saldo
  const isNegative = saldo < 0;
  const saldoColor = isNegative ? "#FF8A8A" : "#D4D4D8"; // Rojo si es negativo, gris si es positivo
  const saldoSoftBg = isNegative ? "rgba(255,138,138,0.14)" : "rgba(212,212,216,0.14)";
  const saldoActiveBg = isNegative ? "rgba(255,138,138,0.28)" : "rgba(212,212,216,0.28)";

  const ícono = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* 3 barras: baja, media, alta */}
      <rect x="3" y="12" width="4" height="8" />
      <rect x="10" y="6" width="4" height="14" />
      <rect x="17" y="15" width="4" height="5" />
    </svg>
  );

  // Si es inline, solo renderizar la tarjeta sin overlay
  if (isInline) {
    return (
      <div style={{ borderRadius: 22, background: isDark ? "linear-gradient(155deg, #211d2c 0%, #141220 100%)" : "#FFFFFF", boxShadow: SHADOWS.shadowLg || "0 -20px 40px rgba(0,0,0,0.5)", animation: "clayRise 0.35s cubic-bezier(0.32, 0.72, 0.12, 1)", display: "flex", flexDirection: "column", padding: "18px" }}>
        <style>{`@keyframes clayRise { from { transform:translateY(20px);opacity:0 } to { transform:translateY(0);opacity:1 } }`}</style>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 12, background: saldoSoftBg, display: "flex", alignItems: "center", justifyContent: "center", color: saldoColor, flexShrink: 0 }}>
              {ícono}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#F5F3FF" }}>Saldo</div>
            </div>
          </div>

          {/* Monto */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: saldoColor, lineHeight: 1.2 }}>
              {fmt(Math.abs(saldo))}
            </div>
            {isNegative && (
              <div style={{ fontSize: 10, fontWeight: 700, color: "#FF8A8A", lineHeight: 1.2 }}>
                Gasto excedido
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div style={{ fontSize: "11.5px", fontWeight: 600, color: isDark ? "#8B87A3" : "#7B7A99", lineHeight: 1.5, marginTop: 8 }}>
          Lo que te queda disponible tras tus gastos del período.
        </div>
      </div>
    );
  }

  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.55)",
        animation: "fadeIn 0.25s ease",
        pointerEvents: "auto",
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }@keyframes clayRise { from { transform:translateY(100%);opacity:0 } to { transform:translateY(0);opacity:1 } }`}</style>

      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          maxHeight: "70vh",
          boxSizing: "border-box",
          background: isDark ? "linear-gradient(155deg, #211d2c, #141220)" : "#FFFFFF",
          borderRadius: "22px 22px 0 0",
          boxShadow: SHADOWS.shadowLg || "0 -20px 40px rgba(0,0,0,0.5)",
          animation: "clayRise 0.35s cubic-bezier(0.32, 0.72, 0.12, 1)",
          display: "flex",
          flexDirection: "column",
          zIndex: 51,
          pointerEvents: "auto",
          padding: "18px",
        }}
      >
        {/* Header + Monto */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid rgba(255,255,255,0.07)`, cursor: "grab", userSelect: "none" }}>
          {/* Izquierda: Ícono + Nombre */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 12, background: saldoSoftBg, display: "flex", alignItems: "center", justifyContent: "center", color: saldoColor, flexShrink: 0 }}>
              {ícono}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#F5F3FF" }}>Saldo</div>
            </div>
          </div>

          {/* Derecha: Monto */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: saldoColor, lineHeight: 1.2 }}>
              {fmt(Math.abs(saldo))}
            </div>
            {isNegative && (
              <div style={{ fontSize: 10, fontWeight: 700, color: "#FF8A8A", lineHeight: 1.2 }}>
                Gasto excedido
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div style={{ fontSize: "11.5px", fontWeight: 600, color: isDark ? "#8B87A3" : "#7B7A99", lineHeight: 1.5, marginBottom: 16 }}>
          Lo que te queda disponible tras tus gastos del período.
        </div>

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          {...pressClose.handlers}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 14,
            border: "none",
            background: "rgba(155,109,255,0.16)",
            color: "#9B6DFF",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            marginTop: "auto",
            flexShrink: 0,
            ...pressClose.getPressStyle(),
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
