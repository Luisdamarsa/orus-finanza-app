import { useState, useEffect } from "react";
import { PILLARS, MANUAL_METHODS } from "../constants";

/**
 * OnboardingSlide1.jsx
 * "Lee notificaciones bancarias automáticamente"
 * Estilo: Tarjetas de Informes (border-left + gradient)
 * Ejemplo: Mercado Libre → Ocio
 */

export default function OnboardingSlide1({ isDark }) {
  const t = {
    bg: "#000000",
    card: "#1E1E2E",
    border: "#2D2D3A",
    text: "#F0EEFF",
    sub: "#7B7A99",
    accent: "#9B6DFF",
  };

  const [notificationVisible, setNotificationVisible] = useState(true);
  const [transactionVisible, setTransactionVisible] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setTransactionVisible(true);
    }, 1000);
    return () => clearTimeout(timer1);
  }, []);

  // Logo ORUS con texto (como en informes)
  const LogoORUS = () => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      {/* Fijos 35% (Azul) */}
      <circle cx="200" cy="200" r="150" fill="none" stroke="#93C5FD" strokeWidth="48" strokeLinecap="round" strokeDasharray="329.87 942.48" strokeDashoffset="0" transform="rotate(-90 200 200)" />
      {/* Deuda 15% (Rojo) */}
      <circle cx="200" cy="200" r="150" fill="none" stroke="#FCA5A5" strokeWidth="48" strokeLinecap="round" strokeDasharray="141.37 942.48" strokeDashoffset="-329.87" transform="rotate(-90 200 200)" />
      {/* Ahorro 20% (Verde) */}
      <circle cx="200" cy="200" r="150" fill="none" stroke="#86EFAC" strokeWidth="48" strokeLinecap="round" strokeDasharray="188.50 942.48" strokeDashoffset="-471.24" transform="rotate(-90 200 200)" />
      {/* Ocio 15% (Púrpura) */}
      <circle cx="200" cy="200" r="150" fill="none" stroke="#C4B5FD" strokeWidth="48" strokeLinecap="round" strokeDasharray="141.37 942.48" strokeDashoffset="-659.74" transform="rotate(-90 200 200)" />
      {/* Varios 15% (Amarillo) */}
      <circle cx="200" cy="200" r="150" fill="none" stroke="#FDE68A" strokeWidth="48" strokeLinecap="round" strokeDasharray="141.37 942.48" strokeDashoffset="-801.11" transform="rotate(-90 200 200)" />
      {/* Centro negro */}
      <circle cx="200" cy="200" r="80" fill="#000000" />
      {/* Texto ORUS */}
      <text x="200" y="230" fontSize="80" fontWeight="800" fill="#F0EEFF" textAnchor="middle">ORUS</text>
    </svg>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        maxWidth: 340,
      }}
    >
      {/* Título */}
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: t.text,
            margin: "0 0 12px 0",
          }}
        >
          Lee notificaciones bancarias
        </h2>
        <p
          style={{
            fontSize: 13,
            color: t.sub,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          ORUS captura automáticamente cada gasto. Sin escribir nada.
        </p>
      </div>

      {/* Notificación - Estilo Google/Android */}
      {notificationVisible && (
        <div
          style={{
            animation: transactionVisible ? "fadeOutUp 0.4s ease forwards" : "slideInDown 0.6s ease",
            width: "100%",
          }}
        >
          <style>{`
            @keyframes slideInDown {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes fadeOutUp {
              from {
                opacity: 1;
                transform: translateY(0);
              }
              to {
                opacity: 0;
                transform: translateY(-20px);
              }
            }
          `}</style>
          <div
            style={{
              background: `linear-gradient(135deg, #2D2D3A, #252535)`,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Timestamp a la izquierda */}
            <div
              style={{
                fontSize: 9,
                color: t.sub,
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Hoy, 14:24
            </div>

            {/* Separador visual */}
            <div
              style={{
                width: 1,
                height: 20,
                background: t.border,
                flexShrink: 0,
              }}
            />

            {/* Logo */}
            <div style={{ flexShrink: 0 }}>
              <LogoORUS />
            </div>

            {/* Nombre */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: t.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                MERCADO LIBRE
              </div>
            </div>

            {/* Monto a la derecha */}
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: t.text,
                flexShrink: 0,
              }}
            >
              $89.900
            </div>
          </div>
        </div>
      )}

      {/* Transacción Registrada - Idéntica a TransactionScreen */}
      {transactionVisible && (
        <div
          style={{
            animation: "slideInUp 0.6s ease",
            width: "100%",
          }}
        >
          <style>{`
            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          <div
            style={{
              background: `linear-gradient(135deg, #2D2D3A, #252535)`,
              border: `1.5px solid ${t.border}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            {/* Título */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: t.accent,
                textTransform: "uppercase",
                marginBottom: 16,
                letterSpacing: 0.5,
              }}
            >
              Nueva Transacción
            </div>

            {/* Nombre de la transacción */}
            <input
              type="text"
              placeholder="Mercado Libre"
              value="Mercado Libre"
              disabled
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.card,
                color: t.text,
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 14,
                boxSizing: "border-box",
              }}
            />

            {/* Monto grande */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: 14,
                gap: 4,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 800, color: "#EF4444" }}>
                $
              </span>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#EF4444" }}>
                89.900
              </span>
            </div>

            {/* Métodos de pago (desde MANUAL_METHODS) */}
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 14,
                marginLeft: "-36px",
                marginRight: "-36px",
                paddingLeft: "36px",
                paddingRight: "36px"
              }}
            >
              {MANUAL_METHODS.map((m) => {
                const active = m.id === "Tarjeta"; // Pre-selecciona Tarjeta para el ejemplo
                return (
                  <button
                    key={m.id}
                    disabled
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      border: active
                        ? `1.5px solid ${m.color}`
                        : "1.5px solid transparent",
                      cursor: "not-allowed",
                      background: active
                        ? `${m.color}22`
                        : isDark
                          ? "#252538"
                          : "#F0EFF8",
                      color: active ? m.color : t.sub,
                      fontSize: 11,
                      fontWeight: 700,
                      outline: "none",
                      transition: "all 0.18s",
                    }}
                  >
                    {m.icon} {m.id}
                  </button>
                );
              })}
            </div>

            {/* Dropdown de categoría (deshabilitado) */}
            <button
              disabled
              style={{
                width: "100%",
                padding: "8px 14px",
                borderRadius: 20,
                cursor: "not-allowed",
                border: `1.5px dashed ${t.accent}99`,
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 13 }}>🏷</span>
              <span
                style={{
                  fontSize: 12,
                  color: t.text,
                  fontWeight: 700,
                  flex: 1,
                  textAlign: "left"
                }}
              >
                Compras online
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={t.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Etiqueta pilar */}
            <div
              style={{
                fontSize: 10,
                color: t.sub,
                marginBottom: 10,
              }}
            >
              Pilar: toca para cambiar
            </div>

            {/* Grid de pilares (desde PILLARS) */}
            <div style={{ marginBottom: 8, fontSize: 10, fontWeight: 600, color: t.sub }}>
              Pilar: toca para cambiar
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {PILLARS.map((p) => {
                const active = p.id === "ocio"; // Pre-selecciona Ocio para el ejemplo
                return (
                  <button
                    key={p.id}
                    disabled
                    style={{
                      flex: 1,
                      padding: "7px 2px",
                      borderRadius: 12,
                      border: active ? `2px solid ${p.color}` : "2px solid transparent",
                      cursor: "not-allowed",
                      background: active
                        ? isDark ? p.darkBg : p.bg
                        : isDark ? "#252538" : "#F0EFF8",
                      outline: "none",
                      transition: "all 0.18s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <div style={{ fontSize: 16 }}>{p.icon}</div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        marginTop: 2,
                        color: active ? (isDark ? p.color : p.darkColor) : t.sub
                      }}
                    >
                      {p.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Beneficios */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 16 }}>🔄</span>
          <span style={{ fontSize: 12, color: t.sub }}>
            Sincronización en tiempo real
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 16 }}>📊</span>
          <span style={{ fontSize: 12, color: t.sub }}>
            Dashboard se actualiza al instante
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontSize: 12, color: t.sub }}>
            Sin copiar, pegar, ni escribir
          </span>
        </div>
      </div>
    </div>
  );
}
