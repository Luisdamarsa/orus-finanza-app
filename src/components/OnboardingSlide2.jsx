/**
 * OnboardingSlide2.jsx
 * "Pilares, Categorías y Movimientos"
 * Explica cómo se organiza el dinero en ORUS
 */

export default function OnboardingSlide2({ isDark }) {
  const t = {
    bg: "#000000",
    card: "#1E1E2E",
    border: "#2D2D3A",
    text: "#F0EEFF",
    sub: "#7B7A99",
    accent: "#9B6DFF",
  };

  const pilares = [
    { name: "Fijos", color: "#93C5FD", icon: "🏠", desc: "Servicios, alquileres" },
    { name: "Deuda", color: "#FCA5A5", icon: "💳", desc: "Tarjeta, créditos" },
    { name: "Ahorro", color: "#86EFAC", icon: "💰", desc: "Metas, inversión" },
    { name: "Ocio", color: "#C4B5FD", icon: "🎬", desc: "Diversión, viajes" },
    { name: "Varios", color: "#FDE68A", icon: "🛍️", desc: "Otros gastos" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
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
          Entiende tu dinero
        </h2>
        <p
          style={{
            fontSize: 13,
            color: t.sub,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Tu dinero se divide en 5 pilares. Cada pilar tiene categorías. Cada gasto es un movimiento.
        </p>
      </div>

      {/* Donut visual pequeño (representativo) */}
      <svg
        viewBox="0 0 140 140"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 100, height: 100 }}
      >
        {/* Fijos 35% (Azul) */}
        <circle
          cx="70"
          cy="70"
          r="40"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="47.1 132.8"
          strokeDashoffset="0"
          transform="rotate(-90 70 70)"
        />
        {/* Deuda 15% (Rojo) */}
        <circle
          cx="70"
          cy="70"
          r="40"
          fill="none"
          stroke="#FCA5A5"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="20.1 132.8"
          strokeDashoffset="-47.1"
          transform="rotate(-90 70 70)"
        />
        {/* Ahorro 20% (Verde) */}
        <circle
          cx="70"
          cy="70"
          r="40"
          fill="none"
          stroke="#86EFAC"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="26.8 132.8"
          strokeDashoffset="-67.2"
          transform="rotate(-90 70 70)"
        />
        {/* Ocio 15% (Púrpura) */}
        <circle
          cx="70"
          cy="70"
          r="40"
          fill="none"
          stroke="#C4B5FD"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="20.1 132.8"
          strokeDashoffset="-94"
          transform="rotate(-90 70 70)"
        />
        {/* Varios 15% (Amarillo) */}
        <circle
          cx="70"
          cy="70"
          r="40"
          fill="none"
          stroke="#FDE68A"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="20.1 132.8"
          strokeDashoffset="-114.1"
          transform="rotate(-90 70 70)"
        />
        {/* Centro */}
        <circle cx="70" cy="70" r="20" fill={t.bg} />
      </svg>

      {/* Grid de pilares */}
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {pilares.map((pilar, idx) => (
          <div
            key={idx}
            style={{
              background: t.card,
              border: `2px solid ${pilar.color}`,
              borderRadius: 10,
              padding: 12,
              textAlign: "center",
              animation: `slideIn 0.5s ease ${idx * 0.1}s both`,
            }}
          >
            <style>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{pilar.icon}</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: pilar.color,
                marginBottom: 2,
              }}
            >
              {pilar.name}
            </div>
            <div
              style={{
                fontSize: 9,
                color: t.sub,
              }}
            >
              {pilar.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Ejemplo de flujo */}
      <div
        style={{
          background: `linear-gradient(135deg, ${t.card}, #2D2D3A)`,
          border: `1.5px solid ${t.border}`,
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
            textAlign: "center",
          }}
        >
          Ejemplo: Si gastas $50 en comida
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            fontSize: 11,
            color: t.sub,
            textAlign: "center",
          }}
        >
          <div>
            <span style={{ fontSize: 16, display: "block", marginBottom: 4 }}>
              🎬
            </span>
            <span>Pilar:</span>
            <br />
            <strong style={{ color: t.text }}>Ocio</strong>
          </div>
          <div style={{ color: t.border }}>→</div>
          <div>
            <span style={{ fontSize: 16, display: "block", marginBottom: 4 }}>
              🍽️
            </span>
            <span>Categoría:</span>
            <br />
            <strong style={{ color: t.text }}>Restaurantes</strong>
          </div>
          <div style={{ color: t.border }}>→</div>
          <div>
            <span style={{ fontSize: 16, display: "block", marginBottom: 4 }}>
              💵
            </span>
            <span>Movimiento:</span>
            <br />
            <strong style={{ color: t.text }}>$50</strong>
          </div>
        </div>
      </div>

      {/* Beneficio */}
      <div
        style={{
          fontSize: 12,
          color: t.sub,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        <span style={{ color: t.accent, fontWeight: 700 }}>Todo visible</span>
        {" "}en tu dashboard:
        <br />
        donut, gráficos y alertas en tiempo real.
      </div>
    </div>
  );
}
