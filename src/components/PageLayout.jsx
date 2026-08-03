import BackButton from "./BackButton";

/**
 * PageLayout.jsx
 *
 * Componente reutilizable para páginas estándar.
 * Estructura: Header + Título + Descripción + Contenido scrolleable
 *
 * Props:
 *   isDark - boolean
 *   onBack - function
 *   title - string o ReactNode
 *   icon - ReactNode (optional)
 *   description - ReactNode (optional)
 *   children - ReactNode
 */
export default function PageLayout({
  isDark,
  onBack,
  title,
  icon,
  description,
  children,
}) {
  const t = isDark
    ? { bg: "#000000", card: "linear-gradient(155deg,#211d2c 0%,#141220 100%)", border: "rgba(255,255,255,0.07)", text: "#F5F3FF", sub: "#8B87A3", accent: "#9B6DFF" }
    : { bg: "#F3F1FA", card: "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)", border: "rgba(30,20,60,0.08)", text: "#1A1830", sub: "#726E8C", accent: "#7C4DFF" };

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, display: "flex", flexDirection: "column", fontFamily: "Manrope, system-ui, sans-serif" }}>
      {/* Header fijo */}
      <div style={{ padding: "26px 22px 0", background: t.bg, borderBottom: `1px solid ${t.border}`, zIndex: 10 }}>
        <BackButton onClick={onBack} />

        {/* Título */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, marginBottom: 10 }}>
          {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
          <div style={{ fontSize: 19, fontWeight: 800, color: t.text, textAlign: "center" }}>
            {title}
          </div>
        </div>

        {/* Descripción */}
        {description && (
          <div style={{ fontSize: 12, fontWeight: 600, color: t.sub, textAlign: "center", lineHeight: 1.5, marginBottom: 16, paddingBottom: 16 }}>
            {description}
          </div>
        )}
      </div>

      {/* Contenido scrolleable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "16px 22px 90px 22px", boxSizing: "border-box" }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {children}
      </div>
    </div>
  );
}
