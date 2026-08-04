import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { DARK, LIGHT } from "../constants/tokens";

const PERMISSIONS = [
  { id: "notif-push", name: "Notificaciones de ORUS", why: "Para avisarte cuando registramos un movimiento y enviarte recordatorios.", kind: "notif", req: "ÓPTIMO" },
  { id: "mic", name: "Micrófono", why: "Para registrar gastos por voz: gasté 20 mil en el súper.", kind: "mic", req: "ÓPTIMO" },
];

export default function PermissionsPage({ onBack, onOpenPrivacy }) {
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;

  const t = {
    bg: tokens.bg,
    surface: isDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    text: tokens.text,
    sub: tokens.sub,
    accent: isDark ? "#9B6DFF" : "#7C4DFF",
    accentSoft: isDark ? "rgba(155,109,255,0.2)" : "rgba(124,77,255,0.15)",
    raised: isDark ? "rgba(255,255,255,0.04)" : "rgba(30,20,60,0.04)",
    shadowSm: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
  };

  const [status, setStatus] = useState({});

  const set = (id, v) => setStatus((s) => ({ ...s, [id]: v }));

  const requestMic = () => {
    if (!navigator.mediaDevices?.getUserMedia) return set("mic", "No disponible");
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => { stream.getTracks().forEach((tr) => tr.stop()); set("mic", "Permitido"); })
      .catch(() => set("mic", "Bloqueado"));
  };

  const requestNotif = () => {
    if (!("Notification" in window)) return set("notif-push", "No disponible");
    Notification.requestPermission().then((p) => set("notif-push", p === "granted" ? "Permitido" : "Bloqueado"));
  };

  const handlePermitClick = (p) => {
    if (p.kind === "mic") requestMic();
    else requestNotif();
  };

  const renderPermissionCard = (p) => {
    const v = status[p.id];
    const isGranted = v === "Permitido";

    return (
      <div key={p.id} style={{ padding: 16, borderRadius: 18, background: t.surface, boxShadow: t.shadowSm, display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Icon Badge */}
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: p.kind === "notif" ? "rgba(245,180,77,0.18)" : t.accentSoft,
          color: p.kind === "notif" ? "#F5B44D" : t.accent,
        }}>
          {p.kind === "notif" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="8" y1="21" x2="16" y2="21" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: "13.5px", fontWeight: 800, color: t.text }}>{p.name}</span>
            <span style={{ padding: "2px 8px", borderRadius: 8, background: t.accentSoft, color: t.accent, fontSize: "8.5px", fontWeight: 800, letterSpacing: ".3px" }}>
              {p.req}
            </span>
          </div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: t.sub, lineHeight: 1.5, marginTop: 4 }}>
            {p.why}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => handlePermitClick(p)}
          disabled={isGranted}
          style={{
            flexShrink: 0,
            padding: "8px 16px",
            borderRadius: 12,
            border: "none",
            background: isGranted ? "transparent" : "linear-gradient(155deg,#B18CFF,#8B5CF6)",
            color: isGranted ? "#22C55E" : "#fff",
            fontSize: "11.5px",
            fontWeight: 800,
            cursor: isGranted ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}>
          {isGranted ? "Permitido" : v === "Bloqueado" ? "Reintentar" : "Permitir"}
        </button>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        }
        pageTitle="Permisos"
        isDark={isDark}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 50px", boxSizing: "border-box" }}>

      {/* Subtitle */}
      <div style={{ fontSize: "12px", fontWeight: 600, color: t.sub, textAlign: "center", lineHeight: 1.5, marginBottom: 22, marginTop: 0 }}>
        ORUS pide estos permisos para funcionar mejor. Tu decides cuáles conceder puedes cambiarlos cuando quieras desde los ajustes de tu teléfono.
      </div>

      {/* Permission Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PERMISSIONS.map(renderPermissionCard)}
      </div>

      {/* Info Note */}
      <div style={{ padding: 16, borderRadius: 16, background: t.raised, boxShadow: t.shadowSm, marginTop: 22 }}>
        <div style={{ fontSize: "11.5px", fontWeight: 600, color: t.sub, lineHeight: 1.5 }}>
          ¿Recibes tus movimientos por correo? La conexión de correo bancario se configura en Automatización; ahí no se pide ningún permiso del teléfono.
        </div>
      </div>

      {/* Privacy Footer */}
      <div style={{ fontSize: "11px", fontWeight: 600, color: t.sub, textAlign: "center", marginTop: 22, lineHeight: 1.6 }}>
        ORUS solo usa estos datos para registrar y organizar tus finanzas. Ver la{" "}
        <span onClick={onOpenPrivacy} style={{ color: t.accent, fontWeight: 700, cursor: "pointer" }}>
          Política de Privacidad
        </span>
        .
      </div>
      </div>
    </div>
  );
}
