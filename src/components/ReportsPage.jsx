import { useState, useRef, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import PageLayout from "./PageLayout";
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
    icon: "📅",
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
    icon: "📊",
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
  },
  {
    id: "annual",
    icon: "🎯",
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
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      title="Informes"
      icon={<BarChart3 size={20} strokeWidth={1.6} />}
      pressBack={pressBack}
      contentTopOffset={contentTopOffset}
      description={
        <div ref={descriptionRef} style={{ fontSize: 12, color: t.sub, lineHeight: 1.5, textAlign: "left" }}>
          Elige el período que se ajuste a ti. Puedes cambiar cuando quieras.
        </div>
      }
    >
      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", minHeight: "100%", gap: 0 }}>
        {/* Contenedor de tarjetas */}
        <div>
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
                background: t.card,
                border: `2px solid ${report.color}`,
                borderRadius: 16,
                padding: 16,
                marginBottom: 8,
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: expanded === report.id ? "column" : "row",
                justifyContent: "space-between",
                alignItems: expanded === report.id ? "flex-start" : "center",
                gap: 12,
              }}
            >
              {/* Header - siempre visible */}
              <div style={{ display: "flex", gap: 12, width: "100%" }}>
                {/* Icono */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 36 }}>{report.icon}</span>
                </div>

                {/* Nombre + Descripción */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: t.text }}>{report.name}</span>
                    {report.id === "quarterly" && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: "#9B6DFF",
                          background: "#9B6DFF22",
                          padding: "5px 10px",
                          borderRadius: 6,
                          textTransform: "uppercase",
                          letterSpacing: 0.4,
                        }}
                      >
                        Recomendado
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11.5, color: t.sub, lineHeight: 1.45, marginTop: 2, textAlign: "left" }}>{report.description}</div>
                </div>

                {/* Toggle */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReport(report.id);
                  }}
                  style={{
                    width: 48,
                    height: 28,
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
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      position: "absolute",
                      top: 2,
                      left: enabledReports[report.id] ? 22 : 2,
                      transition: "left 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Contenido expandido - DENTRO del mismo div */}
              {expanded === report.id && (
                <div style={{ width: "100%", marginTop: 4, paddingTop: 4, borderTop: `1px solid ${report.color}33`, textAlign: "left" }}>
                  <div style={{ fontSize: 12, color: t.sub, marginBottom: 10, lineHeight: 1.4 }}>
                    <strong>Tareas que hace este informe:</strong><br/>
                    {report.tasks.map((task, i) => (
                      <div key={i} style={{ marginTop: 4 }}>{task}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: report.color, fontWeight: 600, marginTop: 10, lineHeight: 1.4 }}>
                    {report.benefits}
                  </div>
                  <div style={{ fontSize: 11, color: t.sub, marginTop: 10, fontStyle: "italic", lineHeight: 1.4 }}>
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
            padding: "12px 16px",
            borderRadius: 12,
            border: `1.5px solid #9B6DFF`,
            background: "#9B6DFF",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: "auto",
            letterSpacing: 0.2,
            ...pressViewReports.getPressStyle({ opacity: 0.85, scale: 0.98 }),
          }}
        >
          Mis informes
        </button>
      </div>
    </PageLayout>
  );
}
