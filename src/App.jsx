import { useState, useEffect, useRef, useCallback } from "react";
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
  addDateToBalance, getLastMonthWithData
} from "./utils/calculations";

// 🆕 Importar páginas de nuevas secciones
import SettingsPage from "./components/SettingsPage";
import BudgetsPage from "./components/BudgetsPage";
import MovimientosPage from "./components/MovimientosPage";
import HeaderService from "./components/HeaderService";
import ProfilePage from "./components/ProfilePage";
import AddTransactionPage from "./components/AddTransactionPage";
import TransactionsListService from "./components/TransactionsListService";

// 🆕 Importar userStorage para datos del usuario
import { userStorage } from "./utils/userStorage";

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
            maxWidth: "400px", textAlign: "center"
          }}>
            {/* Símbolo de cuidado */}
            <div style={{ fontSize: 100, marginBottom: 24, lineHeight: 1 }}>⚠️</div>

            {/* Título */}
            <div style={{ fontSize: 26, fontWeight: 800, color: "#F0EEFF", marginBottom: 8 }}>
              Oops! Algo salió mal
            </div>

            {/* Mensaje de soporte */}
            <div style={{ fontSize: 14, color: "#7B7A99", marginBottom: 32, lineHeight: 1.8 }}>
              Estamos trabajando para mejorar
            </div>

            {/* Botón CTA */}
            <button onClick={() => window.location.reload()} style={{
              width: "100%", padding: "14px 0", borderRadius: 14,
              border: "none", background: "linear-gradient(135deg, #9B6DFF, #6366F1)",
              color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", transition: "all 0.3s",
              boxShadow: "0 8px 24px rgba(155, 109, 255, 0.3)"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              Recargar la app →
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

function DonutChart({ segments, cx, cy, outerR, innerR, activeId, onSelect, isDark, gastos, total, totalSpent, pillarSpends, hasSaldoAsignado, saldoValue }) {
  const [hovered, setHovered] = useState(null);
  let cursor = 0;
  const arcs = segments.map(seg => { const start = cursor; const sweep = seg.pct * 3.6; cursor += sweep; return { ...seg, start, end: cursor - 0.3 }; });

  // 🆕 Lógica de texto dinámico del donut
  let displayLabel = "Gastado";
  let displayValue = totalSpent;
  let displayReference = null;

  if (activeId === "saldo") {
    // 🆕 Saldo seleccionado: "Sobran X de Y"
    displayLabel = "Sobran";
    displayValue = saldoValue || 0;
    displayReference = total;
  } else if (activeId && activeId !== "saldo" && pillarSpends) {
    // Hay una sección seleccionada (pilar)
    const selectedSpend = pillarSpends[activeId] || 0;
    displayValue = selectedSpend;

    if (hasSaldoAsignado) {
      // Con presupuesto: Y = gasto total
      displayReference = totalSpent;
    } else {
      // Sin presupuesto: Y = gasto total
      displayReference = totalSpent;
    }
  } else {
    // Sin selección
    if (hasSaldoAsignado) {
      // Con presupuesto: Y = total disponible (saldo + gasto)
      displayReference = total;
    } else {
      // Sin presupuesto: no mostrar "de X"
      displayReference = null;
    }
  }

  return (
    <svg width={cx * 2} height={cy * 2} style={{ overflow: "visible" }}>
      {arcs.map(arc => {
        const isActive = activeId === arc.id; const isHovered = hovered === arc.id; const scale = isActive ? 1.05 : isHovered ? 1.02 : 1; const op = activeId && !isActive ? 0.45 : 1;
        return (
          <g key={arc.id} style={{ cursor: "pointer", transition: "opacity 0.25s" }} onClick={() => onSelect(arc.id)} onMouseEnter={() => setHovered(arc.id)} onMouseLeave={() => setHovered(null)}>
            {isActive && <path d={arcPath(cx, cy, outerR + 2, arc.start, arc.end)} fill="none" stroke={arc.color} strokeWidth={20} strokeOpacity={0.22} strokeLinecap="round" style={{ transition: "all 0.3s" }} />}
            <path d={arcPath(cx, cy, outerR, arc.start, arc.end)} fill="none" stroke={arc.color} strokeWidth={isActive ? 31 : isHovered ? 28 : 24} strokeLinecap="round" opacity={op} style={{ transition: "all 0.25s cubic-bezier(.4,0,.2,1)", transformOrigin: `${cx}px ${cy}px`, transform: `scale(${scale})` }} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR} fill="#000000" />
      {/* Donut center text - Gastado (dinámico) */}
      {displayValue !== undefined && (
        <g>
          {/* Si hay referencia, posiciona arriba; si no, posiciona en el centro */}
          <text x={cx} y={displayReference !== null && displayReference > 0 ? cy - 18 : cy - 5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 600, fill: isDark ? "#7B7A99" : "#9896B0" }}>
            {displayLabel}
          </text>
          <text x={cx} y={displayReference !== null && displayReference > 0 ? cy + 8 : cy + 15} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: isDark ? "#F0EEFF" : "#1A1830" }}>
            {fmt(displayValue)}
          </text>
          {/* Mostrar "de X" cuando hay referencia */}
          {displayReference !== null && displayReference > 0 && (
            <text x={cx} y={cy + 26} textAnchor="middle" style={{ fontSize: 15, fontWeight: 400, fill: isDark ? "#7B7A99" : "#9896B0" }}>
              de {fmt(displayReference)}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

function CatBar({ catName, spent, budget, color, isDark, pillarSpent, cat }) {
  // 🆕 Aceptar tanto formato antiguo (cat) como nuevo (catName, spent, budget)
  const actualName = catName || cat?.name;
  const actualSpent = spent !== undefined ? spent : (cat?.spent || 0);
  const actualBudget = budget !== undefined ? budget : (cat?.budget);
  const hasBudget = actualBudget != null && actualBudget > 0;
  const p = hasBudget ? Math.round((actualSpent / actualBudget) * 100) : null;
  const pOfPillar = pillarSpent > 0 ? Math.round((actualSpent / pillarSpent) * 100) : 0;
  const barColor = hasBudget && p >= 100 ? "#FCA5A5" : color;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: isDark ? "#E2E0F5" : "#374151", fontWeight: 500 }}>{actualName}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#A0A0C0" : "#6B7280" }}>
          {fmt(actualSpent)}{hasBudget ? <span style={{ fontWeight: 400, opacity: 0.6 }}> / {fmt(actualBudget)}</span> : <span style={{ fontWeight: 400, opacity: 0.6 }}> · {pOfPillar}%</span>}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: isDark ? "#2D2D3A" : "#E5E7EB", overflow: "hidden" }}>
        <div style={{ height: "100%", width: hasBudget ? `${Math.min(p, 100)}%` : `${pOfPillar}%`, borderRadius: 3, background: barColor, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

// 🆕 Función auxiliar para filtrar transacciones en Dashboard
function getFilteredTransactionsForDashboard(transactions, selectedPeriod, filteredPillar, filterType) {
  return transactions.filter(tx => {
    const matchesPeriod = !selectedPeriod || (() => {
      const [txYear, txMonth] = tx.date.split("-").map(Number);
      return txYear === selectedPeriod.year && txMonth === selectedPeriod.month;
    })();
    const matchesPillar = !filteredPillar || tx.pillar === filteredPillar;
    const isIngreso = tx.amount > 0 || tx.pillar === "ingreso";
    let matchesType = true;
    if (filterType === "gastado") matchesType = !isIngreso;
    else if (filterType === "ingresos") matchesType = isIngreso;

    return matchesPeriod && matchesPillar && matchesType;
  });
}

function Movimientos({ isDark, transactions, filteredPillar, setFilteredPillar, stickyTop, selectedPeriod, onOpen, isOpen, filterType, setFilterType, movementOpenedFrom, setMovementOpenedFrom, setFilterTypeExternal }) {
  const handleOpen = () => {
    // 🆕 Lógica: la barra SIEMPRE puede cerrar, sin importar cómo se abrió
    if (isOpen) {
      // Cerrar Estado 2 (importa cómo se abrió)
      onOpen(false);
      setMovementOpenedFrom(null);
      setFilterTypeExternal(null);
    } else if (!isOpen) {
      // Abrir desde la barra
      onOpen(true);
      setMovementOpenedFrom("bar");
    }
  };
  const t = isDark ? { text: "#F0EEFF", sub: "#7B7A99", divider: "#2D2D3A", bg: "#141420" } : { text: "#1A1830", sub: "#9896B0", divider: "#E5E3F5", bg: "#F8F7FF" };

  // Filtra por período, pillar y tipo (gastado/ingresos)
  const displayTxns = transactions.filter(tx => {
    const matchesPeriod = !selectedPeriod || (() => {
      const [txYear, txMonth] = tx.date.split("-").map(Number);
      return txYear === selectedPeriod.year && txMonth === selectedPeriod.month;
    })();
    const matchesPillar = !filteredPillar || tx.pillar === filteredPillar;
    // 🆕 Filtro por tipo: gastado vs ingresos
    const isIngreso = tx.amount > 0 || tx.pillar === "ingreso";
    let matchesType = true;
    if (filterType === "gastado") matchesType = !isIngreso;
    else if (filterType === "ingresos") matchesType = isIngreso;

    return matchesPeriod && matchesPillar && matchesType;
  });

  return (
    <div style={{ marginTop: 0 }}>
      <button onClick={handleOpen} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: t.bg, border: `1.5px solid ${t.divider}`, padding: "10px 8px 10px", cursor: "pointer",
        position: "sticky", top: 0, zIndex: 20, borderRadius: 24, marginBottom: 0,
        overflow: "hidden", boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Movimientos</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, background: isDark ? "#2D2D3A" : "#E5E3F5", color: t.sub }}>{displayTxns.length}</span>
          {/* 🆕 Badge para filtro de tipo (Gastado/Ingresos) */}
          {filterType && (
            <div onClick={e => { e.stopPropagation(); setFilterType(null); }} style={{
              marginLeft: 6, padding: "1px 7px", borderRadius: 10, border: "none",
              background: filterType === "gastado" ? "#EF444422" : "#22C55E22",
              color: filterType === "gastado" ? "#EF4444" : "#22C55E",
              fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}>
              {filterType === "gastado" ? "Gastado" : "Ingresos"}<span>✕</span>
            </div>
          )}
          {filteredPillar && (
            <div onClick={e => { e.stopPropagation(); setFilteredPillar(null); }} style={{
              marginLeft: 6, padding: "1px 7px", borderRadius: 10, border: "none", background: PILLAR_MAP[filteredPillar]?.color + "22", color: PILLAR_MAP[filteredPillar]?.color, fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}>
              {PILLAR_MAP[filteredPillar]?.icon}{PILLAR_MAP[filteredPillar]?.label}<span>✕</span>
            </div>
          )}
        </div>
        <span style={{ fontSize: 11, color: t.sub, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", marginRight: 8 }}>▼</span>
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

// 🆕 NewTransactionPage ha sido movido a componente separado: AddTransactionPage.jsx

function PillarBarsPopup({ pillar, onClose, onViewMovements, isDark, transactions, selectedPeriod }) {
  const t = isDark ? { border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" } : { border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };

  // 🆕 Calcular gastos dinámicamente por período
  const categorySpent = {};
  if (pillar.categories) {
    pillar.categories.forEach((cat) => {
      categorySpent[cat.name] = 0;
    });
  }

  if (transactions) {
    transactions.forEach((tx) => {
      const matchesPillar = tx.pillar === pillar.id;
      const matchesPeriod = !selectedPeriod || (() => {
        const [txYear, txMonth] = tx.date.split("-").map(Number);
        return txYear === selectedPeriod.year && txMonth === selectedPeriod.month;
      })();

      if (matchesPillar && matchesPeriod && tx.amount < 0) {
        const cat = tx.category || "Sin categoría";
        categorySpent[cat] = (categorySpent[cat] || 0) + Math.abs(tx.amount);
      }
    });
  }

  const totalSpent = Object.values(categorySpent).reduce((sum, v) => sum + v, 0);

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
            <div style={{ fontSize: 14, fontWeight: 900, color: t.text, lineHeight: 1.1, marginTop: 4 }}>{fmt(totalSpent)}</div>
            <div style={{ fontSize: 9, color: t.sub, marginTop: 2 }}>de {fmt(pillar.budget)}</div>
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          {pillar.categories.map(cat => (
            <CatBar
              key={cat.name}
              catName={cat.name}
              spent={categorySpent[cat.name] || 0}
              budget={cat.budget}
              color={pillar.color}
              isDark={isDark}
              pillarSpent={totalSpent}
            />
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

// 🆕 Función para obtener el presupuesto correcto para un mes específico
function getBudgetForMonth(pillarId, month, year, customBudgets) {
  const key = `${year}-${String(month).padStart(2, '0')}`;

  // Si hay presupuesto personalizado para ese mes, usarlo
  if (customBudgets[key] && customBudgets[key][pillarId] !== undefined) {
    return customBudgets[key][pillarId];
  }

  // Si no, buscar el presupuesto personalizado más reciente ANTERIOR a ese mes
  for (let m = month - 1; m >= 1; m--) {
    const checkKey = `${year}-${String(m).padStart(2, '0')}`;
    if (customBudgets[checkKey] && customBudgets[checkKey][pillarId] !== undefined) {
      return customBudgets[checkKey][pillarId];
    }
  }

  // Si no hay nada, retornar el presupuesto base de constantes
  const pillar = PILLARS.find(p => p.id === pillarId);
  return pillar?.budget || 0;
}

function Dashboard() {
  const isDark = true; // Solo modo oscuro
  const [scrollY, setScrollY] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [filteredPillar, setFilteredPillar] = useState(null);
  const [showPillarBars, setShowPillarBars] = useState(false);

  // 🆕 Memoizar función de toggle para el donut
  const handleSelectPillar = useCallback((id) => {
    setActiveId(prevActiveId => prevActiveId === id ? null : id);
  }, []);
  const [selectedPillarDetail, setSelectedPillarDetail] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showUpdateBalance, setShowUpdateBalance] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  // 🆕 Pilar seleccionado para la página de movimientos
  const [selectedPillarForMovements, setSelectedPillarForMovements] = useState(null);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [customConcepts, setCustomConcepts] = useState([]);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS); // 🔄 DEV: Inicia con DUMMY siempre
  // 🆕 Inicia con el último mes que tiene datos (sin hardcodear)
  const [selectedPeriod, setSelectedPeriod] = useState(() => getLastMonthWithData(DUMMY_TRANSACTIONS));
  const [isMovementOpen, setIsMovementOpen] = useState(false);
  // 🆕 Filtro de Gastado/Ingresos
  const [filterType, setFilterType] = useState(null); // null | "gastado" | "ingresos"
  // 🆕 Rastrear cómo se abrió Estado 2 (por cuál "puerta")
  const [movementOpenedFrom, setMovementOpenedFrom] = useState(null); // null | "gastado" | "ingresos" | "bar"
  // 🆕 Presupuestos personalizados por mes/año
  // 🔄 DEV: Siempre inicializar vacío (no persistir en localStorage en DEV)
  const [customBudgets, setCustomBudgets] = useState({});
  // 🆕 Estado para mostrar popup de éxito en Perfil
  const [showProfileSaveSuccess, setShowProfileSaveSuccess] = useState(false);
  // 🆕 Estado para mostrar popup de éxito en Presupuestos
  const [showBudgetsSaveSuccess, setShowBudgetsSaveSuccess] = useState(false);
  // 🆕 Estado para mostrar/ocultar sección de GASTADO/INGRESOS (controlado por toggle en Settings)
  // 🔄 DEV: Siempre inicia en true (se reinicia con refresh) - NO usar localStorage en DEV
  const [showIncomes, setShowIncomes] = useState(false);

  // 🆕 Refs para medir alturas dinámicamente
  const expandedStateRef = useRef(null);
  const donutRef = useRef(null);
  const donutContainerRef = useRef(null);
  const pillarsGridRef = useRef(null);
  const colorBarRef = useRef(null);
  const pillarButtonsRef = useRef(null);
  const [measuredHeights, setMeasuredHeights] = useState({
    expanded: 0,
    donut: 0,
    pillarsGrid: 0,
    colorBar: 0,
    pillarButtons: 0,
  });

  // localStorage utilities - TEMPORAL (Supabase later)
  useEffect(() => {
    // 🔄 DEV VERSION: Limpiar datos de DEV al inicio de la sesión
    // Esto asegura que los cambios en Perfil (displayName, currency, idioma) no persistan
    console.log("🧹 DEV: Limpiando datos DEV con prefijo 'orus_dev_'...");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("orus_dev_")) {
        localStorage.removeItem(key);
      }
    });

    // 🔄 DEV VERSION: Siempre cargar datos dummy de desarrollo
    // Si no hay datos en localStorage, los cargamos automáticamente
    const isFirstLoad = !localStorage.getItem("orus_transactions");

    if (isFirstLoad) {
      console.log("📊 DEV: Cargando DUMMY_TRANSACTIONS al localStorage...");
      localStorage.setItem("orus_transactions", JSON.stringify(DUMMY_TRANSACTIONS));
      localStorage.setItem("orus_balances", JSON.stringify(DUMMY_BALANCES));
    } else {
      // Cargar transacciones desde localStorage si ya existen
      try {
        const stored = localStorage.getItem("orus_transactions");
        if (stored) {
          setTransactions(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error loading transactions:", e);
      }
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

  // 🆕 Guardar presupuestos personalizados cuando cambien
  // 🔄 DEV: Deshabilitado (no persistir en localStorage en DEV)
  // useEffect(() => {
  //   localStorage.setItem("orus_custom_budgets", JSON.stringify(customBudgets));
  // }, [customBudgets]);

  // 🆕 Medir alturas dinámicamente para que el layout se adapte
  useEffect(() => {
    const measureHeights = () => {
      const heights = {
        donut: donutRef.current?.offsetHeight || 0,
        colorBar: colorBarRef.current?.offsetHeight || 0,
        pillarButtons: pillarButtonsRef.current?.offsetHeight || 0,
        pillarsGrid: pillarsGridRef.current?.offsetHeight || 0,
      };

      // Calcular altura total del sticky zone basado en lo visible
      const donutSection = !isMovementOpen ? heights.donut : 0;
      const colorBarSection = !isMovementOpen && filterType !== "ingresos" ? (heights.colorBar + 9) : 0;
      const pillarButtonsSection = !isMovementOpen && filterType !== "ingresos" ? (heights.pillarButtons + 4) : 0;
      const pillarsGridSection = !isMovementOpen ? heights.pillarsGrid : 0;
      const movimientosSection = 40; // Altura aproximada del botón de Movimientos

      heights.expanded = donutSection + colorBarSection + pillarButtonsSection + pillarsGridSection + movimientosSection + 30;

      setMeasuredHeights(heights);
    };

    // 🆕 Usar requestAnimationFrame x2 para asegurar que React renderice primero
    const rafId1 = requestAnimationFrame(() => {
      const rafId2 = requestAnimationFrame(measureHeights);
      return rafId2;
    });

    window.addEventListener("resize", measureHeights);
    return () => {
      cancelAnimationFrame(rafId1);
      window.removeEventListener("resize", measureHeights);
    };
  }, [isMovementOpen, filterType]);

  // 🆕 Manejar click FUERA del donut para deseleccionar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si no hay nada seleccionado, no hacer nada
      if (!activeId) return;

      // Si el click fue EN UN BOTÓN/TAG, no deseleccionar (ellos manejan su propio toggle)
      if (event.target.closest('button') && donutContainerRef.current?.contains(event.target)) return;

      // Si el click fue EN UN ARCO DEL DONUT (path = secciones coloridas), no deseleccionar
      // SOLO los <path> son arcos interactivos. El texto está en <text> y se considera "fuera"
      if (event.target.closest('path') && donutRef.current?.contains(event.target)) return;

      // Click en CUALQUIER OTRO LADO (incluso el centro vacío y el texto) → Deselecciona
      setActiveId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeId]);

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

  // 🆕 Limpiar filtros cuando se cierra Movimientos (Estado 2 → Estado 1)
  useEffect(() => {
    if (isMovementOpen === false) {
      setFilteredPillar(null);
      setFilterType(null);
    }
  }, [isMovementOpen]);

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

  // 🆕 Medir dinámicamente el bottom del Área 1 (Sticky Zone)
  const stickyZoneRef = useRef(null);
  const headerRef = useRef(null);
  const [stickyH, setStickyH] = useState(152); // Default

  useEffect(() => {
    const measureHeight = () => {
      if (stickyZoneRef.current && isMovementOpen) {
        const height = stickyZoneRef.current.offsetHeight;
        setStickyH(height);
      }
    };

    setTimeout(measureHeight, 50);
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, [isMovementOpen, filterType]);

  // 🔄 DEV: No guardar en localStorage (reinicia con refresh)
  // TODO: En PROD, guardar en backend
  // useEffect(() => {
  //   localStorage.setItem("showIncomes", JSON.stringify(showIncomes));
  // }, [showIncomes]);

  // 🆕 Declarar saldoForDonut y donutTotal ANTES de usarlos
  const saldoForDonut = saldo != null && saldo > 0 ? saldo : 0;
  const donutTotal = totalSpent + saldoForDonut;
  const hasSaldo = saldo != null;

  // Usa pillarSpends para calcular percentajes en el gráfico
  // 🆕 Calcular porcentajes con donutTotal (que incluye saldo) para que sean consistentes con la barra
  const rawPcts = PILLARS.map(p => donutTotal > 0 ? (pillarSpends[p.id] / donutTotal) * 100 : 0);

  // 🆕 Incluir saldo en el cálculo
  const saldoPct = donutTotal > 0 ? (saldoForDonut / donutTotal) * 100 : 0;
  const allRawPcts = [...rawPcts, saldoPct]; // Pilares + Saldo

  // Aplicar Largest Remainder Method a TODOS (pilares + saldo)
  const allFloorPcts = allRawPcts.map(Math.floor);
  const toAdd = 100 - allFloorPcts.reduce((a, b) => a + b, 0);
  const allByRem = allRawPcts.map((v, i) => ({ i, rem: v - Math.floor(v) })).sort((a, b) => b.rem - a.rem);

  const allChipPcts = [...allFloorPcts];
  for (let k = 0; k < toAdd && k < allByRem.length; k++) allChipPcts[allByRem[k].i]++;

  // Extraer solo los pilares (el saldo está en el índice PILLARS.length)
  const chipPcts = allChipPcts.slice(0, PILLARS.length);
  const saldoFloor = allFloorPcts[PILLARS.length];
  const saldoRem = saldoPct - Math.floor(saldoPct);
  const saldoPctFinal = allChipPcts[PILLARS.length];
  let segments = donutTotal === 0
    ? [{ id: "_empty", label: "Sin datos", color: isDark ? "#2D2D3A" : "#D5D3E8", pct: 100 }]
    : PILLARS.filter(p => pillarSpends[p.id] > 0).map(p => ({ id: p.id, label: p.label, color: p.color, pct: (pillarSpends[p.id] / donutTotal) * 100 }));
  if (saldoForDonut > 0) {
    segments.push({ id: "saldo", label: "Tu saldo", color: SALDO_COLOR, pct: (saldoForDonut / donutTotal) * 100 });
  }

  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

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
          <AddTransactionPage
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
              // 🆕 Cerrar Estado 2 automáticamente cuando se agrega una transacción
              setIsMovementOpen(false);
              setFilterType(null);
              setMovementOpenedFrom(null);
              setScreen("dashboard");
            }}
            isDark={isDark}
            customConcepts={customConcepts}
          />
        </div>
      </div>
    );
  }

  // 🆕 Pantalla de Configuraciones
  if (screen === "settings") {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <SettingsPage
            isDark={isDark}
            onBack={() => setScreen("dashboard")}
            onBudgets={() => setScreen("budgets")}
            onProfile={() => setScreen("profile")}
            showProfileSaveSuccess={showProfileSaveSuccess}
            showBudgetsSaveSuccess={showBudgetsSaveSuccess}
            showIncomes={showIncomes}
            setShowIncomes={setShowIncomes}
          />
        </div>
      </div>
    );
  }

  // 🆕 Pantalla de Perfil
  if (screen === "profile") {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <ProfilePage
            isDark={isDark}
            onBack={() => setScreen("settings")}
            onSaveSuccess={() => {
              setShowProfileSaveSuccess(true);
              setScreen("settings");
              // Ocultar popup después de 2 segundos
              setTimeout(() => setShowProfileSaveSuccess(false), 2000);
            }}
          />
        </div>
      </div>
    );
  }

  // 🆕 Pantalla de Presupuestos
  if (screen === "budgets") {
    const currentMonth = selectedPeriod?.month || new Date().getMonth() + 1;
    const currentYear = selectedPeriod?.year || new Date().getFullYear();
    const key = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    const currentMonthBudgets = {};
    PILLARS.forEach(p => {
      currentMonthBudgets[p.id] = getBudgetForMonth(p.id, currentMonth, currentYear, customBudgets);
    });

    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <BudgetsPage
            isDark={isDark}
            onBack={() => setScreen("settings")}
            initialBudgets={currentMonthBudgets}
            onSave={(newBudgets) => {
              setCustomBudgets(prev => ({
                ...prev,
                [key]: newBudgets
              }));
            }}
            onSaveSuccess={() => {
              // Guardar presupuestos
              // (el callback onSave ya se ejecutó)
              setShowBudgetsSaveSuccess(true);
              setScreen("settings");
              // Ocultar popup después de 2 segundos
              setTimeout(() => setShowBudgetsSaveSuccess(false), 2000);
            }}
          />
        </div>
      </div>
    );
  }

  // 🆕 Pantalla de Movimientos por Pilar
  if (screen === "movimientos" && selectedPillarForMovements) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <MovimientosPage
            isDark={isDark}
            onBack={() => setScreen("dashboard")}
            pilar={selectedPillarForMovements}
            transactions={transactions}
            selectedPeriod={selectedPeriod}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>


        {/* Header Service */}
        <HeaderService
          ref={headerRef}
          isDark={isDark}
          showIncomes={showIncomes}
          setScreen={setScreen}
          isMovementOpen={isMovementOpen}
          movementOpenedFrom={movementOpenedFrom}
          filterType={filterType}
          setFilterType={setFilterType}
          setFilteredPillar={setFilteredPillar}
          setIsMovementOpen={setIsMovementOpen}
          setMovementOpenedFrom={setMovementOpenedFrom}
          totalSpent={totalSpent}
          incomingTotal={incomingTotal}
          t={t}
          fmt={fmt}
          userStorage={userStorage}
        />

        {/* Scroll Container */}
        <div onScroll={e => setScrollY(e.target.scrollTop)} style={{
          position: "absolute", top: showIncomes ? 149 : 115, left: 0, right: 0, bottom: isMovementOpen ? 0 : "auto",
          overflowY: isMovementOpen ? "auto" : "hidden", overflowX: "hidden", paddingBottom: 280, boxSizing: "border-box", scrollbarWidth: "none"
        }}>
          <style>{`::-webkit-scrollbar { display: none; }`}</style>

          <div style={{ padding: "0 22px 120px 22px", height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Sticky Zone */}
            {/* 🆕 Sticky Zone simple y eficiente */}
            <div ref={stickyZoneRef} style={{ position: "sticky", top: 0, zIndex: 30, background: t.bg, margin: "0 -22px", padding: "8px 22px", overflow: "visible", boxShadow: p1 > 0.05 ? "0 4px 16px rgba(0,0,0,0.4)" : "none" }}>

              {/* Saldo y Mes - SIEMPRE visible */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <button onClick={() => setShowUpdateBalance(true)} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "4px 8px", borderRadius: 20, border: "none", cursor: "pointer", background: isDark ? "#1E1E2E" : "#F0EFF8", outline: `1.5px solid transparent`, transition: "all 0.15s", justifyContent: "center" }}>
                  <span style={{ fontSize: 13 }}>💰</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#C4C2E0" : "#6B7280" }}>Saldo actual</span>
                </button>
                <button onClick={() => setShowPeriodPicker(true)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "4px 8px", borderRadius: 20, border: "none", cursor: "pointer", background: selectedPeriod ? "#9B6DFF22" : (isDark ? "#1E1E2E" : "#F0EFF8"), outline: `1.5px solid ${selectedPeriod ? "#9B6DFF88" : "transparent"}`, transition: "all 0.15s" }}>
                  <span style={{ fontSize: 13 }}>📅</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: selectedPeriod ? "#9B6DFF" : (isDark ? "#C4C2E0" : "#6B7280") }}>{getPeriodLabel(selectedPeriod)}</span>
                </button>
              </div>

              {/* ESTADO 1: EXPANDED (Donut + Tarjetas) */}
              {isMovementOpen === false && (
              <div style={{ overflow: "visible" }}>
                {/* 🆕 Contenedor del donut + botones para detectar click outside */}
                <div ref={donutContainerRef}>
                  {/* Donut */}
                  <div ref={donutRef} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                    <DonutChart segments={segments} cx={114} cy={114} outerR={90} innerR={54} activeId={activeId} onSelect={handleSelectPillar} isDark={isDark} gastos={totalSpent} total={totalSpent + saldoForDonut} totalSpent={totalSpent} pillarSpends={pillarSpends} hasSaldoAsignado={saldoForDonut > 0} saldoValue={saldoForDonut} />
                  </div>

                  {/* Botones/Tags del donut */}
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
                </div>

                {/* 🆕 Ocultar barra de categorías cuando filterType es "ingresos" - con ref para medir altura */}
                <div ref={pillarsGridRef} style={{ display: filterType === "ingresos" ? "none" : "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: filterType === "ingresos" ? 0 : 12 }}>
                  {PILLARS.map((p, i) => {
                    const filteredSpent = pillarSpends[p.id];
                    // 🆕 Obtener presupuesto del mes (personalizado o base)
                    const currentMonth = selectedPeriod?.month || new Date().getMonth() + 1;
                    const currentYear = selectedPeriod?.year || new Date().getFullYear();
                    const budgetForMonth = getBudgetForMonth(p.id, currentMonth, currentYear, customBudgets);
                    const hasBudget = budgetForMonth != null && budgetForMonth > 0;
                    // 🆕 Usar chipPcts (mismo cálculo que Estado 2) cuando no hay presupuesto, para consistencia
                    const pc = hasBudget ? Math.round((filteredSpent / budgetForMonth) * 100) : chipPcts[i];
                    // 🆕 Diferenciar entre exactamente 100% (no está pasado) y > 100% (pasado)
                    const over = hasBudget && pc > 100;
                    const isAct = activeId === p.id;
                    // 🎨 CAMBIO: Emoji diferente si Ahorro (🎉) o si otro pilar pasado (⚠️)
                    // 🆕 Usar Math.ceil para redondear hacia arriba el exceso (ej: +0.5% → +1%)
                    // 🆕 Consistencia: usar "del total" en lugar de "total"
                    const badgeLabel = pc === 0 ? "0%" : !hasBudget ? `${pc}% del total` : over ? `+${Math.ceil(pc - 100)}% ${p.id === "ahorro" ? "🎉" : "⚠️"}` : `${pc}%`;

                    return (
                      <div key={p.id} onClick={() => {
                        // 🔄 CAMBIO: Tarjeta abre popup + resalta
                        setActiveId(p.id);
                        setSelectedPillarDetail(p);
                        setShowPillarBars(true);
                      }} style={{
                        // 🎨 CAMBIO: Resalta en verde (Ahorro) o rojo (otros) si pasa presupuesto
                        background: over
                          ? p.id === "ahorro"
                            ? isDark ? p.color + "33" : p.color + "22"  // Verde para Ahorro
                            : isDark ? "#EF444433" : "#FCA5A522"  // Rojo para otros
                          : isAct
                            ? (isDark ? p.darkBg : p.bg)  // Activo normal
                            : (isDark ? "#252535" : "#FFFFFF"),  // Normal
                        border: `1.5px solid ${isAct ? p.color + "88" : over ? (p.id === "ahorro" ? p.color + "88" : "#EF444488") : t.border}`,
                        borderRadius: 11, padding: "1px 8px", cursor: "pointer",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1.5, marginBottom: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                            <span style={{ fontSize: 15, lineHeight: 1, display: "flex", alignItems: "center" }}>{p.icon}</span>
                            <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 700, color: t.text, display: "flex", alignItems: "center" }}>{p.label}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 4px", borderRadius: 6, background: over ? (p.id === "ahorro" ? p.color + "33" : "#FCA5A522") : p.color + "22", color: over ? (p.id === "ahorro" ? p.color : "#EF4444") : (isDark ? p.color : p.darkColor) }}>
                            {badgeLabel}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: t.sub, marginBottom: 0 }}>{fmt(filteredSpent)}</div>
                        {!hasBudget ? (
                          <div style={{ fontSize: 10, color: t.sub, fontStyle: "italic" }}>Sin presupuesto</div>
                        ) : (
                          <div style={{ height: 8, marginTop: 0, marginBottom: 1.5, borderRadius: 2, background: isDark ? "#2D2D3A" : "#E5E7EB", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.min(pc, 100)}%`, borderRadius: 2, background: over ? (p.id === "ahorro" ? p.color : "#FCA5A5") : p.color }} />
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
                          <span style={{ fontSize: 15, lineHeight: 1, display: "flex", alignItems: "center" }}>{saldo < 0 ? "💰" : "💵"}</span>
                          <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 700, color: t.text, display: "flex", alignItems: "center" }}>Saldo</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 4px", borderRadius: 6, background: saldo < 0 ? "#EF444422" : SALDO_COLOR + "33", color: saldo < 0 ? "#EF4444" : "#64748B", flexShrink: 0 }}>
                          {saldo < 0 ? "en rojo" : `${saldoPctFinal}% del total`}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: saldo < 0 ? "#EF4444" : t.sub, marginBottom: 0 }}>
                        {saldo < 0 ? "-$" + Math.abs(saldo).toLocaleString("es-CO") : fmt(saldo)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* ESTADO 2: COLLAPSED (Barra + Tags) - Solo si NO es INGRESOS */}
              {isMovementOpen === true && filterType !== "ingresos" && (
              <div style={{ overflow: "visible", marginBottom: 12 }}>
                {/* Barra de colores */}
                <div ref={colorBarRef} style={{ display: "flex", height: 7, borderRadius: 5, overflow: "hidden", gap: 2, marginBottom: 9 }}>
                  {segments.map(seg => (
                    <div key={seg.id} onClick={() => {
                      // Filtros mutuamente excluyentes: limpiar filterType
                      if (filteredPillar !== seg.id) {
                        setFilterType(null);
                      }
                      setFilteredPillar(filteredPillar === seg.id ? null : seg.id);
                    }} style={{
                      flex: seg.pct, background: seg.color, borderRadius: 3, cursor: "pointer", opacity: filteredPillar && filteredPillar !== seg.id ? 0.28 : 1,
                    }} />
                  ))}
                </div>

                {/* Botones de pilares */}
                <div ref={pillarButtonsRef} style={{ display: "flex", gap: 4 }}>
                  {PILLARS.map((p, i) => {
                    const isFiltered = filteredPillar === p.id;
                    return (
                      <button key={p.id} onClick={() => {
                        // Filtros mutuamente excluyentes: limpiar filterType
                        if (!isFiltered) {
                          setFilterType(null);
                        }
                        setFilteredPillar(isFiltered ? null : p.id);
                      }} style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6px 2px", borderRadius: 9, border: "none", cursor: "pointer",
                        background: isFiltered ? p.color + "33" : p.color + "1A", outline: isFiltered ? `1.5px solid ${p.color}BB` : `1px solid ${p.color}44`,
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: p.color }}>{p.label}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: p.color, opacity: 0.8 }}>{chipPcts[i]}%</div>
                      </button>
                    );
                  })}
                  {/* 🆕 Tag de Saldo - Solo si existe saldo (igual que la tarjeta en Estado 1) */}
                  {hasSaldo && (
                  <button style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6px 2px", borderRadius: 9, border: "none", cursor: "default",
                    background: SALDO_COLOR + "1A", outline: `1px solid ${SALDO_COLOR}44`,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: SALDO_COLOR }}>Saldo</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: SALDO_COLOR, opacity: 0.8 }}>{saldoPctFinal}%</div>
                  </button>
                  )}
                </div>
              </div>
              )}

              {/* Movimientos - SIEMPRE visible */}
              <div style={{ marginTop: 0 }}>
                <Movimientos isDark={isDark} transactions={transactions} filteredPillar={filteredPillar} setFilteredPillar={setFilteredPillar} stickyTop={stickyH} selectedPeriod={selectedPeriod} onOpen={setIsMovementOpen} isOpen={isMovementOpen} filterType={filterType} setFilterType={setFilterType} movementOpenedFrom={movementOpenedFrom} setMovementOpenedFrom={setMovementOpenedFrom} setFilterTypeExternal={setFilterType} />
              </div>
            </div>
          </div>

          {/* Transacciones - position absolute si está abierto */}
          {isMovementOpen && (
            <div style={{ position: "absolute", top: `calc(${stickyH}px + 0px)`, left: 0, right: 0, bottom: 0, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "0 22px 120px 22px" }}>
              <style>{`::-webkit-scrollbar { display: none; }`}</style>
              <TransactionsListService isDark={isDark} transactions={getFilteredTransactionsForDashboard(transactions, selectedPeriod, filteredPillar, filterType)} />
            </div>
          )}
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
            onViewMovements={() => {
              setShowPillarBars(false);
              setSelectedPillarForMovements(selectedPillarDetail);
              setScreen("movimientos");
            }}
            isDark={isDark}
            transactions={transactions}
            selectedPeriod={selectedPeriod}
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
              // 🆕 Volver a Estado 1 automáticamente al actualizar saldo
              setIsMovementOpen(false);
              setFilterType(null);
              setMovementOpenedFrom(null);
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
