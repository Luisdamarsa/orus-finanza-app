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
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" stroke="none" />
                    <path d="M5 10a7 7 0 0 0 14 0" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                  </svg>
                  Micrófono
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

        {/* ===== SECCIÓN 4: PERMISOS (igual a PermissionsPage) ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.22s" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            🔐 Permisos necesarios
          </div>

          {/* Micrófono */}
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: "12px",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none" />
                <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <line x1="8" y1="21" x2="16" y2="21" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <b style={{ fontSize: 13, color: t.text }}>Micrófono</b>
                <span
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    color: "#9B6DFF",
                    background: "#9B6DFF22",
                    padding: "1px 6px",
                    borderRadius: 8,
                  }}
                >
                  ÓPTIMO
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.45, marginTop: 3 }}>
                Para registrar gastos por voz sin abrir la app.
              </div>
            </div>
            <span style={{ color: microphoneEnabled ? "#22C55E" : t.sub, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {microphoneEnabled ? "✓" : "○"}
            </span>
          </div>

          {/* Notificaciones de ORUS */}
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: "12px",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "#FDE68A22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 19,
                flexShrink: 0,
              }}
            >
              🔔
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <b style={{ fontSize: 13, color: t.text }}>Notificaciones de ORUS</b>
                <span
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    color: "#9B6DFF",
                    background: "#9B6DFF22",
                    padding: "1px 6px",
                    borderRadius: 8,
                  }}
                >
                  ÓPTIMO
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.45, marginTop: 3 }}>
                Para avisarte cuando registramos un movimiento y enviarte recordatorios.
              </div>
            </div>
            <span style={{ color: "#22C55E", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>✓</span>
          </div>

          {/* Accesibilidad para leer notificaciones */}
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: "12px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "#93C5FD22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 19,
                flexShrink: 0,
              }}
            >
              🏦
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <b style={{ fontSize: 13, color: t.text }}>Accesibilidad para leer notificaciones</b>
                <span
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    color: t.sub,
                    background: t.sub + "22",
                    padding: "1px 6px",
                    borderRadius: 8,
                  }}
                >
                  OPCIONAL
                </span>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: "#4F8EF7", background: "#4F8EF722", padding: "1px 6px", borderRadius: 8 }}>
                  SOLO ANDROID
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.45, marginTop: 3 }}>
                Solo en Android: leemos las notificaciones de tu tarjeta (Google Pay) para detectar pagos automáticamente.
              </div>
            </div>
            <span style={{ color: notificationListenerEnabled ? "#22C55E" : t.sub, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {notificationListenerEnabled ? "✓" : "○"}
            </span>
          </div>

          <button
            onClick={onPermissions}
            onPointerDown={() => setPressingButton("permisos-btn")}
            onPointerUp={() => setPressingButton(null)}
            onPointerLeave={() => setPressingButton(null)}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 12,
              border: `1.5px solid ${t.border}`,
              background: t.card,
              color: t.text,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.1s",
              transform: pressingButton === "permisos-btn" ? "scale(0.98)" : "scale(1)",
            }}
          >
            Ver todos los permisos →
          </button>
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
