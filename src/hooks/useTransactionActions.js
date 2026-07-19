/**
 * useTransactionActions.js — flujos de crear / editar / eliminar transacción (RS-4).
 *
 * Centraliza la lógica que antes vivía inline en App (armar newTx, addTx, toast,
 * reset de filtros y navegación). No usa hooks internos: es una fábrica de handlers
 * que cierra sobre las dependencias recibidas.
 */
export function useTransactionActions({
  addTx,
  editTransaction,
  deleteTransaction,
  triggerNewTxnToast,
  setSelectedPeriod,
  setIsMovementOpen,
  setFilterType,
  setMovementOpenedFrom,
  setScreen,
  screen,
}) {
  // Al guardar/eliminar en modo edición: volver a la pantalla de origen.
  const backToOrigin = () =>
    setScreen(screen === "movimientos" ? "movimientos" : "dashboard");

  const createTransaction = ({ desc, rawAmount, isIncome, method, concept, pillarId }) => {
    const absAmount = parseInt((rawAmount || "").replace(/\D/g, "")) || 0;
    if (absAmount === 0 && !desc && !concept) {
      setScreen("dashboard");
      return;
    }
    const now = new Date();
    const categoryId = concept || null; // concept es el ID de la categoría (viene de TransactionPage)

    const newTx = {
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      description: desc,
      method: method || "Banco",
      amount: isIncome ? absAmount : -absAmount,
      pillar: isIncome ? "ingreso" : pillarId,
      category: categoryId,
    };

    addTx(newTx); // el servicio asigna el id; el hook persiste
    triggerNewTxnToast({ isIncome, pillarId, categoryId, amount: newTx.amount });

    setSelectedPeriod({ year: now.getFullYear(), month: now.getMonth() + 1 });
    // Cerrar Estado 2 automáticamente al agregar
    setIsMovementOpen(false);
    setFilterType(null);
    setMovementOpenedFrom(null);
    setScreen("dashboard");
  };

  const saveTransaction = (transactionId, updatedData) => {
    editTransaction(transactionId, updatedData);
    backToOrigin();
  };

  const removeTransaction = (transactionId) => {
    deleteTransaction(transactionId);
    backToOrigin();
  };

  return { createTransaction, saveTransaction, removeTransaction };
}
