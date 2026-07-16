import { useState, useEffect, useRef, useCallback } from "react";
import { Component } from "react";

// 🆕 Importar PopupProvider
import { PopupProvider } from "./services/PopupService";

// 🆕 Importar hooks
import { useCategories } from "./hooks/useCategories";
import { useCategoryEditing } from "./hooks/useCategoryEditing";
import { useTransactionEditing } from "./hooks/useTransactionEditing";
import { addHistoryEntry } from "./services/attributeHistoryService";
import { filterTransactions } from "./services/transactionFilterService";
import { useBudgets } from "./hooks/useBudgets";
import { usePillarBudgets } from "./hooks/usePillarBudgets";

// Imports desde los nuevos módulos organizados
import {
  PILLARS, SALDO_COLOR, MONTHS_SHORT, MONTHS_FULL, METHOD_META, PILLAR_MAP,
  ALL_CATS, MANUAL_METHODS, TRANSACTIONS, DUMMY_TRANSACTIONS
} from "./constants";

import { fmt, fmtDate, getPeriodLabel, groupByDate } from "./utils/formatters";
import {
  getLastMonthWithData
} from "./utils/calculations";
import { calculateDashboard, getPillarPercentage, getTagPercentage } from "./utils/dashboardCalculations";
import { getCategoryName } from "./utils/categoryUtils";

// 🆕 Importar páginas de nuevas secciones
import SettingsPage from "./components/SettingsPage";
import ShowIncomesPage from "./components/ShowIncomesPage";
import CategoriesPage from "./components/CategoriesPage";
import AddCategoryPage from "./components/AddCategoryPage";
import BudgetsPage from "./components/BudgetsPage";
import MovimientosPage from "./components/MovimientosPage";
import HeaderService from "./components/HeaderService";
import PeriodSelector from "./components/PeriodSelectorService";
import ProfilePage from "./components/ProfilePage";
import TransactionPage from "./components/TransactionPage";
import PillarCardsGrid from "./components/PillarCardsGrid";
import PillarTagsBar from "./components/PillarTagsBar";
import DonutTagsBar from "./components/DonutTagsBar";
import DonutChartComponent from "./components/DonutChart";
import ColorBar from "./components/ColorBar";
import LoadingWrapper from "./components/LoadingWrapper";
import {
  DonutSkeleton,
  CardsGridSkeleton,
  ColorBarSkeleton,
  TagsBarSkeleton,
} from "./components/LoadingSkeleton";
import { useMultipleLoading } from "./hooks/useLoading";
import PillarBarsPopup from "./components/PillarBarsPopup";
import CatBar from "./components/CatBar";
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



/**
 * 🆕 Convierte ALL_CATS al formato de estado: {pillarId: [cat1, cat2, ...]}
 * @param {array} allCats - Array de {name, pillar}
 * @returns {object} {pillarId: [cat1, cat2, ...]}
 */
function initializeCategoriesFromAllCats(allCats) {
  const result = {};
  PILLARS.forEach(p => {
    result[p.id] = [];
  });
  allCats.forEach(cat => {
    if (result[cat.pillar]) {
      result[cat.pillar].push(cat.name);
    }
  });
  return result;
}

// 🆕 Función auxiliar para filtrar transacciones en Dashboard
function Movimientos({ isDark, transactions, filteredPillar, setFilteredPillar, stickyTop, selectedPeriod, onOpen, isOpen, filterType, setFilterType, movementOpenedFrom, setMovementOpenedFrom, setFilterTypeExternal }) {
  // 🆕 Estado para trackear si el botón está siendo presionado
  const [pressingMovimientos, setPressingMovimientos] = useState(false);

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
  const displayTxns = filterTransactions(transactions, { selectedPeriod, filteredPillar, filterType });

  return (
    <div style={{ marginTop: 0 }}>
      <button
        onClick={handleOpen}
        onPointerDown={() => {
          console.log("🔻 Movimientos presionado");
          setPressingMovimientos(true);
        }}
        onPointerUp={() => {
          console.log("🔺 Movimientos soltado");
          setPressingMovimientos(false);
        }}
        onPointerLeave={() => {
          console.log("🚫 Mouse salió de Movimientos");
          setPressingMovimientos(false);
        }}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: pressingMovimientos ? "rgba(0, 0, 0, 0.2)" : t.bg,
          border: `1.5px solid ${t.divider}`, padding: "10px 8px 10px", cursor: "pointer",
          position: "sticky", top: 0, zIndex: 20, borderRadius: 24, marginBottom: 0,
          overflow: "hidden", boxSizing: "border-box",
          transform: pressingMovimientos ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
          boxShadow: pressingMovimientos ? "inset 0 2px 6px rgba(0, 0, 0, 0.3)" : "none",
          transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
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

// 🆕 NewTransactionPage ha sido movido a componente separado: AddTransactionPage.jsx


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
  const [showUpdateBalance, setShowUpdateBalance] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  // 🆕 Estado para trackear qué botón FAB está siendo presionado
  const [pressingFAB, setPressingFAB] = useState(null);
  // 🆕 Pilar seleccionado para la página de movimientos
  const [selectedPillarForMovements, setSelectedPillarForMovements] = useState(null);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [customConcepts, setCustomConcepts] = useState([]);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS); // 🔄 DEV: Inicia con DUMMY siempre

  // 🆕 Usar hook independiente para categorías (será la BD del usuario)
  const { categories, addCategory: addCategoryToHook, deleteCategory: deleteCategoryFromHook, editCategory: editCategoryInHook } = useCategories();
  // 🆕 Inicia con el último mes que tiene datos (sin hardcodear)
  const [selectedPeriod, setSelectedPeriod] = useState(() => getLastMonthWithData(DUMMY_TRANSACTIONS));
  const [isMovementOpen, setIsMovementOpen] = useState(false);
  // 🆕 Filtro de Gastado/Ingresos
  const [filterType, setFilterType] = useState(null); // null | "gastado" | "ingresos"
  // 🆕 Rastrear cómo se abrió Estado 2 (por cuál "puerta")
  const [movementOpenedFrom, setMovementOpenedFrom] = useState(null); // null | "gastado" | "ingresos" | "bar"
  // 🆕 Hooks independientes
  const { customBudgets, setCustomBudgets } = usePillarBudgets();
  const { categoryBudgets, setCategoryBudgets, updateWithNewCategories } = useBudgets();

  // 🆕 Estados de loading para diferentes secciones
  const { isLoading, startLoading, stopLoading } = useMultipleLoading({
    donut: false,
    cardsGrid: false,
    colorBar: false,
    tagsBar: false,
  });
  // 🆕 Estado para mostrar/ocultar sección de GASTADO/INGRESOS (controlado por toggle en Settings)
  // 🔄 DEV: Siempre inicia en true (se reinicia con refresh) - NO usar localStorage en DEV
  const [showIncomes, setShowIncomes] = useState(false);

  // 🆕 Estados para editar categoría
  const {
    editingCategoryId, editingCategoryName, editingPillarId,
    startEditing: startCategoryEditing, resetEditing: resetCategoryEditing,
  } = useCategoryEditing();

  // 🆕 Estados para editar transacción
  const {
    editingTransactionId, selectedTransactionForEdit,
    startEditing: startTransactionEditing, resetEditing: resetTransactionEditing,
  } = useTransactionEditing();

  // 🆕 Estado para trackear qué tag del donut está siendo presionado
  const [pressingSegmentId, setPressingSegmentId] = useState(null);

  // 🆕 Listener global para efecto de hundimiento en botones
  useEffect(() => {
    const handleButtonClick = (e) => {
      // Solo aplicar a botones, no a elementos padre
      if (e.target.tagName !== 'BUTTON') return;

      // NO aplicar a botones "Atrás" (tienen clase back-button o incluyen <)
      if (e.target.textContent.includes('<') || e.target.classList.contains('back-button')) {
        return;
      }

      // Agregar clase pressed
      e.target.classList.add('pressed');

      // Remover clase después de 300ms
      setTimeout(() => {
        e.target.classList.remove('pressed');
      }, 300);
    };

    // Usar capture phase para interceptar todos los clicks
    document.addEventListener('click', handleButtonClick, true);

    return () => {
      document.removeEventListener('click', handleButtonClick, true);
    };
  }, []);

  // 🆕 FUNCIONES CRUD PARA MUTACION DIRECTA DE ALL_CATS
  const createCategory = (pillarId, categoryName) => {
    // Generar ID: "cat_nombre" o "cat_nombre_1", "cat_nombre_2", etc.
    const baseName = categoryName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    // Contar cuántas categorías con este nombre ya existen en este pilar
    const count = ALL_CATS.filter(
      cat => cat.pillar === pillarId &&
      cat.name.toLowerCase() === categoryName.toLowerCase()
    ).length;

    const newId = count === 0 ? `cat_${baseName}` : `cat_${baseName}_${count}`;

    // Crear nueva categoría
    const newCategory = {
      id: newId,
      name: categoryName,
      pillar: pillarId,
      spent: 0,
      budget: null
    };

    // 1. Agregar directamente a ALL_CATS
    ALL_CATS.push(newCategory);

    // 2. Actualizar estado React del hook
    addCategoryToHook(pillarId, newId);

    console.log("✅ Categoría creada:", newCategory);
  };

  const editCategory = (categoryId, updates) => {
    // Encontrar y editar categoría
    const category = ALL_CATS.find(cat => cat.id === categoryId);
    if (!category) return;

    const oldPillar = category.pillar;
    const oldName = category.name;

    // 🆕 Guardar en historial si cambia nombre
    if (updates.name && updates.name !== category.name) {
      addHistoryEntry(category, "name", category.name, updates.name);
      category.name = updates.name;
    }

    // 🆕 Guardar en historial si cambia pilar
    if (updates.pillar && updates.pillar !== category.pillar) {
      addHistoryEntry(category, "pillar", category.pillar, updates.pillar);
      category.pillar = updates.pillar;
    }

    // Actualizar estado React si cambió de pilar
    if (updates.pillar && oldPillar !== updates.pillar) {
      editCategoryInHook(categoryId, updates.pillar);
    }

    console.log("✅ Categoría editada:", category);
  };

  const deleteCategory = (categoryId) => {
    // Encontrar categoría antes de eliminar (necesitamos su pilar)
    const category = ALL_CATS.find(cat => cat.id === categoryId);
    if (!category) return;

    const pillarId = category.pillar;

    // Encontrar índice y remover de ALL_CATS
    const idx = ALL_CATS.findIndex(cat => cat.id === categoryId);
    if (idx !== -1) {
      ALL_CATS.splice(idx, 1);
    }

    // Actualizar estado React del hook
    deleteCategoryFromHook(categoryId, pillarId);

    console.log("✅ Categoría eliminada:", categoryId);
  };

  const editCategoryBudget = (categoryId, newBudget) => {
    // Editar presupuesto de categoría
    const category = ALL_CATS.find(cat => cat.id === categoryId);
    if (!category) return;

    const oldBudget = category.budget;

    // 🆕 Guardar en historial si cambia presupuesto
    if (newBudget !== oldBudget) {
      addHistoryEntry(category, "budget", oldBudget, newBudget);
      category.budget = newBudget;
    }

    console.log("✅ Presupuesto de categoría actualizado:", categoryId, newBudget);
  };

  const editPillarBudget = (pillarId, newBudget) => {
    // Editar presupuesto de pilar
    const pillar = PILLARS.find(p => p.id === pillarId);
    if (!pillar) return;

    const oldBudget = pillar.budget;

    // 🆕 Guardar en historial si cambia presupuesto
    if (newBudget !== oldBudget) {
      addHistoryEntry(pillar, "budget", oldBudget, newBudget);
      pillar.budget = newBudget;
    }

    console.log("✅ Presupuesto de pilar actualizado:", pillarId, newBudget);
  };

  // 🆕 FUNCIONES CRUD PARA TRANSACCIONES
  const editTransaction = (transactionId, updatedData) => {
    // Buscar y actualizar transacción (sobrescribe datos pero mantiene id, date, time)
    const txIndex = transactions.findIndex(tx => tx.id === transactionId);
    if (txIndex === -1) return;

    const updatedTransactions = [...transactions];
    updatedTransactions[txIndex] = {
      ...transactions[txIndex],
      ...updatedData,
      id: transactions[txIndex].id, // Mantener ID
      date: transactions[txIndex].date, // Mantener fecha
      time: transactions[txIndex].time, // Mantener hora
    };

    setTransactions(updatedTransactions);
    resetTransactionEditing();

    console.log("✅ Transacción editada:", transactionId);
  };

  const deleteTransaction = (transactionId) => {
    // Eliminar transacción
    const updatedTransactions = transactions.filter(tx => tx.id !== transactionId);
    setTransactions(updatedTransactions);
    resetTransactionEditing();

    console.log("✅ Transacción eliminada:", transactionId);
  };

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
      if (key.startsWith("orus_dev_") || key === "orus_custom_budgets" || key === "orus_pillar_budgets" || key === "orus_category_budgets") {
        localStorage.removeItem(key);
        console.log(`🗑️ Limpiado: ${key}`);
      }
    });

    // 🔄 DEV VERSION: Siempre cargar datos dummy de desarrollo
    console.log("📊 DEV: Cargando DUMMY_TRANSACTIONS al localStorage...");
    localStorage.setItem("orus_transactions", JSON.stringify(DUMMY_TRANSACTIONS));

    // Cargar transacciones desde localStorage si ya existen
    const isFirstLoad = !localStorage.getItem("orus_transactions");
    if (!isFirstLoad) {
      try {
        const stored = localStorage.getItem("orus_transactions");
        if (stored) {
          setTransactions(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error loading transactions:", e);
      }
    }

    // 🆕 NO cargar presupuestos desde localStorage - siempre reiniciar desde ALL_CATS
    // Los presupuestos se reinician cada sesión, no persisten
  }, []); // Solo ejecutar una vez al montar

  // Guardar transacciones cuando cambien
  useEffect(() => {
    localStorage.setItem("orus_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // 🆕 NO guardar presupuestos en localStorage - se reinician cada sesión

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

      // Si el popup está abierto, NO deseleccionar (la tarjeta debe seguir azul)
      if (showPillarBars) return;

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
        // ✅ Si month es null, mostrar todo el año. Si no, mostrar solo ese mes
        if (selectedPeriod.month === null) {
          return txYear === selectedPeriod.year;
        }
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

  // ============================================================
  // CALCULAR TODOS LOS VALORES DEL DASHBOARD DE UNA VEZ
  // ============================================================
  const dashboardMetrics = calculateDashboard(filteredByPeriod, PILLARS, SALDO_COLOR, isDark, showIncomes);

  const {
    totalSpent,
    incomingTotal,
    pillarSpends,
    saldo,
    saldoForDonut,
    donutTotal,
    hasSaldo,
    chipPcts,
    saldoPctFinal,
    segments,
  } = dashboardMetrics;

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
          <TransactionPage
            isEditing={false}
            onBack={() => setScreen("dashboard")}
            onDone={({ desc, rawAmount, isIncome, method, concept, pillarId }) => {
              const absAmount = parseInt((rawAmount || "").replace(/\D/g, "")) || 0;
              if (absAmount === 0 && !desc && !concept) { setScreen("dashboard"); return; }
              const now = new Date();
              const dateStr = now.toISOString().slice(0, 10);
              const timeStr = now.toTimeString().slice(0, 5);

              // Crear nueva transacción
              // 🔄 concept es el ID de la categoría (viene desde TransactionPage)
              const categoryId = concept || null;

              const newTx = {
                id: Math.max(...transactions.map(t => t.id || 0), 0) + 1,
                date: dateStr,
                time: timeStr,
                description: desc,  // ✅ Usar "description" para consistencia
                method: method || "Banco",
                amount: isIncome ? absAmount : -absAmount,
                pillar: isIncome ? "ingreso" : pillarId,
                category: categoryId,  // ✅ Ya es ID desde TransactionPage
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
            categories={categories}
            onCreateCategory={(categoryName, pillarId) => {
              // 🆕 Usar hook para agregar categoría
              addCategoryToHook(pillarId, categoryName);
            }}
          />
        </div>
      </div>
    );
  }

  // 🆕 Pantalla de Editar Transacción
  if (editingTransactionId && selectedTransactionForEdit) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <TransactionPage
            isEditing={true}
            editingTransaction={selectedTransactionForEdit}
            onBack={() => {
              resetTransactionEditing();
            }}
            onSave={(transactionId, updatedData) => {
              editTransaction(transactionId, updatedData);
              // Volver a la pantalla anterior (dashboard o movimientos)
              if (screen === "movimientos") {
                setScreen("movimientos");
              } else {
                setScreen("dashboard");
              }
            }}
            onDelete={(transactionId) => {
              deleteTransaction(transactionId);
              // Volver a la pantalla anterior
              if (screen === "movimientos") {
                setScreen("movimientos");
              } else {
                setScreen("dashboard");
              }
            }}
            isDark={isDark}
            categories={categories}
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
            onCategories={() => setScreen("categories")}
            onShowIncomes={() => setScreen("show-incomes")}
            showIncomes={showIncomes}
            setShowIncomes={setShowIncomes}
          />
        </div>
      </div>
    );
  }

  // 🆕 Pantalla de Mostrar Ingresos
  if (screen === "show-incomes") {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <ShowIncomesPage
            isDark={isDark}
            onBack={() => setScreen("settings")}
            showIncomesEnabled={showIncomes}
            onToggleShowIncomes={setShowIncomes}
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
            onSaveSuccess={() => setScreen("settings")}
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
            categories={categories}
            editPillarBudget={editPillarBudget}
            editCategoryBudget={editCategoryBudget}
            onSave={(newBudgets) => {
              setCustomBudgets(prev => ({
                ...prev,
                [key]: newBudgets
              }));
            }}
            onSaveSuccess={() => setScreen("settings")}
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
            categories={categories}
            categoryBudgets={categoryBudgets}
            onEditTransaction={(tx) => {
              startTransactionEditing(tx);
            }}
          />
        </div>
      </div>
    );
  }

  // 🆕 Pantalla de Categorías
  if (screen === "categories") {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <CategoriesPage
            isDark={isDark}
            onBack={() => setScreen("settings")}
            onAddCategory={() => {
              resetCategoryEditing();
              setScreen("add-category");
            }}
            onEditCategory={(categoryId, pillarId) => {
              // ✅ Guardar ID y convertir ID a nombre para pasar a AddCategoryPage
              startCategoryEditing(categoryId, getCategoryName(categoryId), pillarId);
              setScreen("add-category");
            }}
            categories={categories}
          />
        </div>
      </div>
    );
  }

  // 🆕 Pantalla de Agregar/Editar Categoría
  if (screen === "add-category") {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>
          <AddCategoryPage
            isDark={isDark}
            onBack={() => setScreen("categories")}
            categories={categories}
            isEditing={editingCategoryName !== null}
            editingCategoryName={editingCategoryName}
            editingPillarId={editingPillarId}
            onSave={(pillarId, categoryName) => {
              if (editingCategoryId) {
                // 🆕 MODO EDICIÓN: Editar categoría existente usando ID
                editCategory(editingCategoryId, { name: categoryName, pillar: pillarId });
              } else {
                // 🆕 MODO NUEVO: Crear nueva categoría
                createCategory(pillarId, categoryName);
              }

              setScreen("categories");
              resetCategoryEditing();
            }}
            onDelete={() => {
              // 🆕 Eliminar categoría por ID
              if (editingCategoryId) {
                deleteCategory(editingCategoryId);
              }
              setScreen("categories");
              resetCategoryEditing();
            }}
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
                <button disabled onClick={() => setShowUpdateBalance(true)} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "4px 8px", borderRadius: 20, border: "none", cursor: "not-allowed", background: isDark ? "#1E1E2E" : "#F0EFF8", outline: `1.5px solid transparent`, transition: "all 0.15s", justifyContent: "center", opacity: 0.5 }}>
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
                    <LoadingWrapper
                      isLoading={isLoading("donut")}
                      skeleton={<DonutSkeleton isDark={isDark} />}
                      isDark={isDark}
                    >
                      <DonutChartComponent segments={segments} cx={114} cy={114} outerR={90} innerR={54} activeId={activeId} onSelect={handleSelectPillar} isDark={isDark} gastos={totalSpent} total={totalSpent + saldoForDonut} totalSpent={totalSpent} pillarSpends={pillarSpends} hasSaldoAsignado={saldoForDonut > 0} saldoValue={saldoForDonut} selectedPeriod={selectedPeriod} SALDO_COLOR={SALDO_COLOR} />
                    </LoadingWrapper>
                  </div>

                  {/* Botones/Tags del donut - Componente separado */}
                  <DonutTagsBar
                    segments={segments}
                    activeId={activeId}
                    setActiveId={setActiveId}
                    pressingSegmentId={pressingSegmentId}
                    setPressingSegmentId={setPressingSegmentId}
                    isMovementOpen={isMovementOpen}
                    isDark={isDark}
                    t={t}
                  />
                </div>

                {/* 🆕 Ocultar barra de categorías cuando filterType es "ingresos" - con ref para medir altura */}
                <div ref={pillarsGridRef} style={{ display: filterType === "ingresos" ? "none" : "block", marginBottom: filterType === "ingresos" ? 0 : 12 }}>
                  <LoadingWrapper
                    isLoading={isLoading("cardsGrid")}
                    skeleton={<CardsGridSkeleton isDark={isDark} />}
                    isDark={isDark}
                  >
                    <PillarCardsGrid
                      PILLARS={PILLARS}
                      chipPcts={chipPcts}
                      pillarSpends={pillarSpends}
                      activeId={activeId}
                      setActiveId={setActiveId}
                      selectedPeriod={selectedPeriod}
                      customBudgets={customBudgets}
                      getBudgetForMonth={getBudgetForMonth}
                      hasSaldo={hasSaldo}
                      saldo={saldo}
                      saldoPctFinal={saldoPctFinal}
                      SALDO_COLOR={SALDO_COLOR}
                      setSelectedPillarDetail={setSelectedPillarDetail}
                      setShowPillarBars={setShowPillarBars}
                      isDark={isDark}
                      t={t}
                    />
                  </LoadingWrapper>
                </div>
              </div>
              )}

              {/* ESTADO 2: COLLAPSED (Barra + Tags) - Solo si NO es INGRESOS */}
              {isMovementOpen === true && filterType !== "ingresos" && (
              <div style={{ overflow: "visible", marginBottom: 12 }}>
                {/* Barra de colores */}
                <div ref={colorBarRef} style={{ marginBottom: 9 }}>
                  <LoadingWrapper
                    isLoading={isLoading("colorBar")}
                    skeleton={<ColorBarSkeleton isDark={isDark} />}
                    isDark={isDark}
                  >
                    <ColorBar
                      segments={segments}
                      filteredPillar={filteredPillar}
                      setFilteredPillar={setFilteredPillar}
                      setFilterType={setFilterType}
                      isActive={true}
                      selectedPeriod={selectedPeriod}
                    />
                  </LoadingWrapper>
                </div>

                {/* Botones de pilares */}
                <div ref={pillarButtonsRef}>
                  <LoadingWrapper
                    isLoading={isLoading("tagsBar")}
                    skeleton={<TagsBarSkeleton isDark={isDark} />}
                    isDark={isDark}
                  >
                    <PillarTagsBar
                      PILLARS={PILLARS}
                      chipPcts={chipPcts}
                      saldoPctFinal={saldoPctFinal}
                      hasSaldo={hasSaldo}
                      SALDO_COLOR={SALDO_COLOR}
                      filteredPillar={filteredPillar}
                      setFilteredPillar={setFilteredPillar}
                      filterType={filterType}
                      setFilterType={setFilterType}
                      isDark={isDark}
                      t={t}
                    />
                  </LoadingWrapper>
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
              <TransactionsListService
                isDark={isDark}
                transactions={filterTransactions(transactions, { selectedPeriod, filteredPillar, filterType })}
                onEditTransaction={(tx) => {
                  startTransactionEditing(tx);
                }}
              />
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
          <button
            onClick={() => setScreen("new-transaction")}
            onPointerDown={() => setPressingFAB("pencil")}
            onPointerUp={() => setPressingFAB(null)}
            onPointerLeave={() => setPressingFAB(null)}
            style={{
              width: 32, height: 32, borderRadius: "50%", border: "none",
              background: isDark ? "#3A3A52" : "#94A3B8",
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(0,0,0,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transform: pressingFAB === "pencil" ? "scale(0.90)" : "scale(1)",
              opacity: pressingFAB === "pencil" ? 0.7 : 1,
              transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>

          <button
            onPointerDown={() => setPressingFAB("mic")}
            onPointerUp={() => setPressingFAB(null)}
            onPointerLeave={() => setPressingFAB(null)}
            style={{
              width: 52, height: 52, borderRadius: "50%", border: "none",
              background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(155,109,255,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transform: pressingFAB === "mic" ? "scale(0.93)" : "scale(1)",
              opacity: pressingFAB === "mic" ? 0.8 : 1,
              transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
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
            categories={categories}
            onClose={() => { setShowPillarBars(false); setActiveId(null); }}
            onViewMovements={() => {
              setShowPillarBars(false);
              setActiveId(null); // Resetear la tarjeta seleccionada al abrir movimientos
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

// 🆕 Exporta Dashboard envuelto en ErrorBoundary y PopupProvider
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <PopupProvider>
        <Dashboard />
      </PopupProvider>
    </ErrorBoundary>
  );
}
