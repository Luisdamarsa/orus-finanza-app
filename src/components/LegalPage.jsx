import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import terminosRaw from "../legal/terminos.md?raw";
import privacidadRaw from "../legal/privacidad.md?raw";
import { DARK, LIGHT } from "../constants/tokens";

/**
 * LegalPage.jsx — Términos y Condiciones / Privacidad
 * Header con HeaderBar + Título + Fecha
 * Contenido renderizado desde markdown
 */
const DOCS = {
  terms: {
    title: "TÉRMINOS Y CONDICIONES",
    md: terminosRaw,
    updatedDate: "4 de agosto, 2026"
  },
  privacy: {
    title: "TÉRMINOS DE PRIVACIDAD",
    md: privacidadRaw,
    updatedDate: "4 de agosto, 2026"
  },
};

// Inline markdown: **texto** → bold
function inline(text, k) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={`${k}-${i}`}>{p.slice(2, -2)}</strong>
      : <span key={`${k}-${i}`}>{p}</span>
  );
}

export default function LegalPage({ onBack, variant }) {
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    text: tokens.text,
    sub: tokens.sub,
    muted: isDark ? "#6B6680" : "#A99FB8",
    accent: isDark ? "#9B6DFF" : "#7C4DFF",
    accentSoft: isDark ? "rgba(155,109,255,0.2)" : "rgba(124,77,255,0.15)",
  };

  const doc = DOCS[variant] || DOCS.terms;

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      background: t.bg,
      fontFamily: "Manrope, system-ui, sans-serif",
    }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Header con HeaderBar */}
      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/>
            <path d="M15 2v5h5M8 13h8M8 17h8M8 9h4"/>
          </svg>
        }
        pageTitle={doc.title}
        isDark={isDark}
      />

      {/* Contenido scrollable */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "none",
        padding: "26px 22px 50px",
        boxSizing: "border-box",
      }}>

        {/* Aviso placeholder */}
        <div style={{
          padding: "14px 16px",
          borderRadius: 16,
          background: t.accentSoft,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          marginBottom: 24,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <div style={{ fontSize: "11px", fontWeight: 600, color: t.text, lineHeight: 1.5 }}>
            Este es contenido de ejemplo. La versión definitiva debe ser revisada por asesoría legal en Colombia.
          </div>
        </div>

        {/* Cuerpo de términos - renderizado simple de markdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {doc.md.split("\n## ").slice(1).map((section, idx) => {
            const [titleLine, ...bodyLines] = section.split("\n");
            const sectionNum = idx + 1;
            const sectionTitle = titleLine.trim();
            const sectionBody = bodyLines.join("\n").trim();

            return (
              <div key={idx} style={{ textAlign: "left" }}>
                <div style={{ fontSize: "13.5px", fontWeight: 800, color: t.text, marginBottom: 6 }}>
                  {sectionNum}. {sectionTitle}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: t.sub, lineHeight: 1.7 }}>
                  {inline(sectionBody.replace(/\n/g, " "), `body-${idx}`)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer con contacto */}
        <div style={{
          fontSize: "10.5px",
          fontWeight: 600,
          color: t.muted,
          textAlign: "center",
          marginTop: 22,
          lineHeight: 1.6,
          paddingTop: 22,
          borderTop: `1px solid ${t.muted}22`,
        }}>
          Contacto: <span style={{ color: t.accent, fontWeight: 700 }}>soporte@orus.app</span>
        </div>
      </div>
    </div>
  );
}
