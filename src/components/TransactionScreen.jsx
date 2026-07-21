import ScreenShell from "./ScreenShell";
import TransactionPage from "./TransactionPage";

/**
 * TransactionScreen.jsx — pantalla de transacción (RS-4).
 *
 * Un solo componente para los dos modos (misma TransactionPage):
 *  - mode="new"  → crear (onDone = actions.createTransaction)
 *  - mode="edit" → editar/eliminar (onSave / onDelete)
 *
 * La lógica vive en `actions` (useTransactionActions). Extraído de App.jsx.
 */
export default function TransactionScreen({
  mode,
  isDark,
  t,
  categories,
  customConcepts,
  editingTransaction,
  actions,
  onBack,
}) {
  const isEditing = mode === "edit";
  return (
    <ScreenShell bg={t.bg}>
      <TransactionPage
        isEditing={isEditing}
        editingTransaction={isEditing ? editingTransaction : undefined}
        onBack={onBack}
        onDone={isEditing ? undefined : actions.createTransaction}
        onSave={isEditing ? actions.saveTransaction : undefined}
        onDelete={isEditing ? actions.removeTransaction : undefined}
        isDark={isDark}
        categories={categories}
        customConcepts={isEditing ? undefined : customConcepts}
      />
    </ScreenShell>
  );
}
