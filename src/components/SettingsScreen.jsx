import ScreenShell from "./ScreenShell";
import SettingsPage from "./SettingsPage";

/**
 * SettingsScreen.jsx — pantalla de Configuración (RS-3).
 * Envuelve SettingsPage y cablea su navegación. Extraída de App.jsx.
 */
export default function SettingsScreen({ isDark, t, setScreen, showIncomes, setShowIncomes }) {
  return (
    <ScreenShell bg={t.bg}>
      <SettingsPage
        isDark={isDark}
        onBack={() => setScreen("dashboard")}
        onBudgets={() => setScreen("budgets")}
        onProfile={() => setScreen("profile")}
        onCategories={() => setScreen("categories")}
        onShowIncomes={() => setScreen("show-incomes")}
        onTerms={() => setScreen("terms")}
        onPrivacy={() => setScreen("privacy")}
        onAbout={() => setScreen("about")}
        onPermissions={() => setScreen("permissions")}
        onSubscription={() => setScreen("subscription")}
        onPreferences={() => setScreen("preferences")}
        showIncomes={showIncomes}
        setShowIncomes={setShowIncomes}
      />
    </ScreenShell>
  );
}
