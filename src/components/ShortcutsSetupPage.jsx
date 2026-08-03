import { useState } from "react";
import { usePress } from "../hooks/usePress";

/**
 * ShortcutsSetupPage.jsx
 *
 * Página para explicar cómo configurar el Atajo de iOS
 * Guía paso a paso con instrucciones y toggle al final
 */
export default function ShortcutsSetupPage({
  isDark,
  onBack,
  iosShortcutsEnabled,
  setIosShortcutsEnabled,
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
          <span style={{ fontSize: 22 }}>📱</span>
          Activar Atajo
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

        {/* Section 1: ¿Qué es? - con diagrama */}
        <div className="orus-rise" style={{ marginBottom: 24, animationDelay: "0.04s" }}>
          {/* Diagrama de flujo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {/* Pagos */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>💳</div>
              <div style={{ fontSize: 10, color: t.sub, fontWeight: 600 }}>Pagos</div>
            </div>

            {/* Flecha */}
            <div style={{ fontSize: 18, color: t.sub }}>→</div>

            {/* Notificaciones */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🔔</div>
              <div style={{ fontSize: 10, color: t.sub, fontWeight: 600 }}>Notificaciones</div>
            </div>

            {/* Flecha */}
            <div style={{ fontSize: 18, color: t.sub }}>→</div>

            {/* Atajo */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>📱</div>
              <div style={{ fontSize: 10, color: t.sub, fontWeight: 600 }}>Atajo</div>
            </div>

            {/* Flecha */}
            <div style={{ fontSize: 18, color: t.sub }}>→</div>

            {/* ORUS */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>⭐</div>
              <div style={{ fontSize: 10, color: t.sub, fontWeight: 600 }}>ORUS</div>
            </div>
          </div>

          {/* Texto explicativo */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: t.sub, lineHeight: 1.6, marginBottom: 6 }}>
              Un <strong style={{ color: t.text }}>Atajo</strong> es una automatización de iOS que puede leer notificaciones de Apple Pay y enviarlas a ORUS automáticamente.
            </div>
            <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.6 }}>
              Funciona en segundo plano cuando pagas con Apple Pay en tu iPhone.
            </div>
          </div>
        </div>

        {/* Section 2: Instrucciones */}
        <div className="orus-rise" style={{ marginBottom: 24, animationDelay: "0.12s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 12px 0", textAlign: "left" }}>
            Instrucciones
          </h3>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: t.text, textAlign: "left" }}>
            <div style={{ marginBottom: 10 }}>
              1. Abre la app "Atajos"
            </div>
            <div style={{ marginBottom: 10 }}>
              2. Toca el botón "+"
            </div>
            <div style={{ marginBottom: 10 }}>
              3. Busca "Notificación recibida"
            </div>
            <div style={{ marginBottom: 10 }}>
              4. Filtra por: "Apple Pay"
            </div>
            <div style={{ marginBottom: 10 }}>
              5. Agrega acción: "Abrir URL"
            </div>
            <div>
              6. Guarda con el nombre "ORUS - Pagos"
            </div>
          </div>
        </div>

        {/* Section 3: Toggle */}
        <div className="orus-rise" style={{ marginBottom: 40, animationDelay: "0.20s" }}>
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 3 }}>✅ Atajos activados</div>
              <div style={{ fontSize: 11, color: t.sub }}>ORUS lee notificaciones de Apple Pay</div>
            </div>
            <button
              onClick={() => setIosShortcutsEnabled(!iosShortcutsEnabled)}
              style={{
                flexShrink: 0,
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: iosShortcutsEnabled ? "#9B6DFF" : isDark ? "#3D3D4D" : "#D5D3E8",
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
                  transform: iosShortcutsEnabled ? "translateX(20px)" : "translateX(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>
        </div>

        {/* Section 4: Problemas comunes */}
        <div className="orus-rise" style={{ marginBottom: 24, animationDelay: "0.28s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 12px 0", textAlign: "left" }}>
            Problemas Comunes
          </h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.text, marginBottom: 2 }}>El Atajo no se ejecuta</div>
              <div style={{ fontSize: 10, color: t.sub, lineHeight: 1.4 }}>Abre Configuración → Privacidad → Atajos y activa ORUS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🚫</span>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.text, marginBottom: 2 }}>ORUS no abre</div>
              <div style={{ fontSize: 10, color: t.sub, lineHeight: 1.4 }}>Reinstala ORUS o verifica que esté en tu pantalla de inicio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Nota importante - Fijo al bottom */}
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
        <div style={{ fontSize: 10, color: t.sub, lineHeight: 1.6 }}>
          💡 Si ORUS no está instalada o los permisos no están activados, el Atajo puede no funcionar. Verifica que ORUS está en tu pantalla de inicio.
        </div>
      </div>
    </div>
  );
}
