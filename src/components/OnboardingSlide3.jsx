/**
 * OnboardingSlide3.jsx
 * "Informes automáticos + IA"
 * ORUS te explica en qué se te va el dinero
 */

export default function OnboardingSlide3({ isDark }) {
  const t = {
    bg: "#000000",
    card: "#1E1E2E",
    border: "#2D2D3A",
    text: "#F0EEFF",
    sub: "#7B7A99",
    accent: "#9B6DFF",
  };

  const reportes = [
    {
      icon: "📅",
      titulo: "Mensual",
      desc: "Tu mes en números",
      detalles: ["Qué gastaste vs presupuesto", "Top categorías", "Alertas del mes"],
      color: "#93C5FD",
    },
    {
      icon: "📊",
      titulo: "Trimestral",
      desc: "Análisis de 3 meses",
      detalles: ["Tendencias", "Comparativas", "Patrones"],
      color: "#FCA5A5",
    },
    {
      icon: "🎯",
      titulo: "Anual",
      desc: "Tu año financiero",
      detalles: ["Visión completa", "Metas de ahorro", "Resumen ejecutivo"],
      color: "#86EFAC",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        maxWidth: 360,
      }}
    >
      {/* Título */}
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: t.text,
            margin: "0 0 12px 0",
          }}
        >
          Informes automáticos con IA
        </h2>
        <p
          style={{
            fontSize: 13,
            color: t.sub,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          ORUS analiza tus gastos y te explica exactamente dónde se te va el dinero.
        </p>
      </div>

      {/* Tarjetas de reportes */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {reportes.map((reporte, idx) => (
          <div
            key={idx}
            style={{
              background: t.card,
              border: `1.5px solid ${reporte.color}22`,
              borderLeft: `3px solid ${reporte.color}`,
              borderRadius: 10,
              padding: 12,
              animation: `slideIn 0.5s ease ${idx * 0.15}s both`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = t.border;
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = t.card;
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <style>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateX(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
            `}</style>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22 }}>{reporte.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: reporte.color,
                    marginBottom: 2,
                  }}
                >
                  {reporte.titulo}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: t.sub,
                    marginBottom: 6,
                  }}
                >
                  {reporte.desc}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                  }}
                >
                  {reporte.detalles.map((detalle, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 9,
                        color: t.text,
                        background: `${reporte.color}22`,
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {detalle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cómo funciona */}
      <div
        style={{
          background: `linear-gradient(135deg, #9B6DFF22, #9B6DFF11)`,
          border: `1.5px solid #9B6DFF44`,
          borderRadius: 12,
          padding: 14,
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: t.accent,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🤖</span>
          Cómo funciona
        </div>
        <div style={{ fontSize: 10, color: t.sub, lineHeight: 1.6 }}>
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: t.text }}>1. Recopila</strong> tus transacciones automáticamente
          </div>
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: t.text }}>2. Analiza</strong> patrones y tendencias
          </div>
          <div>
            <strong style={{ color: t.text }}>3. Te explica</strong> recomendaciones personalizadas
          </div>
        </div>
      </div>

      {/* Beneficio final */}
      <div
        style={{
          fontSize: 12,
          color: t.text,
          textAlign: "center",
          padding: "12px",
          background: `${t.accent}11`,
          borderRadius: 8,
          border: `1px solid ${t.accent}33`,
        }}
      >
        <span style={{ color: t.accent, fontWeight: 700 }}>Ahorra más</span>
        {" "}
        entendiendo exactamente a dónde va tu dinero.
      </div>
    </div>
  );
}
