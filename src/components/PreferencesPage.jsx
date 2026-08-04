import { useEffect, useRef, useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { userStorage } from "../utils/userStorage";
import { CURRENCIES, LANGUAGES } from "../constants";
import { DARK, LIGHT, RADIUS } from "../constants/tokens";
import { inputStyles, getClayShadow, cardStyles } from "../utils/clayStyles";
import { getStaggerDelay } from "../constants/animations";

/**
 * PreferencesPage.jsx — "Preferencias".
 * Ajustes transversales de la app: tema (Día/Noche), idioma y moneda.
 * (Idioma y moneda vivían antes en Perfil.) Persisten en userStorage.
 * Las secciones entran desde abajo al montar (reveal por scroll). Ruteo en ScreenRouter.
 */
export default function PreferencesPage({ onBack }) {
  // 🆕 Tema desde ThemeContext
  const { isDark, setIsDark } = useTheme();
  const setTheme = setIsDark; // Alias para compatibilidad
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

  // 🆕 Tokens del design (Spatial UI + Claymorfismo)
  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    card: tokens.surfaceFlat,
    border: tokens.border,
    text: tokens.text,
    sub: tokens.sub,
    inputBg: tokens.inputBg,
  };

  const chooseCurrency = (v) => { setCurrency(v); userStorage.setCurrency(v); setCurrencyOpen(false); };
  const chooseLanguage = (v) => { setLanguage(v); userStorage.setLanguage(v); setLanguageOpen(false); };

  const currencyLabel = CURRENCIES.find((o) => o.value === currency)?.label || currency;
  const languageLabel = LANGUAGES.find((o) => o.value === language)?.label || language;

  // Selector genérico (dropdown) reutilizado para idioma y moneda
  const Dropdown = ({ label, options, value, open, setOpen, onChoose }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: t.text }}>{label}</div>
      <div style={{ flex: 1, maxWidth: 220, position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: "100%",
            borderRadius: 14,
            padding: "12px 14px",
            background: t.raised || "rgba(30,20,60,0.04)",
            border: "none",
            display: "flex",
            alignItems: "center",
            textAlign: "left",
            fontSize: 13,
            fontWeight: 600,
            color: t.text,
            cursor: "pointer",
          }}>
          <span>{options.find((o) => o.value === value)?.label || value}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {open && (
          <div style={{ marginTop: 6, borderRadius: 12, border: `1px solid ${t.border}`, background: t.card, overflow: "hidden", position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10 }}>
            {options.map((o) => {
              const active = value === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => { onChoose(o.value); setOpen(false); }}
                  style={{ width: "100%", padding: "10px 14px", border: "none", borderBottom: o !== options[options.length - 1] ? `1px solid ${t.border}` : "none", background: active ? (isDark ? "#252540" : "#F0EFF8") : "transparent", color: active ? "#9B6DFF" : t.text, fontSize: 13.5, fontWeight: active ? 700 : 600, cursor: "pointer", textAlign: "left", display: "flex",  }}>
                  <span>{o.label}</span>
                  {active && <span style={{ color: "#9B6DFF" }}>✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // 🆕 Tarjeta con gradiente y sombra clay
  const card = {
    padding: 16,
    marginTop: 12,
    borderRadius: 18,
    background: tokens.surfaceFlat || "transparent",
    boxShadow: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
  };

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
      <style>{`::-webkit-scrollbar { display: none; }
        .reveal{opacity:0;transform:translateY(26px);transition:opacity .5s ease, transform .5s ease;}
        .reveal.in{opacity:1;transform:none;}
      `}</style>

      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h13"/>
            <circle cx="15" cy="7" r="2"/>
            <circle cx="7" cy="12" r="2"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        }
        pageTitle="Preferencias"
        isDark={isDark}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 50px", boxSizing: "border-box" }}>

      {/* Descripción */}
      <div style={{ fontSize: 11.5, fontWeight: 600, color: t.sub, textAlign: "center", lineHeight: 1.5, marginBottom: 22, marginTop: 0 }}>
        Ajusta cómo se ve y se comporta la app. Los cambios se guardan al instante.
      </div>

      <div ref={containerRef} style={{ textAlign: "left" }}>
        {/* Tema — toggle sol/luna (estilo "Mostrar Ingresos") */}
        <div className="reveal" style={{ ...card, display: "flex", alignItems: "center",  }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>Tema</div>
            <div style={{ fontSize: 11.5, color: t.sub, marginTop: 2 }}>{isDark ? "Modo noche 🌙" : "Modo día ☀️"}</div>
          </div>
          <div
            onClick={() => setTheme(!isDark)}
            style={{ position: "relative", width: 60, height: 32, borderRadius: 16, background: t.inputBg, border: `1px solid ${t.border}`, cursor: "pointer", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: isDark ? 31 : 3, width: 26, height: 26, borderRadius: 13, background: "#9B6DFF", transition: "left 0.2s cubic-bezier(0.4,0,0.2,1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
              {isDark ? "🌙" : "☀️"}
            </div>
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

        <div style={{ fontSize: 11, fontWeight: 600, color: t.sub, textAlign: "center", marginTop: 20, paddingBottom: 10, lineHeight: 1.5 }}>
          Idioma actual: <span style={{ color: t.text, fontWeight: 700 }}>{languageLabel}</span> · Moneda: <span style={{ color: t.text, fontWeight: 700 }}>{currencyLabel}</span>
        </div>
      </div>
      </div>
    </div>
  );
}
