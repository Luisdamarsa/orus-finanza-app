import { useState, useRef, useEffect } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { userStorage } from "../utils/userStorage";
import { DARK, LIGHT } from "../constants/tokens";

/**
 * ReportsPage.jsx — "Mis Informes"
 * Página para configurar informes automáticos (Mensual, Trimestral, Anual)
 * Tarjetas expandibles con toggle para activar/desactivar cada tipo de informe
 * Al final: botón "Mis Informes" que lleva al historial de informes
 */

const REPORTS = [
  {
    id: "monthly",
    icon: (color) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2"/>
        <path d="M3 10h18M8 3v4M16 3v4"/>
      </svg>
    ),
    name: "Mensual",
    description: "Informe de tu mes en números",
    color: "#93C5FD",
    tasks: [
      "✓ Resumen de ingresos vs gastos",
      "✓ Cumplimiento de presupuestos por pilar",
      "✓ Top 3 categorías de gasto",
      "✓ Comparativa vs meses anteriores",
      "✓ Alertas y recomendaciones personalizadas"
    ],
    benefits: "Revisa rápidamente qué pasó en tu mes y ajusta para el siguiente. Se genera automáticamente cada fin de mes.",
    frequency: "Se genera cada fin de mes automáticamente",
  },
  {
    id: "quarterly",
    icon: (color) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 20V10M12 20V4M19 20v-7"/>
      </svg>
    ),
    name: "Trimestral",
    description: "Análisis profundo de tu trimestre",
    color: "#FCA5A5",
    tasks: [
      "✓ Tendencias de gasto en 3 meses",
      "✓ Patrones de comportamiento financiero",
      "✓ Desempeño vs presupuesto anual",
      "✓ Comparativa con trimestres anteriores",
      "✓ Oportunidades de ahorro identificadas"
    ],
    benefits: "Ve el cuadro más grande de tu salud financiera. Detecta patrones que los informes mensuales no muestran.",
    frequency: "Se genera cada fin de trimestre automáticamente",
    recommended: true,
  },
  {
    id: "annual",
    icon: (color) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="5"/>
        <circle cx="12" cy="12" r="1" fill={color}/>
      </svg>
    ),
    name: "Anual",
    description: "Tu año financiero resumido",
    color: "#86EFAC",
    tasks: [
      "✓ Visión completa de tu año (12 meses)",
      "✓ Cumplimiento de metas de ahorro",
      "✓ Evolución mes a mes en gráficos",
      "✓ Categorización anual de gastos",
      "✓ Resumen ejecutivo de tu desempeño"
    ],
    benefits: "Perfecto para reflejos de fin de año y declaración de impuestos. Entiende exactamente cómo te fue el año.",
    frequency: "Se genera cada fin de año automáticamente",
  },
];

export default function ReportsPage({ onBack, onNavigate }) {
  // 🆕 Tema desde ThemeContext
  const { isDark } = useTheme();

  const pressBack = usePress();
  const pressViewReports = usePress();
  const containerRef = useRef(null);
  const descriptionRef = useRef(null);
  const [contentTopOffset, setContentTopOffset] = useState(164);

  // Estado para reports activados (desde localStorage)
  const [enabledReports, setEnabledReports] = useState(() => {
    const saved = userStorage.get("enabledReports") || { monthly: true, quarterly: true, annual: true };
    return saved;
  });

  // Estado para tarjetas expandidas (abierta: "monthly" por default)
  const [expanded, setExpanded] = useState("monthly");

  // Guardar cambios en localStorage
  useEffect(() => {
    userStorage.set("enabledReports", enabledReports);
  }, [enabledReports]);

  // Calcular contentTopOffset dinámicamente basado en altura de descripción
  useEffect(() => {
    if (descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.offsetHeight;
      const newContentTop = 164 + descriptionHeight + 6;
      setContentTopOffset(newContentTop);
    }
  }, []);

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

  // 🆕 Tokens del design (Spatial UI + Claymorfismo)
  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    card: tokens.surfaceFlat,
    border: tokens.border,
    text: tokens.text,
    sub: tokens.sub,
  };

  const toggle = (id) => setExpanded((cur) => (cur === id ? null : id));
  const toggleReport = (id) => setEnabledReports((cur) => ({ ...cur, [id]: !cur[id] }));

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 20V10M12 20V4M19 20v-7" />
          </svg>
        }
        pageTitle="Informes"
        isDark={isDark}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 90px", boxSizing: "border-box" }}>

      {/* Descripción */}
      <div ref={descriptionRef} style={{ fontSize: 12, color: t.sub, lineHeight: 1.5, textAlign: "center", marginBottom: 22, marginTop: 0 }}>
        Elige el período que se ajuste a ti. Puedes cambiar cuando quieras.
      </div>

      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: "100%" }}>
        {/* Contenedor de tarjetas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {/* Tarjetas de reportes */}
          {REPORTS.map((report) => (
          <div
            key={report.id}
            className="reveal"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
            onAnimationEnd={(e) => {
              if (e.animationName === "orus-rise") {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <style>{`
              .reveal.in {
                animation: orus-rise 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }
              @keyframes orus-rise {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            {/* Tarjeta colapsada/expandida - UN SOLO DIV */}
            <div
              onClick={() => toggle(report.id)}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.98)";
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.opacity = "1";
              }}
              style={{
                background: tokens.surfaceFlat || t.card,
                border: `1.5px solid ${report.color}`,
                borderRadius: 20,
                padding: "16px 16px 18px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: expanded === report.id ? "column" : "row",
                alignItems: expanded === report.id ? "flex-start" : "center",
                gap: 12,
                overflow: "hidden",
                boxShadow: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
              }}
            >
              {/* Header - siempre visible */}
              <div style={{ display: "flex", gap: 12, width: "100%" }}>
                {/* Icono badge */}
                <div style={{ width: 38, height: 38, borderRadius: 12, background: `${report.color}26`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: report.color }}>
                  {typeof report.icon === "function" ? report.icon(report.color) : report.icon}
                </div>

                {/* Nombre + Descripción */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: t.text }}>{report.name}</span>
                    {report.recommended && (
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 800,
                          color: "#B18CFF",
                          background: "rgba(139,92,246,0.22)",
                          padding: "2px 8px",
                          borderRadius: 8,
                          textTransform: "uppercase",
                          letterSpacing: 0.4,
                        }}
                      >
                        Recomendado
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.sub, lineHeight: 1.45, marginTop: 2, textAlign: "left" }}>{report.description}</div>
                </div>

                {/* Toggle */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReport(report.id);
                  }}
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 14,
                    background: enabledReports[report.id] ? report.color : t.border,
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      position: "absolute",
                      top: 2,
                      left: enabledReports[report.id] ? 20 : 2,
                      transition: "left 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Contenido expandido - DENTRO del mismo div */}
              {expanded === report.id && (
                <div style={{ width: "100%", marginTop: 4, paddingTop: 4, borderTop: `1px solid ${t.border}`, textAlign: "left" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: t.text, marginBottom: 10, lineHeight: 1.4 }}>
                    Tareas que hace este informe:<br/>
                    {report.tasks.map((task, i) => (
                      <div key={i} style={{ marginTop: 4, fontSize: 11.5, fontWeight: 600, color: t.sub }}>{task}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11.5, color: report.color, fontWeight: 700, marginTop: 10, lineHeight: 1.4 }}>
                    {report.benefits}
                  </div>
                  <div style={{ fontSize: 10, color: tokens.muted || t.sub, marginTop: 10, fontStyle: "italic", lineHeight: 1.4 }}>
                    {report.frequency}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>

        {/* Botón "Mis Informes" - En el pie de página */}
        <button
          onClick={() => {
            onNavigate?.("reports-history");
            console.log("📊 ReportsPage: Botón 'Mis Informes' ABIERTO");
          }}
          {...pressViewReports.handlers}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(155deg,#B18CFF,#8B5CF6)",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            marginTop: "auto",
            letterSpacing: 0.2,
            boxShadow: "0 16px 28px -10px rgba(139,92,246,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
            ...pressViewReports.getPressStyle({ opacity: 0.85, scale: 0.98 }),
          }}
        >
          Mis informes
        </button>
      </div>
      </div>
    </div>
  );
}
