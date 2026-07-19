import ScreenShell from "./ScreenShell";
import CategoriesPage from "./CategoriesPage";
import { getCategoryName } from "../utils/categoryUtils";

/**
 * CategoriesScreen.jsx — pantalla de Categorías (RS-5). Extraída de App.jsx.
 */
export default function CategoriesScreen({ isDark, t, categories, setScreen, resetCategoryEditing, startCategoryEditing }) {
  return (
    <ScreenShell bg={t.bg}>
      <CategoriesPage
        isDark={isDark}
        onBack={() => setScreen("settings")}
        onAddCategory={() => {
          resetCategoryEditing();
          setScreen("add-category");
        }}
        onEditCategory={(categoryId, pillarId) => {
          startCategoryEditing(categoryId, getCategoryName(categoryId), pillarId);
          setScreen("add-category");
        }}
        categories={categories}
      />
    </ScreenShell>
  );
}
