import { useEffect, useRef, useState } from "react";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";
import { userStorage } from "../utils/userStorage";

/**
 * SubscriptionPage.jsx — "Mi Plan".
 * Presenta los 3 planes de ORUS (Free / Plus / Pro) con sus beneficios.
 * Precios en USD (universal). Las tarjetas aparecen desde abajo al entrar en pantalla
 * (reveal por scroll) y están COLAPSADAS: se ve nombre + descripción + precio + botón;
 * al tocar la tarjeta (menos el botón) se despliegan todas las características.
 * Mismo formato que las demás (PageLayout). Extraída — ruteo en ScreenRouter.
 */

const USD_TO_COP = 3300; // ref. 20 jul 2026
const cop = (usd) => "≈ $" + Math.round((usd * USD_TO_COP) / 100) * 100 + " COP/mes";

// Donut de ORUS (símbolo) — mismos pilares/colores del dashboard
const DONUT = [
  { c: "#93C5FD", pct: 30 },
  { c: "#FCA5A5", pct: 20 },
  { c: "#86EFAC", pct: 15 },
  { c: "#C4B5FD", pct: 20 },
  { c: "#FDE68A", pct: 15 },
];
function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function arcPath(cx, cy, r, s, e) {
  const [x1, y1] = polar(cx, cy, r, s);
  const [x2, y2] = polar(cx, cy, r, e);
  const large = e - s > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}
function DonutIcon({ size = 26 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 3;
  let cursor = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {DONUT.map((s, i) => {
        const sweep = s.pct * 3.6;
        const start = cursor;
        const end = cursor + sweep - 8;
        cursor += sweep;
        return <path key={i} d={arcPath(cx, cy, r, start, end)} stroke={s.c} strokeWidth={4} fill="none" strokeLinecap="round" />;
      })}
    </svg>
  );
}

const PLANS = [
  {
    id: "free",
    name: "ORUS Free",
    tint: "#86EFAC",
    price: 0,
    tagline: "Empieza a tomar el control, sin pagar nada.",
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
    name: "ORUS Plus",
    icon: "⭐",
    tint: "#93C5FD",
    price: 2.99,
    tagline: "Que la app registre por ti. Sin escribir, sin anuncios.",
    highlight: true, // el más popular
    perks: ["Sin anuncios", "Lectura automática por correo", "IA que categoriza tus gastos"],
    reviews: [
      { name: "Camila R.", stars: 5, text: "Dejé de anotar todo a mano. Llegan mis gastos solos y ya no veo anuncios. Vale cada peso." },
      { name: "Andrés M.", stars: 5, text: "Lo mejor: conecté la automatización y la app clasifica sola. Súper cómodo." },
      { name: "Valentina P.", stars: 4, text: "Muy bueno por el precio. La categorización automática me ahorra un montón de tiempo." },
    ],
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
    name: "ORUS Pro",
    icon: "👑",
    tint: "#F5C451",
    price: 5.99,
    tagline: "Tu asistente financiero con IA. Solo o en equipo.",
    gold: true,
    badge: "MÁS COMPLETO",
    perks: ["Asistente de IA para tus finanzas", "Informes mensuales y anuales", "Workspaces compartidos"],
    reviews: [
      { name: "Daniela S.", stars: 5, text: "El asistente de IA me dice en qué estoy gastando de más. Es como tener un contador en el bolsillo." },
      { name: "Juan Felipe", stars: 5, text: "Comparto un workspace con mi novia para los gastos de la casa. Nos organizó la vida." },
      { name: "Mariana G.", stars: 5, text: "Los informes anuales son oro para mi negocio. Ahora sé exactamente cómo me fue el año." },
    ],
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
  // Plan activo del usuario (desde userStorage). Ej: "FREE" -> "free"
  const [currentPlan, setCurrentPlan] = useState(() => userStorage.getSubscription().toLowerCase());
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(null); // id del plan en pantalla de confirmación
  const [payHint, setPayHint] = useState(false); // aviso "aquí se abrirá el pago" (placeholder dev)
  const [expanded, setExpanded] = useState(() => userStorage.getSubscription().toLowerCase()); // abre el plan activo

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
  }, [confirming]); // re-adjunta el observer al volver de la confirmación (si no, las tarjetas quedan invisibles)

  const t = isDark
    ? { bg: "#000000", card: "#141420", border: "#23233a", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };

  const toggle = (id) => setExpanded((cur) => (cur === id ? null : id));

  const confirmChange = (id) => {
    userStorage.setSubscription(id.toUpperCase()); // cambia la suscripción del usuario
    setCurrentPlan(id);
    setExpanded(id);
    setSelected(id);
    setConfirming(null);
  };

  const Stars = ({ n }) => (
    <span style={{ color: "#F5C451", fontSize: 11, letterSpacing: 1 }}>
      {"★".repeat(n)}<span style={{ color: t.border }}>{"★".repeat(5 - n)}</span>
    </span>
  );

  // Pantalla de CONFIRMACIÓN (antes de aplicar / pagar)
  const cp = confirming ? PLANS.find((x) => x.id === confirming) : null;
  if (cp) {
    const closeConfirm = () => { setConfirming(null); setPayHint(false); };
    const accent = cp.gold ? "#E0A93E" : cp.highlight ? "#9B6DFF" : t.text;
    return (
      <PageLayout
        key="confirm-plan"
        isDark={isDark}
        onBack={closeConfirm}
        pressBack={pressBack}
        title={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>💎</span>CONFIRMAR PLAN
          </span>
        }
      >
        <div style={{ textAlign: "left" }}>
          {/* Resumen del plan */}
          <div style={{ background: t.card, border: `2px solid ${accent}`, borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: cp.tint + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 }}>
                {cp.id === "free" ? <DonutIcon size={28} /> : cp.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 17, color: t.text }}>{cp.name}</b>
                <div style={{ fontSize: 11.5, color: t.sub, marginTop: 2 }}>{cp.tagline}</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              {cp.price === 0
                ? <span style={{ fontSize: 22, fontWeight: 800, color: t.text }}>Gratis</span>
                : <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: t.text }}>${cp.price}</span>
                    <span style={{ fontSize: 12, color: t.sub, fontWeight: 600 }}>USD/mes</span>
                    <span style={{ fontSize: 10, color: t.sub, marginLeft: 6 }}>{cop(cp.price)}</span>
                  </span>}
            </div>
          </div>

          {/* Ventajas destacadas */}
          {cp.perks && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: t.text, marginBottom: 8 }}>Lo que obtienes</div>
              {cp.perks.map((perk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: accent, fontWeight: 800, fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 12.5, color: t.text, lineHeight: 1.4 }}>{perk}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reseñas */}
          {cp.reviews && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: t.text, marginBottom: 8 }}>Lo que dicen quienes lo usan</div>
              {cp.reviews.map((r, i) => (
                <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 12, marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <b style={{ fontSize: 12, color: t.text }}>{r.name}</b>
                    <Stars n={r.stars} />
                  </div>
                  <div style={{ fontSize: 11.5, color: t.sub, lineHeight: 1.5 }}>“{r.text}”</div>
                </div>
              ))}
              <div style={{ fontSize: 9, color: t.sub, fontStyle: "italic", marginTop: 2 }}>Reseñas de ejemplo.</div>
            </div>
          )}

          {/* Botones */}
          <button
            onClick={() => { if (cp.price === 0) confirmChange(cp.id); else setPayHint(true); }}
            style={{
              width: "100%", marginTop: 18, padding: "13px 0", borderRadius: 14, border: "none",
              background: cp.gold ? "linear-gradient(135deg, #F5C451, #E0A93E)" : (cp.highlight ? "#9B6DFF" : (cp.id === "free" ? "#22C55E" : t.text)),
              color: cp.gold ? "#3D2B00" : (cp.id === "free" || cp.highlight ? "#fff" : t.bg),
              fontSize: 14, fontWeight: 800, cursor: "pointer",
            }}
          >
            {cp.price === 0 ? "Cambiar a ORUS Free" : `Continuar con ${cp.name}`}
          </button>
          <button
            onClick={closeConfirm}
            style={{ width: "100%", marginTop: 10, padding: "11px 0", borderRadius: 14, border: `1.5px solid ${t.border}`, background: "transparent", color: t.sub, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Cancelar
          </button>
          {cp.price !== 0 && !payHint && (
            <div style={{ fontSize: 10, color: t.sub, textAlign: "center", marginTop: 10, paddingBottom: 10, lineHeight: 1.5 }}>
              🔒 El pago se procesará de forma segura por tu tienda (App Store / Google Play). Cancela cuando quieras.
            </div>
          )}
          {cp.price !== 0 && payHint && (
            <div style={{ fontSize: 11.5, color: t.text, textAlign: "center", marginTop: 12, paddingBottom: 10, lineHeight: 1.5, background: "#9B6DFF18", border: `1px solid #9B6DFF55`, borderRadius: 12, padding: 12 }}>
              🔒 Aquí se abrirá el pago de tu tienda (App Store / Google Play).
              <br /><b style={{ color: "#9B6DFF" }}>Próximamente.</b>
            </div>
          )}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      key="plan-list"
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
          const isOpen = expanded === p.id;
          const isCurrent = currentPlan === p.id;
          const border = p.highlight ? "#9B6DFF" : t.border;
          return (
            <div
              key={p.id}
              className="reveal"
              onClick={() => toggle(p.id)}
              style={{
                background: t.card,
                border: `${p.highlight ? 2 : 1}px solid ${border}`,
                borderRadius: 16,
                padding: 16,
                marginTop: 14,
                transitionDelay: `${i * 0.1}s`,
                position: "relative",
                cursor: "pointer",
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
                  {p.id === "free" ? <DonutIcon size={26} /> : p.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <b style={{ fontSize: 16, color: t.text }}>{p.name}</b>
                    {p.badge && (
                      <span style={{ fontSize: 9, fontWeight: 800, color: "#5A3E00", background: "linear-gradient(135deg, #F5C451, #E0A93E)", padding: "2px 8px", borderRadius: 8, letterSpacing: 0.3, boxShadow: "0 1px 4px rgba(224,169,62,0.45)" }}>✦ {p.badge}</span>
                    )}
                    {isCurrent && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#22C55E", background: "#22C55E22", padding: "1px 7px", borderRadius: 8 }}>PLAN ACTUAL</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11.5, color: t.sub, lineHeight: 1.45, marginTop: 2 }}>{p.tagline}</div>
                </div>
                {/* Flechita para desplegar */}
                <span style={{ flexShrink: 0, marginTop: 2, color: t.sub, transition: "transform 0.25s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-flex" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>

              {/* Precio */}
              <div style={{ marginTop: 12, marginBottom: 4 }}>
                {p.price === 0 ? (
                  <span style={{ fontSize: 24, fontWeight: 800, color: t.text }}>Gratis</span>
                ) : (
                  <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: t.text }}>${p.price}</span>
                    <span style={{ fontSize: 12, color: t.sub, fontWeight: 600 }}>USD/mes</span>
                    <span style={{ fontSize: 10, color: t.sub, marginLeft: 6 }}>{cop(p.price)}</span>
                  </span>
                )}
              </div>

              {/* Lista de beneficios (solo si está desplegada) */}
              {isOpen && (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 12, lineHeight: 1.4, flexShrink: 0, color: f.ok ? "#22C55E" : "#FCA5A5", fontWeight: 700 }}>
                        {f.ok ? "✓" : "✕"}
                      </span>
                      <span style={{ fontSize: 12, lineHeight: 1.4, color: f.ok ? (f.muted ? t.sub : t.text) : t.sub, opacity: f.ok ? 1 : 0.6 }}>
                        {f.t}
                        {f.note && <span style={{ color: t.sub, fontStyle: "italic" }}> — {f.note}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón de acción (no expande la tarjeta) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCurrent) return;
                  setPayHint(false);
                  setConfirming(p.id); // abre la pantalla de confirmación
                }}
                style={{
                  width: "100%", marginTop: 14, padding: "11px 0", borderRadius: 12,
                  border: isCurrent ? `1.5px solid ${t.border}` : "none",
                  background: isCurrent ? "transparent" : (p.gold ? "linear-gradient(135deg, #F5C451, #E0A93E)" : (p.highlight ? "#9B6DFF" : t.text)),
                  color: isCurrent ? t.sub : (p.gold ? "#3D2B00" : (p.highlight ? "#fff" : t.bg)),
                  fontSize: 13.5, fontWeight: p.gold ? 800 : 700, cursor: isCurrent ? "default" : "pointer",
                  boxShadow: !isCurrent && p.gold ? "0 2px 10px rgba(224,169,62,0.4)" : "none",
                }}
              >
                {isCurrent ? "Tu plan actual" : `Elegir ${p.name}`}
              </button>
            </div>
          );
        })}

        {selected && (
          <div style={{ fontSize: 11, color: t.sub, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
            {selected === "free"
              ? <>Cambiaste tu plan a <b style={{ color: "#22C55E" }}>ORUS Free</b>.</>
              : <>✅ Tu plan es ahora <b style={{ color: "#9B6DFF" }}>{PLANS.find((x) => x.id === selected).name}</b>. <span style={{ fontStyle: "italic" }}>El cobro real se activará próximamente.</span></>}
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
