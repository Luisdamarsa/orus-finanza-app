/**
 * SaveButton.jsx
 *
 * Botón de guardar reutilizable — cuadrado redondeado (52×52px, border-radius:17px)
 * Usado en: BudgetsPage
 *
 * Props:
 *   - onClick: función a ejecutar al hacer clic
 *   - disabled: bool (por defecto false)
 *   - style: objeto con estilos adicionales (opcional)
 */

export default function SaveButton({ onClick, disabled = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: 17,
        border: "none",
        background: disabled
          ? "rgba(139,92,246,0.4)"
          : "linear-gradient(155deg,#B18CFF,#8B5CF6)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled
          ? "none"
          : "0 16px 28px -10px rgba(139,92,246,0.6)",
        transition: "all 0.2s",
        ...style,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>
  );
}
