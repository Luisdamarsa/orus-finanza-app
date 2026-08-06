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
  currentUser, // 🆕 FASE 2 - Recibir usuario actual para presupuestos por usuario
}) {
  const currentMonth = selectedPeriod?.month || new Date().getMonth() + 1;
  const currentYear = selectedPeriod?.year || new Date().getFullYear();
  const key = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

  const currentMonthBudgets = {};
  PILLARS.forEach((p) => {
    // 🆕 FASE 2 - Pasar userId a getBudgetForMonth
    currentMonthBudgets[p.id] = getBudgetForMonth(p.id, currentMonth, currentYear, customBudgets, currentUser?.id);
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
        // 🆕 FASE 2 - Anidar por userId correctamente
        onSave={(newBudgets) => setCustomBudgets((prev) => ({
          ...prev,
          [currentUser?.id]: {
            ...prev[currentUser?.id],
            [key]: newBudgets
          }
        }))}
        onSaveSuccess={() => setScreen("settings")}
      />
    </ScreenShell>
  );
}
