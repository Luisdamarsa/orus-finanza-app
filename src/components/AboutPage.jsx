import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";

/**
 * AboutPage.jsx — "Acerca de ORUS Finanzas".
 * Presenta la app (historia + características) con ilustraciones vivas (SVG/estilos propios)
 * y animaciones sutiles. Mismo formato que las demás (PageLayout). Extraída — ruteo en ScreenRouter.
 */
const DONUT_SEGMENTS = [
  { id: "fijos", color: "#93C5FD", pct: 30 },
  { id: "deuda", color: "#FCA5A5", pct: 20 },
  { id: "ahorro", color: "#86EFAC", pct: 15 },
  { id: "ocio", color: "#C4B5FD", pct: 20 },
  { id: "varios", color: "#FDE68A", pct: 15 },
];

const PILLARS_LEGEND = [
  ["Fijos", "#93C5FD"],
  ["Deuda", "#FCA5A5"],
  ["Ahorro", "#86EFAC"],
  ["Ocio", "#C4B5FD"],
  ["Varios", "#FDE68A"],
];

// Arco polar (mismo estilo del donut real: puntas redondeadas + gap entre segmentos)
function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function arcPath(cx, cy, r, startDeg, endDeg) {
  const [x1, y1] = polar(cx, cy, r, startDeg);
  const [x2, y2] = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export default function AboutPage({ isDark, onBack }) {
  const pressBack = usePress();
  const t = isDark
    ? { bg: "#000000", card: "#141420", border: "#23233a", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };
  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 14, marginTop: 14 };
  const h = (icon, txt) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <b style={{ fontSize: 13.5, color: t.text }}>{txt}</b>
    </div>
  );

  // Fila de movimiento con icono de pilar
  const movRow = (icon, tint, title, sub, amount, amountColor) => (
    <div style={{ background: tint + "14", border: `1px solid ${tint}33`, borderRadius: 10, padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: tint + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{icon}</div>
        <div><div style={{ fontSize: 11, fontWeight: 700, color: t.text }}>{title}</div><div style={{ fontSize: 9, color: t.sub }}>{sub}</div></div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: amountColor }}>{amount}</div>
    </div>
  );

  // Barra de presupuesto de pilar
  const budRow = (icon, name, pct, color, mt) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: mt }}>
      <span style={{ fontSize: 16 }}>{icon}</span><b style={{ fontSize: 11, color: t.text, minWidth: 44 }}>{name}</b>
      <div style={{ flex: 1, height: 8, borderRadius: 6, background: t.border, overflow: "hidden" }}><div style={{ width: pct + "%", height: "100%", background: color }} /></div>
      <span style={{ fontSize: 10, color: color, fontWeight: 700 }}>{pct}%</span>
    </div>
  );

  // Arcos del donut
  let cursor = 0;
  const arcs = DONUT_SEGMENTS.map((seg) => {
    const start = cursor;
    cursor += seg.pct * 3.6;
    return { ...seg, d: arcPath(90, 90, 70, start, cursor - 4) };
  });

  return (
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      pressBack={pressBack}
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 36 36" style={{ flexShrink: 0 }} aria-hidden="true">
            <g fill="none" strokeWidth="7" transform="rotate(-90 18 18)">
              <circle cx="18" cy="18" r="14" stroke="#93C5FD" strokeDasharray="26.4 87.9" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="14" stroke="#FCA5A5" strokeDasharray="17.6 87.9" strokeDashoffset="-26.4" />
              <circle cx="18" cy="18" r="14" stroke="#86EFAC" strokeDasharray="13.2 87.9" strokeDashoffset="-44.0" />
              <circle cx="18" cy="18" r="14" stroke="#C4B5FD" strokeDasharray="17.6 87.9" strokeDashoffset="-57.2" />
              <circle cx="18" cy="18" r="14" stroke="#FDE68A" strokeDasharray="13.2 87.9" strokeDashoffset="-74.8" />
            </g>
          </svg>
          ACERCA DE ORUS
        </span>
      }
    >
      <style>{`
        @keyframes orusRise{to{opacity:1;transform:translateY(0)}}
        @keyframes orusSegColor{to{stroke:var(--c)}}
        @keyframes orusPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        .orise{opacity:0;transform:translateY(14px);animation:orusRise .6s ease forwards;}
        .osegc{stroke:#3A3A4A;animation:orusSegColor .55s ease forwards;}
        .opulse{animation:orusPulse 1.8s ease-in-out infinite;}
      `}</style>

      {/* Portada */}
      <div className="orise" style={{ textAlign: "center", animationDelay: ".05s" }}>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 1, background: "linear-gradient(90deg,#9B6DFF,#4F8EF7)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>ORUS</div>
        <div style={{ fontSize: 14, color: t.text, fontWeight: 600, marginTop: 2 }}>Tus finanzas, claras y automáticas.</div>
        <div style={{ fontSize: 12.5, color: t.sub, lineHeight: 1.6, marginTop: 12 }}>
          Organiza tu dinero sin esfuerzo. ORUS lee tus movimientos, los clasifica con inteligencia
          artificial y te muestra, de un vistazo, en qué se te va y cuánto te queda.
        </div>
      </div>

      {/* Donut / pilares (se colorea segmento por segmento) */}
      <div className="orise" style={{ marginTop: 26, display: "flex", flexDirection: "column", alignItems: "center", animationDelay: ".18s" }}>
        <svg width={180} height={180} viewBox="0 0 180 180" role="img" aria-label="Donut de pilares">
          <g fill="none" strokeWidth={20} strokeLinecap="round">
            {arcs.map((a, i) => (
              <path key={a.id} className="osegc" d={a.d} style={{ "--c": a.color, animationDelay: `${0.3 + i * 0.12}s` }} />
            ))}
          </g>
          <text x="90" y="84" textAnchor="middle" fill={t.sub} fontSize="12" fontWeight="600">Gastado</text>
          <text x="90" y="106" textAnchor="middle" fill={t.text} fontSize="21" fontWeight="800">$1.688.000</text>
        </svg>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 6 }}>
          {PILLARS_LEGEND.map(([l, c]) => (
            <span key={l} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: c + "22", color: c }}>{l}</span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: t.sub, textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
          <b style={{ color: t.text }}>Un vistazo lo dice todo.</b> Tu gasto se reparte en <b>pilares</b> para que veas al instante a dónde se va el dinero.
        </div>
      </div>

      {/* Movimientos */}
      <div className="orise" style={{ ...card, animationDelay: ".3s" }}>
        {h("📃", "Todo lo que entra y sale")}
        <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.5, marginBottom: 4 }}>Cada gasto e ingreso, agrupado por día y clarito.</div>
        {movRow("🏠", "#93C5FD", "Arriendo Apto 301", "Banco · Fijos", "-$700.000", "#FCA5A5")}
        {movRow("🛒", "#FDE68A", "Carrefour", "Tarjeta · Varios", "-$105.000", "#FCA5A5")}
        {movRow("💚", "#22C55E", "Sueldo Empresa ABC", "Ingreso", "+$2.700.000", "#22C55E")}
      </div>

      {/* Categorías y presupuestos */}
      <div className="orise" style={{ ...card, animationDelay: ".42s" }}>
        {h("🏷️", "Categorías y presupuestos")}
        <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.5, marginBottom: 10 }}>Ponte límites por pilar y por categoría, y mira cómo vas mes a mes.</div>
        {budRow("🏠", "Fijos", 68, "#93C5FD", 0)}
        {budRow("💰", "Deuda", 70, "#FCA5A5", 8)}
        {budRow("🐖", "Ahorro", 82, "#86EFAC", 8)}
      </div>

      {/* IA + automatización */}
      <div className="orise" style={{ ...card, background: "#9B6DFF12", border: "1px solid #9B6DFF44", animationDelay: ".54s" }}>
        {h("✨", "IA + automatización")}
        <div style={{ fontSize: 11, color: t.text, lineHeight: 1.55 }}>
          Dile por <b>voz</b> "gasté 20 mil en el súper", o deja que ORUS <b>lea la notificación de tu banco</b>
          {" "}y cree el movimiento solo. La IA reconoce el comercio, el valor y el pilar. <b>Tú no haces nada.</b>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", justifyContent: "center" }}>
          <div className="opulse" style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 24px rgba(155,109,255,0.45)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none" />
              <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="8" y1="21" x2="16" y2="21" />
            </svg>
          </div>
          <span style={{ color: t.sub, fontSize: 18 }}>→</span>
          <div style={{ background: t.bg, border: "1.5px solid #86EFAC", borderRadius: 16, padding: "5px 10px", fontSize: 11, color: t.text, whiteSpace: "nowrap" }}>🛒 Súper · <b style={{ color: "#FCA5A5" }}>-$20.000</b></div>
        </div>
      </div>

      {/* Finanzas compartidas */}
      <div className="orise" style={{ ...card, animationDelay: ".66s" }}>
        {h("👥", "Finanzas compartidas")}
        <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.55 }}>Workspaces para pareja, roomies o amigos: lleven las cuentas juntos, cada quien aporta sus movimientos.</div>
      </div>

      {/* Cierre */}
      <div className="orise" style={{ textAlign: "center", marginTop: 22, paddingBottom: 10, animationDelay: ".78s" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Menos esfuerzo. Más claridad.</div>
        <div style={{ fontSize: 10.5, color: t.sub, marginTop: 6 }}>ORUS Finanzas · v1.0.0</div>
      </div>
    </PageLayout>
  );
}
