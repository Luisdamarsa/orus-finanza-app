import { useTheme } from "../hooks/useTheme";
import { DARK, LIGHT } from "../constants/tokens";

/**
 * AccountReactivatedPage.jsx
 * Página de reactivación con grid de pilares - datos exactos de mayo 2026
 */
export default function AccountReactivatedPage({ setScreen }) {
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    text: tokens.text,
    sub: tokens.sub,
    accent: "#9B6DFF",
    accentSoft: "rgba(155,109,255,0.16)",
    surface: isDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    shadowSm: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
    border: isDark ? "rgba(139,135,163,0.15)" : "rgba(0,0,0,0.1)",
  };

  // Datos exactos de mayo 2026
  const pillarCards = [
    {
      id: 'fijos',
      name: 'Fijos',
      monto: 820000,
      pctTotal: 30,
      presupuesto: 1200000,
      pctPresup: 68,
      color: '#93C5FD',
      softBg: 'rgba(147,197,253,0.16)',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: 'deuda',
      name: 'Deuda',
      monto: 350000,
      pctTotal: 13,
      presupuesto: 500000,
      pctPresup: 70,
      color: '#FCA5A5',
      softBg: 'rgba(252,165,165,0.16)',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"/><path d="M12 1v6m0 6v4M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24"/>
        </svg>
      ),
    },
    {
      id: 'ocio',
      name: 'Ocio',
      monto: 213000,
      pctTotal: 8,
      presupuesto: 400000,
      pctPresup: 53,
      color: '#C4B5FD',
      softBg: 'rgba(196,181,253,0.16)',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      id: 'varios',
      name: 'Varios',
      monto: 105000,
      pctTotal: 4,
      presupuesto: null,
      pctPresup: null,
      color: '#FDE68A',
      softBg: 'rgba(253,230,138,0.16)',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
        </svg>
      ),
    },
    {
      id: 'ahorro',
      name: 'Ahorro',
      monto: 200000,
      pctTotal: 7,
      presupuesto: 300000,
      pctPresup: 67,
      color: '#86EFAC',
      softBg: 'rgba(134,239,172,0.16)',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      fullWidth: true,
    },
  ];

  const checkIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  const handleContinue = () => {
    setScreen("dashboard");
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: "22px 26px",
        background: "#000000",
        fontFamily: "Manrope, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Bloque central - todo el contenido */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "36px 0 12px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* 1. Badge ícono */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 17,
            background: t.accentSoft,
            color: t.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        {/* 2. Grid de pilares con glow */}
        <div style={{ position: "relative", width: "100%", flexShrink: 0 }}>
          {/* Glow morado detrás */}
          <div
            style={{
              position: "absolute",
              top: -20,
              left: "50%",
              transform: "translateX(-50%)",
              width: 280,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)",
              filter: "blur(14px)",
              pointerEvents: "none",
            }}
          />

          {/* Grid de tarjetas */}
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {pillarCards.map((card, idx) => (
              <div
                key={card.id}
                style={{
                  gridColumn: card.fullWidth ? "1 / -1" : "auto",
                  padding: 8,
                  borderRadius: 14,
                  background: t.surface,
                  boxShadow: "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  boxSizing: "border-box",
                  minWidth: 0,
                  animation: `clayRise 0.4s ease both ${idx * 60}ms`,
                }}
              >
                <style>{`@keyframes clayRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

                {/* Fila superior: ícono, nombre, % */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 8,
                      background: card.softBg,
                      color: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 800,
                      color: t.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {card.name}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 800,
                      color: card.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {card.pctTotal}% del total
                  </span>
                </div>

                {/* Barra de presupuesto */}
                <div style={{ position: "relative", height: 10, display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "100%",
                      height: 4,
                      borderRadius: 3,
                      background: t.border,
                      position: "absolute",
                    }}
                  />
                  {card.presupuesto && (
                    <div
                      style={{
                        width: `${Math.min(card.pctPresup || 0, 100)}%`,
                        height: 4,
                        borderRadius: 3,
                        background: card.color,
                        position: "absolute",
                      }}
                    />
                  )}
                </div>

                {/* Fila inferior: monto, % presup */}
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 4 }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: t.text,
                    }}
                  >
                    ${card.monto.toLocaleString("es-CO")}
                  </span>
                  {card.presupuesto && (
                    <span
                      style={{
                        fontSize: "8.5px",
                        fontWeight: 700,
                        color: card.color,
                        textAlign: "right",
                        lineHeight: 1.25,
                      }}
                    >
                      {card.pctPresup}% presup.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Título y descripción */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: t.text }}>
            ¡Bienvenido de vuelta!
          </div>
          <div
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: t.sub,
              marginTop: 8,
              lineHeight: 1.5,
              padding: "0 6px",
            }}
          >
            Tu cuenta fue reactivada y tus pilares están de nuevo en su lugar. Todo tu historial sigue intacto.
          </div>
        </div>

        {/* 4. Filas de confirmación */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
            marginTop: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 14,
              background: t.surface,
              boxShadow: t.shadowSm,
            }}
          >
            {checkIcon}
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: t.text }}>
              Movimientos y presupuestos restaurados
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 14,
              background: t.surface,
              boxShadow: t.shadowSm,
            }}
          >
            {checkIcon}
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: t.text }}>
              Automatizaciones activas otra vez
            </span>
          </div>
        </div>
      </div>

      {/* Footer - Botón */}
      <div style={{ flexShrink: 0, paddingBottom: 6 }}>
        <button
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(155deg, #B18CFF, #8B5CF6)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 800,
            boxShadow: "0 14px 26px -10px rgba(139,92,246,0.6), inset 0 1px 0 rgba(255,255,255,0.35)",
            cursor: "pointer",
            fontFamily: "Manrope",
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
