import { useState, useRef, useEffect } from "react";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";

export default function AutomatizacionesPage({
  isDark,
  onBack,
  onPermissions,
  microphoneEnabled,
  setMicrophoneEnabled,
  notificationListenerEnabled,
  setNotificationListenerEnabled,
  onOpenAccessibilitySettings,
}) {
  const pressBack = usePress();
  const [pressingButton, setPressingButton] = useState(null);
  const descriptionRef = useRef(null);
  const [contentTop, setContentTop] = useState(220);

  // Medir altura dinámicamente de la descripción
  useEffect(() => {
    if (descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.offsetHeight;
      const newContentTop = 164 + descriptionHeight + 6;
      setContentTop(newContentTop);
    }
  }, []);

  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: value ? "#9B6DFF" : isDark ? "#3D3D4D" : "#D5D3E8",
        cursor: "pointer",
        padding: 2,
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#FFFFFF",
          transform: value ? "translateX(20px)" : "translateX(0)",
          transition: "transform 0.2s",
        }}
      />
    </button>
  );

  return (
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      title="⚡ Automatizaciones"
      descriptionRef={descriptionRef}
      contentTopOffset={contentTop}
      pressBack={pressBack}
      description={
        <>
          <div
            ref={descriptionRef}
            style={{
              fontSize: 13,
              color: t.sub,
              marginBottom: 4,
              lineHeight: 1.4,
              fontWeight: 400,
              textAlign: "left",
            }}
          >
            ORUS capta tus movimientos de 3 formas. Activa las que quieras y olvídate de registrar.
          </div>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ===== SECCIÓN 1: MICRÓFONO ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.04s" }}>
          <div
            style={{
              border: `1.5px solid ${t.border}`,
              borderRadius: 14,
              padding: "16px 14px",
              background: t.card,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 6 }}>
                  🎤 Micrófono
                </div>
                <div style={{ fontSize: 12, color: t.sub, lineHeight: 1.5, marginBottom: 10 }}>
                  Di un gasto: <span style={{ fontStyle: "italic" }}>"Pagué 50 mil en cine con tarjeta"</span>
                </div>
                <div style={{ fontSize: 11, color: t.sub, opacity: 0.75, lineHeight: 1.4 }}>
                  Para registrar movimientos por voz sin abrir la app.
                </div>
              </div>
              <Toggle value={microphoneEnabled} onChange={setMicrophoneEnabled} />
            </div>
            {microphoneEnabled && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: isDark ? "#12291c" : "#EAFBF0",
                  fontSize: 11,
                  color: "#22C55E",
                  fontWeight: 500,
                }}
              >
                ✅ Activo · Acceso al micrófono confirmado
              </div>
            )}
          </div>
        </div>

        {/* ===== SECCIÓN 2: GOOGLE PAY ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.10s" }}>
          <div
            style={{
              border: `1.5px solid ${t.border}`,
              borderRadius: 14,
              padding: "16px 14px",
              background: t.card,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="bold" fill="url(#googleGradient)" dy=".3em">G</text>
                    <defs>
                      <linearGradient id="googleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285F4" />
                        <stop offset="25%" stopColor="#34A853" />
                        <stop offset="50%" stopColor="#FBBC04" />
                        <stop offset="75%" stopColor="#EA4335" />
                        <stop offset="100%" stopColor="#EA4335" />
                      </linearGradient>
                    </defs>
                  </svg>
                  Google Pay (Android)
                </div>
                <div style={{ fontSize: 12, color: t.sub, lineHeight: 1.5, marginBottom: 10 }}>
                  Cuando pagas con NFC, ORUS lee la notificación y te pregunta si registrarla.
                </div>
                <div style={{ fontSize: 11, color: t.sub, opacity: 0.75, lineHeight: 1.4 }}>
                  Recibes una notificación con: lugar, monto y método.
                </div>
              </div>
              <Toggle value={notificationListenerEnabled} onChange={setNotificationListenerEnabled} />
            </div>

            {notificationListenerEnabled ? (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: isDark ? "#12291c" : "#EAFBF0",
                  fontSize: 11,
                  color: "#22C55E",
                  fontWeight: 500,
                }}
              >
                ✅ Activo · Leyendo notificaciones de Google Pay
              </div>
            ) : (
              <button
                onClick={onOpenAccessibilitySettings}
                onPointerDown={() => setPressingButton("google-pay-btn")}
                onPointerUp={() => setPressingButton(null)}
                onPointerLeave={() => setPressingButton(null)}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#9B6DFF33",
                  color: "#9B6DFF",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.1s",
                  transform: pressingButton === "google-pay-btn" ? "scale(0.98)" : "scale(1)",
                }}
              >
                Activar en Configuración →
              </button>
            )}

            {!notificationListenerEnabled && (
              <div
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: isDark ? "#2D2D3A" : "#F5F3FF",
                  fontSize: 10,
                  color: t.sub,
                  lineHeight: 1.3,
                }}
              >
                📱 Se abrirá la Configuración. Busca "ORUS" en <strong>Accesibilidad</strong> y actívalo.
              </div>
            )}
          </div>
        </div>

        {/* ===== SECCIÓN 3: SHORTCUTS iOS (FUTURO) ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.16s" }}>
          <div
            style={{
              border: `1.5px dashed ${t.border}`,
              borderRadius: 14,
              padding: "16px 14px",
              background: isDark ? "#1C1C2E" : "#F8F7FF",
              opacity: 0.6,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 6 }}>
                  📱 Atajo de Notificaciones (iOS)
                </div>
                <div style={{ fontSize: 12, color: t.sub, lineHeight: 1.5, marginBottom: 10 }}>
                  Próximamente: Lee pagos de Apple Pay mediante Atajos.
                </div>
                <div style={{ fontSize: 11, color: t.sub, opacity: 0.75, lineHeight: 1.4 }}>
                  Te mostraremos cómo configurarlo paso a paso.
                </div>
              </div>
            </div>
            <button
              disabled
              style={{
                marginTop: 10,
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #9B6DFF44",
                background: "transparent",
                color: "#9B6DFF66",
                fontSize: 11,
                fontWeight: 600,
                cursor: "not-allowed",
                opacity: 0.5,
              }}
            >
              Disponible pronto
            </button>
          </div>
        </div>

        {/* ===== SECCIÓN 4: PERMISOS ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.22s" }}>
          <div
            style={{
              border: `1.5px solid ${t.border}`,
              borderRadius: 14,
              padding: "14px",
              background: t.card,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 10 }}>
              🔐 Permisos necesarios
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Micrófono (con fondo coloreado como PermissionsPage) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: isDark ? "#2D1E4A" : "#F5F3FF",
                  fontSize: 13,
                  fontWeight: 700,
                  color: t.text,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #9B6DFF, #6D28D9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </div>
                <span style={{ flex: 1 }}>Micrófono</span>
                <span style={{ color: microphoneEnabled ? "#22C55E" : "#999", fontSize: 12, fontWeight: 700 }}>
                  {microphoneEnabled ? "✓" : "○"}
                </span>
              </div>

              {/* Notificaciones de ORUS (con fondo coloreado) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: isDark ? "#3D2600" : "#FFFAEB",
                  fontSize: 13,
                  fontWeight: 700,
                  color: t.text,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "#FDE68A33",
                    border: "1px solid #FDE68A66",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  🔔
                </div>
                <span style={{ flex: 1 }}>Notificaciones de ORUS</span>
                <span style={{ color: "#22C55E", fontSize: 12, fontWeight: 700 }}>✓</span>
              </div>

              {/* Accesibilidad para leer notificaciones (con fondo coloreado) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: isDark ? "#1A2E4A" : "#EBF8FF",
                  fontSize: 13,
                  fontWeight: 700,
                  color: t.text,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "#93C5FD33",
                    border: "1px solid #93C5FD66",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  🏦
                </div>
                <span style={{ flex: 1 }}>Accesibilidad para leer notificaciones</span>
                <span style={{ color: notificationListenerEnabled ? "#22C55E" : "#999", fontSize: 12, fontWeight: 700 }}>
                  {notificationListenerEnabled ? "✓" : "○"}
                </span>
              </div>
            </div>

            <button
              onClick={onPermissions}
              onPointerDown={() => setPressingButton("permisos-btn")}
              onPointerUp={() => setPressingButton(null)}
              onPointerLeave={() => setPressingButton(null)}
              style={{
                marginTop: 12,
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "#9B6DFF22",
                color: "#9B6DFF",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.1s",
                transform: pressingButton === "permisos-btn" ? "scale(0.98)" : "scale(1)",
              }}
            >
              Ver todos los permisos →
            </button>
          </div>
        </div>

        {/* ===== INFO GENERAL ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.28s", marginBottom: 20 }}>
          <div
            style={{
              textAlign: "center",
              color: t.sub,
              fontSize: 11,
              padding: "12px 14px",
              borderRadius: 10,
              background: isDark ? "#1C1C2E" : "#F5F3FF",
              lineHeight: 1.5,
            }}
          >
            💡 <strong>Consejo:</strong> Activa los canales que uses. Cada uno funciona independiente.
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
