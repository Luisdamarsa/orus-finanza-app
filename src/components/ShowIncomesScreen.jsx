import ScreenShell from "./ScreenShell";
import ShowIncomesPage from "./ShowIncomesPage";

/**
 * ShowIncomesScreen.jsx — pantalla "Mostrar Ingresos" (RS-3). Extraída de App.jsx.
 */
export default function ShowIncomesScreen({ isDark, t, setScreen, showIncomes, setShowIncomes }) {
  return (
    <ScreenShell bg={t.bg}>
      <ShowIncomesPage
        isDark={isDark}
        onBack={() => setScreen("settings")}
        showIncomesEnabled={showIncomes}
        onToggleShowIncomes={setShowIncomes}
      />
    </ScreenShell>
  );
}
