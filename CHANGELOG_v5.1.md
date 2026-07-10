# CHANGELOG v5.1 → v5.2 - Fix: Categorías y Presupuestos

## 🐛 Problema Identificado
1. **Nuevas categorías no aparecen en Presupuestos**
   - BudgetsPage no recibía `categories` como prop
   - Creaba su propia instancia de `useCategories()` desincronizada con App.jsx
   
2. **Presupuestos de categorías no se guardaban en-sesión**
   - `handleSave()` en BudgetsPage solo guardaba presupuestos de pilares
   - No incluía presupuestos de categorías en el callback

## ✅ Cambios Realizados

### App.jsx
- **Línea 796**: Agregado prop `categories={categories}` a BudgetsPage
  ```jsx
  <BudgetsPage
    isDark={isDark}
    onBack={() => setScreen("settings")}
    initialBudgets={currentMonthBudgets}
    categories={categories}  // ✅ NUEVO
    onSave={(newBudgets) => { ... }}
    onSaveSuccess={() => setScreen("settings")}
  />
  ```

### BudgetsPage.jsx
- **Línea 7**: Agregado destructuring del prop `categories`
  ```jsx
  export default function BudgetsPage({ 
    isDark, onBack, onSave, initialBudgets, onSaveSuccess, 
    categories: categoriesFromProps  // ✅ NUEVO
  })
  ```

- **Línea 11-12**: Configurado fallback para retrocompatibilidad
  ```jsx
  const { categories: categoriesFromHook } = useCategories();
  const categories = categoriesFromProps || categoriesFromHook;  // ✅ USA PROP SI ESTÁ DISPONIBLE
  ```

## 🔄 Flujo Ahora
1. App.jsx llama a `useCategories()` → obtiene estado compartido
2. App.jsx pasa `categories` como prop a BudgetsPage
3. BudgetsPage recibe categorías actualizadas en tiempo real
4. Cuando se agrega categoría en CategoriesPage:
   - App.jsx se actualiza
   - App.jsx re-renderiza y pasa nuevo prop a BudgetsPage
   - useEffect de BudgetsPage detecta cambio
   - `updateWithNewCategories()` agrega nueva categoría a `categoryBudgets`
5. La nueva categoría aparece en lista expandida del pilar

## 📊 Comportamiento Esperado
- ✅ Al crear "Test" en Fijos → aparece inmediatamente en Presupuestos expandiendo Fijos
- ✅ Al editar presupuesto de "Test" de 0 → 500.000 → se guarda en sesión
- ✅ Al recargar app → presupuestos de categorías vuelven a valores dummy de ALL_CATS
- ✅ Presupuestos de pilares persisten en localStorage

## 🧪 Test Manual
1. Ir a Categorías → Agregar Categoría → Crear "Test" en Fijos
2. Ir a Presupuestos → Expandir "Fijos" → Debería aparece "Test" con presupuesto "Presupuesto"
3. Click en presupuesto de "Test" → Editar a 500000
4. Volver atrás → Volver a Presupuestos → Presupuesto debería seguir siendo 500000
5. Recargar app → Presupuesto debería volver a "Presupuesto" (0)

## 📦 Archivos Modificados
- `src/App.jsx` (Línea 796)
- `src/components/BudgetsPage.jsx` (Líneas 7, 11-12)

## v5.2 - Persistencia en sessionStorage

### ❌ Problema Encontrado
Los presupuestos de categorías se perdían al navegar fuera de BudgetsPage porque solo se guardaban en memoria del componente.

### ✅ Solución Implementada
Modificado `useBudgets.js` para usar **sessionStorage**:
- Carga inicial desde sessionStorage si existe, sino desde ALL_CATS
- Guarda automáticamente en sessionStorage cuando cambia `categoryBudgets`
- Al recargar app: sessionStorage se borra → vuelven a valores de ALL_CATS ✅
- Al navegar entre pantallas: persisten en sessionStorage ✅

**Archivo modificado**: `src/hooks/useBudgets.js`
```jsx
// ✅ Carga desde sessionStorage
const [categoryBudgets, setCategoryBudgets] = useState(() => {
  try {
    const stored = sessionStorage.getItem("orus_category_budgets");
    if (stored) return JSON.parse(stored);
  } catch (e) { ... }
  // Fallback a ALL_CATS
  const budgets = {};
  ALL_CATS.forEach(cat => {
    budgets[cat.name] = cat.budget;
  });
  return budgets;
});

// ✅ Guardar en sessionStorage automáticamente
useEffect(() => {
  sessionStorage.setItem("orus_category_budgets", JSON.stringify(categoryBudgets));
}, [categoryBudgets]);
```

## 🧪 Comportamiento Final (v5.2)
1. ✅ Agregar categoría "Test" en Fijos → aparece en Presupuestos
2. ✅ Editar presupuesto de "Test": 0 → 500.000
3. ✅ Navegar a otra pantalla → vuelve a Presupuestos → presupuesto sigue siendo 500.000
4. ✅ Recargar app → presupuesto vuelve a "Presupuesto" (0, desde ALL_CATS)
5. ✅ Presupuestos de pilares siguen persistiendo en localStorage (sin cambios)
