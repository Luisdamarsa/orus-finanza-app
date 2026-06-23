import { useState, useEffect } from "react";
import { Component } from "react";

// Imports desde los nuevos módulos organizados
import {
  PILLARS, SALDO_COLOR, MONTHS_SHORT, MONTHS_FULL, METHOD_META, PILLAR_MAP,
  ALL_CATS, MANUAL_METHODS, TRANSACTIONS, DUMMY_TRANSACTIONS, DUMMY_BALANCES
} from "./constants";

import { fmt, fmtDate, getPeriodLabel, groupByDate } from "./utils/formatters";
import {
  getEffectiveBalance, calculateSaldo, calculateSaldoForDonut,
  calculateDonutTotal, calculateSaldoPercentage, shouldLoadBalance,
  addDateToBalance
} from "./utils/calculations";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: "100vw", height: "100vh",
          background: "#0D0D1A",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: 20
        }}>
          <div style={{
            maxWidth: "500px", background: "#1A1A2B",
            borderRadius: 24, border: "1px solid #2D2D3A",
            padding: "40px 20px", textAlign: "center",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)"
          }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>⚠️</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#F0EEFF", marginBottom: 12 }}>
              Oops! Algo salió mal
            </div>
            <div style={{ fontSize: 14, color: "#7B7A99", marginBottom: 20, lineHeight: 1.6 }}>
              La aplicación encontró un error inesperado. Intenta recargar la página.
            </div>
            <div style={{
              background: "#252535", borderRadius: 12,
              padding: 16, marginBottom: 20,
              textAlign: "left", fontSize: 12,
              color: "#FCA5A5", maxHeight: 120, overflowY: "auto",
              fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word"
            }}>
              {this.state.error?.message || "Error desconocido"}
            </div>
            <button onClick={() => window.location.reload()} style={{
              width: "100%", padding: "13px 0", borderRadius: 12,
              border: "none", background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s"
            }}>
              Recargar aplicación →
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const arcPath = (cx, cy, r, startAngle, endAngle) => {
  const rad = ((startAngle - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad), y1 = cy + r * Math.sin(rad);
  const rad2 = ((endAngle - 90) * Math.PI) / 180;
  const x2 = cx + r * Math.cos(rad2), y2 = cy + r * Math.sin(rad2);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

function DonutChart({ segments, cx, cy, outerR, innerR, activeId, onSelect, isDark, gastos, total }) {
  const [hovered, setHovered] = useState(null);
  let cursor = 0;
  const arcs = segments.map(seg => { const start = cursor; const sweep = seg.pct * 3.6; cursor += sweep; return { ...seg, start, end: cursor - 0.3 }; });
  return (
    <svg width={cx * 2} height={cy * 2} style={{ overflow: "visible" }}>
      {arcs.map(arc => {
        const isActive = activeId === arc.id; const isHovered = hovered === arc.id; const scale = isActive ? 1.05 : isHovered ? 1.02 : 1; const op = activeId && !isActive ? 0.45 : 1;
        return (
          <g key={arc.id} style={{ cursor: "pointer", transition: "opacity 0.25s" }} onClick={() => onSelect(isActive ? null : arc.id)} onMouseEnter={() => setHovered(arc.id)} onMouseLeave={() => setHovered(null)}>
            {isActive && <path d={arcPath(cx, cy, outerR + 2, arc.start, arc.end)} fill="none" stroke={arc.color} strokeWidth={20} strokeOpacity={0.22} strokeLinecap="round" style={{ transition: "all 0.3s" }} />}
            <path d={arcPath(cx, cy, outerR, arc.start, arc.end)} fill="none" stroke={arc.color} strokeWidth={isActive ? 31 : isHovered ? 28 : 24} strokeLinecap="round" opacity={op} style={{ transition: "all 0.25s cubic-bezier(.4,0,.2,1)", transformOrigin: `${cx}px ${cy}px`, transform: `scale(${scale})` }} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR} fill="#000000" />
      {/* Donut center text - Gastado */}
      {gastos !== undefined && total !== undefined && (
        <g>
          <text x={cx} y={cy - 18} textAnchor="middle" style={{ fontSize: 13, fontWeight: 600, fill: isDark ? "#7B7A99" : "#9896B0" }}>
            Gastado
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: isDark ? "#F0EEFF" : "#1A1830" }}>
            {fmt(gastos)}
          </text>
          {/* Mostrar "de X" si total > 0 (siempre mostrar referencia de cuánto tenía disponible) */}
          {total > 0 && (
            <text x={cx} y={cy + 26} textAnchor="middle" style={{ fontSize: 15, fontWeight: 400, fill: isDark ? "#7B7A99" : "#9896B0" }}>
              de {fmt(total)}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

function CatBar({ cat, color, isDark, pillarSpent }) {
  const hasBudget = cat.budget != null && cat.budget > 0;
  const p = hasBudget ? Math.round((cat.spent / cat.budget) * 100) : null;
  const pOfPillar = pillarSpent > 0 ? Math.round((cat.spent / pillarSpent) * 100) : 0;
  const barColor = hasBudget && p >= 100 ? "#FCA5A5" : color;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: isDark ? "#E2E0F5" : "#374151", fontWeight: 500 }}>{cat.name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#A0A0C0" : "#6B7280" }}>
          {fmt(cat.spent)}{hasBudget ? <span style={{ fontWeight: 400, opacity: 0.6 }}> / {fmt(cat.budget)}</span> : <span style={{ fontWeight: 400, opacity: 0.6 }}> · {pOfPillar}%</span>}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: isDark ? "#2D2D3A" : "#E5E7EB", overflow: "hidden" }}>
        <div style={{ height: "100%", width: hasBudget ? `${Math.min(p, 100)}%` : `${pOfPillar}%`, borderRadius: 3, background: barColor, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function TransactionsList({ isDark, transactions, filteredPillar, stickyH, selectedPeriod }) {
  const t = isDark ? { text: "#F0EEFF", sub: "#7B7A99", divider: "#2D2D3A", bg: "#141420" } : { text: "#1A1830", sub: "#9896B0", divider: "#E5E3F5", bg: "#F8F7FF" };

  const displayTxns = transactions.filter(tx => {
    const matchesPeriod = !selectedPeriod || (() => {
      const [txYear, txMonth] = tx.date.split("-").map(Number);
      return txYear === selectedPeriod.year && txMonth === selectedPeriod.month;
    })();
    const matchesPillar = !filteredPillar || tx.pillar === filteredPillar;
    return matchesPeriod && matchesPillar;
  });
  const groups = groupByDate(displayTxns);

  return (
    <>
      {groups.map((group) => (
        <div key={group.date} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 5px", position: "sticky", top: 0, zIndex: 15, background: t.bg, border: `1px solid ${isDark ? "#2D2D3A55" : "#E5E3F566"}`, borderRadius: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: t.sub }}>{group.label.toUpperCase()}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: group.dayTotal < 0 ? "#EF4444" : "#22C55E" }}>{group.dayTotal < 0 ? "-" : "+"}{fmt(Math.abs(group.dayTotal))}</span>
          </div>
          <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${t.divider}` }}>
            {group.items.map((tx, i) => {
              const isIngreso = tx.amount > 0 || tx.pillar === "ingreso";
              const pillar = PILLAR_MAP[tx.pillar] || PILLAR_MAP["varios"];
              const method = METHOD_META[tx.method] || METHOD_META["Banco"];
              return (
                <div key={tx.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
                  borderBottom: i < group.items.length - 1 ? `1px solid ${t.divider}` : "none",
                  background: isIngreso ? (isDark ? "#0b1f14" : "#f0fdf4") : (isDark ? "#1A1A28" : "#FFFFFF"),
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: isIngreso ? "#22C55E28" : (pillar.color + "28"), border: `1px solid ${isIngreso ? "#22C55E44" : pillar.color + "44"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{isIngreso ? "💚" : pillar.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.desc}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 5, background: isDark ? (method.darkBg || "#1e2535") : (method.bg || "#F1F5F9"), color: method.color }}>{tx.method}</span>
                      {isIngreso ? (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 5, background: isDark ? "#0d2118" : "#dcfce7", color: "#22C55E" }}>Ingreso</span>
                      ) : (
                        <span style={{ fontSize: 10, color: t.sub }}><span style={{ color: pillar.color, fontWeight: 600 }}>{pillar.label}</span>{tx.category ? <>{" → "}{tx.category}</> : null}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isIngreso ? "#22C55E" : tx.pillar === "ahorro" ? (isDark ? "#86EFAC" : "#22C55E") : (isDark ? "#FCA5A5" : "#EF4444") }}>{isIngreso ? "+" : "-"}{fmt(Math.abs(tx.amount))}</div>
                    <div style={{ fontSize: 10, color: t.sub, marginTop: 2 }}>{tx.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function Movimientos({ isDark, transactions, filteredPillar, setFilteredPillar, stickyTop, selectedPeriod, onOpen, isOpen }) {
  const handleOpen = () => {
    onOpen(!isOpen);
  };
  const t = isDark ? { text: "#F0EEFF", sub: "#7B7A99", divider: "#2D2D3A", bg: "#141420" } : { text: "#1A1830", sub: "#9896B0", divider: "#E5E3F5", bg: "#F8F7FF" };

  // Filtra por período y pillar
  const displayTxns = transactions.filter(tx => {
    const matchesPeriod = !selectedPeriod || (() => {
      const [txYear, txMonth] = tx.date.split("-").map(Number);
      return txYear === selectedPeriod.year && txMonth === selectedPeriod.month;
    })();
    const matchesPillar = !filteredPillar || tx.pillar === filteredPillar;
    return matchesPeriod && matchesPillar;
  });

  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={handleOpen} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: t.bg, border: `1.5px solid ${t.divider}`, padding: "10px 8px 10px", cursor: "pointer",
        position: "sticky", top: 0, zIndex: 20, borderRadius: 24, marginBottom: 8,
        overflow: "hidden", boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Movimientos</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, background: isDark ? "#2D2D3A" : "#E5E3F5", color: t.sub }}>{displayTxns.length}</span>
          {filteredPillar && (
            <div onClick={e => { e.stopPropagation(); setFilteredPillar(null); }} style={{
              marginLeft: 6, padding: "1px 7px", borderRadius: 10, border: "none", background: "#9B6DFF22", color: "#9B6DFF", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}>
              {PILLAR_MAP[filteredPillar]?.icon}{PILLAR_MAP[filteredPillar]?.label}<span>✕</span>
            </div>
          )}
        </div>
        <span style={{ fontSize: 11, color: t.sub, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>▼</span>
      </button>
    </div>
  );
}

function PeriodSelector({ isDark, selectedPeriod, onSelect, onClose, monthHasData }) {
  const t = isDark ? { bg: "#1A1A2B", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" } : { bg: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };
  const isSel = (month) => selectedPeriod && selectedPeriod.month === month;
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 55,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end",
    }}>
      <style>{`@keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }`}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%",
        background: t.bg,
        borderRadius: "22px 22px 0 0",
        border: `1px solid ${t.border}`,
        borderBottom: "none",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.32)",
        animation: "slideUp 0.3s cubic-bezier(.22,1,.36,1)",
        maxHeight: "68%",
        overflowY: "auto",
        scrollbarWidth: "none",
        paddingBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: isDark ? "#3D3D55" : "#D5D3E8" }} />
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 18px 12px",
          borderBottom: `1px solid ${t.border}`,
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: t.text }}>Período</span>
          <button onClick={onClose} style={{
            width: 26, height: 26, borderRadius: "50%",
            background: isDark ? "#2D2D3A" : "#F0EFF8",
            border: "none", cursor: "pointer",
            color: t.sub, fontSize: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
        <div style={{ padding: "0 14px" }}>
          <button onClick={() => { onSelect(null); onClose(); }} style={{
            width: "100%", padding: "9px 14px", borderRadius: 12, border: "none",
            cursor: "pointer", textAlign: "left", marginBottom: 16,
            background: !selectedPeriod ? "#9B6DFF22" : (isDark ? "#1E1E2E" : "#F0EFF8"),
            outline: !selectedPeriod ? "1.5px solid #9B6DFF88" : "1.5px solid transparent",
            display: "flex", alignItems: "center", gap: 9,
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 15 }}>📅</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: !selectedPeriod ? "#9B6DFF" : t.text, flex: 1 }}>Todo el tiempo</span>
            {!selectedPeriod && <span style={{ fontSize: 13, color: "#9B6DFF" }}>✓</span>}
          </button>

          <div style={{ fontSize: 10, fontWeight: 800, color: t.sub, letterSpacing: 0.6, marginBottom: 8 }}>2026</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 5, marginBottom: 20 }}>
            {MONTHS_SHORT.map((mLabel, idx) => {
              const month = idx + 1; const sel = isSel(month); const hasData = monthHasData(month, 2026);
              return (
                <button key={month} onClick={() => { onSelect({ year: 2026, month }); onClose(); }} disabled={!hasData} style={{
                  padding: "8px 2px", borderRadius: 9, border: "none",
                  cursor: hasData ? "pointer" : "not-allowed",
                  background: sel ? "#9B6DFF" : (isDark ? "#2D2D3A" : "#EDEDF7"),
                  color: sel ? "#fff" : (hasData ? t.text : t.sub),
                  fontSize: 10, fontWeight: sel ? 800 : 600,
                  transition: "all 0.15s",
                  opacity: hasData ? 1 : 0.4,
                }}>
                  {mLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewTransactionPage({ onBack, onDone, isDark, customConcepts }) {
  const [desc, setDesc] = useState("");
  const [rawAmount, setRawAmount] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [method, setMethod] = useState(null);
  const [concept, setConcept] = useState(null);
  const [pillarId, setPillarId] = useState(null);
  const [conceptOpen, setConceptOpen] = useState(false);
  const [newConceptText, setNewConceptText] = useState("");

  const numericAmount = parseInt(rawAmount.replace(/\D/g, "")) || 0;
  const hasAmount = numericAmount > 0;
  const t = isDark ? { bg:"#0D0D1A", card:"#181828", border:"#2D2D3A", cardBorder:"#2D2D4A", text:"#F0EEFF", sub:"#7B7A99", ph:"#4A4A6A", divider:"#252538" } : { bg:"#F8F7FF", card:"#FFFFFF", border:"#E5E3F5", cardBorder:"#E5E3F5", text:"#1A1830", sub:"#9896B0", ph:"#C4C2E0", divider:"#F0EFF8" };
  const amountColor = hasAmount ? (isIncome ? "#22C55E" : "#EF4444") : t.sub;

  function handleConceptPick(cat) {
    setConcept(cat.name);
    setPillarId(cat.pillar);
    setConceptOpen(false);
    setNewConceptText("");
  }

  function handleCreateConcept() {
    const name = newConceptText.trim();
    if (!name) return;
    setConcept(name);
    setPillarId(null);
    setConceptOpen(false);
    setNewConceptText("");
  }

  return (
    <div style={{
      position:"absolute", inset:0, zIndex:40,
      background: isDark ? "#0D0D1A" : "#F8F7FF",
      display:"flex", flexDirection:"column",
      padding:"56px 22px 24px",
      boxSizing:"border-box",
    }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ddDown   { from{opacity:0;transform:scaleY(0.92);transform-origin:top} to{opacity:1;transform:scaleY(1)} }
      `}</style>

      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:0 }}>
        <button onClick={onBack} style={{
          width:30, height:30, borderRadius:9, border:"none",
          background: isDark ? "#1E1E2E" : "#EEE9FF",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={isDark?"#C4C2E0":"#6B7280"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={{ fontSize:12, color:t.sub, fontWeight:500 }}>Volver</span>
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{
          background: t.card,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: 20,
          padding: "18px 18px 16px",
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 4px 20px rgba(100,80,200,0.08)",
        }}>

          <div style={{ fontSize:10, fontWeight:800, color:"#9B6DFF", letterSpacing:1, marginBottom:12 }}>
            NUEVA TRANSACCIÓN
          </div>

          <input
            type="text"
            placeholder="Descripción del movimiento..."
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={{
              width:"100%", background:"none", border:"none", outline:"none",
              fontSize:14, fontWeight:desc ? 700 : 400,
              color: desc ? t.text : t.ph,
              fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              marginBottom:14, padding:0, boxSizing:"border-box",
            }}
          />

          <div style={{ height:1, background:t.divider, marginBottom:12 }}/>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
              <span style={{ fontSize:13, fontWeight:700, color:amountColor }}>$</span>
              <input
                type="text" inputMode="numeric"
                placeholder="0"
                value={numericAmount > 0 ? numericAmount.toLocaleString("es-CO") : ""}
                onChange={e => setRawAmount(e.target.value)}
                style={{
                  background:"none", border:"none", outline:"none",
                  fontSize:22, fontWeight:800, color:amountColor,
                  width:140,
                  fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  padding:0,
                }}
              />
            </div>

            {hasAmount && (
              <div style={{ display:"flex", borderRadius:8, overflow:"hidden",
                border:`1px solid ${t.border}`, animation:"fadeInUp 0.18s ease", flexShrink:0 }}>
                <button onClick={() => setIsIncome(false)} style={{
                  padding:"4px 9px", border:"none", cursor:"pointer", fontSize:11, fontWeight:700,
                  background: !isIncome ? "#FCA5A5" : (isDark?"#252538":"#F8F7FF"),
                  color: !isIncome ? "#991B1B" : t.sub,
                  transition:"all 0.15s",
                }}>−</button>
                <div style={{ width:1, background:t.border }}/>
                <button onClick={() => setIsIncome(true)} style={{
                  padding:"4px 9px", border:"none", cursor:"pointer", fontSize:11, fontWeight:700,
                  background: isIncome ? "#86EFAC" : (isDark?"#252538":"#F8F7FF"),
                  color: isIncome ? "#14532D" : t.sub,
                  transition:"all 0.15s",
                }}>+</button>
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
            {MANUAL_METHODS.map(m => {
              const active = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  padding:"4px 10px", borderRadius:20, border:"none", cursor:"pointer",
                  background: active ? m.color+"22" : (isDark?"#252538":"#F0EFF8"),
                  color: active ? m.color : t.sub,
                  fontSize:11, fontWeight:700,
                  outline: active ? `1.5px solid ${m.color}66` : "1.5px solid transparent",
                  transition:"all 0.18s",
                }}>
                  {m.icon} {m.id}
                </button>
              );
            })}
          </div>

          {!isIncome && <div style={{ height:1, background:t.divider, marginBottom:12 }}/>}

          {isIncome && hasAmount && (
            <div style={{
              marginTop:12, display:"flex", alignItems:"center", gap:8,
              padding:"9px 14px", borderRadius:14,
              background: isDark ? "#0d2118" : "#F0FDF4",
              border:"1px solid #86EFAC44",
              animation:"fadeInUp 0.2s ease",
            }}>
              <span style={{ fontSize:16 }}>💰</span>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#22C55E" }}>→ Tu saldo</div>
                <div style={{ fontSize:10, color: isDark?"#5ebd8a":"#4ade80", marginTop:1 }}>El ingreso se suma directamente a tu saldo</div>
              </div>
            </div>
          )}

          {!isIncome && (
            <div style={{ position:"relative" }}>
              <button onClick={() => setConceptOpen(o => !o)} style={{
                width:"100%", padding:"8px 14px", borderRadius:20, cursor:"pointer",
                border:`1.5px dashed ${concept ? "#9B6DFF99" : "#9B6DFF66"}`,
                background:"transparent",
                display:"flex", alignItems:"center", gap:8,
                transition:"border 0.2s",
              }}>
                <span style={{ fontSize:13 }}>🏷</span>
                <span style={{ fontSize:12, color:concept?t.text:"#9B6DFF", fontWeight:concept?700:500, flex:1, textAlign:"left" }}>
                  {concept || "Selecciona el concepto"}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#9B6DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform:conceptOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {conceptOpen && (
                <div style={{
                  position:"absolute", top:"calc(100% + 8px)", left:0, right:0, zIndex:50,
                  background: isDark?"#1C1C2E":"#FAFAFE",
                  border:`1px solid ${isDark?"#2D2D4A":"#E5E3F5"}`,
                  borderRadius:20,
                  boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(155,109,255,0.12)" : "0 12px 40px rgba(100,80,200,0.14), 0 0 0 1px rgba(155,109,255,0.08)",
                  maxHeight:230, overflowY:"auto", scrollbarWidth:"none",
                  animation:"ddDown 0.18s ease",
                  padding:"6px",
                }}>
                  <div style={{
                    display:"flex", alignItems:"center", gap:8,
                    padding:"8px 10px",
                    background: isDark?"#252540":"#F0EEFF",
                    borderRadius:14, marginBottom:6,
                  }}>
                    <span style={{ fontSize:14 }}>✦</span>
                    <input
                      type="text"
                      placeholder="Nuevo concepto..."
                      value={newConceptText}
                      onChange={e => setNewConceptText(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && handleCreateConcept()}
                      style={{
                        flex:1, background:"none", border:"none", outline:"none",
                        fontSize:12, color:t.text, fontStyle:"italic",
                        fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      }}
                    />
                    {newConceptText.trim() && (
                      <button onClick={handleCreateConcept} style={{
                        padding:"4px 11px", borderRadius:20, border:"none",
                        background:"linear-gradient(135deg,#9B6DFF,#4F8EF7)",
                        color:"white", fontSize:11, fontWeight:700, cursor:"pointer",
                        flexShrink:0,
                      }}>Crear</button>
                    )}
                  </div>

                  {Object.entries([...ALL_CATS, ...(customConcepts||[])].reduce((acc, cat) => {
                    (acc[cat.pillar] = acc[cat.pillar] || []).push(cat); return acc;
                  }, {})).map(([pid, cats]) => {
                    const p = PILLARS.find(x => x.id === pid);
                    return (
                      <div key={pid} style={{ marginBottom:4 }}>
                        <div style={{
                          display:"inline-flex", alignItems:"center", gap:4,
                          margin:"2px 4px 4px",
                          padding:"2px 9px",
                          borderRadius:20,
                          background: isDark ? `${p.color}22` : `${p.color}18`,
                          border:`1px solid ${p.color}44`,
                        }}>
                          <span style={{ fontSize:9 }}>{p.icon}</span>
                          <span style={{ fontSize:9, fontWeight:800, color:p.color, letterSpacing:0.6 }}>
                            {p.label.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:1, padding:"0 2px" }}>
                          {cats.map(cat => {
                            const isActive = concept === cat.name;
                            return (
                              <button key={cat.name} onClick={() => handleConceptPick(cat)} style={{
                                width:"100%", padding:"7px 12px", border:"none", cursor:"pointer",
                                borderRadius:12,
                                background: isActive ? (isDark ? `${p.color}30` : `${p.color}18`) : "transparent",
                                display:"flex", alignItems:"center", justifyContent:"space-between",
                                transition:"background 0.15s",
                              }}>
                                <span style={{
                                  fontSize:12, fontWeight: isActive ? 700 : 400,
                                  color: isActive ? p.color : t.text,
                                }}>
                                  {cat.name}
                                </span>
                                {isActive && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke={p.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!isIncome && concept && !conceptOpen && (
            <div style={{ marginTop:12, animation:"fadeInUp 0.2s ease" }}>
              <div style={{ fontSize:10, marginBottom:8, fontWeight:600,
                color: pillarId ? t.sub : "#F59E0B",
                display:"flex", alignItems:"center", gap:5 }}>
                {pillarId
                  ? <>Categoría <span style={{ opacity:0.6 }}>· toca para cambiar</span></>
                  : <>⚑ Elige una categoría para este concepto</>}
              </div>
              <div style={{ display:"flex", gap:5 }}>
                {PILLARS.map(p => {
                  const active = pillarId === p.id;
                  return (
                    <button key={p.id} onClick={() => setPillarId(p.id)} style={{
                      flex:1, padding:"7px 2px", borderRadius:12, border:"none", cursor:"pointer",
                      background: active ? (isDark?p.darkBg:p.bg) : (isDark?"#252538":"#F0EFF8"),
                      outline: active ? `2px solid ${p.color}88` : "2px solid transparent",
                      transition:"all 0.18s",
                    }}>
                      <div style={{ fontSize:16 }}>{p.icon}</div>
                      <div style={{ fontSize:9, fontWeight:700, marginTop:2,
                        color:active?(isDark?p.color:p.darkColor):t.sub }}>{p.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      <div style={{ position:"absolute", bottom:24, right:22 }}>
        <button
          onClick={() => onDone({ desc, rawAmount, isIncome, method, concept, pillarId })}
          style={{
            width:52, height:52, borderRadius:"50%", border:"none",
            background:"linear-gradient(135deg, #9B6DFF, #4F8EF7)",
            cursor:"pointer",
            boxShadow:"0 6px 24px rgba(155,109,255,0.45)",
            display:"flex", alignItems:"center", justifyContent:"center",
            opacity:(desc||hasAmount) ? 1 : 0.45,
            transition:"opacity 0.2s",
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function PillarBarsPopup({ pillar, onClose, onViewMovements, isDark }) {
  const t = isDark ? { border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" } : { border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px", animation: "fadeIn 0.2s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }@keyframes popIn  { from { transform:scale(0.92);opacity:0 } to { transform:scale(1);opacity:1 } }`}</style>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 300, background: isDark ? "#1A1A2B" : "#FFFFFF", borderRadius: 20, border: `1px solid ${t.border}`, padding: "16px", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", animation: "popIn 0.22s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 18 }}>{pillar.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: t.text }}>{pillar.label}</div>
          </div>
          <button onClick={onClose} style={{ width: 24, height: 24, borderRadius: "50%", background: isDark ? "#2D2D3A" : "#F0EFF8", border: "none", fontSize: 11, cursor: "pointer", color: t.sub, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        {pillar.budget != null && (
          <div style={{ textAlign: "center", marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 9, color: pillar.color, fontWeight: 700, letterSpacing: 0.4 }}>{pillar.label.toUpperCase()}</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: t.text, lineHeight: 1.1, marginTop: 4 }}>{fmt(pillar.spent)}</div>
            <div style={{ fontSize: 9, color: t.sub, marginTop: 2 }}>de {fmt(pillar.budget)}</div>
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          {pillar.categories.map(cat => (
            <CatBar key={cat.name} cat={cat} color={pillar.color} isDark={isDark} pillarSpent={pillar.spent} />
          ))}
        </div>
        <button onClick={onViewMovements} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: pillar.color + "22", color: pillar.color, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
          Ver movimientos →
        </button>
      </div>
    </div>
  );
}

function PillarDetailPage({ pillar, onBack, isDark, transactions }) {
  const [expandCategories, setExpandCategories] = useState(true);
  const hasBudget = pillar.budget != null && pillar.budget > 0;
  const pc = hasBudget ? Math.round((pillar.spent / pillar.budget) * 100) : null;
  const over = hasBudget && pc >= 100;
  const t = isDark ? { bg: "#0a0a0f", header: "#141420", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" } : { bg: "#FFFFFF", header: "#FFFFFF", card: "#F8F7FF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };
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

function UpdateBalanceModal({ onDone, onClose, isDark, currentSaldo }) {
  const [raw, setRaw] = useState("");
  const t = isDark ? { border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" } : { border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };
  const numeric = parseInt((raw || "").replace(/\D/g, "")) || 0;
  const isValid = raw.trim().length > 0 && numeric > 0;

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px", animation: "fadeIn 0.2s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }@keyframes popIn  { from { transform:scale(0.92);opacity:0 } to { transform:scale(1);opacity:1 } }`}</style>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: isDark ? "#1A1A2B" : "#FFFFFF", borderRadius: 24, border: `1px solid ${t.border}`, padding: "20px", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", animation: "popIn 0.22s cubic-bezier(.34,1.56,.64,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: t.text }}>💰 Actualizar saldo</div>
            <div style={{ fontSize: 11, color: t.sub, marginTop: 3 }}>¿Cuánto tienes disponible ahora?</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: isDark ? "#2D2D3A" : "#F0EFF8", border: "none", fontSize: 13, cursor: "pointer", color: t.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ position: "relative", marginBottom: currentSaldo != null ? 10 : 16 }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, fontWeight: 700, color: t.sub, pointerEvents: "none" }}>$</div>
          <input
            type="text" inputMode="numeric" placeholder="0" autoFocus
            value={raw ? parseInt(raw.replace(/\D/g, "")).toLocaleString("es-CO") : ""}
            onChange={e => setRaw(e.target.value)}
            style={{ width: "100%", padding: "12px 12px 12px 28px", borderRadius: 12, border: `1.5px solid ${isValid ? "#86EFAC" : t.border}`, background: isDark ? "#252535" : "#F8F7FF", color: t.text, fontSize: 18, fontWeight: 700, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
          />
        </div>
        {currentSaldo != null && (
          <div style={{ fontSize: 11, color: t.sub, marginBottom: 14, textAlign: "center" }}>
            Saldo calculado actualmente:{" "}
            <strong style={{ color: currentSaldo < 0 ? "#EF4444" : "#22C55E" }}>
              {currentSaldo < 0 ? "-" : ""}{fmt(Math.abs(currentSaldo))}
            </strong>
          </div>
        )}
        <button
          onClick={() => { if (isValid) onDone(numeric); }}
          style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: isValid ? "linear-gradient(135deg, #9B6DFF, #4F8EF7)" : (isDark ? "#2D2D3A" : "#E5E3F5"), color: isValid ? "#fff" : t.sub, fontSize: 14, fontWeight: 700, cursor: isValid ? "pointer" : "default", transition: "all 0.2s" }}
        >
          Confirmar nuevo saldo →
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const isDark = true; // Solo modo oscuro
  const [scrollY, setScrollY] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [filteredPillar, setFilteredPillar] = useState(null);
  const [showPillarBars, setShowPillarBars] = useState(false);
  const [selectedPillarDetail, setSelectedPillarDetail] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showUpdateBalance, setShowUpdateBalance] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({ year: 2026, month: 3 });
  const [screen, setScreen] = useState("dashboard");
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [customConcepts, setCustomConcepts] = useState([]);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [isMovementOpen, setIsMovementOpen] = useState(false);

  // localStorage utilities - TEMPORAL (Supabase later)
  useEffect(() => {
    // Inicializar con datos dummy SOLO EN DESARROLLO si localStorage está vacío
    const isFirstLoad = !localStorage.getItem("orus_transactions");
    const isDevelopment = import.meta.env.DEV; // true en desarrollo, false en producción

    if (isFirstLoad && isDevelopment) {
      // Solo cargar datos dummy en desarrollo
      localStorage.setItem("orus_transactions", JSON.stringify(DUMMY_TRANSACTIONS));
      localStorage.setItem("orus_balances", JSON.stringify(DUMMY_BALANCES));
    }

    // Cargar transacciones desde localStorage
    try {
      const stored = localStorage.getItem("orus_transactions");
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading transactions:", e);
    }

    // Cargar balance desde localStorage SOLO si es de un mes previo (no el mes actual)
    try {
      const stored = localStorage.getItem("orus_balances"); // Solo una llave
      if (stored) {
        const saved = Array.isArray(JSON.parse(stored))
          ? JSON.parse(stored)[0] // Si es array, tomar el primero
          : JSON.parse(stored); // Si es objeto único, usar directo

        const today = new Date();
        const currentMonth = today.getMonth() + 1; // 1-12
        const currentYear = today.getFullYear();

        // Solo cargar si es de un mes ANTERIOR (no el mes actual)
        if (saved && saved.month && saved.year) {
          const isCurrentMonth = saved.month === currentMonth && saved.year === currentYear;
          const isPastMonth = saved.year < currentYear || (saved.year === currentYear && saved.month < currentMonth);

          if (isPastMonth) {
            setBalance(saved);
          }
        }
      }
    } catch (e) {
      console.error("Error loading balance:", e);
    }
  }, []); // Solo ejecutar una vez al montar

  // Guardar transacciones cuando cambien
  useEffect(() => {
    localStorage.setItem("orus_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Guardar balance cuando cambien (con mes/año para validar al cargar)
  useEffect(() => {
    if (balance) {
      const today = new Date();
      const balanceWithDate = {
        ...balance,
        month: today.getMonth() + 1, // 1-12
        year: today.getFullYear(),
      };
      localStorage.setItem("orus_balances", JSON.stringify(balanceWithDate));
    }
  }, [balance]);

  // Filtra transacciones por período seleccionado
  const filteredByPeriod = selectedPeriod
    ? transactions.filter(tx => {
        const [txYear, txMonth] = tx.date.split("-").map(Number);
        return txYear === selectedPeriod.year && txMonth === selectedPeriod.month;
      })
    : transactions;

  // Verifica si un mes/año tiene datos (usa el estado transactions actual)
  const monthHasData = (month, year) => {
    return transactions.some(tx => {
      const [txYear, txMonth] = tx.date.split("-").map(Number);
      return txYear === year && txMonth === month;
    });
  };

  // Calcula gastos e ingresos del período filtrado
  const totalSpent = filteredByPeriod
    .filter(tx => tx.amount < 0 && tx.pillar !== "ingreso")
    .reduce((s, tx) => s + Math.abs(tx.amount), 0);

  const incomingTotal = filteredByPeriod
    .filter(tx => tx.amount > 0 || tx.pillar === "ingreso")
    .reduce((s, tx) => s + (tx.amount > 0 ? tx.amount : 0), 0);

  // Recalcula PILLARS spending basado en período filtrado
  const pillarSpends = {};
  PILLARS.forEach(p => pillarSpends[p.id] = 0);
  filteredByPeriod
    .filter(tx => tx.amount < 0 && tx.pillar !== "ingreso")
    .forEach(tx => {
      if (pillarSpends[tx.pillar] !== undefined) {
        pillarSpends[tx.pillar] += Math.abs(tx.amount);
      }
    });

  const effectiveBalance = (balance && selectedPeriod && balance.year === selectedPeriod.year && balance.month === selectedPeriod.month) ? balance.value : null;
  const saldo = effectiveBalance != null ? effectiveBalance - totalSpent + incomingTotal : null;

  const sy = scrollY || 0;
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Colapso instantáneo basado en click (no scroll)
  const p1 = isMovementOpen ? 1 : 0;
  const p2 = isMovementOpen ? 1 : 0;

  const COLLAPSED_H = 96;
  const MOVIMIENTOS_H = 56; // marginTop: 16px + barra: ~40px
  const stickyH = isMovementOpen ? COLLAPSED_H + MOVIMIENTOS_H : 510 + MOVIMIENTOS_H;

  // Usa pillarSpends para calcular percentajes en el gráfico
  const rawPcts = PILLARS.map(p => totalSpent > 0 ? (pillarSpends[p.id] / totalSpent) * 100 : 0);
  const floorPcts = rawPcts.map(Math.floor);
  const toAdd = 100 - floorPcts.reduce((a, b) => a + b, 0);
  const byRem = rawPcts.map((v, i) => ({ i, rem: v - Math.floor(v) })).sort((a, b) => b.rem - a.rem);
  const chipPcts = [...floorPcts];
  for (let k = 0; k < toAdd && k < byRem.length; k++) chipPcts[byRem[k].i]++;

  const saldoForDonut = saldo != null && saldo > 0 ? saldo : 0;
  const donutTotal = totalSpent + saldoForDonut;
  let segments = donutTotal === 0
    ? [{ id: "_empty", label: "Sin datos", color: isDark ? "#2D2D3A" : "#D5D3E8", pct: 100 }]
    : PILLARS.filter(p => pillarSpends[p.id] > 0).map(p => ({ id: p.id, label: p.label, color: p.color, pct: (pillarSpends[p.id] / donutTotal) * 100 }));
  if (saldoForDonut > 0) {
    segments.push({ id: "saldo", label: "Tu saldo", color: SALDO_COLOR, pct: (saldoForDonut / donutTotal) * 100 });
  }

  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  const hasSaldo = saldo != null;

  if (screen === "pillar-detail" && selectedPillarDetail) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <PillarDetailPage
            pillar={selectedPillarDetail}
            onBack={() => { setScreen("dashboard"); setShowPillarBars(false); setSelectedPillarDetail(null); }}
            isDark={isDark}
            transactions={transactions}
          />
        </div>
      </div>
    );
  }

  if (screen === "new-transaction") {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <NewTransactionPage
            onBack={() => setScreen("dashboard")}
            onDone={({ desc, rawAmount, isIncome, method, concept, pillarId }) => {
              const absAmount = parseInt((rawAmount || "").replace(/\D/g, "")) || 0;
              if (absAmount === 0 && !desc && !concept) { setScreen("dashboard"); return; }
              const now = new Date();
              const dateStr = now.toISOString().slice(0, 10);
              const timeStr = now.toTimeString().slice(0, 5);

              // Crear nueva transacción
              const newTx = {
                id: Math.max(...transactions.map(t => t.id || 0), 0) + 1,
                date: dateStr,
                time: timeStr,
                desc: desc || concept,
                method: method || "Banco",
                amount: isIncome ? absAmount : -absAmount,
                pillar: isIncome ? "ingreso" : (pillarId || concept),
                category: concept || null,
              };

              // Guardar en estado (useEffect automaticamente guarda en localStorage)
              const updatedTxns = [...transactions, newTx];
              setTransactions(updatedTxns);

              setSelectedPeriod({ year: now.getFullYear(), month: now.getMonth() + 1 });
              setScreen("dashboard");
            }}
            isDark={isDark}
            customConcepts={customConcepts}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>


        {/* Header */}
        <div style={{ position: "absolute", top: 52, left: 0, right: 0, height: 76, zIndex: 30, background: t.bg, padding: "8px 22px 25px", boxSizing: "border-box", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: t.text }}>Luis Daniel</div>
              <div style={{ fontSize: 10, color: t.sub }}>Buenos días 👋</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: isDark ? "#1f1010" : "#FEF2F2", border: `1px solid ${isDark ? "#5c1a1a44" : "#FCA5A533"}`, borderRadius: 8, padding: "3px 9px" }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: t.sub }}>GASTADO</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#EF4444" }}>-{fmt(totalSpent)}</span>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: isDark ? "#0a1a10" : "#F0FDF4", border: `1px solid ${isDark ? "#16532d44" : "#86EFAC33"}`, borderRadius: 8, padding: "3px 9px" }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: t.sub }}>INGRESOS</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#22C55E" }}>+{fmt(incomingTotal)}</span>
            </div>
          </div>
        </div>

        {/* Scroll Container */}
        <div onScroll={e => setScrollY(e.target.scrollTop)} style={{
          position: "absolute", top: 130, left: 0, right: 0, bottom: isMovementOpen ? 0 : "auto",
          overflowY: isMovementOpen ? "auto" : "hidden", overflowX: "hidden", paddingBottom: 280, boxSizing: "border-box", scrollbarWidth: "none"
        }}>
          <style>{`::-webkit-scrollbar { display: none; }`}</style>

          <div style={{ padding: "0 22px 120px 22px", minHeight: "100vh" }}>
            {/* Sticky Zone */}
            <div style={{ position: "sticky", top: 0, zIndex: 30, background: t.bg, margin: "0 -22px", height: stickyH, overflow: "hidden", boxShadow: p1 > 0.05 ? "0 4px 16px rgba(0,0,0,0.4)" : "none" }}>

              {/* Saldo button LEFT */}
              <div style={{ position: "absolute", top: 8, left: 22, zIndex: 6, pointerEvents: "auto" }}>
                <button onClick={() => setShowUpdateBalance(true)} style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  padding: "4px 8px", borderRadius: 20, border: "none",
                  cursor: "pointer",
                  background: isDark ? "#1E1E2E" : "#F0EFF8",
                  outline: `1.5px solid transparent`,
                  transition: "all 0.15s",
                  justifyContent: "center",
                }}>
                  <span style={{ fontSize: 13 }}>💰</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#C4C2E0" : "#6B7280" }}>
                    Saldo actual
                  </span>
                </button>
              </div>

              {/* Period button RIGHT */}
              <div style={{ position: "absolute", top: 8, right: 22, zIndex: 6, pointerEvents: "auto" }}>
                <button onClick={() => setShowPeriodPicker(true)} style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
                  padding: "4px 8px", borderRadius: 20, border: "none",
                  cursor: "pointer",
                  background: selectedPeriod ? "#9B6DFF22" : (isDark ? "#1E1E2E" : "#F0EFF8"),
                  outline: `1.5px solid ${selectedPeriod ? "#9B6DFF88" : "transparent"}`,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 13 }}>📅</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: selectedPeriod ? "#9B6DFF" : (isDark ? "#C4C2E0" : "#6B7280") }}>
                    {getPeriodLabel(selectedPeriod)}
                  </span>
                </button>
              </div>

              {/* Expanded State */}
              <div style={{ position: "absolute", inset: 0, padding: "20px 22px 0", opacity: 1 - p1, pointerEvents: p1 < 0.5 ? "auto" : "none", overflow: "visible" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                  <DonutChart segments={segments} cx={114} cy={114} outerR={90} innerR={54} activeId={activeId} onSelect={(id) => {
                    setActiveId(id);
                    if (id && id !== "_empty" && id !== "saldo") {
                      const pillar = PILLARS.find(p => p.id === id);
                      if (pillar) {
                        setSelectedPillarDetail(pillar);
                        setShowPillarBars(true);
                      }
                    }
                  }} isDark={isDark} gastos={totalSpent} total={totalSpent + saldoForDonut} />
                </div>

                <div style={{ display: "flex", flexWrap: "nowrap", gap: 3, justifyContent: "center", marginBottom: 6, overflow: "hidden" }}>
                  {segments.map(seg => (
                    <button key={seg.id} onClick={() => setActiveId(activeId === seg.id ? null : seg.id)} style={{
                      display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 6px", borderRadius: 20,
                      border: `1.5px solid ${activeId === seg.id ? seg.color : "transparent"}`,
                      background: activeId === seg.id ? seg.color + "22" : isDark ? "#1E1E2E" : "#F0EFF8",
                      color: activeId === seg.id ? seg.color : t.sub, fontSize: 9.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: seg.color, display: "inline-block" }} />
                      {seg.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 5 }}>
                  {PILLARS.map(p => {
                    const filteredSpent = pillarSpends[p.id];
                    const hasBudget = p.budget != null && p.budget > 0;
                    const pc = hasBudget ? Math.round((filteredSpent / p.budget) * 100) : (totalSpent > 0 ? Math.round((filteredSpent / totalSpent) * 100) : 0);
                    const over = hasBudget && pc >= 100;
                    const isAct = activeId === p.id;
                    const badgeLabel = pc === 0 ? "0%" : !hasBudget ? `${pc}% total` : over ? `+${pc - 100}% 🎉` : `${pc}%`;

                    return (
                      <div key={p.id} onClick={() => {
                        setActiveId(isAct ? null : p.id);
                        if (!isAct) {
                          setSelectedPillarDetail(p);
                          setShowPillarBars(true);
                        }
                      }} style={{
                        background: isAct ? (isDark ? p.darkBg : p.bg) : (isDark ? "#252535" : "#FFFFFF"),
                        border: `1.5px solid ${isAct ? p.color + "88" : t.border}`, borderRadius: 11, padding: "1px 8px", cursor: "pointer",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1.5, marginBottom: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                            <span style={{ fontSize: 15, lineHeight: 1, display: "flex", alignItems: "center" }}>{p.icon}</span>
                            <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 700, color: t.text, display: "flex", alignItems: "center" }}>{p.label}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 4px", borderRadius: 6, background: over ? "#FCA5A522" : p.color + "22", color: over ? "#EF4444" : (isDark ? p.color : p.darkColor) }}>
                            {badgeLabel}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: t.sub, marginBottom: 0 }}>{fmt(filteredSpent)}</div>
                        {!hasBudget ? (
                          <div style={{ fontSize: 10, color: t.sub, fontStyle: "italic" }}>Sin presupuesto</div>
                        ) : (
                          <div style={{ height: 8, marginTop: 0, marginBottom: 1.5, borderRadius: 2, background: isDark ? "#2D2D3A" : "#E5E7EB", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.min(pc, 100)}%`, borderRadius: 2, background: over ? "#FCA5A5" : p.color }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {hasSaldo && (
                    <div style={{
                      background: saldo < 0
                        ? (isDark ? "#2a1111" : "#FEF2F2")
                        : activeId === "saldo" ? (isDark ? "#0d2118" : "#F0FDF4") : (isDark ? "#1E1E2E" : "#FFFFFF"),
                      border: `1.5px solid ${saldo < 0 ? "#EF444488" : activeId === "saldo" ? SALDO_COLOR + "88" : t.border}`,
                      borderRadius: 11, padding: "1px 8px", cursor: saldo >= 0 ? "pointer" : "default",
                    }} onClick={() => saldo >= 0 && setActiveId(activeId === "saldo" ? null : "saldo")}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1.5, marginBottom: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                          <span style={{ fontSize: 15, lineHeight: 1, display: "flex", alignItems: "center" }}>{saldo < 0 ? "🔴" : "💵"}</span>
                          <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 700, color: t.text, display: "flex", alignItems: "center" }}>Tu saldo</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 4px", borderRadius: 6, background: saldo < 0 ? "#EF444422" : SALDO_COLOR + "33", color: saldo < 0 ? "#EF4444" : "#64748B", flexShrink: 0 }}>
                          {saldo < 0 ? "en rojo" : `${donutTotal === 0 ? 0 : Math.round((saldo / donutTotal) * 100)}%`}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: saldo < 0 ? "#EF4444" : t.sub, marginBottom: 0 }}>
                        {saldo < 0 ? "-$" + Math.abs(saldo).toLocaleString("es-CO") : fmt(saldo)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Movimientos - AL FINAL del Expanded State */}
                <div style={{ marginTop: 0 }}>
                  <Movimientos isDark={isDark} transactions={transactions} filteredPillar={filteredPillar} setFilteredPillar={setFilteredPillar} stickyTop={stickyH} selectedPeriod={selectedPeriod} onOpen={setIsMovementOpen} isOpen={isMovementOpen} />
                </div>
              </div>

              {/* Collapsed State */}
              <div style={{ position: "absolute", inset: 0, padding: "38px 22px 6px", opacity: p2, pointerEvents: p2 >= 0.5 ? "auto" : "none", overflow: "hidden" }}>
                <div style={{ display: "flex", height: 7, borderRadius: 5, overflow: "hidden", gap: 2, marginBottom: 9 }}>
                  {segments.map(seg => (
                    <div key={seg.id} onClick={() => setFilteredPillar(filteredPillar === seg.id ? null : seg.id)} style={{
                      flex: seg.pct, background: seg.color, borderRadius: 3, cursor: "pointer", opacity: filteredPillar && filteredPillar !== seg.id ? 0.28 : 1,
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {PILLARS.map((p, i) => {
                    const isFiltered = filteredPillar === p.id;
                    return (
                      <button key={p.id} onClick={() => setFilteredPillar(isFiltered ? null : p.id)} style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6px 2px", borderRadius: 9, border: "none", cursor: "pointer",
                        background: isFiltered ? p.color + "33" : p.color + "1A", outline: isFiltered ? `1.5px solid ${p.color}BB` : `1px solid ${p.color}44`,
                      }}>
                        <div style={{ fontSize: 9, fontWeight: 800, color: p.color }}>{p.label}</div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: p.color, opacity: 0.8 }}>{chipPcts[i]}%</div>
                      </button>
                    );
                  })}
                </div>

                {/* Movimientos - AL FINAL del Collapsed State */}
                <div style={{ marginTop: 0 }}>
                  <Movimientos isDark={isDark} transactions={transactions} filteredPillar={filteredPillar} setFilteredPillar={setFilteredPillar} stickyTop={stickyH} selectedPeriod={selectedPeriod} onOpen={setIsMovementOpen} isOpen={isMovementOpen} />
                </div>
              </div>
            </div>

            {/* Transacciones - SCROLLEABLES (solo cuando isMovementOpen) */}
            {isMovementOpen && <TransactionsList isDark={isDark} transactions={transactions} filteredPillar={filteredPillar} stickyH={stickyH} selectedPeriod={selectedPeriod} />}
          </div>
        </div>

        {/* Bottom Fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, pointerEvents: "none", zIndex: 34, background: `linear-gradient(to bottom, transparent, ${t.bg})` }} />

        {/* FAB - Lápiz (left) + Micrófono (right) */}
        <div style={{
          position: "absolute", bottom: 24, right: 22, zIndex: 35,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button onClick={() => setScreen("new-transaction")} style={{
            width: 32, height: 32, borderRadius: "50%", border: "none",
            background: isDark ? "#3A3A52" : "#94A3B8",
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(0,0,0,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>

          <button style={{
            width: 52, height: 52, borderRadius: "50%", border: "none",
            background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(155,109,255,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none"/>
              <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
            </svg>
          </button>
        </div>

        {/* Period Picker */}
        {showPeriodPicker && (
          <PeriodSelector
            isDark={isDark}
            selectedPeriod={selectedPeriod}
            onSelect={p => { setSelectedPeriod(p); setFilteredPillar(null); setActiveId(null); }}
            onClose={() => setShowPeriodPicker(false)}
            monthHasData={monthHasData}
          />
        )}

        {/* Popups */}
        {showPillarBars && selectedPillarDetail && (
          <PillarBarsPopup
            pillar={selectedPillarDetail}
            onClose={() => { setShowPillarBars(false); setActiveId(null); }}
            onViewMovements={() => { setShowPillarBars(false); setScreen("pillar-detail"); }}
            isDark={isDark}
          />
        )}

        {showUpdateBalance && (
          <UpdateBalanceModal
            isDark={isDark}
            currentSaldo={saldo}
            onClose={() => setShowUpdateBalance(false)}
            onDone={val => {
              const now = new Date();
              const newBalance = { year: now.getFullYear(), month: now.getMonth() + 1, value: val };
              setBalance(newBalance);
              setSelectedPeriod({ year: now.getFullYear(), month: now.getMonth() + 1 });
              setShowUpdateBalance(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Exporta Dashboard envuelto en ErrorBoundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
