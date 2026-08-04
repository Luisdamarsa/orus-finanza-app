import { useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { DARK, LIGHT } from "../constants/tokens";

export default function ShortcutsSetupPage({ onBack, isDark, iosShortcutsEnabled, setIosShortcutsEnabled }) {
  const theme = useTheme();
  const resolvedIsDark = isDark !== undefined ? isDark : theme.isDark;
  const tokens = resolvedIsDark ? DARK : LIGHT;

  const t = {
    bg: tokens.bg,
    surface: resolvedIsDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    text: tokens.text,
    sub: tokens.sub,
    muted: resolvedIsDark ? "#6B6680" : "#A99FB8",
    accent: resolvedIsDark ? "#9B6DFF" : "#7C4DFF",
    accentSoft: resolvedIsDark ? "rgba(155,109,255,0.2)" : "rgba(124,77,255,0.15)",
    danger: resolvedIsDark ? "#FF8A8A" : "#EF4444",
    border: tokens.border,
    shadowSm: resolvedIsDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
  };

  const pressToggle = usePress();

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Header fijo */}
      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5F3FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="6" height="6" />
            <rect x="14" y="4" width="6" height="6" />
            <rect x="4" y="14" width="6" height="6" />
            <rect x="14" y="14" width="6" height="6" />
          </svg>
        }
        pageTitle="Activar Atajo"
        isDark={resolvedIsDark}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 50px", boxSizing: "border-box" }}>

      {/* Diagrama de 4 pasos */}
      <div style={{ marginTop: 18, padding: "18px 10px", borderRadius: 18, background: t.surface, boxShadow: t.shadowSm, display: "flex", alignItems: "center",  }}>
        {[
          { label: "Pagos", bg: "rgba(147,197,253,0.16)", color: "#93C5FD", path: "M2 10h20M2 8v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2H4a2 2 0 00-2 2z" },
          { label: "Notificaciones", bg: "rgba(245,180,77,0.16)", color: "#F5B44D", path: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" },
          { label: "Atajo", bg: "rgba(134,239,172,0.16)", color: "#86EFAC", svg: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="6" height="6" />
              <rect x="14" y="4" width="6" height="6" />
              <rect x="4" y="14" width="6" height="6" />
              <rect x="14" y="14" width="6" height="6" />
            </svg>
          ) },
          { label: "ORUS", bg: t.accentSoft, color: t.accent, path: "M13 10l-1.5 4.5M11 10a3 3 0 116 0M12 21c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3z" },
        ].map((step, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, position: "relative" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", color: step.color }}>
              {step.svg ? step.svg : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={step.path} />
                </svg>
              )}
            </div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#8B87A3", textAlign: "center", lineHeight: 1.2 }}>{step.label}</div>
            {idx < 3 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B87A3" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: "-22px", top: "10px" }}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Texto explicativo */}
      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#8B87A3", textAlign: "center", lineHeight: 1.6, marginTop: 18 }}>
        Un <span style={{ fontWeight: 800, color: "#F5F3FF" }}>Atajo</span> es una automatización de iOS que puede leer notificaciones de Apple Pay y enviarlas a ORUS automáticamente.
      </div>

      {/* Nota secundaria */}
      <div style={{ fontSize: "11px", fontWeight: 600, color: t.muted, textAlign: "center", lineHeight: 1.5, marginTop: 8 }}>
        Funciona en segundo plano cuando pagas con Apple Pay en tu iPhone.
      </div>

      {/* Instrucciones */}
      <div style={{ fontSize: "14px", fontWeight: 800, color: "#F5F3FF", marginTop: 22, textAlign: "left" }}>Instrucciones</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {[
          "1. Abre la app \"Atajos\"",
          "2. Toca el botón \"+\"",
          "3. Busca \"Notificación recibida\"",
          "4. Filtra por: \"Apple Pay\"",
          "5. Agrega acción: \"Abrir URL\"",
          "6. Guarda con el nombre \"ORUS - Pagos\"",
        ].map((item, idx) => (
          <div key={idx} style={{ fontSize: "12px", fontWeight: 600, color: "#8B87A3", textAlign: "left" }}>
            {item}
          </div>
        ))}
      </div>

      {/* Atajos Activados */}
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", padding: "15px 16px", borderRadius: 16, background: t.surface, boxShadow: t.shadowSm }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(134,239,172,0.16)", display: "flex", alignItems: "center", justifyContent: "center", color: "#86EFAC", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F5F3FF" }}>Atajos activados</div>
            <div style={{ fontSize: "10.5px", fontWeight: 600, color: "#8B87A3", marginTop: 2 }}>ORUS lee notificaciones de Apple Pay</div>
          </div>
        </div>
        <button
          onClick={() => setIosShortcutsEnabled && setIosShortcutsEnabled(!iosShortcutsEnabled)}
          {...pressToggle.handlers}
          style={{
            width: 44,
            height: 26,
            borderRadius: 13,
            border: "none",
            background: iosShortcutsEnabled ? t.accent : t.border,
            cursor: "pointer",
            padding: 2,
            boxSizing: "border-box",
            display: "inline-flex",
            alignItems: "center",
            position: "relative",
            transition: "background 0.18s ease",
            ...pressToggle.getPressStyle(),
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#FFFFFF",
              position: "absolute",
              left: iosShortcutsEnabled ? 20 : 2,
              transition: "left 0.18s ease",
            }}
          />
        </button>
      </div>

      {/* Problemas Comunes */}
      <div style={{ fontSize: "14px", fontWeight: 800, color: "#F5F3FF", textAlign: "left", marginTop: 24 }}>Problemas Comunes</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
        {[
          { title: "El Atajo no se ejecuta", desc: "Abre Configuración → Privacidad → Atajos y activa ORUS.", bg: "rgba(245,180,77,0.16)", color: "#F5B44D", path: "M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" },
          { title: "ORUS no abre", desc: "Reinstala ORUS o verifica que esté en tu pantalla de inicio.", bg: "rgba(255,138,138,0.16)", color: t.danger, path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
        ].map((problem, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: problem.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: problem.color }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={problem.path} />
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#F5F3FF" }}>{problem.title}</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#8B87A3", marginTop: 2, lineHeight: 1.5 }}>{problem.desc}</div>
            </div>
          </div>
        ))}
      </div>

        {/* Tip final */}
        <div style={{ padding: "14px 16px", borderRadius: 16, background: t.accentSoft, marginTop: 20, fontSize: "11px", fontWeight: 600, color: "#F5F3FF", textAlign: "center", lineHeight: 1.5 }}>
          💡 Si ORUS no está instalada o los permisos no están activados, el Atajo puede no funcionar. Verifica que ORUS esté en tu pantalla de inicio.
        </div>
      </div>
    </div>
  );
}
