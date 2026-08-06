import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { DARK, LIGHT } from "../constants/tokens";

/**
 * OnboardingPage.jsx — Onboarding 4 slides
 * Exactamente igual al diseño de Claude Design
 */

const PILLARS = [
  { name: "Fijos", color: "#93C5FD", softBg: "rgba(147,197,253,0.16)", normPct: 42 },
  { name: "Deuda", color: "#FCA5A5", softBg: "rgba(252,165,165,0.16)", normPct: 18 },
  { name: "Ahorro", color: "#86EFAC", softBg: "rgba(134,239,172,0.16)", normPct: 12 },
  { name: "Ocio", color: "#C4B5FD", softBg: "rgba(196,181,253,0.16)", normPct: 15 },
  { name: "Varios", color: "#FDE68A", softBg: "rgba(253,230,138,0.16)", normPct: 13 },
];

const DONUT_SEGMENTS = [
  { color: "#93C5FD", pct: 42 },
  { color: "#FCA5A5", pct: 18 },
  { color: "#86EFAC", pct: 12 },
  { color: "#C4B5FD", pct: 15 },
  { color: "#FDE68A", pct: 13 },
];

// Calcular dashArray y dashOffset para el donut
function getDonutSegments() {
  const circumference = 2 * Math.PI * 86; // radio 86
  let currentOffset = 0;

  return DONUT_SEGMENTS.map((seg) => {
    const dashLength = (seg.pct / 100) * circumference;
    const dashOffset = -currentOffset;
    currentOffset += dashLength;

    return {
      ...seg,
      dashArray: `${dashLength} ${circumference}`,
      dashOffset,
    };
  });
}

export default function OnboardingPage({ setScreen }) {
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    text: tokens.text,
    sub: tokens.sub,
    accent: isDark ? "#9B6DFF" : "#7C4DFF",
    accentSoft: isDark ? "rgba(155,109,255,0.2)" : "rgba(124,77,255,0.15)",
    danger: isDark ? "#FF8A8A" : "#EF4444",
    surface: isDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    raised: isDark ? "linear-gradient(155deg,#262231 0%,#17151f 100%)" : "linear-gradient(155deg,#f8f7fc 0%,#f0ecf8 100%)",
    shadowSm: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
    shadow: isDark ? "0 14px 24px rgba(0,0,0,0.35)" : "0 14px 24px rgba(0,0,0,0.15)",
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const donutSegments = getDonutSegments();
  const isLastSlide = currentSlide === 3;

  const handleNext = () => {
    if (currentSlide < 3) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setScreen("login");
    }
  };

  const handleSkip = () => {
    setScreen("login");
  };

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      padding: "22px 26px 0",
      background: t.bg,
      fontFamily: "Manrope, system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* Botón Skip */}
      <div style={{ display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
        <button
          onClick={handleSkip}
          style={{
            background: "none",
            border: "none",
            color: t.sub,
            fontWeight: 700,
            fontSize: "12.5px",
            cursor: "pointer",
            padding: "6px 4px",
            fontFamily: "Manrope",
          }}
        >
          Saltar
        </button>
      </div>

      {/* Contenido scrollable */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "8px 12px",
        scrollbarWidth: "none",
        boxSizing: "border-box",
      }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* SLIDE 0: Automatizaciones inteligentes */}
        {currentSlide === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            {/* Ícono - arriba fijo */}
            <div style={{ paddingTop: 48 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent, flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>
                </svg>
              </div>
            </div>

            {/* Contenido - centrado en la mitad */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
              {/* Tarjetas separadas (sin sobreposición) */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              {/* Tarjeta arriba (notificación banco) */}
              <div style={{
                width: 200,
                padding: "11px 13px",
                borderRadius: 18,
                background: t.surface,
                boxShadow: t.shadow,
                transform: "rotate(-4deg)",
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, background: t.raised, display: "flex", alignItems: "center", justifyContent: "center", color: t.sub, flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10l8-6 8 6M5 10v9h14v-9"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "9.5px", fontWeight: 700, color: t.sub }}>Notificación · Banco</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: t.text, marginTop: 2 }}>Luz EPM · -$60.000</div>
                </div>
              </div>

              {/* Flecha conectora */}
              <div style={{ color: t.accent }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>

              {/* Tarjeta abajo (transacción completada) */}
              <div style={{
                width: 190,
                padding: "12px 13px",
                borderRadius: 18,
                background: t.surface,
                boxShadow: t.shadow,
                transform: "rotate(3deg)",
              }}>
                <div style={{ fontSize: "8.5px", fontWeight: 800, letterSpacing: "0.6px", color: t.accent, textAlign: "center" }}>NUEVA TRANSACCIÓN</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 7 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: t.danger }}>-$60.000</div>
                  <div style={{ display: "flex", borderRadius: 9, overflow: "hidden" }}>
                    <div style={{ width: 17, height: 17, background: "rgba(239,68,68,0.22)", color: t.danger, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>–</div>
                    <div style={{ width: 17, height: 17, background: t.raised, color: t.sub, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>+</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                  {["Llave", "Banco", "Tarjeta"].map((label, i) => (
                    <span key={i} style={{
                      flex: label === "Banco" ? 1.2 : 1,
                      padding: "4px 3px",
                      borderRadius: 10,
                      background: label === "Banco" ? "rgba(245,158,11,0.18)" : t.raised,
                      color: label === "Banco" ? "#F59E0B" : t.sub,
                      fontSize: "7.5px",
                      fontWeight: label === "Banco" ? 800 : 700,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}>
                      {label}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, padding: "6px 10px", borderRadius: 11, border: `1px dashed ${t.accent}`, background: t.accentSoft }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: t.text }}>Servicios</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 9l7 7 7-7"/>
                  </svg>
                </div>
                <div style={{ fontSize: "7px", fontWeight: 700, color: t.sub, marginTop: 8, letterSpacing: "0.3px" }}>PILAR</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 3, marginTop: 4 }}>
                  {[
                    { icon: "🏠", color: "#93C5FD", isActive: true },
                    { icon: "💰", color: "#FCA5A5", isActive: false },
                    { icon: "🐖", color: "#86EFAC", isActive: false },
                    { icon: "✨", color: "#C4B5FD", isActive: false },
                    { icon: "🎲", color: "#FDE68A", isActive: false },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      padding: "4px 0",
                      borderRadius: 9,
                      border: item.isActive ? `1.5px solid ${item.color}` : `1.5px solid transparent`,
                      background: item.isActive ? `rgba(147,197,253,0.12)` : t.raised,
                      fontSize: 10,
                    }}>
                      {item.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>

            {/* Texto - abajo fijo */}
            <div style={{ textAlign: "center", paddingBottom: 12 }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: t.text }}>Automatizaciones inteligentes</div>
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: t.sub, marginTop: 8, lineHeight: 1.5, padding: "0 6px" }}>
                Lee tus notificaciones de pagos y bancos, y llena la transacción por ti: descripción, monto y categoría, listas para confirmar.
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 1: Tus gastos en pilares */}
        {currentSlide === 1 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            {/* Ícono - arriba fijo */}
            <div style={{ paddingTop: 48 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent, flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>
                </svg>
              </div>
            </div>

            {/* Contenido - centrado en la mitad */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: 14 }}>

            {/* Donut */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="200" height="200" viewBox="0 0 220 220" style={{ filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.35))" }}>
                <g transform="rotate(-90 110 110)">
                  {donutSegments.map((seg, i) => (
                    <circle
                      key={i}
                      cx="110"
                      cy="110"
                      r="86"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeDasharray={seg.dashArray}
                      strokeDashoffset={seg.dashOffset}
                    />
                  ))}
                </g>
              </svg>
              <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: t.sub }}>Gastado</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: t.text }}>$1.690.000</span>
              </div>
            </div>

            {/* Pilares */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              {PILLARS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", borderRadius: 14, background: p.softBg }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }}/>
                  <span style={{ fontSize: 12, fontWeight: 800, color: t.text, width: 56 }}>{p.name}</span>
                  <span style={{ fontSize: "10.5px", fontWeight: 600, color: t.sub }}>{p.normPct}% del total</span>
                </div>
              ))}
            </div>
            </div>

            {/* Texto - abajo fijo */}
            <div style={{ textAlign: "center", paddingBottom: 12 }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: t.text }}>Tus gastos, organizados en pilares</div>
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: t.sub, marginTop: 8, lineHeight: 1.5, padding: "0 6px" }}>
                Cada gasto cae en uno de 5 pilares. El donut te muestra de un vistazo en qué se está yendo tu dinero.
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: IA de ORUS */}
        {currentSlide === 2 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            {/* Ícono - arriba fijo */}
            <div style={{ paddingTop: 48 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent, flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3M9 21h6"/>
                </svg>
              </div>
            </div>

            {/* Contenido - centrado en la mitad */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: 14 }}>
              {/* Chat bubbles */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ alignSelf: "flex-end", maxWidth: "78%", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", background: "linear-gradient(155deg,#B18CFF,#8B5CF6)", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                Gasté 45.000 en el cine
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "82%", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: t.surface, boxShadow: t.shadowSm, fontSize: 12, fontWeight: 700, color: t.text, display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86EFAC" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                Registré $45.000 en Ocio → Cine / Planes
              </div>
              <div style={{ alignSelf: "flex-end", maxWidth: "78%", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", background: "linear-gradient(155deg,#B18CFF,#8B5CF6)", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                ¿Cómo van mis gastos de ocio?
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "82%", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: t.surface, boxShadow: t.shadowSm, fontSize: 12, fontWeight: 700, color: t.text }}>
                Vas en 53% de tu presupuesto de Ocio este mes 📊
              </div>
            </div>

            {/* FAB */}
            <div style={{ width: 40, height: 40, borderRadius: 14, background: "linear-gradient(155deg,#B18CFF,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 16px 28px -10px rgba(139,92,246,0.6)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3M9 21h6"/>
              </svg>
            </div>
            </div>

            {/* Texto - abajo fijo */}
            <div style={{ textAlign: "center", paddingBottom: 12 }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: t.text }}>Habla con la IA de ORUS</div>
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: t.sub, marginTop: 8, lineHeight: 1.5, padding: "0 6px" }}>
                Cuéntale un gasto por voz o texto y ella crea la transacción. Pregúntale por tus movimientos y arma informes automáticos que puedes imprimir o compartir.
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: Informes */}
        {currentSlide === 3 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            {/* Ícono - arriba fijo */}
            <div style={{ paddingTop: 48 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent, flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19h16M7 15v3M12 10v8M17 6v12"/>
                </svg>
              </div>
            </div>

            {/* Contenido - centrado en la mitad */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: 14 }}>
              {/* Tarjeta informe */}
            <div style={{ width: "100%", padding: 16, borderRadius: 20, background: "linear-gradient(155deg, #211d2c 0%, #141220 100%)", boxShadow: "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.4px", color: t.accent }}>INFORME · MAYO</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginTop: 10, lineHeight: 1.5 }}>
                Gastaste <span style={{ color: t.danger }}>$1.688.000</span> este mes, 12% menos que en abril.
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "10px 12px", borderRadius: 14, background: "rgba(134,239,172,0.12)" }}>
                <span style={{ fontSize: 14 }}>💡</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#86EFAC", lineHeight: 1.4 }}>Tip: Ahorraste $85.000 más que en julio — mantén este ritmo.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: "10px 12px", borderRadius: 14, background: "rgba(134,239,172,0.12)" }}>
                <span style={{ fontSize: 14 }}>💡</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#86EFAC", lineHeight: 1.4 }}>Tip: Tu gasto en Ocio bajó 22% vs trimestre anterior.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: "10px 12px", borderRadius: 14, background: "rgba(252,165,165,0.12)" }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#FCA5A5", lineHeight: 1.4 }}>Alerta: Deuda llegó a 78% de tu presupuesto este mes.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: "10px 12px", borderRadius: 14, background: "rgba(252,165,165,0.12)" }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#FCA5A5", lineHeight: 1.4 }}>Alerta: Fijos subieron $90.000 vs junio — revisa suscripciones.</span>
              </div>
            </div>
            </div>

            {/* Texto - abajo fijo */}
            <div style={{ textAlign: "center", paddingBottom: 12 }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: t.text }}>Informes con tips y alertas</div>
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: t.sub, marginTop: 8, lineHeight: 1.5, padding: "0 6px" }}>
                Elige informes mensuales, trimestrales o anuales — cada uno con su propia lectura de tus finanzas — y recibe tips y alertas cuando un pilar se salga de presupuesto.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer: puntos + botón */}
      <div style={{ flexShrink: 0, padding: "14px 0 26px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                border: "none",
                cursor: "pointer",
                height: 7,
                width: i === currentSlide ? 28 : 7,
                borderRadius: 4,
                background: t.accent,
                opacity: i === currentSlide ? 1 : 0.4,
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(155deg,#B18CFF,#8B5CF6)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 16px 28px -10px rgba(139,92,246,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
            fontFamily: "Manrope",
          }}
        >
          {isLastSlide ? "Comenzar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
