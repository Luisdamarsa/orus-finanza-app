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
import { useTransactionToast } from "./hooks/useTransactionToast";
import ScreenShell from "./components/ScreenShell";
import { DashboardContext } from "./contexts/DashboardContext";
import * as catalog from "./services/categoryCatalogService";
import { usePillarBudgets } from "./hooks/usePillarBudgets";

// Imports desde los nuevos módulos organizados
import {
  PILLARS, SALDO_COLOR, MONTHS_SHORT, MONTHS_FULL, METHOD_META, PILLAR_MAP,
  ALL_CATS, MANUAL_METHODS, TRANSACTIONS, DUMMY_TRANSACTIONS
} from "./constants";

import { calculateDashboard } from "./utils/dashboardCalculations";

// 🆕 Importar páginas de nuevas secciones
import MovimientosPage from "./components/MovimientosPage";
import { useMultipleLoading } from "./hooks/useLoading";
import DashboardScreen from "./components/DashboardScreen";
import BudgetsScreen from "./components/BudgetsScreen";
import CategoriesScreen from "./components/CategoriesScreen";
import AddCategoryScreen from "./components/AddCategoryScreen";
import TransactionScreen from "./components/TransactionScreen";
import { useTransactionActions } from "./hooks/useTransactionActions";
import SettingsScreen from "./components/SettingsScreen";
import ShowIncomesScreen from "./components/ShowIncomesScreen";
import ProfileScreen from "./components/ProfileScreen";
import PillarDetailPage from "./components/PillarDetailPage";

// 🆕 Importar userStorage para datos del usuario





/**
 * 🆕 Convierte ALL_CATS al formato de estado: {pillarId: [cat1, cat2, ...]}
 * @param {array} allCats - Array de {name, pillar}
 * @returns {object} {pillarId: [cat1, cat2, ...]}
 */


// 🆕 NewTransactionPage ha sido movido a componente separado: AddTransactionPage.jsx


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

  // 🆕 Toast de nueva transacción (hook)
  const { toast: newTxnToast, showTransactionToast: triggerNewTxnToast } = useTransactionToast();

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

  const txnActions = useTransactionActions({
    addTx, editTransaction, deleteTransaction, triggerNewTxnToast,
    setSelectedPeriod, setIsMovementOpen, setFilterType, setMovementOpenedFrom,
    setScreen, screen,
  });

  if (screen === "pillar-detail" && selectedPillarDetail) {
    return (
      <ScreenShell bg={t.bg}>
          <PillarDetailPage
            pillar={selectedPillarDetail}
            onBack={() => { setScreen("dashboard"); setShowPillarBars(false); setSelectedPillarDetail(null); }}
            isDark={isDark}
            transactions={transactions}
          />
      </ScreenShell>
    );
  }

  if (screen === "new-transaction") {
    return <TransactionScreen mode="new" isDark={isDark} t={t} categories={categories} customConcepts={customConcepts} actions={txnActions} onBack={() => setScreen("dashboard")} onCreateCategory={(name, pillarId) => addCategoryToHook(pillarId, name)} />;
  }

  // 🆕 Pantalla de Editar Transacción
  if (editingTransactionId && selectedTransactionForEdit) {
    return <TransactionScreen mode="edit" isDark={isDark} t={t} categories={categories} editingTransaction={selectedTransactionForEdit} actions={txnActions} onBack={() => resetTransactionEditing()} />;
  }

  // 🆕 Pantalla de Configuraciones
  if (screen === "settings") {
    return <SettingsScreen isDark={isDark} t={t} setScreen={setScreen} showIncomes={showIncomes} setShowIncomes={setShowIncomes} />;
  }

  // 🆕 Pantalla de Mostrar Ingresos
  if (screen === "show-incomes") {
    return <ShowIncomesScreen isDark={isDark} t={t} setScreen={setScreen} showIncomes={showIncomes} setShowIncomes={setShowIncomes} />;
  }

  // 🆕 Pantalla de Perfil
  if (screen === "profile") {
    return <ProfileScreen isDark={isDark} t={t} setScreen={setScreen} />;
  }

  // 🆕 Pantalla de Presupuestos
  if (screen === "budgets") {
    return <BudgetsScreen isDark={isDark} t={t} selectedPeriod={selectedPeriod} customBudgets={customBudgets} setCustomBudgets={setCustomBudgets} categories={categories} editPillarBudget={editPillarBudget} editCategoryBudget={editCategoryBudget} getBudgetForMonth={getBudgetForMonth} setScreen={setScreen} />;
  }

  // 🆕 Pantalla de Movimientos por Pilar
  if (screen === "movimientos" && selectedPillarForMovements) {
    return (
      <ScreenShell bg={t.bg}>
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
      </ScreenShell>
    );
  }

  // 🆕 Pantalla de Categorías
  if (screen === "categories") {
    return <CategoriesScreen isDark={isDark} t={t} categories={categories} setScreen={setScreen} resetCategoryEditing={resetCategoryEditing} startCategoryEditing={startCategoryEditing} />;
  }

  // 🆕 Pantalla de Agregar/Editar Categoría
  if (screen === "add-category") {
    return <AddCategoryScreen isDark={isDark} t={t} categories={categories} editingCategoryName={editingCategoryName} editingPillarId={editingPillarId} editingCategoryId={editingCategoryId} editCategory={editCategory} createCategory={createCategory} deleteCategory={deleteCategory} resetCategoryEditing={resetCategoryEditing} setScreen={setScreen} />;
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
