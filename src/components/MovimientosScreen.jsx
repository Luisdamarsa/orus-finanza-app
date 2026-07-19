import ScreenShell from "./ScreenShell";
import MovimientosPage from "./MovimientosPage";

/**
 * MovimientosScreen.jsx — pantalla de Movimientos por pilar (RS-6). Extraída de App.jsx.
 */
export default function MovimientosScreen({ isDark, t, selectedPillarForMovements, transactions, selectedPeriod, setScreen, startTransactionEditing }) {
  return (
    <ScreenShell bg={t.bg}>
      <MovimientosPage
        isDark={isDark}
        onBack={() => setScreen("dashboard")}
        pilar={selectedPillarForMovements}
        transactions={transactions}
        selectedPeriod={selectedPeriod}
        onEditTransaction={(tx) => startTransactionEditing(tx)}
      />
    </ScreenShell>
  );
}
