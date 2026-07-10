import { TrashIcon } from "../icons/Icons";

/**
 * DeleteAccountModal.jsx
 * Modal centrado para confirmar eliminación de cuenta
 *
 * Props:
 *   isDark - Tema oscuro
 *   isOpen - Si el modal está visible
 *   onCancel - Callback al hacer click en Cancelar
 *   onConfirm - Callback al hacer click en Eliminar Cuenta
 */
export default function DeleteAccountModal({ isDark, isOpen, onCancel, onConfirm }) {
  const t = isDark
    ? { bg: "rgba(0, 0, 0, 0.7)", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "rgba(248, 247, 255, 0.7)", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay semi-transparente */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: t.bg,
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal centrado */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "calc(100% - 40px)",
          maxWidth: 380,
          background: t.card,
          border: `1.5px solid ${t.border}`,
          borderRadius: 16,
          padding: "28px 24px",
          boxSizing: "border-box",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        }}>
        {/* Icono de papelera */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
            }}>
            <TrashIcon width={28} height={28} color="#EF4444" strokeWidth={2.5} />
          </div>
        </div>

        {/* Título */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: t.text,
            textAlign: "center",
            marginBottom: 12,
          }}>
          ¿Estás seguro?
        </div>

        {/* Descripción principal */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: t.text,
            textAlign: "center",
            marginBottom: 8,
          }}>
          ¿Quieres eliminar tu cuenta?
        </div>

        {/* Advertencia */}
        <div
          style={{
            fontSize: 13,
            color: t.sub,
            textAlign: "center",
            lineHeight: 1.5,
            marginBottom: 24,
          }}>
          Esta acción es <strong style={{ color: "#EF4444" }}>irreversible</strong>. Se borrarán todos tus datos, transacciones y configuraciones de la app.
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 12 }}>
          {/* Botón Cancelar */}
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 8,
              border: `1.5px solid ${t.border}`,
              background: isDark ? "#252535" : "#F5F3FF",
              color: t.text,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDark ? "#2D2D3A" : "#F0EFF8";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isDark ? "#252535" : "#F5F3FF";
            }}>
            Cancelar
          </button>

          {/* Botón Eliminar Cuenta (Rojo) */}
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #EF4444",
              background: "#EF4444",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#DC2626";
              e.target.style.borderColor = "#DC2626";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#EF4444";
              e.target.style.borderColor = "#EF4444";
            }}>
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </>
  );
}
