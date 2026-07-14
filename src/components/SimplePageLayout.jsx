/**
 * SimplePageLayout.jsx
 *
 * Componente reutilizable para páginas sin título (especiales):
 * - Header fijo (top: 0, height: 52) con botón atrás
 * - Contenido scrolleable (top: 52, bottom: 0)
 *
 * Props:
 *   isDark - boolean: Tema oscuro/claro
 *   onBack - function: Callback para el botón atrás
 *   pressBack - object: Hook usePress para animación del botón atrás
 *   children - ReactNode: Contenido de la página
 */
export default function SimplePageLayout({
  isDark,
  onBack,
  pressBack,
  children,
}) {
  const t = isDark
    ? { bg: "#0D0D1A", card: "#181828", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#FFFFFF", card: "#F8F7FF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, position: "relative" }}>
      {/* Header fijo (top: 0, height: 52) */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 52,
        background: t.bg, padding: "8px 22px", boxSizing: "border-box",
        borderBottom: `1px solid ${t.border}`, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            {...pressBack.handlers}
            style={{
              width: 30, height: 30, borderRadius: 9, border: "none",
              background: isDark ? "#1E1E2E" : "#EEE9FF",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", ...pressBack.getPressStyle(),
            }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={isDark ? "#C4C2E0" : "#6B7280"} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>Atrás</span>
        </div>
      </div>

      {/* Contenido scrolleable (top: 52) */}
      <div style={{
        position: "absolute", top: 52, left: 0, right: 0, bottom: 0,
        overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none",
        padding: "20px 22px", boxSizing: "border-box"
      }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {children}
      </div>
    </div>
  );
}
