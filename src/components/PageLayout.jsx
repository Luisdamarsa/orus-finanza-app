/**
 * PageLayout.jsx
 *
 * Componente reutilizable para páginas estándar con estructura:
 * - Header fijo (top: 52, height: 52) con botón atrás
 * - Título centrado (top: 104, height: 60)
 * - Descripción opcional (fija, sin scroll)
 * - Contenido scrolleable (top: 164 o después de descripción, bottom: 0)
 *
 * Props:
 *   isDark - boolean: Tema oscuro/claro
 *   onBack - function: Callback para el botón atrás
 *   title - string o ReactNode: Título de la página (ej: "⚙️ Configuración")
 *   pressBack - object: Hook usePress para animación del botón atrás
 *   titleExtra - ReactNode (optional): Elementos adicionales en la sección de título (ej: botón Cerrar Sesión)
 *   description - ReactNode (optional): Descripción fija que aparece entre título y contenido
 *   descriptionRef - ref (optional): Ref para medir altura dinámica de descripción
 *   contentTopOffset - number (optional): Offset manual del top del contenido (para descripciones dinámicas)
 *   children - ReactNode: Contenido de la página
 */
export default function PageLayout({
  isDark,
  onBack,
  title,
  pressBack,
  titleExtra,
  description,
  descriptionRef,
  contentTopOffset,
  children,
}) {
  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, position: "relative" }}>
      {/* Header fijo (top: 52, height: 52) */}
      <div style={{
        position: "absolute", top: 52, left: 0, right: 0, height: 52,
        background: t.bg, padding: "8px 22px", boxSizing: "border-box",
        borderBottom: `1px solid ${t.border}`, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            {...pressBack.handlers}
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              border: "none",
              background: isDark ? "#1E1E2E" : "#EEE9FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              ...pressBack.getPressStyle(),
            }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#C4C2E0" : "#6B7280"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>Atrás</span>
        </div>
      </div>

      {/* Sección de Título (top: 104, height: 60) */}
      <div style={{
        position: "absolute",
        top: 104,
        left: 0,
        right: 0,
        height: 60,
        background: t.bg,
        padding: "0 22px",
        boxSizing: "border-box",
        zIndex: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: t.text,
          flex: 1,
          textAlign: "center",
        }}>
          {title}
        </div>
        {titleExtra}
      </div>

      {/* Descripción opcional (fija, sin scroll) */}
      {description && (
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
          {description}
        </div>
      )}

      {/* Contenido scrolleable */}
      <div style={{
        position: "absolute", top: contentTopOffset || 164, left: 0, right: 0, bottom: 0,
        overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none",
        padding: description ? "6px 22px 20px 22px" : "20px 22px 20px 22px", boxSizing: "border-box"
      }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {children}
      </div>
    </div>
  );
}
