import ScreenShell from "./ScreenShell";
import AddCategoryPage from "./AddCategoryPage";
import { usePopup } from "../services/PopupService";
import { invalidateCategoryMap } from "../hooks/useUserCategories"; // 🆕 Para recargar categoryMap
import { useCategoryHistory } from "../context/CategoryHistoryContext"; // 🆕 FASE 3C - Para refetch historial desde context global

/**
 * AddCategoryScreen.jsx — pantalla de Agregar/Editar Categoría (RS-5). Extraída de App.jsx.
 */
export default function AddCategoryScreen({
  isDark, t, categories,
  editingCategoryName, editingPillarId, editingCategoryId,
  editCategory, createCategory, deleteCategory, resetCategoryEditing, setScreen,
}) {
  const popup = usePopup();
  const { refetch: refetchCategories } = useCategoryHistory(); // 🆕 FASE 3C - Refetch del historial desde context global

  return (
    <ScreenShell bg={t.bg}>
      <AddCategoryPage
        isDark={isDark}
        onBack={() => setScreen("categories")}
        categories={categories}
        isEditing={editingCategoryName !== null}
        editingCategoryName={editingCategoryName}
        editingPillarId={editingPillarId}
        // 🆕 FASE 3A: onSave y onDelete ahora son async (editCategory, createCategory, deleteCategory son async)
        onSave={async (pillarId, categoryName) => {
          try {
            if (editingCategoryId) {
              await editCategory(editingCategoryId, { name: categoryName, pillar: pillarId });
            } else {
              await createCategory(pillarId, categoryName);
            }
            // 🆕 Invalidar categoryMap para recargar nombres
            invalidateCategoryMap();
            // 🆕 FASE 3C - Recargar historiales para que TransactionsListService tenga datos actualizados
            refetchCategories();
            setScreen("categories");
            resetCategoryEditing();
          } catch (err) {
            popup.showErrorPopup(`Error: ${err.message}`);
            throw err; // Re-lanzar para que AddCategoryPage lo atrape
          }
        }}
        onDelete={async () => {
          try {
            if (editingCategoryId) {
              await deleteCategory(editingCategoryId);
            }
            // 🆕 Invalidar categoryMap para recargar nombres
            invalidateCategoryMap();
            // 🆕 FASE 3C - Recargar historiales después de borrar
            refetchCategories();
            setScreen("categories");
            resetCategoryEditing();
          } catch (err) {
          }
        }}
      />
    </ScreenShell>
  );
}
