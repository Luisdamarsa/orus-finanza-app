import ScreenShell from "./ScreenShell";
import CategoriesPage from "./CategoriesPage";
import { getCategoryName } from "../utils/categoryUtils";

/**
 * CategoriesScreen.jsx — pantalla de Categorías (RS-5). Extraída de App.jsx.
 * 🆕 FASE 3A - Recibe catLoading, catError de Supabase
 */
export default function CategoriesScreen({ isDark, t, categories, catLoading, catError, setScreen, resetCategoryEditing, startCategoryEditing, categoriesTab, setCategoriesTab }) {
  return (
    <ScreenShell bg={t.bg}>
      <CategoriesPage
        isDark={isDark}
        onBack={() => setScreen("settings")}
        tab={categoriesTab}
        setTab={setCategoriesTab}
        isLoading={catLoading}
        error={catError}
        onAddCategory={(isIncome) => {
          // income → marca el contexto con editingPillarId "ingreso" (sigue siendo "crear", sin nombre)
          if (isIncome) startCategoryEditing(null, null, "ingreso");
          else resetCategoryEditing();
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
