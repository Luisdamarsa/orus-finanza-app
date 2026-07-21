import { useEffect, useRef, useState } from "react";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";
import { userStorage } from "../utils/userStorage";
import { CURRENCIES, LANGUAGES } from "../constants";

/**
 * PreferencesPage.jsx — "Preferencias".
 * Ajustes transversales de la app: tema (Día/Noche), idioma y moneda.
 * (Idioma y moneda vivían antes en Perfil.) Persisten en userStorage.
 * Las secciones entran desde abajo al montar (reveal por scroll). Ruteo en ScreenRouter.
 */
export default function PreferencesPage({ isDark, onBack, setTheme }) {
  const pressBack = usePress();
  const containerRef = useRef(null);

  const [currency, setCurrency] = useState(() => userStorage.getCurrency());
  const [language, setLanguage] = useState(() => userStorage.getLanguage());
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  // Reveal por scroll: cada sección aparece desde abajo al entrar en pantalla
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const t = isDark
    ? { bg: "#000000", card: "#141420", border: "#23233a", text: "#F0EEFF", sub: "#7B7A99", inputBg: "#1E1E2E" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99", inputBg: "#F1F0FF" };

  const chooseCurrency = (v) => { setCurrency(v); userStorage.setCurrency(v); setCurrencyOpen(false); };
  const chooseLanguage = (v) => { setLanguage(v); userStorage.setLanguage(v); setLanguageOpen(false); };

  const currencyLabel = CURRENCIES.find((o) => o.value === currency)?.label || currency;
  const languageLabel = LANGUAGES.find((o) => o.value === language)?.label || language;

  // Selector genérico (dropdown) reutilizado para idioma y moneda
  const Dropdown = ({ label, options, value, open, setOpen, onChoose }) => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.sub, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
        <span>{options.find((o) => o.value === value)?.label || value}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: t.sub, fontSize: 11 }}>▼</span>
      </button>
      {open && (
        <div style={{ marginTop: 6, borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, overflow: "hidden" }}>
          {options.map((o) => {
            const active = value === o.value;
            return (
              <button
                key={o.value}
                onClick={() => onChoose(o.value)}
                style={{ width: "100%", padding: "10px 14px", border: "none", borderBottom: o !== options[options.length - 1] ? `1px solid ${t.border}` : "none", background: active ? (isDark ? "#252540" : "#F0EFF8") : "transparent", color: active ? "#9B6DFF" : t.text, fontSize: 13.5, fontWeight: active ? 700 : 600, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
                <span>{o.label}</span>
                {active && <span style={{ color: "#9B6DFF" }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const card = { background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16, marginTop: 14 };

  return (
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      pressBack={pressBack}
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <span style={{ fontSize: 18 }}>⚙️</span>PREFERENCIAS
        </span>
      }
    >
      <style>{`
        .reveal{opacity:0;transform:translateY(26px);transition:opacity .5s ease, transform .5s ease;}
        .reveal.in{opacity:1;transform:none;}
      `}</style>

      <div ref={containerRef} style={{ textAlign: "left" }}>
        <div style={{ fontSize: 12.5, color: t.sub, lineHeight: 1.6, marginBottom: 6 }}>
          Ajusta cómo se ve y se comporta la app. Los cambios se guardan al instante.
        </div>

        {/* Tema */}
        <div className="reveal" style={card}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text, marginBottom: 10 }}>Tema</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { dark: false, icon: "☀️", label: "Día" },
              { dark: true, icon: "🌙", label: "Noche" },
            ].map((opt) => {
              const active = isDark === opt.dark;
              return (
                <button
                  key={opt.label}
                  onClick={() => setTheme(opt.dark)}
                  style={{
                    flex: 1, padding: "14px 0", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${active ? "#9B6DFF" : t.border}`,
                    background: active ? "#9B6DFF18" : t.inputBg,
                    color: t.text, fontSize: 13, fontWeight: 700,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  }}>
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  {opt.label}
                  {active && <span style={{ fontSize: 9, color: "#9B6DFF", fontWeight: 800 }}>ACTIVO</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Idioma */}
        <div className="reveal" style={{ ...card, transitionDelay: "0.08s" }}>
          <Dropdown label="Idioma" options={LANGUAGES} value={language} open={languageOpen} setOpen={setLanguageOpen} onChoose={chooseLanguage} />
        </div>

        {/* Moneda */}
        <div className="reveal" style={{ ...card, transitionDelay: "0.16s" }}>
          <Dropdown label="Moneda" options={CURRENCIES} value={currency} open={currencyOpen} setOpen={setCurrencyOpen} onChoose={chooseCurrency} />
        </div>

        <div style={{ fontSize: 10.5, color: t.sub, textAlign: "center", marginTop: 20, paddingBottom: 10, lineHeight: 1.5 }}>
          Idioma actual: <b style={{ color: t.text }}>{languageLabel}</b> · Moneda: <b style={{ color: t.text }}>{currencyLabel}</b>
        </div>
      </div>
    </PageLayout>
  );
}
