import { useEffect, useState } from "react";
import ScreenShell from "./ScreenShell";
import BudgetsPage from "./BudgetsPage";
import { PILLARS } from "../constants";
import * as budgetService from "../services/budgetService";

/**
 * BudgetsScreen.jsx — pantalla de Presupuestos (RS-5).
 * Calcula los presupuestos del mes visto y los pasa a BudgetsPage. Extraída de App.jsx.
 */
export default function BudgetsScreen({
  isDark, t, selectedPeriod, customBudgets, setCustomBudgets,
  categories, editPillarBudget, editCategoryBudget, getBudgetForMonth, setScreen,
  currentUser, currentUserId, // 🆕 FASE 2 - Recibir usuario actual para presupuestos por usuario
}) {
  // 🆕 FASE 3B - Cargar presupuestos de categorías desde Supabase
  // 🆕 FASE 3D - Pasar monthYear para cargar presupuestos del mes ACTUAL
  const [supabaseCategoryBudgets, setSupabaseCategoryBudgets] = useState({});

  useEffect(() => {
    const loadCategoryBudgets = async () => {
      if (currentUserId) {
        const todayMonth = new Date().getMonth() + 1;
        const todayYear = new Date().getFullYear();
        const monthYear = `${todayYear}-${String(todayMonth).padStart(2, '0')}`;

        const budgets = await budgetService.getCategoryBudgetsForUser(currentUserId, monthYear);
        setSupabaseCategoryBudgets(budgets);
      }
    };
    loadCategoryBudgets();
  }, [currentUserId]);
  // 🆕 FASE 3B - Buscar el presupuesto MÁS RECIENTE (última actualización), no del mes seleccionado
  const getMostRecentBudgetForPillar = (pillarId) => {
    const userBudgets = customBudgets[currentUserId] || {};

    // Obtener todos los meses disponibles y ordenarlos descendentemente (más reciente primero)
    const months = Object.keys(userBudgets).sort().reverse();

    for (const monthYear of months) {
      if (userBudgets[monthYear] && userBudgets[monthYear][pillarId] !== undefined) {
        return userBudgets[monthYear][pillarId];
      }
    }

    // Si no hay presupuesto guardado, retornar el default del pilar
    const pillar = PILLARS.find(p => p.id === pillarId);
    return pillar?.budget || 0;
  };

  const currentMonthBudgets = {};
  PILLARS.forEach((p) => {
    // 🆕 Usar presupuesto más reciente en lugar del del mes seleccionado
    currentMonthBudgets[p.id] = getMostRecentBudgetForPillar(p.id);
  });

  // 🆕 FASE 3B - Guardar presupuestos con fecha ACTUAL (hoy), no con selectedPeriod
  const todayMonth = new Date().getMonth() + 1;
  const todayYear = new Date().getFullYear();
  const todayKey = `${todayYear}-${String(todayMonth).padStart(2, "0")}`;

  return (
    <ScreenShell bg={t.bg}>
      <BudgetsPage
        isDark={isDark}
        onBack={() => setScreen("settings")}
        initialBudgets={currentMonthBudgets}
        categories={categories}
        editPillarBudget={editPillarBudget}
        editCategoryBudget={editCategoryBudget}
        // 🆕 FASE 3B - Guardar con fecha ACTUAL, no con selectedPeriod
        onSave={(newBudgets) => setCustomBudgets((prev) => ({
          ...prev,
          [currentUser?.id]: {
            ...prev[currentUser?.id],
            [todayKey]: newBudgets
          }
        }))}
        onSaveSuccess={() => setScreen("settings")}
        // 🆕 FASE 3B - Pasar currentUserId para setCategoryBudget
        currentUserId={currentUserId}
        // 🆕 FASE 3B - Pasar presupuestos de categorías desde Supabase
        initialCategoryBudgets={supabaseCategoryBudgets}
      />
    </ScreenShell>
  );
}
