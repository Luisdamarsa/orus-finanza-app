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

/**
 * ScreenRouter.jsx — enruta la pantalla activa (RS-7).
 *
 * Reemplaza la cadena de `if (screen === ...)` que vivía en App.
 * Fallback: <DashboardScreen /> (consume DashboardContext).
 */
export default function ScreenRouter({
  screen, isDark, t,
  selectedPillarDetail, setSelectedPillarDetail, setShowPillarBars, transactions,
  categories, customConcepts, txnActions, addCategoryToHook,
  editingTransactionId, selectedTransactionForEdit, resetTransactionEditing,
  showIncomes, setShowIncomes,
  selectedPeriod, customBudgets, setCustomBudgets, editPillarBudget, editCategoryBudget, getBudgetForMonth,
  selectedPillarForMovements, startTransactionEditing,
  resetCategoryEditing, startCategoryEditing,
  editingCategoryName, editingPillarId, editingCategoryId, editCategory, createCategory, deleteCategory,
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
    return <TransactionScreen mode="new" isDark={isDark} t={t} categories={categories} customConcepts={customConcepts} actions={txnActions} onBack={() => setScreen("dashboard")} onCreateCategory={(name, pillarId) => addCategoryToHook(pillarId, name)} />;
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
    return <CategoriesScreen isDark={isDark} t={t} categories={categories} setScreen={setScreen} resetCategoryEditing={resetCategoryEditing} startCategoryEditing={startCategoryEditing} />;
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
        <AboutPage isDark={isDark} onBack={() => setScreen("settings")} />
      </ScreenShell>
    );
  }

  if (screen === "permissions") {
    return (
      <ScreenShell bg={t.bg}>
        <PermissionsPage isDark={isDark} onBack={() => setScreen("settings")} onOpenPrivacy={() => setScreen("privacy-perms")} />
      </ScreenShell>
    );
  }

  if (screen === "subscription") {
    return (
      <ScreenShell bg={t.bg}>
        <SubscriptionPage isDark={isDark} onBack={() => setScreen("settings")} />
      </ScreenShell>
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

  return <DashboardScreen />;
}
