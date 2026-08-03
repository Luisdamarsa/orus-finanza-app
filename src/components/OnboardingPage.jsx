import { useState } from "react";
import { usePress } from "../hooks/usePress";
import OnboardingSlide1 from "./OnboardingSlide1";
import OnboardingSlide2 from "./OnboardingSlide2";
import OnboardingSlide3 from "./OnboardingSlide3";

/**
 * OnboardingPage.jsx
 * Onboarding de 3 pantallas para nuevos usuarios
 * Pantalla 1: Automatización de transacciones
 * Pantalla 2: Pilares, Categorías y Movimientos
 * Pantalla 3: Informes + IA
 */

const SLIDES = [
  { id: 1, component: OnboardingSlide1 },
  { id: 2, component: OnboardingSlide2 },
  { id: 3, component: OnboardingSlide3 },
];

export default function OnboardingPage({ setScreen }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const pressNext = usePress();
  const pressPrev = usePress();
  const pressSkip = usePress();

  const t = {
    bg: "#000000",
    card: "#1E1E2E",
    border: "#2D2D3A",
    text: "#F0EEFF",
    sub: "#7B7A99",
    accent: "#9B6DFF",
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Último slide: ir a LoginPage
      setScreen("login");
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    setScreen("login");
  };

  const CurrentSlideComponent = SLIDES[currentSlide].component;
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: t.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header con indicador de progreso y botón Skip */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        {/* Progreso visual */}
        <div
          style={{
            display: "flex",
            gap: 6,
          }}
        >
          {SLIDES.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentSlide ? 24 : 8,
                height: 4,
                borderRadius: 2,
                background:
                  index === currentSlide
                    ? t.accent
                    : index < currentSlide
                      ? t.accent
                      : t.border,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          {...pressSkip.handlers}
          style={{
            background: "none",
            border: "none",
            color: t.sub,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            padding: 0,
            transition: "color 0.15s",
            opacity: pressSkip.pressing ? 0.7 : 1,
          }}
          onMouseEnter={(e) => (e.target.style.color = t.text)}
          onMouseLeave={(e) => (e.target.style.color = t.sub)}
        >
          Omitir
        </button>
      </div>

      {/* Contenido del slide (con animación) */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <style>{`
          @keyframes fadeIn {
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
        <CurrentSlideComponent isDark={true} />
      </div>

      {/* Footer con botones de navegación */}
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {/* Botón Atrás */}
        {currentSlide > 0 && (
          <button
            onClick={handlePrev}
            {...pressPrev.handlers}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: `1.5px solid ${t.border}`,
              background: "transparent",
              color: t.text,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
              minWidth: 100,
              ...pressPrev.getPressStyle({ opacity: 0.8, scale: 0.98 }),
            }}
          >
            ← Atrás
          </button>
        )}

        {/* Botón Siguiente / Empezar */}
        <button
          onClick={handleNext}
          {...pressNext.handlers}
          style={{
            padding: "12px 32px",
            borderRadius: 12,
            border: "none",
            background: t.accent,
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            flex: currentSlide === 0 ? 1 : "auto",
            minWidth: 120,
            transition: "all 0.15s",
            ...pressNext.getPressStyle({ opacity: 0.85, scale: 0.98 }),
          }}
        >
          {isLastSlide ? "Empezar" : "Siguiente →"}
        </button>
      </div>

      {/* Indicador numérico pequeño */}
      <div
        style={{
          fontSize: 11,
          color: t.sub,
          marginBottom: 10,
        }}
      >
        {currentSlide + 1} / {SLIDES.length}
      </div>
    </div>
  );
}
