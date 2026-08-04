/**
 * SaveDeleteButtons.jsx
 *
 * Componente de botones flotantes para guardar (check) y eliminar (trash)
 * Ambos son cuadrados redondeados 52×52px, border-radius 17px
 *
 * Props:
 *   - onSave: función al hacer clic en guardar
 *   - onDelete: función al hacer clic en eliminar (opcional)
 *   - disabledSave: bool (por defecto false)
 *   - disabledDelete: bool (por defecto false)
 *   - showDelete: bool (por defecto true) - mostrar u ocultar botón delete
 */

export default function SaveDeleteButtons({
  onSave,
  onDelete,
  disabledSave = false,
  disabledDelete = false,
  showDelete = true,
}) {
  return (
    <>
      {/* Botón Guardar — Esquina inferior derecha */}
      <button
        onClick={onSave}
        disabled={disabledSave}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: 17,
          border: "none",
          background: disabledSave
            ? "rgba(139,92,246,0.4)"
            : "linear-gradient(155deg,#B18CFF,#8B5CF6)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabledSave ? "not-allowed" : "pointer",
          boxShadow: disabledSave
            ? "none"
            : "0 16px 28px -10px rgba(139,92,246,0.6)",
          transition: "all 0.2s",
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

      {/* Botón Eliminar — Esquina inferior izquierda (solo si showDelete=true) */}
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          disabled={disabledDelete}
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            width: 52,
            height: 52,
            borderRadius: 17,
            border: "none",
            background: disabledDelete
              ? "rgba(239,68,68,0.4)"
              : "linear-gradient(155deg,#EF4444,#DC2626)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: disabledDelete ? "not-allowed" : "pointer",
            boxShadow: disabledDelete
              ? "none"
              : "0 16px 28px -10px rgba(239,68,68,0.6)",
            transition: "all 0.2s",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      )}
    </>
  );
}
