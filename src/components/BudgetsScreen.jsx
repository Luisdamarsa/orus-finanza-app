import ScreenShell from "./ScreenShell";
import BudgetsPage from "./BudgetsPage";
import { PILLARS } from "../constants";

/**
 * BudgetsScreen.jsx — pantalla de Presupuestos (RS-5).
 * Calcula los presupuestos del mes visto y los pasa a BudgetsPage. Extraída de App.jsx.
 */
export default function BudgetsScreen({
  isDark, t, selectedPeriod, customBudgets, setCustomBudgets,
  categories, editPillarBudget, editCategoryBudget, getBudgetForMonth, setScreen,
}) {
  const currentMonth = selectedPeriod?.month || new Date().getMonth() + 1;
  const currentYear = selectedPeriod?.year || new Date().getFullYear();
  const key = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

  const currentMonthBudgets = {};
  PILLARS.forEach((p) => {
    currentMonthBudgets[p.id] = getBudgetForMonth(p.id, currentMonth, currentYear, customBudgets);
  });

  return (
    <ScreenShell bg={t.bg}>
      <BudgetsPage
        isDark={isDark}
        onBack={() => setScreen("settings")}
        initialBudgets={currentMonthBudgets}
        categories={categories}
        editPillarBudget={editPillarBudget}
        editCategoryBudget={editCategoryBudget}
        onSave={(newBudgets) => setCustomBudgets((prev) => ({ ...prev, [key]: newBudgets }))}
        onSaveSuccess={() => setScreen("settings")}
      />
    </ScreenShell>
  );
}
