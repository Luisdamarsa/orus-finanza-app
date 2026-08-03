import ScreenShell from "./ScreenShell";
import PillarDetailPage from "./PillarDetailPage";
import TransactionScreen from "./TransactionScreen";
import SettingsScreen from "./SettingsScreen";
import ShowIncomesScreen from "./ShowIncomesScreen";
import ProfileScreen from "./ProfileScreen";
import BudgetsScreen from "./BudgetsScreen";
import MovimientosScreen from "./MovimientosScreen";
import CategoriesScreen from "./CategoriesScreen";
import AddCategoryScreen from "./AddCategoryScreen";
import DashboardScreen from "./DashboardScreen";
import LegalPage from "./LegalPage";
import AboutPage from "./AboutPage";
import PermissionsPage from "./PermissionsPage";
import SubscriptionPage from "./SubscriptionPage";
import PreferencesPage from "./PreferencesPage";
import AutomatizacionesScreen from "./AutomatizacionesScreen";
import NotificationsSetupPage from "./NotificationsSetupPage";
import ShortcutsSetupPage from "./ShortcutsSetupPage";
import ReportsPage from "./ReportsPage";
import MyReportsPage from "./MyReportsPage";
import LoginPage from "./LoginPage";
import OnboardingPage from "./OnboardingPage";

/**
 * ScreenRouter.jsx — enruta la pantalla activa (RS-7).
 *
 * Reemplaza la cadena de `if (screen === ...)` que vivía en App.
 * Fallback: <DashboardScreen /> (consume DashboardContext).
 */
export default function ScreenRouter({
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
  microphoneEnabled, setMicrophoneEnabled, notificationListenerEnabled, setNotificationListenerEnabled,
  iosShortcutsEnabled, setIosShortcutsEnabled,
  onOpenAccessibilitySettings,
  previousScreen,
  setScreen,
}) {
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
    return <TransactionScreen mode="new" isDark={isDark} t={t} categories={categories} customConcepts={customConcepts} actions={txnActions} prefill={voicePrefill} onBack={() => setScreen("dashboard")} />;
  }

  // Editar transacción
  if (editingTransactionId && selectedTransactionForEdit) {
    return <TransactionScreen mode="edit" isDark={isDark} t={t} categories={categories} editingTransaction={selectedTransactionForEdit} actions={txnActions} onBack={() => resetTransactionEditing()} />;
  }

  if (screen === "settings") {
    return <SettingsScreen isDark={isDark} t={t} setScreen={setScreen} showIncomes={showIncomes} setShowIncomes={setShowIncomes} />;
  }

  if (screen === "show-incomes") {
    return <ShowIncomesScreen isDark={isDark} t={t} setScreen={setScreen} showIncomes={showIncomes} setShowIncomes={setShowIncomes} />;
  }

  if (screen === "profile") {
    return <ProfileScreen isDark={isDark} t={t} setScreen={setScreen} />;
  }

  if (screen === "budgets") {
    return <BudgetsScreen isDark={isDark} t={t} selectedPeriod={selectedPeriod} customBudgets={customBudgets} setCustomBudgets={setCustomBudgets} categories={categories} editPillarBudget={editPillarBudget} editCategoryBudget={editCategoryBudget} getBudgetForMonth={getBudgetForMonth} setScreen={setScreen} />;
  }

  if (screen === "movimientos" && selectedPillarForMovements) {
    return <MovimientosScreen isDark={isDark} t={t} selectedPillarForMovements={selectedPillarForMovements} transactions={transactions} selectedPeriod={selectedPeriod} setScreen={setScreen} startTransactionEditing={startTransactionEditing} />;
  }

  if (screen === "categories") {
    return <CategoriesScreen isDark={isDark} t={t} categories={categories} setScreen={setScreen} resetCategoryEditing={resetCategoryEditing} startCategoryEditing={startCategoryEditing} categoriesTab={categoriesTab} setCategoriesTab={setCategoriesTab} />;
  }

  if (screen === "add-category") {
    return <AddCategoryScreen isDark={isDark} t={t} categories={categories} editingCategoryName={editingCategoryName} editingPillarId={editingPillarId} editingCategoryId={editingCategoryId} editCategory={editCategory} createCategory={createCategory} deleteCategory={deleteCategory} resetCategoryEditing={resetCategoryEditing} setScreen={setScreen} />;
  }

  if (screen === "terms") {
    return (
      <ScreenShell bg={t.bg}>
        <LegalPage variant="terms" isDark={isDark} onBack={() => setScreen("settings")} />
      </ScreenShell>
    );
  }

  if (screen === "privacy") {
    return (
      <ScreenShell bg={t.bg}>
        <LegalPage variant="privacy" isDark={isDark} onBack={() => setScreen("settings")} />
      </ScreenShell>
    );
  }

  if (screen === "about") {
    return (
      <ScreenShell bg={t.bg}>
        <AboutPage onBack={() => setScreen("settings")} />
      </ScreenShell>
    );
  }

  if (screen === "permissions") {
    const backTarget = previousScreen === "automatizaciones" ? "automatizaciones" : "settings";
    return (
      <ScreenShell bg={t.bg}>
        <PermissionsPage onBack={() => setScreen(backTarget)} onOpenPrivacy={() => setScreen("privacy-perms")} />
      </ScreenShell>
    );
  }

  if (screen === "subscription") {
    return (
      <ScreenShell bg={t.bg}>
        <SubscriptionPage onBack={() => setScreen("settings")} />
      </ScreenShell>
    );
  }

  if (screen === "preferences") {
    return (
      <ScreenShell bg={t.bg}>
        <PreferencesPage onBack={() => setScreen("settings")} />
      </ScreenShell>
    );
  }

  if (screen === "automatizaciones") {
    return (
      <AutomatizacionesScreen
        isDark={isDark}
        t={t}
        setScreen={setScreen}
        onPermissions={() => setScreen("permissions")}
        microphoneEnabled={microphoneEnabled}
        setMicrophoneEnabled={setMicrophoneEnabled}
        notificationListenerEnabled={notificationListenerEnabled}
        setNotificationListenerEnabled={setNotificationListenerEnabled}
        iosShortcutsEnabled={iosShortcutsEnabled}
        setIosShortcutsEnabled={setIosShortcutsEnabled}
        onOpenAccessibilitySettings={onOpenAccessibilitySettings}
      />
    );
  }

  // Privacidad abierta DESDE Permisos → Atrás vuelve a Permisos
  if (screen === "privacy-perms") {
    return (
      <ScreenShell bg={t.bg}>
        <LegalPage variant="privacy" isDark={isDark} onBack={() => setScreen("permissions")} />
      </ScreenShell>
    );
  }

  if (screen === "notifications-setup") {
    return (
      <ScreenShell bg={t.bg}>
        <NotificationsSetupPage
          isDark={isDark}
          onBack={() => setScreen("automatizaciones")}
          notificationListenerEnabled={notificationListenerEnabled}
          setNotificationListenerEnabled={setNotificationListenerEnabled}
        />
      </ScreenShell>
    );
  }

  if (screen === "shortcuts-setup") {
    return (
      <ScreenShell bg={t.bg}>
        <ShortcutsSetupPage
          isDark={isDark}
          onBack={() => setScreen("automatizaciones")}
          iosShortcutsEnabled={iosShortcutsEnabled}
          setIosShortcutsEnabled={setIosShortcutsEnabled}
        />
      </ScreenShell>
    );
  }

  if (screen === "reports") {
    return (
      <ScreenShell bg={t.bg}>
        <ReportsPage
          onBack={() => setScreen("settings")}
          onNavigate={(dest) => {
            if (dest === "reports-history") setScreen("my-reports");
            else setScreen(dest);
          }}
        />
      </ScreenShell>
    );
  }

  if (screen === "my-reports") {
    return (
      <ScreenShell bg={t.bg}>
        <MyReportsPage onBack={() => setScreen("reports")} />
      </ScreenShell>
    );
  }

  if (screen === "onboarding") {
    return (
      <ScreenShell bg="#000000">
        <OnboardingPage setScreen={setScreen} />
      </ScreenShell>
    );
  }

  if (screen === "login") {
    return (
      <ScreenShell bg="#000000">
        <LoginPage setScreen={setScreen} />
      </ScreenShell>
    );
  }

  if (screen === "about-login") {
    return (
      <ScreenShell bg={t.bg}>
        <AboutPage isDark={isDark} onBack={() => setScreen("login")} />
      </ScreenShell>
    );
  }

  if (screen === "legal") {
    return (
      <ScreenShell bg={t.bg}>
        <LegalPage variant="terms" isDark={isDark} onBack={() => setScreen("login")} />
      </ScreenShell>
    );
  }

  if (screen === "forgot-password") {
    // TODO: Crear pantalla de recuperación de contraseña
    return (
      <ScreenShell bg={t.bg}>
        <div style={{ padding: 20, color: t.text }}>
          <button onClick={() => setScreen("login")} style={{ cursor: "pointer" }}>← Volver al inicio</button>
          <p style={{ marginTop: 20 }}>Pantalla de recuperación de contraseña (próximamente)</p>
        </div>
      </ScreenShell>
    );
  }

  return <DashboardScreen />;
}
