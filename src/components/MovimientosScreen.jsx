import ScreenShell from "./ScreenShell";
import MovimientosPage from "./MovimientosPage";

/**
 * MovimientosScreen.jsx — pantalla de Movimientos por pilar (RS-6). Extraída de App.jsx.
 * 🆕 FASE 3A - Recibe txLoading, txError de Supabase
 */
export default function MovimientosScreen({ isDark, t, selectedPillarForMovements, transactions, txLoading, txError, selectedPeriod, setScreen, startTransactionEditing, showIncomes }) {
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
      />
    </ScreenShell>
  );
}
