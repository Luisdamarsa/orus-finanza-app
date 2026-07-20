import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";
import terminosRaw from "../legal/terminos.md?raw";
import privacidadRaw from "../legal/privacidad.md?raw";

/**
 * LegalPage.jsx — pantalla de documentos legales (Términos y Condiciones / Privacidad).
 * Mismo formato que las demás páginas (PageLayout: header + título centrado + contenido).
 * El contenido vive en src/legal/*.md (editable) y se renderiza con un mini-markdown.
 */
const DOCS = {
  terms: { title: "TÉRMINOS Y CONDICIONES", md: terminosRaw },
  privacy: { title: "TÉRMINOS DE PRIVACIDAD", md: privacidadRaw },
};

// Negritas **texto** dentro de una línea
function inline(text, k) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={`${k}-${i}`}>{p.slice(2, -2)}</strong>
      : <span key={`${k}-${i}`}>{p}</span>
  );
}

// Mini-renderer de markdown (subset: ##/###, >, -, **bold**, ---, párrafos). El # (H1) se omite
// porque el título lo pone PageLayout.
function renderMarkdown(md, t, isDark) {
  const out = [];
  let list = [];
  let key = 0;
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${key++}`} style={{ margin: "4px 0 10px", paddingLeft: 18 }}>
          {list.map((li, i) => (
            <li key={i} style={{ fontSize: 13, lineHeight: 1.55, color: t.text, marginBottom: 4 }}>{inline(li, `li-${i}`)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.replace(/\r$/, "");
    if (line.trim() === "") { flush(); continue; }
    if (line.startsWith("- ")) { list.push(line.slice(2)); continue; }
    flush();
    if (line.startsWith("# ")) continue; // título lo pone PageLayout
    else if (line.startsWith("### ")) out.push(<h3 key={key++} style={{ fontSize: 13.5, fontWeight: 700, color: t.text, margin: "12px 0 4px" }}>{inline(line.slice(4), key)}</h3>);
    else if (line.startsWith("## ")) out.push(<h2 key={key++} style={{ fontSize: 15, fontWeight: 800, color: t.text, margin: "18px 0 6px" }}>{inline(line.slice(3), key)}</h2>);
    else if (line.startsWith("> ")) out.push(
      <div key={key++} style={{ borderLeft: `3px solid #9B6DFF88`, padding: "7px 10px", margin: "8px 0", background: isDark ? "#1A1730" : "#F3F0FF", color: t.sub, fontSize: 12, lineHeight: 1.5, borderRadius: 6 }}>{inline(line.slice(2), key)}</div>
    );
    else if (line.startsWith("---")) out.push(<div key={key++} style={{ height: 1, background: t.border, margin: "14px 0" }} />);
    else out.push(<p key={key++} style={{ fontSize: 13, lineHeight: 1.6, color: t.text, margin: "0 0 8px" }}>{inline(line, key)}</p>);
  }
  flush();
  return out;
}

export default function LegalPage({ isDark, onBack, variant }) {
  const pressBack = usePress();
  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };
  const doc = DOCS[variant] || DOCS.terms;

  return (
    <PageLayout isDark={isDark} onBack={onBack} title={doc.title} pressBack={pressBack}>
      <div style={{ textAlign: "left" }}>
        {renderMarkdown(doc.md, t, isDark)}
      </div>
    </PageLayout>
  );
}
