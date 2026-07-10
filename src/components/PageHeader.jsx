import { useRef, useEffect, useState } from "react";

/**
 * PageHeader.jsx - Componente reutilizable para encabezados de página
 *
 * Props:
 *   icon: string - Emoji o icono (ej: "💰", "🏷️")
 *   title: string - Título de la página
 *   description: string - Descripción principal
 *   hint: string - Texto de ayuda/ejemplos (opcional)
 *   isDark: boolean - Tema oscuro
 *   onDescriptionHeightChange: function - Callback cuando cambia la altura de descripción (opcional)
 *   showTitleToggle: boolean - Mostrar toggle al lado del título (para Mostrar Ingresos)
 *   toggleValue: boolean - Valor del toggle (si showTitleToggle es true)
 *   onToggleChange: function - Callback cuando cambia el toggle
 */
export default function PageHeader({
  icon,
  title,
  description,
  hint,
  isDark,
  onDescriptionHeightChange,
  showTitleToggle,
  toggleValue,
  onToggleChange,
}) {
  const t = isDark
    ? { bg: "#000000", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", text: "#1A1830", sub: "#9896B0" };

  // 🆕 Ref para medir altura de descripción dinámicamente
  const descriptionRef = useRef(null);
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  // 🆕 Medir altura dinámicamente de la descripción
  useEffect(() => {
    if (descriptionRef.current) {
      const height = descriptionRef.current.offsetHeight;
      setDescriptionHeight(height);
      // Notificar al componente padre (ej: ShowIncomesPage) sobre el cambio de altura
      if (onDescriptionHeightChange) {
        onDescriptionHeightChange(height);
      }
    }
  }, [description, hint, onDescriptionHeightChange]);

  // Calcular top del contenido basado en altura de descripción
  // Header (52px) + Título (60px) + Descripción (variable) + gaps (3+6)
  const contentTop = 52 + 60 + 3 + descriptionHeight + 6;

  return (
    <>
      {/* Sección de Título (top: 104, height: 60) */}
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 0,
          right: 0,
          height: 60,
          background: t.bg,
          padding: "0 22px",
          paddingBottom: "3px",
          boxSizing: "border-box",
          zIndex: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: showTitleToggle ? "space-between" : "center",
        }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: t.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          {title}
        </div>

        {/* Toggle en el título (solo para Mostrar Ingresos) */}
        {showTitleToggle && (
          <button
            onClick={() => onToggleChange && onToggleChange(!toggleValue)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              width: 44,
              height: 24,
              borderRadius: 12,
              border: "none",
              background: toggleValue ? "#9B6DFF" : isDark ? "#3D3D4D" : "#D5D3E8",
              cursor: "pointer",
              padding: 2,
              boxSizing: "border-box",
            }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#FFFFFF",
                transform: toggleValue ? "translateX(20px)" : "translateX(0)",
              }}
            />
          </button>
        )}
      </div>

      {/* Sección de Descripción (Componente Aparte) */}
      <div
        ref={descriptionRef}
        style={{
          position: "absolute",
          top: 164,
          left: 0,
          right: 0,
          background: t.bg,
          padding: "3px 22px",
          paddingBottom: "6px",
          boxSizing: "border-box",
          zIndex: 25,
        }}>
        {/* Descripción 1 */}
        {description && (
          <div
            style={{
              fontSize: 13,
              color: t.sub,
              marginBottom: description && hint ? 6 : 0,
              lineHeight: 1.4,
              fontWeight: 400,
              textAlign: "left",
            }}>
            {description}
          </div>
        )}

        {/* Descripción 2 (Hint/Ejemplos) */}
        {hint && (
          <div
            style={{
              fontSize: 12,
              color: t.sub,
              opacity: 0.75,
              fontStyle: "italic",
              textAlign: "left",
            }}>
            {hint}
          </div>
        )}
      </div>

      {/* Retornar contentTop para que la página lo use */}
      {/* Esto se pasa a través de un provider o se calcula en la página */}
      <style>{`
        [data-page-content] {
          position: absolute;
          top: ${contentTop}px;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          padding: 6px 22px 40px 22px;
          box-sizing: border-box;
        }
        [data-page-content]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
