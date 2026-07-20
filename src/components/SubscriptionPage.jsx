import { useEffect, useRef, useState } from "react";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";

/**
 * SubscriptionPage.jsx — "Mi Plan".
 * Presenta los 3 planes de ORUS (Free / Plus / Pro) con sus beneficios.
 * Precios en USD (universal). Las tarjetas aparecen desde abajo al entrar en pantalla
 * (reveal por scroll, IntersectionObserver). Mismo formato que las demás (PageLayout).
 * Extraída — ruteo en ScreenRouter.
 */

const USD_TO_COP = 3300; // ref. 20 jul 2026
const cop = (usd) => "≈ $" + Math.round((usd * USD_TO_COP) / 100) * 100 + " COP/mes";

const PLANS = [
  {
    id: "free",
    name: "Free",
    icon: "🆓",
    tint: "#86EFAC",
    price: 0,
    tagline: "Empieza a tomar el control, sin pagar nada.",
    current: true, // plan actual por defecto (sin BD todavía)
    features: [
      { t: "Registro manual y por voz", ok: true },
      { t: "Hasta 10 movimientos al día", ok: true, note: "desbloquea +5 viendo un anuncio" },
      { t: "Categorías y presupuestos básicos", ok: true },
      { t: "Con anuncios", ok: true, muted: true },
      { t: "Lectura automática (correo / notificaciones)", ok: false },
      { t: "Asistente de IA", ok: false },
    ],
  },
  {
    id: "plus",
    name: "Plus",
    icon: "⭐",
    tint: "#93C5FD",
    price: 2.99,
    tagline: "Que la app registre por ti. Sin escribir, sin anuncios.",
    highlight: true, // el más popular
    features: [
      { t: "Todo lo del plan Free, ilimitado", ok: true },
      { t: "Sin anuncios", ok: true },
      { t: "Lectura por correo bancario", ok: true },
      { t: "Notificación (Android) / Atajo (iOS)", ok: true },
      { t: "IA que categoriza tus movimientos", ok: true },
      { t: "IA que transcribe tu voz", ok: true },
      { t: "Informe mensual básico", ok: true },
      { t: "Asistente de IA para preguntar", ok: false },
      { t: "Workspaces compartidos", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: "👑",
    tint: "#C4B5FD",
    price: 5.99,
    tagline: "Tu asistente financiero con IA. Solo o en equipo.",
    features: [
      { t: "Todo lo del plan Plus", ok: true },
      { t: "Asistente de IA: pregúntale sobre tus finanzas", ok: true, note: "hasta 100 consultas/mes" },
      { t: "Análisis inteligente de tus finanzas", ok: true },
      { t: "Informes mensuales y anuales completos", ok: true },
      { t: "Workspaces compartidos", ok: true, note: "pareja, amigos o tu negocio" },
      { t: "Categorización por IA (sin límite)", ok: true },
    ],
  },
];

export default function SubscriptionPage({ isDark, onBack }) {
  const pressBack = usePress();
  const containerRef = useRef(null);
  const [selected, setSelected] = useState(null);

  // Reveal por scroll: cada .reveal aparece desde abajo cuando entra en pantalla
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

  return (
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      pressBack={pressBack}
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <span style={{ fontSize: 18 }}>💎</span>MI PLAN
        </span>
      }
    >
      <style>{`
        .reveal{opacity:0;transform:translateY(26px);transition:opacity .5s ease, transform .5s ease;}
        .reveal.in{opacity:1;transform:none;}
      `}</style>

      <div ref={containerRef} style={{ textAlign: "left" }}>
        <div style={{ fontSize: 12.5, color: t.sub, lineHeight: 1.6, marginBottom: 6 }}>
          Elige el plan que se ajuste a ti. Puedes empezar gratis y cambiar cuando quieras.
        </div>

        {PLANS.map((p, i) => {
          const isSel = selected === p.id;
          const border = p.highlight ? "#9B6DFF" : t.border;
          return (
            <div
              key={p.id}
              className="reveal"
              style={{
                background: t.card,
                border: `${p.highlight ? 2 : 1}px solid ${isSel ? "#9B6DFF" : border}`,
                borderRadius: 16,
                padding: 16,
                marginTop: 14,
                transitionDelay: `${i * 0.1}s`,
                position: "relative",
              }}
            >
              {p.highlight && (
                <span style={{ position: "absolute", top: -9, left: 16, background: "#9B6DFF", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 9px", borderRadius: 10, letterSpacing: 0.5 }}>
                  MÁS POPULAR
                </span>
              )}

              {/* Encabezado del plan */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: p.tint + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <b style={{ fontSize: 16, color: t.text }}>{p.name}</b>
                    {p.current && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#22C55E", background: "#22C55E22", padding: "1px 7px", borderRadius: 8 }}>PLAN ACTUAL</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11.5, color: t.sub, lineHeight: 1.45, marginTop: 2 }}>{p.tagline}</div>
                </div>
              </div>

              {/* Precio */}
              <div style={{ marginTop: 12, marginBottom: 4 }}>
                {p.price === 0 ? (
                  <span style={{ fontSize: 24, fontWeight: 800, color: t.text }}>Gratis</span>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: t.text }}>${p.price}</span>
                    <span style={{ fontSize: 12, color: t.sub, fontWeight: 600 }}>USD/mes</span>
                    <span style={{ fontSize: 10, color: t.sub, marginLeft: 6 }}>{cop(p.price)}</span>
                  </span>
                )}
              </div>

              {/* Lista de beneficios */}
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 12, lineHeight: 1.4, flexShrink: 0, color: f.ok ? "#22C55E" : "#FCA5A5", fontWeight: 700 }}>
                      {f.ok ? "✓" : "✕"}
                    </span>
                    <span style={{ fontSize: 12, lineHeight: 1.4, color: f.ok ? (f.muted ? t.sub : t.text) : t.sub, textDecoration: f.ok ? "none" : "none", opacity: f.ok ? 1 : 0.6 }}>
                      {f.t}
                      {f.note && <span style={{ color: t.sub, fontStyle: "italic" }}> — {f.note}</span>}
                    </span>
                  </div>
                ))}
              </div>

              {/* Botón de acción */}
              <button
                onClick={() => setSelected(p.id)}
                style={{
                  width: "100%", marginTop: 14, padding: "11px 0", borderRadius: 12,
                  border: p.current ? `1.5px solid ${t.border}` : "none",
                  background: p.current ? "transparent" : (p.highlight ? "#9B6DFF" : t.text),
                  color: p.current ? t.sub : (p.highlight ? "#fff" : t.bg),
                  fontSize: 13.5, fontWeight: 700, cursor: p.current ? "default" : "pointer",
                }}
              >
                {p.current ? "Tu plan actual" : `Elegir ${p.name}`}
              </button>
            </div>
          );
        })}

        {selected && selected !== "free" && (
          <div style={{ fontSize: 11, color: t.sub, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
            🔒 Los pagos se activarán próximamente. ¡Gracias por tu interés en <b style={{ color: "#9B6DFF" }}>ORUS {PLANS.find((x) => x.id === selected).name}</b>!
          </div>
        )}

        <div style={{ fontSize: 10.5, color: t.sub, textAlign: "center", marginTop: 20, paddingBottom: 10, lineHeight: 1.5 }}>
          Precios en USD. El valor en COP es una referencia y puede variar con la tasa de cambio.
          Cancela cuando quieras.
        </div>
      </div>
    </PageLayout>
  );
}
