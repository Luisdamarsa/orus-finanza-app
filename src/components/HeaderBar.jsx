import BackButton from "./BackButton";

/**
 * HeaderBar.jsx — Componente reutilizable para headers de páginas
 *
 * Estructura flexible:
 * - Solo [← Atrás] si no hay pageTitle ni pageIcon
 * - [← Atrás] + [Título] si solo hay pageTitle
 * - [← Atrás] + [Icono] + [Título] si hay ambos
 *
 * Props:
 *   onBack - callback para volver
 *   pageIcon - SVG o ReactNode del icono (opcional)
 *   pageTitle - nombre de la página (opcional)
 *   isDark - tema
 */
export default function HeaderBar({ onBack, pageIcon, pageTitle, isDark }) {
  const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(30,20,60,0.08)";

  return (
    <div style={{
      padding: "20px 22px 0px 22px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      flexShrink: 0,
      zIndex: 10,
      fontFamily: "Manrope, system-ui, sans-serif",
    }}>
      {/* Botón Atrás */}
      <div style={{ flexShrink: 0 }}>
        <BackButton onClick={onBack} />
      </div>

      {/* Título + Icono (si existen) */}
      {pageTitle && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {pageIcon && (
            <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {pageIcon}
            </div>
          )}
          <span style={{
            fontSize: 13,
            fontWeight: 800,
            color: isDark ? "#F5F3FF" : "#1A1830",
          }}>
            {pageTitle}
          </span>
        </div>
      )}
    </div>
  );
}
