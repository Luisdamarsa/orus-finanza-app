import ScreenShell from "./ScreenShell";
import AddCategoryPage from "./AddCategoryPage";

/**
 * AddCategoryScreen.jsx — pantalla de Agregar/Editar Categoría (RS-5). Extraída de App.jsx.
 */
export default function AddCategoryScreen({
  isDark, t, categories,
  editingCategoryName, editingPillarId, editingCategoryId,
  editCategory, createCategory, deleteCategory, resetCategoryEditing, setScreen,
}) {
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
            setScreen("categories");
            resetCategoryEditing();
          } catch (err) {
            console.error("❌ Error saving category:", err);
          }
        }}
        onDelete={async () => {
          try {
            if (editingCategoryId) {
              await deleteCategory(editingCategoryId);
            }
            setScreen("categories");
            resetCategoryEditing();
          } catch (err) {
            console.error("❌ Error deleting category:", err);
          }
        }}
      />
    </ScreenShell>
  );
}
