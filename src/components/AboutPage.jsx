import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";

/**
 * AboutPage.jsx — "Acerca de ORUS Finanzas".
 * Presenta la app (historia + características) con ilustraciones vivas (SVG/estilos propios)
 * y animaciones sutiles. Mismo formato que las demás (PageLayout). Extraída — ruteo en ScreenRouter.
 */
const PILLARS_LEGEND = [
  ["Fijos", "#93C5FD"],
  ["Deuda", "#FCA5A5"],
  ["Ahorro", "#86EFAC"],
  ["Ocio", "#C4B5FD"],
  ["Varios", "#FDE68A"],
];

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

  return (
    <PageLayout isDark={isDark} onBack={onBack} title="ACERCA DE ORUS" pressBack={pressBack}>
      <style>{`
        @keyframes orusRise{to{opacity:1;transform:translateY(0)}}
        @keyframes orusSeg{from{opacity:0;stroke-width:8}to{opacity:1;stroke-width:20}}
        @keyframes orusPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        .orise{opacity:0;transform:translateY(14px);animation:orusRise .6s ease forwards;}
        .oseg{opacity:0;animation:orusSeg .5s ease forwards;}
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

      {/* Donut / pilares */}
      <div className="orise" style={{ marginTop: 26, display: "flex", flexDirection: "column", alignItems: "center", animationDelay: ".18s" }}>
        <svg width={180} height={180} viewBox="0 0 180 180" role="img" aria-label="Donut de pilares">
          <g transform="rotate(-90 90 90)" fill="none" strokeWidth={20}>
            <circle className="oseg" style={{ animationDelay: ".30s" }} cx="90" cy="90" r="70" stroke="#93C5FD" strokeDasharray="131.9 439.8" strokeDashoffset="0" />
            <circle className="oseg" style={{ animationDelay: ".42s" }} cx="90" cy="90" r="70" stroke="#FCA5A5" strokeDasharray="87.9 439.8" strokeDashoffset="-131.9" />
            <circle className="oseg" style={{ animationDelay: ".54s" }} cx="90" cy="90" r="70" stroke="#86EFAC" strokeDasharray="65.9 439.8" strokeDashoffset="-219.8" />
            <circle className="oseg" style={{ animationDelay: ".66s" }} cx="90" cy="90" r="70" stroke="#C4B5FD" strokeDasharray="87.9 439.8" strokeDashoffset="-285.7" />
            <circle className="oseg" style={{ animationDelay: ".78s" }} cx="90" cy="90" r="70" stroke="#FDE68A" strokeDasharray="65.9 439.8" strokeDashoffset="-373.6" />
          </g>
          <text x="90" y="84" textAnchor="middle" fill={t.sub} fontSize="11">Gastado</text>
          <text x="90" y="104" textAnchor="middle" fill={t.text} fontSize="19" fontWeight="800">$1.688.000</text>
        </svg>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 6 }}>
          {PILLARS_LEGEND.map(([l, c]) => (
            <span key={l} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: c + "22", color: c }}>● {l}</span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: t.sub, textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
          <b style={{ color: t.text }}>Un vistazo lo dice todo.</b> Tu gasto se reparte en <b>pilares</b> para que veas al instante a dónde se va el dinero.
        </div>
      </div>

      {/* Movimientos */}
      <div className="orise" style={{ ...card, animationDelay: ".3s" }}>
        {h("📃", "Todo lo que entra y sale")}
        <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.5, marginBottom: 10 }}>Cada gasto e ingreso, agrupado por día y clarito.</div>
        <div style={{ background: "#FDE68A14", border: "1px solid #FDE68A33", borderRadius: 10, padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 11, fontWeight: 700, color: t.text }}>Carrefour</div><div style={{ fontSize: 9, color: t.sub }}>Tarjeta · Varios</div></div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#FCA5A5" }}>-$105.000</div>
        </div>
        <div style={{ background: "#22C55E14", border: "1px solid #22C55E33", borderRadius: 10, padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <div><div style={{ fontSize: 11, fontWeight: 700, color: t.text }}>Sueldo Empresa ABC</div><div style={{ fontSize: 9, color: t.sub }}>💚 Ingreso</div></div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#22C55E" }}>+$2.700.000</div>
        </div>
      </div>

      {/* Categorías y presupuestos */}
      <div className="orise" style={{ ...card, animationDelay: ".42s" }}>
        {h("🏷️", "Categorías y presupuestos")}
        <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.5, marginBottom: 10 }}>Ponte límites por pilar y por categoría, y mira cómo vas mes a mes.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🏠</span><b style={{ fontSize: 11, color: t.text, minWidth: 44 }}>Fijos</b>
          <div style={{ flex: 1, height: 8, borderRadius: 6, background: t.border, overflow: "hidden" }}><div style={{ width: "68%", height: "100%", background: "#93C5FD" }} /></div>
          <span style={{ fontSize: 10, color: "#93C5FD", fontWeight: 700 }}>68%</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 16 }}>🐖</span><b style={{ fontSize: 11, color: t.text, minWidth: 44 }}>Ahorro</b>
          <div style={{ flex: 1, height: 8, borderRadius: 6, background: t.border, overflow: "hidden" }}><div style={{ width: "82%", height: "100%", background: "#86EFAC" }} /></div>
          <span style={{ fontSize: 10, color: "#86EFAC", fontWeight: 700 }}>82%</span>
        </div>
      </div>

      {/* IA + automatización */}
      <div className="orise" style={{ ...card, background: "#9B6DFF12", border: "1px solid #9B6DFF44", animationDelay: ".54s" }}>
        {h("✨", "IA + automatización")}
        <div style={{ fontSize: 11, color: t.text, lineHeight: 1.55 }}>
          Dile por <b>voz</b> "gasté 20 mil en el súper", o deja que ORUS <b>lea la notificación de tu banco</b>
          {" "}y cree el movimiento solo. La IA reconoce el comercio, el valor y el pilar. <b>Tú no haces nada.</b>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", justifyContent: "center" }}>
          <div className="opulse" style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#9B6DFF,#4F8EF7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎤</div>
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
        <div style={{ fontSize: 10.5, color: t.sub, marginTop: 6 }}>ORUS Finanzas · Hecho en Colombia 🇨🇴</div>
      </div>
    </PageLayout>
  );
}
