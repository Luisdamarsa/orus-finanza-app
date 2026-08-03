import { useState } from "react";
import { usePress } from "../hooks/usePress";

/**
 * NotificationsSetupPage.jsx
 *
 * Página para explicar cómo activar "Notificaciones de Wallet"
 * Guía paso a paso y toggle al final para guardar preferencia
 */
export default function NotificationsSetupPage({
  isDark,
  onBack,
  notificationListenerEnabled,
  setNotificationListenerEnabled,
}) {
  const pressBack = usePress();
  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, position: "relative" }}>
      {/* Header fijo */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          height: 52,
          background: t.bg,
          padding: "8px 22px",
          boxSizing: "border-box",
          borderBottom: `1px solid ${t.border}`,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            {...pressBack.handlers}
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              border: "none",
              background: isDark ? "#1E1E2E" : "#EEE9FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              ...pressBack.getPressStyle(),
            }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#C4C2E0" : "#6B7280"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>Atrás</span>
        </div>
      </div>

      {/* Título */}
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 0,
          right: 0,
          height: 60,
          background: t.bg,
          paddingLeft: "22px",
          paddingBottom: "3px",
          boxSizing: "border-box",
          zIndex: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: t.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
          <span style={{ fontSize: 22 }}>💳</span>
          Activar Notificaciones
        </div>
      </div>

      {/* Contenido scrolleable */}
      <div
        style={{
          position: "absolute",
          top: 164,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          padding: "20px 22px 40px 22px",
          boxSizing: "border-box",
        }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* Section 1: ¿Qué necesitas? - Como descripción de página */}
        <div className="orus-rise" style={{ marginBottom: 24, animationDelay: "0.04s" }}>
          <div style={{ fontSize: 13, color: t.sub, lineHeight: 1.6, textAlign: "left" }}>
            Necesitas permiso para que ORUS lea las notificaciones de tu Wallet, y tener una tarjeta configurada en Wallet.
          </div>
        </div>

        {/* Section 2: Instrucciones */}
        <div className="orus-rise" style={{ marginBottom: 24, animationDelay: "0.12s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 12px 0", textAlign: "left" }}>
            Instrucciones
          </h3>

          <div style={{ fontSize: 12, lineHeight: 1.8, color: t.sub, textAlign: "left" }}>
            <div style={{ marginBottom: 10, color: t.text }}>
              1. Abre Configuración
            </div>
            <div style={{ marginBottom: 10, color: t.text }}>
              2. Ve a Notificaciones
            </div>
            <div style={{ marginBottom: 10, color: t.text }}>
              3. Busca "leer notificaciones"
            </div>
            <div style={{ marginBottom: 10, color: t.text }}>
              4. Busca "ORUS" y actívala
            </div>
            <div style={{ color: t.text }}>
              5. ¡Listo! Ahora ORUS lee las notificaciones de wallet
            </div>
          </div>
        </div>

        {/* Section 3: Toggle de automatizaciones activas */}
        <div className="orus-rise" style={{ marginBottom: 40, animationDelay: "0.20s" }}>
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 3 }}>✅ Automatizaciones activas</div>
              <div style={{ fontSize: 11, color: t.sub }}>ORUS lee notificaciones de tu wallet</div>
            </div>
            <button
              onClick={() => setNotificationListenerEnabled(!notificationListenerEnabled)}
              style={{
                flexShrink: 0,
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: notificationListenerEnabled ? "#9B6DFF" : isDark ? "#3D3D4D" : "#D5D3E8",
                cursor: "pointer",
                padding: 2,
                boxSizing: "border-box",
                display: "inline-flex",
                alignItems: "center",
              }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  transform: notificationListenerEnabled ? "translateX(20px)" : "translateX(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>
        </div>

        {/* Section 4: Selecciona fuente */}
        <div className="orus-rise" style={{ marginBottom: 24, animationDelay: "0.28s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 12px 0", textAlign: "left" }}>
            Selecciona fuente
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Google Pay */}
            <button
              style={{
                width: "100%",
                background: isDark ? "#1E1E2E" : "#FFFFFF",
                border: `1.5px solid #9B6DFF`,
                borderRadius: 8,
                padding: 12,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
              <img
                src="https://cdn.simpleicons.org/googlepay/4285F4"
                alt="Google Pay"
                style={{ width: 24, height: 24, flexShrink: 0 }}
              />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#9B6DFF" }}>Google Pay</div>
            </button>

            {/* Google Wallet */}
            <button
              style={{
                width: "100%",
                background: isDark ? "#252535" : "#F5F3FF",
                border: `1.5px solid ${t.border}`,
                borderRadius: 8,
                padding: 12,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                {/* Billetera con tiras de colores - Google Wallet style */}
                <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="#34A853" strokeWidth="1.5" />
                <rect x="2" y="4" width="20" height="3.5" fill="#34A853" />
                <rect x="2" y="7.5" width="20" height="2.5" fill="#EA4335" />
                <rect x="2" y="10" width="20" height="2.5" fill="#4285F4" />
                <rect x="2" y="12.5" width="20" height="2.5" fill="#FBBC04" />
              </svg>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Google Wallet</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer: Mensaje de soporte - Fijo al bottom */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "auto",
          background: `linear-gradient(to top, ${t.bg}, transparent)`,
          padding: "16px 22px",
          boxSizing: "border-box",
          zIndex: 20,
          textAlign: "center",
        }}>
        <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.6 }}>
          ¿Tienes problemas para que ORUS lea las notificaciones? Contacta con{" "}
          <a href="#" style={{ color: "#9B6DFF", textDecoration: "none", fontWeight: 600 }}>
            ayuda
          </a>
          .
        </div>
      </div>
    </div>
  );
}
