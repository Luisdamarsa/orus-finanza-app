import { useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { DARK, LIGHT } from "../constants/tokens";

export default function NotificationsSetupPage({ onBack, isDark, notificationListenerEnabled, setNotificationListenerEnabled }) {
  const theme = useTheme();
  const resolvedIsDark = isDark !== undefined ? isDark : theme.isDark;
  const tokens = resolvedIsDark ? DARK : LIGHT;

  const t = {
    bg: tokens.bg,
    surface: resolvedIsDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    text: tokens.text,
    sub: tokens.sub,
    accent: resolvedIsDark ? "#9B6DFF" : "#7C4DFF",
    accentSoft: resolvedIsDark ? "rgba(155,109,255,0.2)" : "rgba(124,77,255,0.15)",
    border: tokens.border,
    shadowSm: resolvedIsDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
    inputBg: resolvedIsDark ? "rgba(255,255,255,0.04)" : "rgba(30,20,60,0.04)",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSources, setSelectedSources] = useState([]);

  const sources = [
    { id: "google-pay", name: "Google Pay", icon: "P", color: "#4285F4" },
    { id: "google-wallet", name: "Google Wallet", icon: "🎫", color: "#4285F4" },
  ];

  const filteredSources = sources.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedSources.find(sel => sel.id === s.id)
  );

  const toggleSource = (source) => {
    setSelectedSources([...selectedSources, source]);
    setSearchQuery("");
  };

  const removeSource = (sourceId) => {
    setSelectedSources(selectedSources.filter(s => s.id !== sourceId));
  };

  const pressToggle = usePress();

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
      <style>{`::-webkit-scrollbar { display: none; } input::placeholder { color: #8B87A3 !important; }`}</style>

      {/* Header fijo */}
      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5F3FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M2 10h20" />
          </svg>
        }
        pageTitle="Activar Notificaciones"
        isDark={resolvedIsDark}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 50px", boxSizing: "border-box" }}>

        {/* Explicación */}
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#8B87A3", lineHeight: 1.5, textAlign: "left" }}>
          Recibe notificaciones automáticas de tus transacciones de Wallet. ORUS las leerá y te preguntará si registrarlas. Tú controlas qué se registra.
        </div>

        {/* Instrucciones */}
        <div style={{ fontSize: "14px", fontWeight: 800, color: "#F5F3FF", marginTop: 20, textAlign: "left" }}>Instrucciones</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {[
          "1. Abre Configuración",
          "2. Ve a Notificaciones",
          "3. Busca \"leer notificaciones\"",
          "4. Busca \"ORUS\" y actívala",
          "5. ¡Listo! Ahora ORUS lee las notificaciones de wallet",
        ].map((item, idx) => (
          <div key={idx} style={{ fontSize: "12px", fontWeight: 600, color: "#8B87A3", textAlign: "left" }}>
            {item}
          </div>
        ))}
      </div>

      {/* Automatizaciones Activas */}
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", padding: "15px 16px", borderRadius: 16, background: t.surface, boxShadow: t.shadowSm }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(134,239,172,0.16)", display: "flex", alignItems: "center", justifyContent: "center", color: "#86EFAC", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F5F3FF" }}>Automatizaciones activas</div>
            <div style={{ fontSize: "10.5px", fontWeight: 600, color: "#8B87A3", marginTop: 2 }}>ORUS lee notificaciones de tu wallet</div>
          </div>
        </div>
        <button
          onClick={() => setNotificationListenerEnabled && setNotificationListenerEnabled(!notificationListenerEnabled)}
          {...pressToggle.handlers}
          style={{
            width: 44,
            height: 26,
            borderRadius: 13,
            border: "none",
            background: notificationListenerEnabled ? t.accent : t.border,
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
              left: notificationListenerEnabled ? 20 : 2,
              transition: "left 0.18s ease",
            }}
          />
        </button>
      </div>

      {/* Selecciona Fuente */}
      <div style={{ fontSize: "14px", fontWeight: 800, color: "#F5F3FF", marginTop: 22, textAlign: "left" }}>Selecciona fuente</div>

      {/* Search Bar */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 14, background: t.inputBg, boxShadow: t.shadowSm }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Buscar fuente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "#F5F3FF",
            outline: "none",
            fontFamily: "Manrope",
          }}
        />
      </div>

      {/* Dropdown */}
      {searchQuery && filteredSources.length > 0 && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredSources.map((source) => (
            <button
              key={source.id}
              onClick={() => toggleSource(source)}
              style={{
                padding: "13px 14px",
                borderRadius: 14,
                background: t.surface,
                boxShadow: t.shadowSm,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.opacity = "0.8"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px", fontWeight: 800, color: source.color }}>
                {source.icon}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: t.text, flex: 1, textAlign: "left" }}>{source.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chips seleccionados */}
      {selectedSources.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {selectedSources.map((source) => (
            <div
              key={source.id}
              style={{
                padding: "7px 8px 7px 6px",
                borderRadius: 20,
                background: t.accentSoft,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: 6, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800, color: source.color, flexShrink: 0 }}>
                {source.icon}
              </div>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: t.accent, flex: 1, textAlign: "left" }}>{source.name}</span>
              <button
                onClick={() => removeSource(source.id)}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

        {/* Footer */}
        <div style={{ fontSize: "11px", fontWeight: 600, color: "#8B87A3", textAlign: "center", marginTop: 30, lineHeight: 1.6 }}>
          ¿Tienes problemas...? Contacta con nuestra{" "}
          <span style={{ color: "#9B6DFF", fontWeight: 700, cursor: "pointer", fontSize: "11px" }}>
            ayuda
          </span>
          {" "}sobre cómo configurar notificaciones.
        </div>
      </div>
    </div>
  );
}
