import { useState, useEffect, useRef, useCallback } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

// 🆕 Importar PopupProvider
import { PopupProvider } from "./services/PopupService";

// 🆕 Importar ThemeProvider y useTheme
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./hooks/useTheme";

// 🆕 Importar hooks
import { useAuth } from "./hooks/useAuth";
import { useCategories } from "./hooks/useCategories";
import { useCategoryEditing } from "./hooks/useCategoryEditing";
import { useTransactionEditing } from "./hooks/useTransactionEditing";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useDashboardNavigation } from "./hooks/useDashboardNavigation";
import { useTransactions } from "./hooks/useTransactions";
import { useTransactionToast } from "./hooks/useTransactionToast";
import ScreenRouter from "./components/ScreenRouter";
import { DashboardContext } from "./contexts/DashboardContext";
import * as catalog from "./services/categoryCatalogService";
import { usePillarBudgets } from "./hooks/usePillarBudgets";

// Imports desde los nuevos módulos organizados
import {
  PILLARS, SALDO_COLOR, MONTHS_SHORT, MONTHS_FULL, METHOD_META, PILLAR_MAP,
  ALL_CATS, MANUAL_METHODS, DUMMY_TRANSACTIONS
} from "./constants";

import { calculateDashboard } from "./utils/dashboardCalculations";

// 🆕 Importar páginas de nuevas secciones
import { useMultipleLoading } from "./hooks/useLoading";
import { useTransactionActions } from "./hooks/useTransactionActions";

// 🆕 Importar userStorage para datos del usuario
import { userStorage } from "./utils/userStorage";





/**
 * 🆕 Convierte ALL_CATS al formato de estado: {pillarId: [cat1, cat2, ...]}
 * @param {array} allCats - Array de {name, pillar}
 * @returns {object} {pillarId: [cat1, cat2, ...]}
 */


// 🆕 NewTransactionPage ha sido movido a componente separado: AddTransactionPage.jsx


// 🆕 Función para obtener el presupuesto correcto para un mes específico
// 🆕 FASE 2: Recibe userId para filtrar presupuestos por usuario
function getBudgetForMonth(pillarId, month, year, customBudgets, userId) {
  const key = `${year}-${String(month).padStart(2, '0')}`;

  // 🆕 Acceder a customBudgets[userId][key][pillarId] (estructura anidada)
  const userBudgets = customBudgets[userId] || {};

  // Si hay presupuesto personalizado para ese mes, usarlo
  if (userBudgets[key] && userBudgets[key][pillarId] !== undefined) {
    return userBudgets[key][pillarId];
  }

  // Si no, buscar el presupuesto personalizado más reciente ANTERIOR a ese mes
  for (let m = month - 1; m >= 1; m--) {
    const checkKey = `${year}-${String(m).padStart(2, '0')}`;
    if (userBudgets[checkKey] && userBudgets[checkKey][pillarId] !== undefined) {
      return userBudgets[checkKey][pillarId];
    }
  }

  // Si no hay nada, retornar el presupuesto base de constantes
  const pillar = PILLARS.find(p => p.id === pillarId);
  return pillar?.budget || 0;
}

function Dashboard() {
  // 🆕 Tema desde ThemeContext (centralizado)
  const { isDark, setIsDark } = useTheme();
  const setTheme = setIsDark; // Alias para compatibilidad con código existente
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

  // 🆕 Rastrear pantalla anterior para navegación correcta (ej. Permisos → volver a Automatizaciones, no a Configuración)
  // Solo registra pantallas "principales", no pantallas hijas/modales (permissions, privacy-perms, terms, etc.)
  const [previousScreen, setPreviousScreen] = useState(null);
  const mainScreens = ["dashboard", "settings", "automatizaciones", "profile", "categories", "budgets", "movimientos", "add-category", "show-incomes", "notifications-setup", "shortcuts-setup", "reports", "my-reports"];
  useEffect(() => {
    if (screen && mainScreens.includes(screen) && screen !== previousScreen) {
      setPreviousScreen(screen);
    }
  }, [screen, previousScreen]);

  // 🆕 Memoizar función de toggle para el donut
  const handleSelectPillar = useCallback((id) => {
    setActiveId(prevActiveId => prevActiveId === id ? null : id);
  }, []);
  // 🆕 Estado para trackear qué botón FAB está siendo presionado
  const [pressingFAB, setPressingFAB] = useState(null);
  // 🆕 Búsqueda de movimientos (lupa del FAB): abre Estado 2 y filtra por texto
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // 🆕 Datos por voz para pre-llenar la pantalla de nueva transacción (se consume al abrirla)
  const [voicePrefill, setVoicePrefill] = useState(null);
  // 🆕 Tab de la página de Categorías ("gastos" | "ingresos"); persiste al ir/volver de crear categoría
  const [categoriesTab, setCategoriesTab] = useState("gastos");
  // 🆕 Estados de Automatizaciones (persistidos en userStorage)
  const [microphoneEnabled, setMicrophoneEnabled] = useState(() => userStorage.get("microphoneEnabled") !== false);
  const [notificationListenerEnabled, setNotificationListenerEnabled] = useState(() => userStorage.get("notificationListenerEnabled") === true);
  const [iosShortcutsEnabled, setIosShortcutsEnabled] = useState(() => userStorage.get("iosShortcutsEnabled") === true);
  // Guardar cambios en userStorage
  const handleSetMicrophoneEnabled = (value) => {
    setMicrophoneEnabled(value);
    userStorage.set("microphoneEnabled", value);
  };
  const handleSetNotificationListenerEnabled = (value) => {
    setNotificationListenerEnabled(value);
    userStorage.set("notificationListenerEnabled", value);
  };
  const handleSetIosShortcutsEnabled = (value) => {
    setIosShortcutsEnabled(value);
    userStorage.set("iosShortcutsEnabled", value);
  };
  // Función para abrir Configuración → Accesibilidad
  const onOpenAccessibilitySettings = () => {
    if (window.Capacitor) {
      window.Capacitor.Plugins.App.openUrl?.({
        url: "android://settings/accessibility"
      }).catch(() => {
        console.log("No se puede abrir Settings (dev mode)");
      });
    }
  };
  // Limpia el prefill al salir de "nueva transacción" (para que el lápiz manual no herede datos de voz)
  useEffect(() => {
    if (screen !== "new-transaction") setVoicePrefill(null);
  }, [screen]);

  // 🆕 FASE 2 - Integración con useAuth
  // Obtener el usuario actual logueado y extraer su ID para filtrar transacciones
  const { user: authUser } = useAuth();

  // 🆕 PASO 6 - Selector de usuario para testing (DEV ONLY)
  // Permite cambiar entre los 3 usuarios para verificar el filtrado
  const [devSelectedUserId, setDevSelectedUserId] = useState(null); // null = usar useAuth, no-null = forzar user
  const MOCK_USER_OPTIONS = [
    { id: "UA0001", name: "Luis Daniel (237 transacciones)" },
    { id: "UB0002", name: "María García (55 transacciones)" },
    { id: "UC0003", name: "Carlos López (50 transacciones)" },
  ];

  // Mapeo de usuarios mock
  const MOCK_USERS_MAP = {
    "UA0001": { id: "UA0001", username: "Luis Daniel", nombre: "Luis", apellido: "Daniel", email: "test@test.com", phone: "+57 3001111111" },
    "UB0002": { id: "UB0002", username: "María García", nombre: "María", apellido: "García", email: "test1@example.com", phone: "+57 3002222222" },
    "UC0003": { id: "UC0003", username: "Carlos López", nombre: "Carlos", apellido: "López", email: "test2@example.com", phone: "+57 3003333333" },
  };

  // Si devSelectedUserId está set, usarlo; si no, usar authUser
  const currentUserId = devSelectedUserId || authUser?.id || "UA0001";

  // Crear currentUser basado en currentUserId (si devSelectedUserId está set, buscar en MOCK_USERS_MAP)
  const currentUser = devSelectedUserId ? MOCK_USERS_MAP[devSelectedUserId] : authUser;

  // 🆕 Pilar seleccionado para la página de movimientos
  const [customConcepts, setCustomConcepts] = useState([]);
  const {
    transactions,
    addTransaction: addTx,
    editTransaction: applyEditTx,
    deleteTransaction: removeTx,
    loadTransactions,
  } = useTransactions(currentUserId); // 🆕 FASE 2: Pasar userId para filtrar transacciones

  // 🆕 Console logs para debugging FASE 2 (DESPUÉS de useTransactions)
  useEffect(() => {
    console.log(`\n🆕 FASE 2 - USUARIO ACTUAL: ${currentUserId} (${currentUser?.nombre})`);
    console.log(`  Transacciones del usuario: ${transactions.length}`);

    // Desglose de transacciones por pilar
    const txByPillar = {};
    transactions.forEach(tx => {
      if (!txByPillar[tx.pillar]) txByPillar[tx.pillar] = 0;
      txByPillar[tx.pillar]++;
    });
    console.log(`  Distribución: `, txByPillar);
  }, [currentUserId, currentUser, transactions]);

  // 🆕 Categorías: toda la lógica (crear/reutilizar/editar/borrar/varios) vive en el hook.
  // 🆕 FASE 2: Pasar userId para filtrar categorías por usuario
  const { categories, createCategory, getOrCreateCategory, ensureVariosCategory, editCategory, deleteCategory } = useCategories(currentUserId);
  // 🆕 Inicia con el último mes que tiene datos (sin hardcodear)
  // 🆕 Filtro de Gastado/Ingresos
  // 🆕 Rastrear cómo se abrió Estado 2 (por cuál "puerta")
  // 🆕 Hooks independientes
  // 🆕 FASE 2: Pasar userId para filtrar presupuestos por usuario
  const { customBudgets, setCustomBudgets } = usePillarBudgets(currentUserId);

  // 🆕 DEBUG: Loguear presupuestos del usuario
  useEffect(() => {
    console.log(`\n💰 Presupuestos para ${currentUserId}:`, customBudgets[currentUserId] || {});
  }, [currentUserId, customBudgets]);

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

  // 🆕 FASE 2 - Presupuestos aislados por usuario
  // Actualiza customBudgets[userId][mes/año][pillarId] para cada usuario
  const editPillarBudget = (pillarId, newBudget) => {
    console.log(`\n🔧 editPillarBudget INICIO:`, { pillarId, newBudget, currentUserId, selectedPeriod });

    if (!currentUserId) {
      console.log(`  ❌ NO currentUserId`);
      return;
    }
    if (!selectedPeriod) {
      console.log(`  ❌ NO selectedPeriod`);
      return;
    }

    const month = selectedPeriod.month || new Date().getMonth() + 1;
    const year = selectedPeriod.year || new Date().getFullYear();
    const key = `${year}-${String(month).padStart(2, '0')}`;

    console.log(`  ✅ Guardando: ${currentUserId}[${key}][${pillarId}] = ${newBudget}`);

    setCustomBudgets(prev => {
      const updated = {
        ...prev,
        [currentUserId]: {
          ...prev[currentUserId],
          [key]: {
            ...prev[currentUserId]?.[key],
            [pillarId]: newBudget
          }
        }
      };
      console.log(`  Nuevo estado:`, updated);
      return updated;
    });
  };

  const editCategoryBudget = (categoryId, newBudget) => {
    catalog.setCategoryBudget(categoryId, newBudget);
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

    // 🆕 FASE 2 - Verificar filtrado por userId
    console.log(`🆕 FASE 2 - Usuario actual: ${currentUserId}`);
    console.log(`🆕 FASE 2 - Transacciones cargadas para usuario: ${transactions.length}`);

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
      setSearchOpen(false);
      setSearchQuery("");
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
    ensureVariosCategory,
    getOrCreateCategory,
  });

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
    handleSelectPillar, pressingFAB, setPressingFAB, txnActions,
    searchOpen, setSearchOpen, searchQuery, setSearchQuery,
    setVoicePrefill,
    pressingSegmentId, setPressingSegmentId, customConcepts, setCustomConcepts,
    transactions, categories, customBudgets, setCustomBudgets,
    isLoading, startLoading, stopLoading,
    editingCategoryId, editingCategoryName, editingPillarId,
    startCategoryEditing, resetCategoryEditing,
    editingTransactionId, selectedTransactionForEdit,
    startTransactionEditing, resetTransactionEditing,
    // 🆕 FASE 2 - Usuario actual
    currentUser, currentUserId,
    ...dashboardMetrics,
  };

  const routerProps = {
    screen, isDark, t, setTheme,
    selectedPillarDetail, setSelectedPillarDetail, setShowPillarBars, transactions,
    categories, customConcepts, txnActions, voicePrefill,
    editingTransactionId, selectedTransactionForEdit, resetTransactionEditing,
    showIncomes, setShowIncomes,
    selectedPeriod, customBudgets, setCustomBudgets, editPillarBudget, editCategoryBudget, getBudgetForMonth,
    selectedPillarForMovements, startTransactionEditing,
    resetCategoryEditing, startCategoryEditing,
    editingCategoryName, editingPillarId, editingCategoryId, editCategory, createCategory, deleteCategory,
    categoriesTab, setCategoriesTab,
    microphoneEnabled, setMicrophoneEnabled: handleSetMicrophoneEnabled,
    notificationListenerEnabled, setNotificationListenerEnabled: handleSetNotificationListenerEnabled,
    iosShortcutsEnabled, setIosShortcutsEnabled: handleSetIosShortcutsEnabled,
    onOpenAccessibilitySettings,
    previousScreen,
    currentUser, // 🆕 FASE 2
    setScreen,
  };

  return (
    <>
      {/* 🆕 PASO 6 - Selector de usuario (DEV ONLY) - Esquina inferior izquierda */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        fontFamily: 'monospace',
        maxWidth: '220px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        pointerEvents: 'auto'
      }}>
        <div style={{ marginBottom: '6px', fontWeight: 'bold', fontSize: '10px' }}>CAMBIAR USUARIO:</div>
        <select
          value={devSelectedUserId || ''}
          onChange={(e) => setDevSelectedUserId(e.target.value || null)}
          style={{
            width: '100%',
            padding: '4px',
            marginBottom: '6px',
            borderRadius: '4px',
            border: '1px solid #555',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          <option value="">Auto (useAuth)</option>
          {MOCK_USER_OPTIONS.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <div style={{ fontSize: '10px', color: '#888', lineHeight: '1.4' }}>
          <div>ID: {currentUserId}</div>
          <div>TXS: {transactions.length}</div>
        </div>
      </div>

      <DashboardContext.Provider value={dashboard}>
        <ScreenRouter {...routerProps} />
      </DashboardContext.Provider>
    </>
  );
}

// 🆕 Exporta Dashboard envuelto en ThemeProvider, ErrorBoundary y PopupProvider
export default function AppWithErrorBoundary() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <PopupProvider>
          <Dashboard />
        </PopupProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
