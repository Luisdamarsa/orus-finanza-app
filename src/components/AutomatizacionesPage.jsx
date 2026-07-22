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
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 6 }}>
                  🏦 Google Pay (Android)
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
              {/* Micrófono */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: isDark ? "#252538" : "#F5F3FF",
                  fontSize: 11,
                }}
              >
                <span>
                  🎤 Micrófono{" "}
                  <span style={{ color: "#22C55E", fontWeight: 700 }}>
                    {microphoneEnabled ? "✓" : "○"}
                  </span>
                </span>
              </div>

              {/* Notificaciones */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: isDark ? "#252538" : "#F5F3FF",
                  fontSize: 11,
                }}
              >
                <span>
                  🔔 Notificaciones{" "}
                  <span style={{ color: "#22C55E", fontWeight: 700 }}>
                    {notificationListenerEnabled ? "✓" : "○"}
                  </span>
                </span>
              </div>

              {/* Accesibilidad */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: isDark ? "#252538" : "#F5F3FF",
                  fontSize: 11,
                }}
              >
                <span>
                  ⚙️ Accesibilidad{" "}
                  <span style={{ color: notificationListenerEnabled ? "#22C55E" : "#EF4444", fontWeight: 700 }}>
                    {notificationListenerEnabled ? "✓" : "○"}
                  </span>
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
