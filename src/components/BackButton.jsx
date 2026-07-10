import { useState } from "react";

/**
 * BackButton.jsx
 * Botón de atrás reutilizable con efecto de press
 */
export default function BackButton({ onClick, isDark, label = "Atrás", style = {} }) {
  const [pressing, setPressing] = useState(false);

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => setPressing(false)}
      onPointerLeave={() => setPressing(false)}
      style={{
        background: "none",
        border: "none",
        color: isDark ? "#F0EEFF" : "#1A1830",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: 0,
        marginBottom: 14,
        fontSize: 14,
        fontWeight: 600,
        opacity: pressing ? 0.6 : 1,
        transform: pressing ? "scale(0.95)" : "scale(1)",
        transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        ...style,
      }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: isDark ? "#2D2D3A" : "#E5E3F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          transform: pressing ? "scale(0.92)" : "scale(1)",
          transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
        ←
      </div>
      {label}
    </button>
  );
}
