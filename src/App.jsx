import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

// 🆕 FASE 3F - Importar supabase para recuperar sesión
import { supabase } from "./services/supabaseService";

// 🆕 SESSION 1 - Importar OAuth service
import { syncOAuthUserToDatabase } from "./services/oauthService";

// 🆕 Importar PopupProvider
import { PopupProvider } from "./services/PopupService";

// 🆕 Importar ThemeProvider y useTheme
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./hooks/useTheme";

// 🆕 FASE 3C - Importar CategoryHistoryProvider
import { CategoryHistoryProvider } from "./context/CategoryHistoryContext";

// 🆕 Importar hooks
import { useAuth } from "./hooks/useAuth";
import { useCategories } from "./hooks/useCategories";
import { useCategoryEditing } from "./hooks/useCategoryEditing";
import { useTransactionEditing } from "./hooks/useTransactionEditing";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useDashboardNavigation } from "./hooks/useDashboardNavigation";
import { useTransactions } from "./hooks/useTransactions";
import { useTransactionToast } from "./hooks/useTransactionToast";
import { useUserCategories } from "./hooks/useUserCategories"; // 🆕 FASE 3C - categoryMap
import ScreenRouter from "./components/ScreenRouter";
import LoadingDashboard from "./components/LoadingDashboard"; // 🆕 Skeleton loading
import { DashboardContext } from "./contexts/DashboardContext";
import * as catalog from "./services/categoryCatalogService";
// 🆕 FASE 3B - Importar budgetService para presupuestos
import * as budgetService from "./services/budgetService";
import { usePillarBudgets } from "./hooks/usePillarBudgets";
import { useCategoryBudgets } from "./hooks/useCategoryBudgets"; // 🆕 FASE 3B - Presupuestos de categorías
// 🆕 Importar servicio de usuarios
import { getAllUsers, getUserPreferences, saveUserPreferences } from "./services/userService";

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

  // ✅ FASE LOGIN - Leer userId desde localStorage PRIMERO (antes de usarlo en useEffect)
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem("currentUserId") || null;
  });

  // 🆕 Loading state para Dashboard después de OAuth
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // 🆕 Rastrear pantalla anterior para navegación correcta (ej. Permisos → volver a Automatizaciones, no a Configuración)
  // Solo registra pantallas "principales", no pantallas hijas/modales (permissions, privacy-perms, terms, etc.)
  const [previousScreen, setPreviousScreen] = useState(null);
  const mainScreens = ["dashboard", "settings", "automatizaciones", "profile", "categories", "budgets", "movimientos", "add-category", "show-incomes", "notifications-setup", "shortcuts-setup", "reports", "my-reports"];
  useEffect(() => {
    if (screen && mainScreens.includes(screen) && screen !== previousScreen) {
      setPreviousScreen(screen);
    }
  }, [screen, previousScreen]);

  // ✅ FASE LOGIN - Sincronizar currentUserId con localStorage CONSTANTEMENTE
  useEffect(() => {
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId && storedUserId !== currentUserId) {
      setCurrentUserId(storedUserId);
    }
  }, [screen]);

  // 🆕 Sincronizar localStorage constantemente (para login/logout)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedUserId = localStorage.getItem("currentUserId");
      if (storedUserId !== currentUserId) {
        setCurrentUserId(storedUserId);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentUserId]);

  // 🆕 FASE 3F - Recuperar sesión de Supabase Auth al cargar la app
  // Esto asegura que supabase.auth.updateUser() funcione para cambiar contraseña
  useEffect(() => {
    const recoverSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("Error recuperando sesión:", error);
        if (data?.session) {
          console.log("✅ Sesión de Supabase recuperada:", data.session.user.email);
        }
      } catch (err) {
        console.error("Error en recoverSession:", err);
      }
    };
    recoverSession();
  }, []);

  // 🆕 SESSION 1 - Sincronizar usuarios OAuth después del callback
  // Escucha cambios en auth.users y sincroniza con tabla usuarios (SOLO para OAuth)
  useEffect(() => {
    const syncOAuthUser = async (session) => {
      try {
        // 🆕 VERIFICAR: Solo sincronizar si es OAuth (google, apple, etc)
        const provider = session?.user?.app_metadata?.provider;
        const isOAuth = provider && provider !== "email";

        if (!isOAuth) {
          console.log("[App] Login con email+password, no sincronizar OAuth");
          // Guardar userId incluso para email+password
          if (session?.user?.id) {
            localStorage.setItem("currentUserId", session.user.id);
            localStorage.setItem("authProvider", "email"); // 🆕 Guardar que es email+password
            setCurrentUserId(session.user.id);
          }
          return;
        }

        // Si es OAuth, sincronizar a tabla usuarios
        if (session?.user?.id) {
          const syncResult = await syncOAuthUserToDatabase();
          localStorage.setItem("currentUserId", session.user.id);
          localStorage.setItem("authProvider", provider); // 🆕 Guardar provider (google, apple, etc)
          setCurrentUserId(session.user.id);

          // 🆕 IMPORTANTE: Redirigir a Dashboard o AccountReactivatedPage después de OAuth exitoso
          // setTimeout asegura que React procese el cambio antes
          setTimeout(() => {
            // Si fue una reactivación, mostrar pantalla especial primero
            if (syncResult?.wasReactivated) {
              console.log("[App] Cuenta reactivada, mostrando AccountReactivatedPage");
              setScreen("account-reactivated");
            } else {
              // Si es nuevo login, ir directo a Dashboard
              setIsDashboardLoading(true); // Activar skeleton loading
              setScreen("dashboard");
              console.log("[App] Redirigiendo a Dashboard después de OAuth");

              // Desactivar loading después de 800ms (o cuando datos lleguen)
              setTimeout(() => setIsDashboardLoading(false), 800);
            }
          }, 100);
        }
      } catch (err) {
        console.error("[App] Error sincronizando OAuth:", err.message);
        // 🆕 Limpiar localStorage como fallback si falla la sincronización
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("currentUserEmail");
        localStorage.removeItem("authProvider");
        setCurrentUserId(null);
        setScreen("login");
      }
    };

    // Listener para cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await syncOAuthUser(session);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [setCurrentUserId, setScreen]);

  // ✅ FASE LOGIN - Validar si hay usuario logueado
  // Si no hay sesión activa, forzar pantalla de login
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Si hay sesión en Supabase, debería estar en dashboard
      // Si NO hay sesión, debería estar en login/signup/forgot-password
      if (!session && !currentUserId) {
        if (screen !== "login" && screen !== "signup" && screen !== "forgot-password" && screen !== "about-login") {
          setScreen("login");
        }
      }
    };

    checkSession();
  }, [currentUserId, screen, setScreen]);

  // 🆕 Limpiar localStorage de currentUserId al iniciar si está en login
  useEffect(() => {
    if (screen === "login") {
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("currentUserEmail");
      setCurrentUserId(null);
    }
  }, [screen]);

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
  // 🆕 FASE 3D - Estados de preferencias (se cargan desde BD en useEffect, después del login)
  // Defaults: microphoneEnabled=true, notificationListenerEnabled=false, iosShortcutsEnabled=false, pushNotificationsEnabled=false
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [notificationListenerEnabled, setNotificationListenerEnabled] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false); // 🆕 Para notificaciones push de ORUS
  const [iosShortcutsEnabled, setIosShortcutsEnabled] = useState(false);
  // 🆕 FASE 3D - Guardar cambios en userStorage Y Supabase
  const handleSetMicrophoneEnabled = (value) => {
    setMicrophoneEnabled(value);
    userStorage.set("microphoneEnabled", value);
    // Guardar en Supabase si hay usuario logueado
    if (currentUserId) {
      saveUserPreferences(currentUserId, { microphoneenabled: value });
    }
  };
  const handleSetNotificationListenerEnabled = (value) => {
    setNotificationListenerEnabled(value);
    userStorage.set("notificationListenerEnabled", value);
    // Guardar en Supabase si hay usuario logueado
    if (currentUserId) {
      saveUserPreferences(currentUserId, { notificationlistenerenabled: value });
    }
  };

  // 🆕 FASE 3D - Handler para notificaciones push (ORUS)
  const handleSetPushNotificationsEnabled = (value) => {
    setPushNotificationsEnabled(value);
    userStorage.set("pushNotificationsEnabled", value);
    // Guardar en Supabase si hay usuario logueado
    if (currentUserId) {
      saveUserPreferences(currentUserId, { push_notifications_enabled: value });
    }
  };
  const handleSetIosShortcutsEnabled = (value) => {
    setIosShortcutsEnabled(value);
    userStorage.set("iosShortcutsEnabled", value);
    // Guardar en Supabase si hay usuario logueado
    if (currentUserId) {
      saveUserPreferences(currentUserId, { iosshortcutsenabled: value });
    }
  };

  // 🆕 FASE 3D - Wrapper para setShowIncomes que guarda en BD
  const handleSetShowIncomes = (value) => {
    setShowIncomes(value);
    userStorage.set("showIncomes", value);
    // Guardar en Supabase si hay usuario logueado
    if (currentUserId) {
      saveUserPreferences(currentUserId, { show_incomes: value });
    }
  };

  // 🆕 FASE 3D - Wrapper para setIsDark que guarda en BD
  const handleSetIsDark = (value) => {
    setIsDark(value);
    userStorage.set("isDark", value);
    // Guardar en Supabase si hay usuario logueado
    if (currentUserId) {
      saveUserPreferences(currentUserId, { isdark: value });
    }
  };

  // Función para abrir Configuración → Accesibilidad
  const onOpenAccessibilitySettings = () => {
    if (window.Capacitor) {
      window.Capacitor.Plugins.App.openUrl?.({
        url: "android://settings/accessibility"
      }).catch(() => {
        // Settings no disponible en dev mode
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

  // ✅ FASE LOGIN - currentUserId ya se declara arriba
  const [supabaseUsers, setSupabaseUsers] = useState([]); // 🆕 Traer usuarios de Supabase dinámicamente

  // 🆕 Cargar usuarios de Supabase automáticamente
  useEffect(() => {
    const loadSupabaseUsers = async () => {
      const users = await getAllUsers();

      if (users.length > 0) {
        const userOptions = users.map(user => ({
          id: user.id,
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          username: user.username || user.email?.split('@')[0] || 'Usuario',
          email: user.email || '', // 🆕 FASE 3D - Agregar email
          phone: user.phone || '' // 🆕 FASE 3D - Agregar teléfono
        }));
        setSupabaseUsers(userOptions);
      }
    };

    loadSupabaseUsers();
  }, []);

  // 🆕 PASO 7 - Refetch usuarios cuando vuelves a dashboard (después de editar perfil)
  useEffect(() => {
    if (screen === "dashboard") {
      const loadSupabaseUsers = async () => {
        const users = await getAllUsers();

        if (users.length > 0) {
          const userOptions = users.map(user => ({
            id: user.id,
            nombre: user.nombre || '',
            apellido: user.apellido || '',
            username: user.username || user.email?.split('@')[0] || 'Usuario',
            email: user.email || '',
            phone: user.phone || ''
          }));
          setSupabaseUsers(userOptions);
        }
      };

      loadSupabaseUsers();
    }
  }, [screen]);

  // Crear opciones del dropdown desde usuarios de Supabase
  const MOCK_USER_OPTIONS = supabaseUsers.map(user => ({
    id: user.id,
    name: `${user.username} (${user.nombre} ${user.apellido})`
  }));

  // Mapeo de usuarios desde Supabase
  const MOCK_USERS_MAP = useMemo(() => {
    const map = {};
    supabaseUsers.forEach(user => {
      map[user.id] = {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        phone: user.phone || ''
      };
    });
    return map;
  }, [supabaseUsers]);

  // 🆕 FASE LOGIN - currentUserId ya se obtiene de localStorage

  // 🆕 Crear currentUser desde supabaseUsers (basado en currentUserId de localStorage)
  const currentUser = useMemo(() => {
    if (currentUserId && supabaseUsers.length > 0) {
      const user = supabaseUsers.find(u => u.id === currentUserId);
      if (user) return user;
    }
    return null;
  }, [currentUserId, supabaseUsers]);

  // 🆕 FASE 3D - Cargar preferencias del usuario desde Supabase cuando cambia currentUserId
  // También resetea selectedPeriod al mes actual en login
  useEffect(() => {
    if (!currentUserId) return;

    // Resetear periodo al mes actual en login
    const today = new Date();
    const newPeriod = {
      month: today.getMonth() + 1,
      year: today.getFullYear()
    };
    setSelectedPeriod(newPeriod);

    const loadUserPreferences = async () => {
      const prefs = await getUserPreferences(currentUserId);
      if (prefs) {
        // Actualizar estados locales desde BD
        setMicrophoneEnabled(prefs.microphoneenabled !== false);
        setNotificationListenerEnabled(prefs.notificationlistenerenabled === true);
        setPushNotificationsEnabled(prefs.push_notifications_enabled === true); // 🆕 FASE 3D
        setIosShortcutsEnabled(prefs.iosshortcutsenabled === true);
        setShowIncomes(prefs.show_incomes === true);
        setIsDark(prefs.isdark !== false);
        // TODO: Aquí también podrías cargar idioma y moneda si lo necesitas
      }
    };

    loadUserPreferences();
  }, [currentUserId]);

  // 🆕 Pilar seleccionado para la página de movimientos
  const [customConcepts, setCustomConcepts] = useState([]);
  const {
    transactions,
    addTransaction: addTx,
    editTransaction: applyEditTx,
    deleteTransaction: removeTx,
    isLoading: txLoading,
    error: txError,
    loadTransactions,
  } = useTransactions(currentUserId); // 🆕 FASE 2: Pasar userId para filtrar transacciones
  // 🆕 FASE 3A: Ahora addTx, applyEditTx, removeTx son async


  // 🆕 Categorías: toda la lógica (crear/reutilizar/editar/borrar/varios) vive en el hook.
  // 🆕 FASE 2: Pasar userId para filtrar categorías por usuario
  // 🆕 FASE 3A: Ahora createCategory, editCategory, deleteCategory son async
  const { categories, createCategory, getOrCreateCategory, ensureVariosCategory, editCategory, deleteCategory, isLoading: catLoading, error: catError } = useCategories(currentUserId);

  // 🆕 FASE 3C - CategoryMap para mostrar nombres en pilares
  const categoryMap = useUserCategories(currentUserId);

  // 🆕 Inicia con el último mes que tiene datos (sin hardcodear)
  // 🆕 Filtro de Gastado/Ingresos
  // 🆕 Rastrear cómo se abrió Estado 2 (por cuál "puerta")
  // 🆕 Hooks independientes
  // 🆕 FASE 2: Pasar userId para filtrar presupuestos por usuario
  const { customBudgets, setCustomBudgets } = usePillarBudgets(currentUserId);

  // 🆕 FASE 3D - Presupuestos de categorías (MENSUALES como pilares)
  // Construir monthYear a partir de selectedPeriod
  const categoryBudgetsMonthYear = selectedPeriod ? `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}` : null;
  const { categoryBudgets } = useCategoryBudgets(currentUserId, categoryBudgetsMonthYear);


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

  // 🆕 FASE 3B - Presupuestos aislados por usuario + persistencia en Supabase
  // Ahora es async y persiste en Supabase
  const editPillarBudget = async (pillarId, newBudget) => {
    if (!currentUserId || !selectedPeriod) return;

    const month = selectedPeriod.month || new Date().getMonth() + 1;
    const year = selectedPeriod.year || new Date().getFullYear();
    const monthYear = `${year}-${String(month).padStart(2, '0')}`;
    const key = monthYear;

    try {
      const success = await budgetService.setPillarBudget(currentUserId, pillarId, monthYear, newBudget);
      if (success) {
        setCustomBudgets(prev => ({
          ...prev,
          [currentUserId]: {
            ...prev[currentUserId],
            [key]: {
              ...prev[currentUserId]?.[key],
              [pillarId]: newBudget
            }
          }
        }));
      }
    } catch (err) {
    }
  };

  // 🆕 FASE 3B: editCategoryBudget ahora es async (setCategoryBudget es async)
  // 🆕 FASE 3D: Pasar monthYear para presupuestos mensuales
  const editCategoryBudget = async (categoryId, newBudget) => {
    try {
      if (!currentUserId || !selectedPeriod) {
        throw new Error("Usuario o período no disponible");
      }
      const month = selectedPeriod.month || new Date().getMonth() + 1;
      const year = selectedPeriod.year || new Date().getFullYear();
      const monthYear = `${year}-${String(month).padStart(2, '0')}`;

      await catalog.setCategoryBudget(categoryId, newBudget, currentUserId, monthYear);
    } catch (err) {
      throw err; // 🆕 Relanzar el error para que BudgetsPage lo capture
    }
  };

  // 🆕 FUNCIONES CRUD PARA TRANSACCIONES
  // 🆕 FASE 3A: Ahora son async para esperar a Supabase
  const editTransaction = async (transactionId, updatedData) => {
    try {
      await applyEditTx(transactionId, updatedData);
      resetTransactionEditing();
    } catch (err) {
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      await removeTx(transactionId);
      resetTransactionEditing();
    } catch (err) {
    }
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
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("orus_dev_") || key === "orus_custom_budgets" || key === "orus_pillar_budgets" || key === "orus_category_budgets") {
        localStorage.removeItem(key);
      }
    });

    // 🔄 DEV VERSION: Siempre cargar datos dummy de desarrollo
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
        // 🆕 FASE 3E - Si year === null, es "TODO EL TIEMPO" (todos los años)
        if (selectedPeriod.year === null && selectedPeriod.month === null) {
          return true; // Mostrar todas las transacciones
        }
        // ✅ Si month es null (pero year existe), mostrar todo el año
        if (selectedPeriod.month === null) {
          return txYear === selectedPeriod.year;
        }
        // Si month existe, mostrar solo ese mes
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
    categories, // 🆕 FASE 3C - Para obtener nombres de categorías
  });

  // 🆕 HU-1: valor del contexto del Dashboard (estado + métricas). Se expande por HU.
  // 🆕 FASE 3C - Usar useMemo para asegurar que dashboard se actualiza cuando categoryMap cambia
  const dashboard = useMemo(() => ({
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
    // 🆕 FASE 3A - Loading states de Supabase
    txLoading, txError, catLoading, catError,
    editingCategoryId, editingCategoryName, editingPillarId,
    startCategoryEditing, resetCategoryEditing,
    editingTransactionId, selectedTransactionForEdit,
    startTransactionEditing, resetTransactionEditing,
    // 🆕 FASE 2 - Usuario actual
    currentUser, currentUserId,
    // 🆕 FASE 3C - CategoryMap para mostrar nombres
    categoryMap,
    ...dashboardMetrics,
  }), [categoryMap, newTxnToast, isDark, t, monthHasData, getBudgetForMonth, donutRef, donutContainerRef, pillarsGridRef, colorBarRef, pillarButtonsRef, headerRef, stickyZoneRef, stickyH, p1, scrollY, setScrollY, selectedPeriod, setSelectedPeriod, filterType, setFilterType, filteredPillar, setFilteredPillar, activeId, setActiveId, isMovementOpen, setIsMovementOpen, movementOpenedFrom, setMovementOpenedFrom, screen, setScreen, selectedPillarDetail, setSelectedPillarDetail, selectedPillarForMovements, setSelectedPillarForMovements, showPillarBars, setShowPillarBars, showUpdateBalance, setShowUpdateBalance, showPeriodPicker, setShowPeriodPicker, showIncomes, setShowIncomes, handleSelectPillar, pressingFAB, setPressingFAB, txnActions, searchOpen, setSearchOpen, searchQuery, setSearchQuery, setVoicePrefill, pressingSegmentId, setPressingSegmentId, customConcepts, setCustomConcepts, transactions, categories, customBudgets, setCustomBudgets, isLoading, startLoading, stopLoading, txLoading, txError, catLoading, catError, editingCategoryId, editingCategoryName, editingPillarId, startCategoryEditing, resetCategoryEditing, editingTransactionId, selectedTransactionForEdit, startTransactionEditing, resetTransactionEditing, currentUser, currentUserId, dashboardMetrics]);

  const routerProps = {
    screen, isDark, t, setTheme: handleSetIsDark, // 🆕 FASE 3D - Guardar en BD
    selectedPillarDetail, setSelectedPillarDetail, setShowPillarBars, transactions: filteredByPeriod, // 🆕 FASE 3E - Pasar transacciones filtradas por período
    categories, customConcepts, txnActions, voicePrefill,
    // 🆕 FASE 3A - Loading states de Supabase
    txLoading, txError, catLoading, catError,
    editingTransactionId, selectedTransactionForEdit, resetTransactionEditing,
    showIncomes, setShowIncomes: handleSetShowIncomes, // 🆕 FASE 3D - Guardar en BD
    selectedPeriod, customBudgets, setCustomBudgets, editPillarBudget, editCategoryBudget, getBudgetForMonth,
    categoryBudgets, // 🆕 FASE 3B - Presupuestos de categorías
    selectedPillarForMovements, startTransactionEditing,
    resetCategoryEditing, startCategoryEditing,
    editingCategoryName, editingPillarId, editingCategoryId, editCategory, createCategory, deleteCategory,
    categoriesTab, setCategoriesTab,
    microphoneEnabled, setMicrophoneEnabled: handleSetMicrophoneEnabled,
    notificationListenerEnabled, setNotificationListenerEnabled: handleSetNotificationListenerEnabled,
    pushNotificationsEnabled, setPushNotificationsEnabled: handleSetPushNotificationsEnabled, // 🆕 FASE 3D
    iosShortcutsEnabled, setIosShortcutsEnabled: handleSetIosShortcutsEnabled,
    onOpenAccessibilitySettings,
    previousScreen,
    currentUser, currentUserId, // 🆕 FASE 2
    categoryMap, // 🆕 FASE 3C - Pasar categoryMap a ScreenRouter
    setScreen,
  };

  return (
    <>
      {/* ✅ FASE LOGIN - Selector de usuarios removido */}

      {/* 🆕 FASE 3C - CategoryHistoryProvider envuelve todo para acceso global a categorías con historial */}
      <CategoryHistoryProvider userId={currentUserId}>
        <DashboardContext.Provider value={dashboard}>
          {/* 🆕 Mostrar skeleton loading mientras se carga Dashboard después de OAuth */}
          {isDashboardLoading && screen === "dashboard" ? (
            <LoadingDashboard isDark={isDark} />
          ) : (
            <ScreenRouter {...routerProps} />
          )}
        </DashboardContext.Provider>
      </CategoryHistoryProvider>
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
