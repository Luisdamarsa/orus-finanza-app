import ScreenShell from "./ScreenShell";
import MovimientosPage from "./MovimientosPage";

/**
 * MovimientosScreen.jsx — pantalla de Movimientos por pilar (RS-6). Extraída de App.jsx.
 * 🆕 FASE 3A - Recibe txLoading, txError de Supabase
 * 🆕 FASE 3C - Recibe currentUserId para cargar categorías de Supabase
 * 🆕 FASE 3B - Recibe getBudgetForMonth, customBudgets y categoryBudgets para obtener presupuestos de Supabase
 */
export default function MovimientosScreen({ isDark, t, selectedPillarForMovements, transactions, txLoading, txError, selectedPeriod, setScreen, startTransactionEditing, showIncomes, currentUserId, categoryMap, categories, getBudgetForMonth, customBudgets, categoryBudgets }) {
  return (
    <ScreenShell bg={t.bg}>
      <MovimientosPage
        isDark={isDark}
        onBack={() => setScreen("dashboard")}
        pilar={selectedPillarForMovements}
        transactions={transactions}
        isLoading={txLoading}
        error={txError}
        selectedPeriod={selectedPeriod}
        onEditTransaction={(tx) => startTransactionEditing(tx)}
        showIncomes={showIncomes}
        currentUserId={currentUserId}
        categoryMap={categoryMap} // 🆕 FASE 3C - Pasar categoryMap
        categories={categories} // 🆕 FASE 3C - Pasar categories del usuario
        getBudgetForMonth={getBudgetForMonth} // 🆕 FASE 3B - Pasar función para obtener presupuestos
        customBudgets={customBudgets} // 🆕 FASE 3B - Pasar presupuestos personalizados
        categoryBudgets={categoryBudgets} // 🆕 FASE 3B - Pasar presupuestos de categorías
      />
    </ScreenShell>
  );
}
