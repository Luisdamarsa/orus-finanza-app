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
        onSave={(pillarId, categoryName) => {
          if (editingCategoryId) {
            editCategory(editingCategoryId, { name: categoryName, pillar: pillarId });
          } else {
            createCategory(pillarId, categoryName);
          }
          setScreen("categories");
          resetCategoryEditing();
        }}
        onDelete={() => {
          if (editingCategoryId) {
            deleteCategory(editingCategoryId);
          }
          setScreen("categories");
          resetCategoryEditing();
        }}
      />
    </ScreenShell>
  );
}
