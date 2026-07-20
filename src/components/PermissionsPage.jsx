import { useState } from "react";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";

/**
 * PermissionsPage.jsx — "Permisos".
 * Explica los permisos que ORUS necesita (con iconos) y permite gestionarlos:
 *  - micrófono y notificaciones → se piden con las APIs web (funcional en el navegador).
 *  - leer notificaciones / SMS / correo → nativos: se conceden en los ajustes del teléfono.
 * Mismo formato que las demás (PageLayout). Extraída — ruteo en ScreenRouter.
 */
const PERMISSIONS = [
  { id: "notif-read", icon: "🔔", color: "#93C5FD", name: "Leer avisos del banco", why: "Para detectar tus movimientos automáticamente cuando el banco te notifica.", kind: "native", req: "Requerido" },
  { id: "mic", icon: "🎤", color: "#9B6DFF", name: "Micrófono", why: "Para registrar gastos por voz: “gasté 20 mil en el súper”.", kind: "mic", req: "Opcional" },
  { id: "sms", icon: "💬", color: "#86EFAC", name: "Mensajes (SMS)", why: "Algunos bancos y Nequi/Daviplata avisan por SMS; los leemos solo para crear el movimiento.", kind: "native", req: "Opcional" },
  { id: "notif-push", icon: "📲", color: "#FDE68A", name: "Notificaciones de ORUS", why: "Para avisarte de tus finanzas y enviarte recordatorios.", kind: "notif", req: "Opcional" },
  { id: "correo", icon: "✉️", color: "#C4B5FD", name: "Correo", why: "Algunas confirmaciones bancarias llegan por correo; con tu permiso las leemos para registrar el movimiento.", kind: "native", req: "Opcional" },
];

export default function PermissionsPage({ isDark, onBack }) {
  const pressBack = usePress();
  const [status, setStatus] = useState({});
  const [hint, setHint] = useState(false);

  const t = isDark
    ? { bg: "#000000", card: "#141420", border: "#23233a", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };

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

  const statusColor = (v) => (v === "Permitido" ? "#22C55E" : v === "Bloqueado" ? "#FCA5A5" : t.sub);

  const action = (p) => {
    const v = status[p.id];
    if (p.kind === "native") {
      return <span style={{ fontSize: 10, fontWeight: 700, color: t.sub, background: t.border, padding: "4px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>En el teléfono</span>;
    }
    // mic / notif (web)
    if (v && v !== "Bloqueado") {
      return <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(v), whiteSpace: "nowrap" }}>{v}</span>;
    }
    return (
      <button
        onClick={p.kind === "mic" ? requestMic : requestNotif}
        style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "#9B6DFF", border: "none", padding: "5px 11px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap" }}>
        {v === "Bloqueado" ? "Reintentar" : "Permitir"}
      </button>
    );
  };

  return (
    <PageLayout isDark={isDark} onBack={onBack} title="PERMISOS" pressBack={pressBack}>
      <div style={{ fontSize: 12.5, color: t.sub, lineHeight: 1.6, marginBottom: 6 }}>
        ORUS pide estos permisos para funcionar mejor. Tú decides cuáles conceder — puedes cambiarlos
        cuando quieras desde los ajustes de tu teléfono.
      </div>

      {PERMISSIONS.map((p) => (
        <div key={p.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 12, marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: p.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{p.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <b style={{ fontSize: 13, color: t.text }}>{p.name}</b>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: p.req === "Requerido" ? "#FCA5A5" : t.sub, background: (p.req === "Requerido" ? "#FCA5A5" : t.sub) + "22", padding: "1px 6px", borderRadius: 8 }}>{p.req.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.45, marginTop: 3 }}>{p.why}</div>
          </div>
          <div style={{ flexShrink: 0 }}>{action(p)}</div>
        </div>
      ))}

      {/* Ir a los ajustes del teléfono */}
      <button
        onClick={() => setHint(true)}
        style={{ width: "100%", marginTop: 18, padding: "13px 0", borderRadius: 14, border: `1.5px solid ${t.border}`, background: t.card, color: t.text, fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        🔧 Abrir ajustes del teléfono →
      </button>
      {hint && (
        <div style={{ fontSize: 11, color: t.sub, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
          En la app instalada, esto abre los <b>Ajustes → ORUS</b> de tu teléfono, donde puedes conceder o
          revocar cada permiso.
        </div>
      )}

      <div style={{ fontSize: 10.5, color: t.sub, textAlign: "center", marginTop: 20, paddingBottom: 10, lineHeight: 1.5 }}>
        ORUS solo usa estos datos para registrar y organizar tus finanzas. Ver la{" "}
        <b style={{ color: "#9B6DFF" }}>Política de Privacidad</b>.
      </div>
    </PageLayout>
  );
}
