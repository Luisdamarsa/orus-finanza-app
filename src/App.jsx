import { useState, useEffect, useRef, useCallback } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

// 🆕 Importar PopupProvider
import { PopupProvider } from "./services/PopupService";

// 🆕 Importar hooks
import { useCategories } from "./hooks/useCategories";
import { useCategoryEditing } from "./hooks/useCategoryEditing";
import { useTransactionEditing } from "./hooks/useTransactionEditing";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useDashboardNavigation } from "./hooks/useDashboardNavigation";
import { useTransactions } from "./hooks/useTransactions";
import { DashboardContext } from "./contexts/DashboardContext";
import * as catalog from "./services/categoryCatalogService";
import { usePillarBudgets } from "./hooks/usePillarBudgets";

// Imports desde los nuevos módulos organizados
import {
  PILLARS, SALDO_COLOR, MONTHS_SHORT, MONTHS_FULL, METHOD_META, PILLAR_MAP,
  ALL_CATS, MANUAL_METHODS, TRANSACTIONS, DUMMY_TRANSACTIONS
} from "./constants";

import { fmt, groupByDate } from "./utils/formatters";
import { calculateDashboard } from "./utils/dashboardCalculations";
import { getCategoryName } from "./utils/categoryUtils";

// 🆕 Importar páginas de nuevas secciones
import SettingsPage from "./components/SettingsPage";
import ShowIncomesPage from "./components/ShowIncomesPage";
import CategoriesPage from "./components/CategoriesPage";
import AddCategoryPage from "./components/AddCategoryPage";
import BudgetsPage from "./components/BudgetsPage";
import MovimientosPage from "./components/MovimientosPage";
import ProfilePage from "./components/ProfilePage";
import TransactionPage from "./components/TransactionPage";
import { useMultipleLoading } from "./hooks/useLoading";
import DashboardScreen from "./components/DashboardScreen";
import CatBar from "./components/CatBar";

// 🆕 Importar userStorage para datos del usuario





/**
 * 🆕 Convierte ALL_CATS al formato de estado: {pillarId: [cat1, cat2, ...]}
 * @param {array} allCats - Array de {name, pillar}
 * @returns {object} {pillarId: [cat1, cat2, ...]}
 */


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
  const {
    selectedPeriod, setSelectedPeriod,
    filterType, setFilterType,
    filteredPillar, setFilteredPillar,
    activeId, setActiveId,
    isMovementOpen, setIsMovementOpen,
    movementOpenedFrom, setMovementOpenedFrom,
  } = useDashboardFilters();
  const {
    screen, setScreen,
    selectedPillarDetail, setSelectedPillarDetail,
    selectedPillarForMovements, setSelectedPillarForMovements,
    showPillarBars, setShowPillarBars,
    showUpdateBalance, setShowUpdateBalance,
    showPeriodPicker, setShowPeriodPicker,
    showIncomes, setShowIncomes,
  } = useDashboardNavigation();

  // 🆕 Memoizar función de toggle para el donut
  const handleSelectPillar = useCallback((id) => {
    setActiveId(prevActiveId => prevActiveId === id ? null : id);
  }, []);
  // 🆕 Estado para trackear qué botón FAB está siendo presionado
  const [pressingFAB, setPressingFAB] = useState(null);
  // 🆕 Pilar seleccionado para la página de movimientos
  const [customConcepts, setCustomConcepts] = useState([]);
  const {
    transactions,
    addTransaction: addTx,
    editTransaction: applyEditTx,
    deleteTransaction: removeTx,
    loadTransactions,
  } = useTransactions();

  // 🆕 Usar hook independiente para categorías (será la BD del usuario)
  const { categories, addCategory: addCategoryToHook, deleteCategory: deleteCategoryFromHook, editCategory: editCategoryInHook } = useCategories();
  // 🆕 Inicia con el último mes que tiene datos (sin hardcodear)
  // 🆕 Filtro de Gastado/Ingresos
  // 🆕 Rastrear cómo se abrió Estado 2 (por cuál "puerta")
  // 🆕 Hooks independientes
  const { customBudgets, setCustomBudgets } = usePillarBudgets();

  // 🆕 Estados de loading para diferentes secciones
  const { isLoading, startLoading, stopLoading } = useMultipleLoading({
    donut: false,
    cardsGrid: false,
    colorBar: false,
    tagsBar: false,
  });
  // 🆕 Estado para mostrar/ocultar sección de GASTADO/INGRESOS (controlado por toggle en Settings)
  // 🔄 DEV: Siempre inicia en true (se reinicia con refresh) - NO usar localStorage en DEV

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
  // Catálogo (mutaciones vía categoryCatalogService) + sincronización de estado React
  const createCategory = (pillarId, categoryName) => {
    const newId = catalog.createCategoryEntry(pillarId, categoryName);
    addCategoryToHook(pillarId, newId);
  };

  const editCategory = (categoryId, updates) => {
    const res = catalog.renameOrMoveCategory(categoryId, updates);
    if (res && res.pillarChanged) editCategoryInHook(categoryId, updates.pillar);
  };

  const deleteCategory = (categoryId) => {
    const pillarId = catalog.softDeleteCategory(categoryId);
    if (pillarId) deleteCategoryFromHook(categoryId, pillarId);
  };

  const editCategoryBudget = (categoryId, newBudget) => {
    catalog.setCategoryBudget(categoryId, newBudget);
  };

  const editPillarBudget = (pillarId, newBudget) => {
    catalog.setPillarBudget(pillarId, newBudget);
  };

  // 🆕 FUNCIONES CRUD PARA TRANSACCIONES
  const editTransaction = (transactionId, updatedData) => {
    applyEditTx(transactionId, updatedData);
    resetTransactionEditing();
    console.log("✅ Transacción editada:", transactionId);
  };

  const deleteTransaction = (transactionId) => {
    removeTx(transactionId);
    resetTransactionEditing();
    console.log("✅ Transacción eliminada:", transactionId);
  };

  // 🆕 Refs para medir alturas dinámicamente
  const donutRef = useRef(null);
  const donutContainerRef = useRef(null);
  const pillarsGridRef = useRef(null);
  const colorBarRef = useRef(null);
  const pillarButtonsRef = useRef(null);
  const [, setMeasuredHeights] = useState({
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
          loadTransactions(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error loading transactions:", e);
      }
    }

    // 🆕 NO cargar presupuestos desde localStorage - siempre reiniciar desde ALL_CATS
    // Los presupuestos se reinician cada sesión, no persisten
  }, []); // Solo ejecutar una vez al montar

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


  // Colapso instantáneo basado en click (no scroll)
  const p1 = isMovementOpen ? 1 : 0;

  // 🆕 Medir dinámicamente el bottom del Área 1 (Sticky Zone)
  const stickyZoneRef = useRef(null);
  const headerRef = useRef(null);
  const [stickyH, setStickyH] = useState(152); // Default

  // 🆕 Toast de nueva transacción (aparece 1.5s en el hueco saldo/mes)
  const [newTxnToast, setNewTxnToast] = useState(null);
  const newTxnToastTimer = useRef(null);
  const triggerNewTxnToast = (data) => {
    setNewTxnToast({ ...data, key: Date.now() });
    if (newTxnToastTimer.current) clearTimeout(newTxnToastTimer.current);
    newTxnToastTimer.current = setTimeout(() => setNewTxnToast(null), 1500);
  };

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
                date: dateStr,
                time: timeStr,
                description: desc,  // ✅ Usar "description" para consistencia
                method: method || "Banco",
                amount: isIncome ? absAmount : -absAmount,
                pillar: isIncome ? "ingreso" : pillarId,
                category: categoryId,  // ✅ Ya es ID desde TransactionPage
              };

              // El servicio asigna el id; el hook persiste automáticamente.
              addTx(newTx);

              // 🆕 Toast de confirmación de la transacción recién creada
              triggerNewTxnToast({ isIncome, pillarId, categoryId, amount: newTx.amount });

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

  // 🆕 HU-1: valor del contexto del Dashboard (estado + métricas). Se expande por HU.
  const dashboard = {
    newTxnToast,
    isDark, t, monthHasData, getBudgetForMonth,
    donutRef, donutContainerRef, pillarsGridRef,
    colorBarRef, pillarButtonsRef,
    headerRef, stickyZoneRef, stickyH, p1,
    scrollY, setScrollY,
    selectedPeriod, setSelectedPeriod, filterType, setFilterType,
    filteredPillar, setFilteredPillar, activeId, setActiveId,
    isMovementOpen, setIsMovementOpen, movementOpenedFrom, setMovementOpenedFrom,
    screen, setScreen, selectedPillarDetail, setSelectedPillarDetail,
    selectedPillarForMovements, setSelectedPillarForMovements,
    showPillarBars, setShowPillarBars, showUpdateBalance, setShowUpdateBalance,
    showPeriodPicker, setShowPeriodPicker, showIncomes, setShowIncomes,
    handleSelectPillar, pressingFAB, setPressingFAB,
    pressingSegmentId, setPressingSegmentId, customConcepts, setCustomConcepts,
    transactions, categories, customBudgets, setCustomBudgets,
    isLoading, startLoading, stopLoading,
    editingCategoryId, editingCategoryName, editingPillarId,
    startCategoryEditing, resetCategoryEditing,
    editingTransactionId, selectedTransactionForEdit,
    startTransactionEditing, resetTransactionEditing,
    ...dashboardMetrics,
  };

  return (
    <DashboardContext.Provider value={dashboard}>
      <DashboardScreen />
    </DashboardContext.Provider>
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
