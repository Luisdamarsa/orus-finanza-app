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
  iosShortcutsEnabled,
  setIosShortcutsEnabled,
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
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: "12px",
              display: "flex",
              alignItems: "flex-start",
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
              <b style={{ fontSize: 13, color: t.text, display: "block", marginBottom: 3 }}>Microfono</b>
              <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.45 }}>Para registrar gastos por voz sin abrir la app.</div>
            </div>
            <Toggle value={microphoneEnabled} onChange={setMicrophoneEnabled} />
          </div>
        </div>

        {/* ===== SECCIÓN 2: GOOGLE PAY ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.10s" }}>
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: "12px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "linear-gradient(135deg, #4285F4, #34A853)",
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
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <path d="M1 10h22"></path>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <b style={{ fontSize: 13, color: t.text, display: "block", marginBottom: 3 }}>Notificaciones de Wallet</b>
              <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.45 }}>Cuando pagas con NFC, ORUS lee la notificación y te pregunta si registrarla.</div>
            </div>
            <Toggle value={notificationListenerEnabled} onChange={setNotificationListenerEnabled} />
          </div>
        </div>

        {/* ===== SECCIÓN 3: SHORTCUTS iOS ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.16s" }}>
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: "12px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "linear-gradient(135deg, #34D399, #10B981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 19,
              }}
            >
              📱
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <b style={{ fontSize: 13, color: t.text, display: "block", marginBottom: 3 }}>Atajo de Notificaciones (iOS)</b>
              <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.45 }}>Lee pagos de Apple Pay mediante Atajos configurados.</div>
            </div>
            <Toggle value={iosShortcutsEnabled} onChange={setIosShortcutsEnabled} />
          </div>
        </div>

        {/* ===== INFO GENERAL ===== */}
        <div className="orus-rise" style={{ animationDelay: "0.22s", marginBottom: 20 }}>
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
