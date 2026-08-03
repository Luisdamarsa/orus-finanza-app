import { useState, useRef, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import PageLayout from "./PageLayout";
import { userStorage } from "../utils/userStorage";
import { openReportInBrowser } from "../services/reportViewService";
import { DARK, LIGHT } from "../constants/tokens";

// Crear hooks usePress para cada filtro
const TabPressButton = ({ tab, isActive, onToggle, isDark, t }) => {
  const tabPress = usePress();
  return (
    <button
      key={tab.id}
      onClick={() => onToggle(tab.id)}
      {...tabPress.handlers}
      style={{
        padding: "8px 14px",
        borderRadius: 20,
        border: isActive ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
        background: isActive ? `${t.accent}22` : t.card,
        color: isActive ? t.accent : t.text,
        fontSize: 12,
        fontWeight: isActive ? 700 : 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 6,
        ...tabPress.getPressStyle({ opacity: 0.8, scale: 0.95 }),
      }}
    >
      <span>{tab.icon}</span>
      {tab.label}
    </button>
  );
};

/**
 * MyReportsPage.jsx — "Mis Informes"
 * Página para ver el historial de informes generados automáticamente
 * Tabs para filtrar por tipo (Mensual, Trimestral, Anual)
 * Cada informe es clickeable para verlo en detalle
 */

const TABS = [
  { id: "monthly", label: "Mensual", icon: "📅" },
  { id: "quarterly", label: "Trimestral", icon: "📊" },
  { id: "annual", label: "Anual", icon: "🎯" },
];

// Datos reales de informes generados (enero 2025 - mayo 2026)
// Se cargará dinámicamente desde /informes-anuales/output/
// Fallback: datos simulados si no se pueden cargar
const FALLBACK_REPORTS = [
  { id: 1, date: "2025-01-31", title: "Enero 2025", status: "completed", generated: "31 ene • 23:59" },
  { id: 2, date: "2025-02-28", title: "Febrero 2025", status: "completed", generated: "28 feb • 23:59" },
  { id: 3, date: "2025-03-31", title: "Marzo 2025", status: "completed", generated: "31 mar • 23:59" },
  { id: 4, date: "2025-04-30", title: "Abril 2025", status: "completed", generated: "30 abr • 23:59" },
  { id: 5, date: "2025-05-31", title: "Mayo 2025", status: "completed", generated: "31 may • 23:59" },
  { id: 6, date: "2025-06-30", title: "Junio 2025", status: "completed", generated: "30 jun • 23:59" },
  { id: 7, date: "2025-07-31", title: "Julio 2025", status: "completed", generated: "31 jul • 23:59" },
  { id: 8, date: "2025-08-31", title: "Agosto 2025", status: "completed", generated: "31 ago • 23:59" },
  { id: 9, date: "2025-09-30", title: "Septiembre 2025", status: "completed", generated: "30 sep • 23:59" },
  { id: 10, date: "2025-10-31", title: "Octubre 2025", status: "completed", generated: "31 oct • 23:59" },
  { id: 11, date: "2025-11-30", title: "Noviembre 2025", status: "completed", generated: "30 nov • 23:59" },
  { id: 12, date: "2025-12-31", title: "Diciembre 2025", status: "completed", generated: "31 dic • 23:59" },
  { id: 13, date: "2026-01-31", title: "Enero 2026", status: "completed", generated: "31 ene • 23:59" },
  { id: 14, date: "2026-02-28", title: "Febrero 2026", status: "completed", generated: "28 feb • 23:59" },
  { id: 15, date: "2026-03-31", title: "Marzo 2026", status: "completed", generated: "31 mar • 23:59" },
  { id: 16, date: "2026-04-30", title: "Abril 2026", status: "completed", generated: "30 abr • 23:59" },
  { id: 17, date: "2026-05-31", title: "Mayo 2026", status: "completed", generated: "31 may • 23:59" },
  { id: 101, date: "2025-03-31", title: "Q1 2025 (Ene-Mar)", status: "completed", generated: "31 mar • 23:59" },
  { id: 102, date: "2025-06-30", title: "Q2 2025 (Abr-Jun)", status: "completed", generated: "30 jun • 23:59" },
  { id: 103, date: "2025-09-30", title: "Q3 2025 (Jul-Sep)", status: "completed", generated: "30 sep • 23:59" },
  { id: 104, date: "2025-12-31", title: "Q4 2025 (Oct-Dic)", status: "completed", generated: "31 dic • 23:59" },
  { id: 105, date: "2026-03-31", title: "Q1 2026 (Ene-Mar)", status: "completed", generated: "31 mar • 23:59" },
  { id: 106, date: "2026-06-30", title: "Q2 2026 (Abr-Jun)", status: "completed", generated: "30 jun • 23:59" },
  { id: 201, date: "2025-12-31", title: "Año 2025", status: "completed", generated: "31 dic • 23:59" },
];

export default function MyReportsPage({ onBack }) {
  // 🆕 Tema desde ThemeContext
  const { isDark } = useTheme();

  const pressBack = usePress();
  const containerRef = useRef(null);
  const descriptionRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState(null); // null = sin filtro
  const [contentTopOffset, setContentTopOffset] = useState(164);
  const [expandedReportId, setExpandedReportId] = useState(null); // Reporte expandido
  const [downloadingReportId, setDownloadingReportId] = useState(null); // Reporte descargado

  // Toggle filter: si clickeas el mismo, se desactiva
  const toggleFilter = (filterId) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  // Usar FALLBACK_REPORTS por ahora (tiene todos los 24 informes)
  const allReports = FALLBACK_REPORTS;

  // Calcular contentTopOffset dinámicamente basado en altura de descripción
  useEffect(() => {
    if (descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.offsetHeight;
      const newContentTop = 164 + descriptionHeight + 6;
      setContentTopOffset(newContentTop);
    }
  }, []);

  // 🆕 Tokens del design (Spatial UI + Claymorfismo)
  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    card: tokens.surfaceFlat,
    border: tokens.border,
    text: tokens.text,
    sub: tokens.sub,
    accent: tokens.accent,
  };

  // Función para ordenar: Año > [Trimestre > Meses del trimestre (desc)] > [Siguiente trimestre > Sus meses] ...
  const getSortedReports = () => {
    // Agrupar por año
    const byYear = {};
    allReports.forEach(report => {
      const year = new Date(report.date).getFullYear();
      if (!byYear[year]) byYear[year] = { annual: [], quarterly: [], monthly: [] };
      if (report.title.includes("Año")) byYear[year].annual.push(report);
      else if (report.title.includes("Q")) byYear[year].quarterly.push(report);
      else byYear[year].monthly.push(report);
    });

    const result = [];
    const years = Object.keys(byYear).sort((a, b) => b - a); // años descendentes

    years.forEach(year => {
      const yearData = byYear[year];

      // Agregar año primero
      yearData.annual.forEach(annual => result.push(annual));

      // Trimestres ordenados descendentes (Q4, Q3, Q2, Q1)
      const sortedQuarterly = yearData.quarterly.sort((a, b) => new Date(b.date) - new Date(a.date));

      sortedQuarterly.forEach(quarter => {
        // Agregar trimestre
        result.push(quarter);

        // Extraer número de trimestre de la fecha o del título (ej: "Q4 2025")
        const quarterMatch = quarter.title.match(/Q(\d)/);
        const qNumber = quarterMatch ? parseInt(quarterMatch[1]) : 0;

        // Meses que pertenecen a este trimestre (basado en el mes en la fecha)
        const monthsInQuarter = yearData.monthly.filter(month => {
          const monthDate = new Date(month.date);
          const monthNum = monthDate.getMonth() + 1; // 1-12

          // Determinar qué trimestre pertenece este mes
          let qOfMonth = 0;
          if (monthNum >= 1 && monthNum <= 3) qOfMonth = 1;
          else if (monthNum >= 4 && monthNum <= 6) qOfMonth = 2;
          else if (monthNum >= 7 && monthNum <= 9) qOfMonth = 3;
          else if (monthNum >= 10 && monthNum <= 12) qOfMonth = 4;

          return qOfMonth === qNumber;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // descendentes

        // Agregar meses del trimestre
        monthsInQuarter.forEach(month => result.push(month));
      });
    });

    return result;
  };

  const allSortedReports = getSortedReports();

  // Filtrar por activeFilter (null = sin filtro) + solo completed
  const reports = allSortedReports
    .filter(r => r.status === "completed") // Solo informes generados
    .filter(r => {
      if (activeFilter === "monthly") return !r.title.includes("Q") && !r.title.includes("Año");
      if (activeFilter === "quarterly") return r.title.includes("Q");
      if (activeFilter === "annual") return r.title.includes("Año");
      return true; // Sin filtro, mostrar todos los completed
    });

  return (
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      title="Mis Informes"
      icon={<TrendingUp size={20} strokeWidth={1.6} />}
      pressBack={pressBack}
      contentTopOffset={contentTopOffset}
      description={
        <div ref={descriptionRef} style={{ fontSize: 13, color: t.sub, lineHeight: 1.4 }}>
          Historial de tus informes generados automáticamente. Cada uno se crea al final del período.
        </div>
      }
    >
      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", minHeight: "100%", gap: 0 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
          <style>{`::-webkit-scrollbar { display: none; }`}</style>
          {TABS.map((tab) => (
            <TabPressButton
              key={tab.id}
              tab={tab}
              isActive={activeFilter === tab.id}
              onToggle={toggleFilter}
              isDark={isDark}
              t={t}
            />
          ))}
        </div>

        {/* Lista de informes */}
        <div style={{ background: "#000000", borderRadius: 12, overflow: "hidden" }}>
          {reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4 }}>
                No hay informes aún
              </div>
              <div style={{ fontSize: 12, color: t.sub }}>
                Los informes se generan automáticamente al final de cada período
              </div>
            </div>
          ) : (
            reports.map((report, idx) => {
              // Determinar tipo de reporte
              const isAnnual = report.title.includes("Año");
              const isQuarterly = report.title.includes("Q");
              const isMonthly = !isAnnual && !isQuarterly;
              const isExpanded = expandedReportId === report.id;

              // Tamaños y estilos según tipo
              let fontSize = 14;
              let fontWeight = 400;
              let paddingLeft = 16;
              let paddingVertical = 7;

              // Aplicar formato de tap solo si NO hay filtro activo
              const showHierarchy = activeFilter === null;

              if (isAnnual) {
                fontSize = 14 * 1.2; // 16.8px
                fontWeight = 700;
                paddingLeft = 16;
                paddingVertical = 7 + 2;
              } else if (isQuarterly) {
                fontSize = (14 * 1.2) * 0.8; // 13.44px
                fontWeight = 700;
                paddingLeft = showHierarchy ? 16 + 10 : 16; // Indentado solo sin filtro
              } else if (isMonthly) {
                paddingLeft = showHierarchy ? 16 + 20 : 16; // Más indentado solo sin filtro
              }

              // Función para abrir informe en navegador
              const handleViewReport = (e) => {
                e.stopPropagation();
                setDownloadingReportId(report.id);

                try {
                  const normalizedName = getNormalizedFileName();
                  const result = openReportInBrowser(normalizedName);

                  if (result.success) {
                    console.log(`✅ Abierto en navegador: ${result.filename}`);
                    // Mantener verde por 2 segundos
                    setTimeout(() => setDownloadingReportId(null), 2000);
                  } else {
                    console.error(`❌ Error: ${result.error}`);
                    setDownloadingReportId(null);
                  }
                } catch (error) {
                  console.error("Error abriendo informe:", error);
                  setDownloadingReportId(null);
                }
              };

              // Nombre completo del informe (para UI)
              const getFullReportName = () => {
                if (report.title.includes("Año")) return `Informe ORUS Anual ${report.title.split(" ")[1]}`;
                if (report.title.includes("Q")) {
                  const match = report.title.match(/Q(\d) (\d{4})/);
                  if (match) return `Informe ORUS Trimestral Q${match[1]} ${match[2]}`;
                }
                return `Informe ORUS Mensual ${report.title}`;
              };

              // Nombre normalizado para archivo (coincide con /output/)
              const getNormalizedFileName = () => {
                const monthMap = {
                  "Enero": "January", "Febrero": "February", "Marzo": "March", "Abril": "April",
                  "Mayo": "May", "Junio": "June", "Julio": "July", "Agosto": "August",
                  "Septiembre": "September", "Octubre": "October", "Noviembre": "November", "Diciembre": "December"
                };

                if (report.title.includes("Año")) {
                  const year = report.title.split(" ")[1];
                  return `Informe_ORUS_Anual_${year}`;
                }
                if (report.title.includes("Q")) {
                  // Formato: "Q1 2025 (Ene-Mar)"
                  const match = report.title.match(/Q(\d) (\d{4})/);
                  if (match) return `Informe_ORUS_Trimestral_Q${match[1]}_${match[2]}`;
                }
                // Mensual: extraer mes y año
                const [month, year] = report.title.split(" ");
                const englishMonth = monthMap[month] || month;
                return `Informe_ORUS_Mensual_${englishMonth}${year}`;
              };

              return (
                <div
                  key={report.id}
                  style={{
                    borderBottom: idx < reports.length - 1 ? `1px solid ${t.border}` : "none",
                    background: "#000000",
                  }}
                >
                  {/* Header expandible */}
                  <div
                    onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                    style={{
                      padding: `${paddingVertical}px 16px ${paddingVertical}px ${paddingLeft}px`,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      background: "#000000",
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                      e.currentTarget.style.transform = "scale(0.99)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize, fontWeight, color: t.text }}>
                          {report.title}
                        </span>
                        {report.status === "pending" && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: t.sub,
                              background: t.border,
                              padding: "3px 6px",
                              borderRadius: 4,
                              textTransform: "uppercase",
                            }}
                          >
                            Próximo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Chevron > */}
                    <div
                      style={{
                        fontSize: 16,
                        color: t.sub,
                        opacity: 0.6,
                        flexShrink: 0,
                        transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      &gt;
                    </div>
                  </div>

                  {/* Contenido expandido */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "12px 16px 16px 36px",
                        borderTop: `1px solid ${t.border}`,
                        background: "#000000",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      {/* Fila 1: Título + Botón */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        {/* Nombre completo */}
                        <div style={{ fontSize: 13, fontWeight: 400, fontStyle: "italic", color: t.text, flex: 1, textAlign: "left" }}>
                          {getFullReportName()}
                        </div>

                        {/* Botón ver en navegador */}
                        <button
                          onClick={handleViewReport}
                          style={{
                            padding: "3px 6px",
                            borderRadius: 6,
                            border: "none",
                            background: downloadingReportId === report.id ? "#22C55E" : "#7B7A99",
                            color: "#FFFFFF",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                          onMouseDown={(e) => {
                            if (downloadingReportId !== report.id) {
                              e.currentTarget.style.opacity = "0.85";
                              e.currentTarget.style.transform = "scale(0.98)";
                            }
                          }}
                          onMouseUp={(e) => {
                            if (downloadingReportId !== report.id) {
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.transform = "scale(1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (downloadingReportId !== report.id) {
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.transform = "scale(1)";
                            }
                          }}
                        >
                          {downloadingReportId === report.id ? "✓ Abierto" : "Ver"}
                        </button>
                      </div>

                      {/* Fila 2: Fecha de generación */}
                      <div style={{ fontSize: 11, color: t.sub, textAlign: "left" }}>
                        Generado: {report.generated}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Info footer - En la parte de abajo */}
        <div
          style={{
            marginTop: "auto",
            padding: "12px 14px",
            borderRadius: 10,
            background: `${t.sub}11`,
            border: `1px solid ${t.sub}33`,
          }}
        >
          <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.5 }}>
            <strong style={{ color: t.text }}>💡 Tip:</strong> Los informes se generan automáticamente. Ábrelos en el navegador desde la vista de detalle.
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
