import { useState, useEffect, useRef } from "react";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";

/**
 * PermissionsPage.jsx — "Permisos".
 * Explica los permisos que ORUS necesita (con iconos) y permite gestionarlos:
 *  - micrófono y notificaciones → se piden con las APIs web (funcional en el navegador).
 *  - leer notificaciones / SMS / correo → nativos: se conceden en los ajustes del teléfono.
 * Las tarjetas aparecen desde abajo al entrar en pantalla. Extraída — ruteo en ScreenRouter.
 */
const PERMISSIONS = [
  { id: "notif-push", icon: "🔔", color: "#FDE68A", name: "Notificaciones de ORUS", why: "Para avisarte de tus finanzas y enviarte recordatorios.", kind: "notif", req: "Óptimo" },
  { id: "mic", icon: "🎤", color: "#9B6DFF", name: "Micrófono", why: "Para registrar gastos por voz: “gasté 20 mil en el súper”.", kind: "mic", req: "Óptimo" },
  { id: "sms", icon: "💬", color: "#86EFAC", name: "Mensajes (SMS)", why: "Algunos bancos y Nequi/Daviplata avisan por SMS; los leemos solo para crear el movimiento.", kind: "native", req: "Opcional" },
  { id: "notif-read", icon: "🏦", color: "#93C5FD", name: "Leer avisos del banco", why: "Para detectar tus movimientos automáticamente cuando el banco te notifica.", kind: "native", req: "Opcional" },
  { id: "correo", icon: "✉️", color: "#C4B5FD", name: "Correo", why: "Algunas confirmaciones bancarias llegan por correo; con tu permiso las leemos para registrar el movimiento.", kind: "native", req: "Opcional" },
];

export default function PermissionsPage({ isDark, onBack, onOpenPrivacy }) {
  const pressBack = usePress();
  const [status, setStatus] = useState({});
  const [hint, setHint] = useState(false);
  const containerRef = useRef(null);

  // Reveal por scroll: cada .reveal aparece desde abajo al entrar en pantalla
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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

  // Icono de la tarjeta (mic usa el icono real de la app)
  const iconEl = (p) => {
    if (p.id === "mic") {
      return (
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none" />
            <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
          </svg>
        </div>
      );
    }
    return <div style={{ width: 38, height: 38, borderRadius: 11, background: p.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{p.icon}</div>;
  };

  return (
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      pressBack={pressBack}
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <span style={{ fontSize: 18 }}>🔐</span>PERMISOS
        </span>
      }
    >
      <style>{`
        .reveal{opacity:0;transform:translateY(26px);transition:opacity .5s ease, transform .5s ease;}
        .reveal.in{opacity:1;transform:none;}
      `}</style>

      <div ref={containerRef} style={{ textAlign: "left" }}>
        <div style={{ fontSize: 12.5, color: t.sub, lineHeight: 1.6, marginBottom: 6 }}>
          ORUS pide estos permisos para funcionar mejor. Tú decides cuáles conceder — puedes cambiarlos
          cuando quieras desde los ajustes de tu teléfono.
        </div>

        {PERMISSIONS.map((p, i) => (
          <div key={p.id} className="reveal" style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 12, marginTop: 12, display: "flex", alignItems: "center", gap: 12, transitionDelay: `${i * 0.09}s` }}>
            {iconEl(p)}
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <b style={{ fontSize: 13, color: t.text }}>{p.name}</b>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: p.req === "Óptimo" ? "#9B6DFF" : t.sub, background: (p.req === "Óptimo" ? "#9B6DFF" : t.sub) + "22", padding: "1px 6px", borderRadius: 8 }}>{p.req.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.45, marginTop: 3, textAlign: "left" }}>{p.why}</div>
            </div>
            <div style={{ flexShrink: 0 }}>{action(p)}</div>
          </div>
        ))}

        <button
          className="reveal"
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
          <span onClick={onOpenPrivacy} style={{ color: "#9B6DFF", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Política de Privacidad</span>.
        </div>
      </div>
    </PageLayout>
  );
}
