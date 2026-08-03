import { useState } from "react";
import { fmt, groupByDate } from "../utils/formatters";
import { METHOD_META } from "../constants";
import CatBar from "./CatBar";
import { useTheme } from "../hooks/useTheme";
import { DARK, LIGHT, RADIUS } from "../constants/tokens";
import { rowStyles, getClayShadow } from "../utils/clayStyles";

/**
 * PillarDetailPage.jsx
 * Detalle de un pilar (gasto, presupuesto, categorías y movimientos).
 * Extraído de App.jsx (RS-2) — comportamiento idéntico.
 */
export default function PillarDetailPage({ pillar, onBack, transactions }) {
  // 🆕 Tema desde ThemeContext
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;

  const [expandCategories, setExpandCategories] = useState(true);
  const hasBudget = pillar.budget != null && pillar.budget > 0;
  const pc = hasBudget ? Math.round((pillar.spent / pillar.budget) * 100) : null;
  const over = hasBudget && pc >= 100;

  // 🆕 Tokens del design (Spatial UI + Claymorfismo)
  const t = {
    bg: tokens.bg,
    header: tokens.bg,
    card: tokens.surfaceFlat,
    border: tokens.border,
    text: tokens.text,
    sub: tokens.sub,
  };
  const pillarTxs = (transactions || []).filter(tx => tx.pillar === pillar.id).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  const groups = groupByDate(pillarTxs);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 45, background: t.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 16px 16px 16px", background: t.header, borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: t.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0, marginBottom: 14, fontSize: 14, fontWeight: 600 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: isDark ? "#2D2D3A" : "#E5E3F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>←</div>
          <span>Volver</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{pillar.icon}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: t.text }}>{pillar.label}</span>
        </div>
      </div>

      <div style={{ padding: "16px 18px", background: t.header, borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: over ? (pillar.id === "ahorro" ? (isDark ? "#86EFAC" : "#22C55E") : "#EF4444") : (isDark ? "#F0EEFF" : "#1A1830") }}>
            -{fmt(pillar.spent)}
          </div>
          {hasBudget ? (
            <div style={{ border: `1.5px dashed ${pillar.color}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, color: pillar.color, whiteSpace: "nowrap", flexShrink: 0 }}>
              {pc}% del presupuesto
            </div>
          ) : (
            <div style={{ border: `1.5px dashed ${t.sub}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, color: t.sub, whiteSpace: "nowrap", flexShrink: 0 }}>
              Sin presupuesto
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", position: "relative", paddingBottom: "60px" }}>
        {hasBudget && (
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
            <button onClick={() => setExpandCategories(!expandCategories)} style={{ width: "100%", background: "none", border: "none", color: t.text, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Presupuesto: {fmt(pillar.budget)}</span>
              <span>{expandCategories ? "▼" : "▶"}</span>
            </button>
            {expandCategories && (
              <div style={{ marginTop: 12 }}>
                {pillar.categories.map(cat => (
                  <CatBar key={cat.name} cat={cat} color={pillar.color} isDark={isDark} pillarSpent={pillar.spent} />
                ))}
              </div>
            )}
          </div>
        )}

        {!hasBudget && pillar.categories.length > 0 && (
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
            <button onClick={() => setExpandCategories(!expandCategories)} style={{ width: "100%", background: "none", border: "none", color: t.text, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Conceptos</span>
              <span>{expandCategories ? "▼" : "▶"}</span>
            </button>
            {expandCategories && (
              <div style={{ marginTop: 12 }}>
                {pillar.categories.map(cat => (
                  <CatBar key={cat.name} cat={cat} color={pillar.color} isDark={isDark} pillarSpent={pillar.spent} />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ position: "sticky", top: 0, zIndex: 10, padding: "12px 18px", background: t.bg, borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: t.sub, letterSpacing: 0.5 }}>MOVIMIENTOS</div>
        </div>

        {groups.length === 0 ? (
          <div style={{ textAlign: "center", color: t.sub, fontSize: 13, paddingTop: 20, paddingBottom: 20 }}>
            Sin movimientos en esta categoría
          </div>
        ) : (
          <div style={{ padding: "0 18px" }}>
            {groups.map((group) => (
              <div key={group.date}>
                <div style={{ position: "sticky", top: 39, zIndex: 9, fontSize: 9, fontWeight: 700, color: t.sub, letterSpacing: 0.4, paddingBottom: 8, paddingTop: 12, background: t.bg, borderBottom: `1px solid ${t.border}`, marginBottom: 8 }}>
                  {group.label}
                </div>
                {group.items.map(tx => {
                  const method = METHOD_META[tx.method] || METHOD_META["Banco"];
                  return (
                    <div key={tx.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = isDark ? "#242433" : "#F3F0FF"} onMouseLeave={e => e.currentTarget.style.background = t.card}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 4 }}>
                          {tx.desc}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: isDark ? (method.darkBg || "#1e2535") : (method.bg || "#F1F5F9"), color: method.color, whiteSpace: "nowrap" }}>{tx.method}</span>
                          {tx.category && (
                            <span style={{ fontSize: 8, color: t.sub, whiteSpace: "nowrap" }}>• {tx.category}</span>
                          )}
                          <span style={{ fontSize: 8, color: t.sub }}>{tx.time}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, flexShrink: 0, marginLeft: 10, color: over ? (pillar.id === "ahorro" ? (isDark ? "#86EFAC" : "#22C55E") : "#EF4444") : (isDark ? "#FCA5A5" : "#EF4444") }}>
                        -{fmt(Math.abs(tx.amount))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 56, pointerEvents: "none", background: `linear-gradient(to bottom, transparent, ${t.bg})`, marginTop: 8 }} />
      </div>

      <div style={{ position: "absolute", bottom: 24, right: 18, zIndex: 35, display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: isDark ? "#3A3A52" : "#94A3B8", cursor: "pointer", boxShadow: "0 3px 10px rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)", cursor: "pointer", boxShadow: "0 6px 24px rgba(155,109,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none"/>
            <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
