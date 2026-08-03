import { useState } from "react";

/**
 * BackButton.jsx
 * Botón de atrás reutilizable con estilos clay
 */
export default function BackButton({ onClick, style = {} }) {
  const [pressing, setPressing] = useState(false);

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => setPressing(false)}
      onPointerLeave={() => setPressing(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        color: "#8B87A3",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        padding: "6px 0",
        fontFamily: "Manrope, system-ui, sans-serif",
        opacity: pressing ? 0.7 : 1,
        transform: pressing ? "scale(0.95)" : "scale(1)",
        transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        ...style,
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5l-7 7 7 7" />
      </svg>
      Atrás
    </button>
  );
}
