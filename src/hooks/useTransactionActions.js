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
  ensureVariosCategory,
  getOrCreateCategory,
}) {
  // Al guardar/eliminar en modo edición: volver a la pantalla de origen.
  const backToOrigin = () =>
    setScreen(screen === "movimientos" ? "movimientos" : "dashboard");

  // 🆕 FASE 3A: createTransaction ahora es async (getOrCreateCategory, ensureVariosCategory, addTx son async)
  const createTransaction = async ({ desc, rawAmount, isIncome, method, concept, pillarId, isNewCategory }) => {
    try {
      const absAmount = parseInt((rawAmount || "").replace(/\D/g, "")) || 0;
      if (absAmount === 0 && !desc && !concept) {
        setScreen("dashboard");
        return;
      }
      const now = new Date();
      let categoryId = concept || null; // concept es el ID de la categoría (viene de TransactionPage)
      let pillar = isIncome ? "ingreso" : pillarId;

      // 🆕 Categoría nueva escrita en el dropdown: `concept` es el NOMBRE, no un id.
      // Se crea (o reutiliza si ya existe) al GUARDAR → persiste en el catálogo y aparece
      // en Categorías, Presupuestos y el dropdown. Devuelve el id real para la transacción.
      // Si no se eligió pilar, se crea en "varios" (default), igual que un gasto sin categoría.
      if (!isIncome && isNewCategory && concept && getOrCreateCategory) {
        const targetPillar = pillarId || "varios";
        categoryId = await getOrCreateCategory(targetPillar, concept);
        pillar = targetPillar;
      }

      // 🆕 Categoría nueva de INGRESO (concept es el nombre) → se crea/reutiliza en el grupo "ingreso".
      if (isIncome && isNewCategory && concept && getOrCreateCategory) {
        categoryId = await getOrCreateCategory("ingreso", concept);
      }

      // 🆕 Gasto sin categoría → cae en la categoría "Varios" del pilar Varios (la crea si no existe)
      if (!isIncome && !categoryId) {
        categoryId = await ensureVariosCategory();
        pillar = "varios";
      }

      const newTx = {
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
        description: desc,
        method: method || "Banco",
        amount: isIncome ? absAmount : -absAmount,
        pillar,
        category: categoryId,
      };

      await addTx(newTx); // el servicio asigna el id; el hook persiste
      triggerNewTxnToast({ isIncome, pillarId: pillar, categoryId, amount: newTx.amount });

      setSelectedPeriod({ year: now.getFullYear(), month: now.getMonth() + 1 });
      // Cerrar Estado 2 automáticamente al agregar
      setIsMovementOpen(false);
      setFilterType(null);
      setMovementOpenedFrom(null);
      setScreen("dashboard");
    } catch (err) {
      console.error("❌ Error creating transaction:", err);
    }
  };

  // 🆕 FASE 3A: saveTransaction ahora es async
  const saveTransaction = async (transactionId, updatedData) => {
    try {
      await editTransaction(transactionId, updatedData);
      backToOrigin();
    } catch (err) {
      console.error("❌ Error saving transaction:", err);
    }
  };

  // 🆕 FASE 3A: removeTransaction ahora es async
  const removeTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      backToOrigin();
    } catch (err) {
      console.error("❌ Error removing transaction:", err);
    }
  };

  return { createTransaction, saveTransaction, removeTransaction };
}
