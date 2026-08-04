import { useEffect, useRef, useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { userStorage } from "../utils/userStorage";
import { DARK, LIGHT } from "../constants/tokens";
import DonutChart from "./DonutChart";

const USD_TO_COP = 3300;
const cop = (usd) => "≈ $" + Math.round((usd * USD_TO_COP) / 100) * 100 + " COP/mes";

// Donut real de ORUS (mismo del login)
function DonutIcon({ size = 18 }) {
  const segments = [
    { color: "#93C5FD", start: 0, pct: 30 },
    { color: "#FCA5A5", start: 30, pct: 20 },
    { color: "#86EFAC", start: 50, pct: 15 },
    { color: "#C4B5FD", start: 65, pct: 20 },
    { color: "#FDE68A", start: 85, pct: 15 },
  ];

  const paths = segments.map((seg) => {
    const startAngle = (seg.start * 360) / 100 - 90;
    const endAngle = ((seg.start + seg.pct) * 360) / 100 - 90;
    const rad1 = (startAngle * Math.PI) / 180;
    const rad2 = (endAngle * Math.PI) / 180;
    const cx = size / 2, cy = size / 2, r = size / 2 - 2;
    const x1 = cx + r * Math.cos(rad1);
    const y1 = cy + r * Math.sin(rad1);
    const x2 = cx + r * Math.cos(rad2);
    const y2 = cy + r * Math.sin(rad2);
    const large = seg.pct > 50 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {segments.map((seg, i) => (
        <path key={i} d={paths[i]} fill={seg.color} />
      ))}
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
      { t: "Hasta 10 movimientos al día — desbloquea +5 viendo un anuncio", ok: true, highlight: true },
      { t: "Categorías y presupuestos básicos", ok: true },
      { t: "Con anuncios", ok: true },
      { t: "Lectura automática (correo / notificaciones)", ok: false },
      { t: "Asistente de IA", ok: false },
    ],
  },
  {
    id: "plus",
    name: "ORUS Plus",
    icon: "⭐",
    iconColor: "#F5B93D",
    tint: "#93C5FD",
    price: 2.99,
    tagline: "Que la app registre por ti. Sin escribir, sin anuncios.",
    highlight: true,
    accentColor: "#8B5CF6",
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
    accentColor: "#F5B93D",
    perks: ["Todo lo del plan Plus", "Asistente de IA para tus finanzas", "Informes automáticos con tips y alertas"],
    reviews: [
      { name: "Jorge T.", stars: 5, text: "El asistente de IA me dice en qué estoy gastando de más. Es como tener un contador en el bolsillo." },
      { name: "Natalia G.", stars: 5, text: "Comparto un workspace con mi novia para los gastos de la casa. Nos organizó la vida." },
      { name: "Simón A.", stars: 4, text: "Los informes anuales son oro para mi negocio. Ahora sé exactamente cómo me fue el año." },
    ],
    features: [
      { t: "Todo lo del plan Plus", ok: true },
      { t: "Asistente de IA: pregúntale sobre tus finanzas — hasta 100 consultas/mes", ok: true, highlight: true },
      { t: "Análisis inteligente de tus finanzas", ok: true },
      { t: "Informes mensuales y anuales completos", ok: true },
      { t: "Workspaces compartidos — pareja, amigos o tu negocio", ok: true, highlight: true },
      { t: "Categorización por IA (sin límite)", ok: true },
    ],
  },
];

export default function SubscriptionPage({ onBack }) {
  const { isDark } = useTheme();
  const pressBack = usePress();
  const pressContinue = usePress();
  const pressCancel = usePress();
  const containerRef = useRef(null);
  const [currentPlan, setCurrentPlan] = useState(() => userStorage.getSubscription().toLowerCase());
  const [expanded, setExpanded] = useState(() => userStorage.getSubscription().toLowerCase());
  const [confirming, setConfirming] = useState(null);

  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    text: tokens.text,
    sub: tokens.sub,
    muted: tokens.muted,
    surface: "linear-gradient(155deg,#211d2c 0%,#141220 100%)",
    raised: "linear-gradient(155deg,#262231 0%,#17151f 100%)",
    shadowLg: "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
    shadowSm: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [confirming]);

  const toggle = (id) => setExpanded((cur) => (cur === id ? null : id));

  // PANTALLA DE CONFIRMACIÓN
  const confirmPlan = confirming ? PLANS.find((x) => x.id === confirming) : null;
  if (confirmPlan) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#000000", fontFamily: "Manrope" }}>
        {/* Header fijo - Solo Botón Atrás */}
        <div style={{ padding: "20px 22px", borderBottom: "1px solid rgba(139,135,163,0.15)", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 8, flexShrink: 0, zIndex: 10 }}>
          <button
            onClick={() => setConfirming(null)}
            {...pressBack.handlers}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: "#8B87A3",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              padding: "6px 0",
              fontFamily: "Manrope",
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Atrás
          </button>
        </div>

        {/* Contenido scrollable */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 50px", boxSizing: "border-box" }}>

        {/* TÍTULO CON GRADIENTE */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 0, marginBottom: 18 }}>
          <span style={{ fontSize: 14 }}>💎</span>
          <span style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.3px",
            textTransform: "uppercase",
            background: "linear-gradient(90deg,#7DD3FC,#B18CFF)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Confirmar Plan
          </span>
        </div>

        <style>{`
          .reveal{opacity:0;transform:translateY(26px);transition:opacity .5s ease, transform .5s ease;}
          .reveal.in{opacity:1;transform:none;}
        `}</style>

        <div ref={containerRef}>
          {/* TARJETA RESUMEN */}
          <div className="reveal" style={{
            marginTop: 18,
            borderRadius: 20,
            background: t.surface,
            border: `1.5px solid ${confirmPlan.accentColor}`,
            boxShadow: t.shadowLg,
            padding: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: t.raised, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 32, color: confirmPlan.iconColor || "inherit" }}>{confirmPlan.icon}</span>
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: "14.5px", fontWeight: 800, color: t.text }}>{confirmPlan.name}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.sub, marginTop: 2, lineHeight: 1.3 }}>{confirmPlan.tagline}</div>
              </div>
            </div>

            {/* PRECIO */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: t.text }}>${confirmPlan.price}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.sub }}>USD/mes</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#5F5C74" }}>{cop(confirmPlan.price)}</span>
            </div>
          </div>

          {/* LO QUE OBTIENES */}
          <div className="reveal" style={{ marginTop: 22, transitionDelay: "0.08s" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 800, color: t.text, marginBottom: 10 }}>Lo que obtienes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {confirmPlan.perks.map((perk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#86EFAC" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ fontSize: "12.5px", fontWeight: 600, color: t.text }}>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RESEÑAS */}
          <div className="reveal" style={{ marginTop: 22, transitionDelay: "0.16s" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 800, color: t.text, marginBottom: 10 }}>Lo que dicen quienes lo usan</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {confirmPlan.reviews.map((r, i) => (
                <div key={i} className="reveal" style={{
                  padding: "13px 14px",
                  borderRadius: 16,
                  background: t.surface,
                  boxShadow: t.shadowSm,
                  transitionDelay: `${0.22 + i * 0.1}s`,
                }}>
                  <div style={{ display: "flex", alignItems: "center",  }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 800, color: t.text }}>{r.name}</span>
                    <span style={{ fontSize: 11, color: "#F5B93D", letterSpacing: 1 }}>
                      {"★".repeat(r.stars)}<span style={{ opacity: 0.3 }}>{"★".repeat(5 - r.stars)}</span>
                    </span>
                  </div>
                  <div style={{ fontSize: "11.5px", fontWeight: 600, color: t.sub, marginTop: 6, lineHeight: 1.5 }}>
                    "{r.text}"
                  </div>
                </div>
              ))}
              <div style={{ fontSize: "9.5px", fontWeight: 600, color: "#5F5C74", marginTop: 8 }}>Reseñas de ejemplo.</div>
            </div>
          </div>

          {/* BOTONES */}
          <button
            className="reveal"
            onClick={() => setConfirming(null)}
            {...pressContinue.handlers}
            style={{
              width: "100%",
              padding: 15,
              borderRadius: 16,
              border: "none",
              fontSize: "13.5px",
              fontWeight: 800,
              marginTop: 22,
              fontFamily: "Manrope",
              cursor: "pointer",
              background: confirmPlan.id === "plus" ? "linear-gradient(155deg,#B18CFF,#8B5CF6)" : "linear-gradient(155deg,#FBBF54,#F5B93D)",
              color: confirmPlan.id === "plus" ? "#fff" : "#241a02",
              transitionDelay: "0.5s",
              ...pressContinue.getPressStyle({ scale: 0.97 }),
            }}>
            Continuar con {confirmPlan.name}
          </button>

          <button
            className="reveal"
            onClick={() => setConfirming(null)}
            {...pressCancel.handlers}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 16,
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              marginTop: 10,
              fontFamily: "Manrope",
              cursor: "pointer",
              background: t.raised,
              color: t.sub,
              transitionDelay: "0.56s",
            }}>
            Cancelar
          </button>

          {/* FOOTER */}
          <div className="reveal" style={{ fontSize: 10, fontWeight: 600, color: "#5F5C74", marginTop: 16, lineHeight: 1.5, textAlign: "center", transitionDelay: "0.62s" }}>
            🔒 El pago se procesará de forma segura por tu tienda (App Store / Google Play). Cancela cuando quieras.
          </div>
        </div>
        </div>
      </div>
    );
  }

  // PANTALLA DE LISTA DE PLANES
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#000000", fontFamily: "Manrope" }}>
      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l3 6-9 12L3 9z" />
            <path d="M9 3l3 6 3-6M3 9h18" />
          </svg>
        }
        pageTitle="Mi Plan"
        isDark={true}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 50px", boxSizing: "border-box" }}>

      {/* SUBTÍTULO */}
      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#8B87A3", textAlign: "center", lineHeight: 1.5, marginTop: 0 }}>
        Elige el plan que se ajuste a ti. Puedes empezar gratis y cambiar cuando quieras.
      </div>

      {/* TARJETAS DE PLAN */}
      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
        <style>{`
          .reveal{opacity:0;transform:translateY(26px);transition:opacity .5s ease, transform .5s ease;}
          .reveal.in{opacity:1;transform:none;}
        `}</style>

        {PLANS.map((p, i) => {
          const isOpen = expanded === p.id;
          const isCurrent = currentPlan === p.id;

          let borderStyle = "1px solid rgba(255,255,255,0.07)";
          if (p.id === "plus") borderStyle = "1.5px solid #8B5CF6";
          if (p.id === "pro") borderStyle = "1.5px solid rgba(245,185,61,0.5)";

          return (
            <div
              key={p.id}
              className="reveal"
              onClick={() => toggle(p.id)}
              style={{
                borderRadius: 22,
                background: t.surface,
                boxShadow: t.shadowLg,
                padding: isOpen && (p.highlight || p.gold) ? "20px 18px 18px" : "18px",
                position: "relative",
                cursor: "pointer",
                border: borderStyle,
                transitionDelay: `${i * 0.1}s`,
              }}>
              {/* TAG FLOTANTE */}
              {p.highlight && (
                <span style={{ position: "absolute", top: -11, left: 18, background: "#8B5CF6", color: "#fff", fontSize: "9.5px", fontWeight: 800, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" }}>
                  MÁS POPULAR
                </span>
              )}
              {p.gold && (
                <span style={{ position: "absolute", top: -11, left: 18, background: "#F5B93D", color: "#fff", fontSize: "9.5px", fontWeight: 800, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" }}>
                  + MÁS COMPLETO
                </span>
              )}

              {/* HEADER PLAN */}
              <div style={{ display: "flex", alignItems: "center", gap: 12,  }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  {/* ÍCONO */}
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: t.raised, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", pointerEvents: "none" }}>
                    {p.id === "free" ? (
                      <div style={{ position: "relative", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                        <DonutChart
                          segments={[
                            { id: "fijos", label: "Fijos", color: "#93C5FD", pct: 35 },
                            { id: "deuda", label: "Deuda", color: "#FCA5A5", pct: 15 },
                            { id: "ahorro", label: "Ahorro", color: "#86EFAC", pct: 20 },
                            { id: "ocio", label: "Ocio", color: "#C4B5FD", pct: 15 },
                            { id: "varios", label: "Varios", color: "#FDE68A", pct: 15 },
                          ]}
                          cx={20}
                          cy={20}
                          outerR={15}
                          innerR={12}
                          activeId={null}
                          onSelect={() => {}}
                          isDark={isDark}
                          total={0}
                          totalSpent={0}
                          pillarSpends={{}}
                          hasSaldoAsignado={false}
                          saldoValue={0}
                          selectedPeriod={null}
                          showCenterText={false}
                        />
                        <div style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                          fontSize: 6,
                          fontWeight: 800,
                          color: "#F0EEFF",
                          letterSpacing: 0.3,
                        }}>
                          ORUS
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 32, color: p.iconColor || "inherit" }}>{p.icon}</span>
                    )}
                  </div>

                  {/* NOMBRE + BADGE */}
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14.5px", fontWeight: 800, color: t.text }}>{p.name}</span>
                      {isCurrent && (
                        <span style={{ fontSize: "8.5px", fontWeight: 800, color: "#86EFAC", background: "rgba(134,239,172,0.16)", padding: "2px 8px", borderRadius: 8 }}>
                          PLAN ACTUAL
                        </span>
                      )}
                    </div>
                    {/* TAGLINE */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: t.sub, marginTop: 2, lineHeight: 1.3 }}>
                      {p.tagline}
                    </div>
                  </div>
                </div>

                {/* CHEVRON */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: t.sub,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                    flexShrink: 0,
                  }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {/* CONTENIDO EXPANDIDO */}
              {isOpen && (
                <>
                  {/* PRECIO */}
                  <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 8, textAlign: "left" }}>
                    {p.price === 0 ? (
                      <span style={{ fontSize: 28, fontWeight: 800, color: t.text }}>Gratis</span>
                    ) : (
                      <>
                        <span style={{ fontSize: 28, fontWeight: 800, color: t.text }}>${p.price}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.sub }}>USD/mes</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#5F5C74" }}>{cop(p.price)}</span>
                      </>
                    )}
                  </div>

                  {/* FEATURES */}
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9, textAlign: "left" }}>
                    {p.features.map((f, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        {f.ok ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#86EFAC" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E4574B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                            <path d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        )}
                        <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontStyle: f.highlight ? "italic" : "normal" }}>
                          {f.t}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* BOTÓN CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirming(p.id);
                    }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 16,
                      border: "none",
                      fontSize: "13.5px",
                      fontWeight: 800,
                      marginTop: 16,
                      fontFamily: "Manrope",
                      cursor: p.id === "free" ? "default" : "pointer",
                      background: p.id === "free" ? t.raised : p.id === "plus" ? "linear-gradient(155deg,#B18CFF,#8B5CF6)" : "linear-gradient(155deg,#FBBF54,#F5B93D)",
                      color: p.id === "free" ? t.sub : p.id === "plus" ? "#fff" : "#241a02",
                      opacity: p.id === "free" ? 0.6 : 1,
                    }}>
                    {p.id === "free" ? "Tu plan actual" : `Elegir ${p.name}`}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div style={{ fontSize: 10, fontWeight: 600, color: "#5F5C74", textAlign: "center", marginTop: 18, lineHeight: 1.5 }}>
        Precios en USD. El valor en COP es una referencia y puede variar con la tasa de cambio. Cancela cuando quieras.
      </div>
      </div>
    </div>
  );
}
