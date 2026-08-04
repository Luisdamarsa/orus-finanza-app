import { useRef, useEffect } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { DARK, LIGHT } from "../constants/tokens";
import { PILLARS } from "../constants";

/**
 * Función auxiliar para generar arcos SVG del donut
 */
const arcPath = (cx, cy, r, startAngle, endAngle) => {
  const rad = ((startAngle - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad), y1 = cy + r * Math.sin(rad);
  const rad2 = ((endAngle - 90) * Math.PI) / 180;
  const x2 = cx + r * Math.cos(rad2), y2 = cy + r * Math.sin(rad2);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

/**
 * AboutPage.jsx — "Acerca de ORUS"
 * Página con información de ORUS, el donut, pilares, y tarjetas explicativas.
 */
export default function AboutPage({ onBack }) {
  const { isDark } = useTheme();
  const containerRef = useRef(null);

  // Tokens
  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    surface: isDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    raised: isDark ? "linear-gradient(155deg,#262231 0%,#17151f 100%)" : "linear-gradient(155deg,#f8f7fc 0%,#f0ecf8 100%)",
    text: tokens.text,
    sub: tokens.sub,
    muted: isDark ? "#6B6680" : "#A99FB8",
    accent: isDark ? "#9B6DFF" : "#7C4DFF",
    border: tokens.border,
    shadowSm: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(120,105,170,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
    danger: isDark ? "#FF8A8A" : "#E4574B",
    okGreen: isDark ? "#86EFAC" : "#16A34A",
  };

  // Reveal por scroll
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

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Header fijo */}
      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
        }
        pageTitle="Acerca de ORUS Finanzas"
        isDark={isDark}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 50px", boxSizing: "border-box" }}>
        <div ref={containerRef}>
        {/* Logo + Tagline + Descripción */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 1, background: "linear-gradient(155deg,#B18CFF,#8B5CF6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", marginBottom: 8 }}>
            ORUS
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 8 }}>Tus finanzas, claras y automáticas.</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.sub, lineHeight: 1.6 }}>
            Organiza tu dinero sin esfuerzo. ORUS lee tus movimientos, los clasifica con inteligencia artificial y te muestra, de un vistazo, en qué se te va y cuánto te queda.
          </div>
        </div>

        {/* Donut */}
        <div className="reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
          <svg width="270" height="270" viewBox="0 0 160 160" style={{ maxWidth: "100%" }}>
            {/* Arcos del donut con los porcentajes: Fijos 35%, Deuda 15%, Ahorro 20%, Ocio 15%, Varios 15% */}
            {/* Fijos 35% (0° - 126°) */}
            <path d={arcPath(80, 80, 50, 0, 126)} fill="none" stroke="#93C5FD" strokeWidth="16" strokeLinecap="round" />
            {/* Deuda 15% (126° - 180°) */}
            <path d={arcPath(80, 80, 50, 126, 180)} fill="none" stroke="#FCA5A5" strokeWidth="16" strokeLinecap="round" />
            {/* Ahorro 20% (180° - 252°) */}
            <path d={arcPath(80, 80, 50, 180, 252)} fill="none" stroke="#86EFAC" strokeWidth="16" strokeLinecap="round" />
            {/* Ocio 15% (252° - 306°) */}
            <path d={arcPath(80, 80, 50, 252, 306)} fill="none" stroke="#C4B5FD" strokeWidth="16" strokeLinecap="round" />
            {/* Varios 15% (306° - 360°) */}
            <path d={arcPath(80, 80, 50, 306, 360)} fill="none" stroke="#FDE68A" strokeWidth="16" strokeLinecap="round" />

            {/* Centro */}
            <circle cx="80" cy="80" r="32" fill={t.bg} />
            {/* Texto en el centro */}
            <text x="80" y="75" textAnchor="middle" style={{ fontSize: 9, fontWeight: 600, fill: t.sub }}>Gastado</text>
            <text x="80" y="92" textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: t.text }}>$8.200.000</text>
          </svg>
        </div>

        {/* Chips de pilares */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 28 }}>
          {[
            { name: "Fijos", color: "#93C5FD", bg: "rgba(147,197,253,0.16)" },
            { name: "Deuda", color: "#FCA5A5", bg: "rgba(252,165,165,0.16)" },
            { name: "Ahorro", color: "#86EFAC", bg: "rgba(134,239,172,0.16)" },
            { name: "Ocio", color: "#C4B5FD", bg: "rgba(196,181,253,0.16)" },
            { name: "Varios", color: "#FDE68A", bg: "rgba(253,230,138,0.16)" },
          ].map((pillar, idx) => (
            <span key={idx} style={{ padding: "5px 12px", borderRadius: 20, background: pillar.bg, color: pillar.color, fontSize: 10.5, fontWeight: 800, fontFamily: "Manrope, system-ui, sans-serif" }}>
              {pillar.name}
            </span>
          ))}
        </div>

        {/* "Un vistazo lo dice todo" */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 8 }}>Un vistazo lo dice todo.</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.sub, lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
            Tu gasto se reparte en <span style={{ color: t.text, fontWeight: 800 }}>pilares</span> para que veas al instante a dónde va el dinero.
          </div>
        </div>

        {/* Tarjeta 1: Todo lo que entra y sale */}
        <div className="reveal" style={{ borderRadius: 24, background: t.surface, boxShadow: t.shadowSm, padding: 16, marginTop: 20, marginBottom: 0, textAlign: "left" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15 }}>📄</span>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: t.text }}>Todo lo que entra y sale</span>
          </div>

          {/* Descripción */}
          <div style={{ fontSize: 11, fontWeight: 600, color: t.sub, marginTop: 4, lineHeight: 1.5 }}>
            Cada gasto e ingreso, agrupado por día y clarito.
          </div>

          {/* Filas de transacción */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {[
              { emoji: "🏠", bg: "rgba(147,197,253,0.16)", nombre: "Arriendo Apto 301", subtitulo: "Banco · Fijos", monto: "-$700.000", colorMonto: t.danger },
              { emoji: "🎲", bg: "rgba(253,230,138,0.16)", nombre: "Carrefour", subtitulo: "Tarjeta · Varios", monto: "-$105.000", colorMonto: t.danger },
              { emoji: "💚", bg: "rgba(134,239,172,0.16)", nombre: "Sueldo Empresa ABC", subtitulo: "Ingreso", monto: "+$2.700.000", colorMonto: t.okGreen },
            ].map((tx, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 13px", borderRadius: 14, background: t.raised, gap: 12 }}>
                {/* Badge + texto */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  {/* Badge ícono 32×32 */}
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: tx.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                    {tx.emoji}
                  </div>
                  {/* Nombre + subtítulo */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: t.text }}>{tx.nombre}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: t.sub, marginTop: 2 }}>{tx.subtitulo}</div>
                  </div>
                </div>
                {/* Monto a la derecha */}
                <div style={{ fontSize: 12.5, fontWeight: 800, color: tx.colorMonto, flexShrink: 0 }}>
                  {tx.monto}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta 2: Categorías y presupuestos */}
        <div className="reveal" style={{ borderRadius: 24, background: t.surface, boxShadow: t.shadowSm, padding: 16, marginTop: 0, marginBottom: 0, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, color: t.text }}>🏷️</span>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: t.text }}>Categorías y presupuestos</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.sub, marginTop: 4, lineHeight: 1.5 }}>Ponte límites por pilar y por categoría, y mira cómo vas mes a mes.</div>

          {/* Barras de presupuesto */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            {[
              { emoji: "🏠", nombre: "Fijos", porcentaje: 68, color: "#93C5FD" },
              { emoji: "💰", nombre: "Deuda", porcentaje: 70, color: "#FCA5A5" },
              { emoji: "🐷", nombre: "Ahorro", porcentaje: 82, color: "#86EFAC" },
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>{item.emoji}</span>
                <div style={{ width: 44, fontSize: 12, fontWeight: 700, color: t.text, flexShrink: 0 }}>{item.nombre}</div>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: t.border, overflow: "hidden" }}>
                  <div style={{ width: `${item.porcentaje}%`, height: "100%", background: item.color, transition: "width 0.3s ease" }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: item.color, flexShrink: 0 }}>{item.porcentaje}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta 3: IA + automatización */}
        <div className="reveal" style={{ borderRadius: 24, background: t.surface, boxShadow: t.shadowSm, padding: 16, marginTop: 0, marginBottom: 0, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, color: t.text }}>✨</span>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: t.text }}>IA + automatización</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.sub, lineHeight: 1.5, marginTop: 4 }}>
            Dile por voz <span style={{ color: t.text, fontWeight: 800 }}>"gasté 20 mil en el súper"</span>, o deja que ORUS lea la notificación de tu banco y cree el movimiento solo. La IA reconoce el comercio, el valor y el pilar. Tú no haces nada.
          </div>

          {/* Mockup de flujo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
            {/* Círculo con micrófono SVG */}
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(155deg,#B18CFF,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            {/* Flecha */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            {/* Chip resultado */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 14, border: `1.5px solid ${t.okGreen}`, background: "rgba(134,239,172,0.1)", color: t.okGreen, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800 }}>Súper</span>
              <span style={{ fontSize: 12, fontWeight: 800 }}>-$20.000</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Finanzas compartidas */}
        <div className="reveal" style={{ borderRadius: 24, background: t.surface, boxShadow: t.shadowSm, padding: 16, marginTop: 0, marginBottom: 28, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, color: t.text }}>👥</span>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: t.text }}>Finanzas compartidas</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.sub, lineHeight: 1.6, marginTop: 6 }}>
            Workspaces para pareja, roomies o amigos: lleven las cuentas juntos, cada quien aporta sus movimientos.
          </div>
        </div>

          {/* Footer */}
          <div className="reveal" style={{ textAlign: "center", paddingBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 12 }}>Menos esfuerzo. Más claridad.</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.muted }}>ORUS Finanzas · v1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
