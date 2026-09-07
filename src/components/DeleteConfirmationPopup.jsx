/**
 * DeleteConfirmationPopup.jsx — Popup genérico de confirmación para eliminar
 *
 * Reutilizable para: transacciones, categorías, usuarios, etc.
 *
 * Props:
 *   - isOpen: boolean - mostrar/ocultar popup
 *   - onConfirm: function - callback al hacer clic "Borrar"
 *   - onCancel: function - callback al hacer clic "Cancelar"
 *   - title: string - título (defecto: "¿Eliminar?")
 *   - message: string - mensaje (defecto: "No se podrá recuperar...")
 *   - isDark: boolean - tema oscuro
 */

export default function DeleteConfirmationPopup({
  isOpen,
  onConfirm,
  onCancel,
  title = "¿Eliminar?",
  message = "Esta acción no se puede deshacer.",
  isDark = false,
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(3px)",
          zIndex: 998,
        }}
      />

      {/* Popup centrado */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
          borderRadius: 16,
          padding: "16px 20px",
          width: "85%",
          maxWidth: 300,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Icono de alerta */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "#EF4444" }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Título */}
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            textAlign: "center",
            margin: 0,
            color: isDark ? "#ffffff" : "#000000",
          }}
        >
          {title}
        </h2>

        {/* Mensaje */}
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.4,
            textAlign: "center",
            margin: 0,
            color: isDark ? "#b0b0b0" : "#666666",
          }}
        >
          {message}
        </p>

        {/* Botones */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 4,
          }}
        >
          {/* Cancelar (gris) */}
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: isDark ? "#333333" : "#e5e5e5",
              color: isDark ? "#ffffff" : "#000000",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? "#444444" : "#d0d0d0";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDark ? "#333333" : "#e5e5e5";
            }}
          >
            Cancelar
          </button>

          {/* Borrar (rojo) */}
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              background: "linear-gradient(155deg,#EF4444,#DC2626)",
              color: "#ffffff",
              cursor: "pointer",
              boxShadow: "0 16px 28px -10px rgba(239,68,68,0.6)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0 20px 40px rgba(239,68,68,0.7)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 16px 28px -10px rgba(239,68,68,0.6)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Borrar
          </button>
        </div>
      </div>
    </>
  );
}
