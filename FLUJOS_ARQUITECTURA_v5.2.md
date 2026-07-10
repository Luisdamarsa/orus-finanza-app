# 🏗️ FLUJOS DE ARQUITECTURA - v5.2

## 1️⃣ FLUJO: Crear Nueva Categoría

```
┌─────────────────────────────────────────────────────────────┐
│ USUARIO: Categorías → + → Ingresa "Test" → Fijos → Guardar │
└─────────────────────────────────────────────────────────────┘
                            ↓
                   AddCategoryPage.jsx
                   └─ onSave callback
                            ↓
                   App.jsx (línea 864-871)
                   └─ addCategoryToHook(pillarId, categoryName)
                            ↓
            useCategories() hook actualiza estado
            └─ categories["Fijos"].push("Test")
                            ↓
        ✅ App.jsx re-renderiza con nuevo categories
                            ↓
        ✅ App.jsx pasa categories a BudgetsPage prop
                            ↓
        ✅ BudgetsPage detecta cambio en useEffect
                            ↓
        ✅ updateWithNewCategories(categories) agrega "Test"
                            ↓
        ✅ "Test" aparece en categoryBudgets con valor 0
                            ↓
┌─────────────────────────────────────────────┐
│ ✅ RESULTADO: "Test" visible en Presupuestos│
└─────────────────────────────────────────────┘
```

**Archivos Involucrados**:
- `AddCategoryPage.jsx` → recibe categorías y pasa onSave
- `App.jsx` → maneja addCategoryToHook
- `useCategories()` → actualiza estado compartido
- `BudgetsPage.jsx` → recibe prop y sincroniza

---

## 2️⃣ FLUJO: Editar Presupuesto de Categoría

```
┌────────────────────────────────────────────────────────────┐
│ USUARIO: Presupuestos → Expandir "Fijos" → Click "Test" →│
│ Cambiar 0 → 500000 → Clickear ✓ flotante                 │
└────────────────────────────────────────────────────────────┘
                            ↓
                    BudgetsPage.jsx
                    └─ Input onChange → handleCategoryBudgetChange()
                            ↓
            useBudgets().handleCategoryBudgetChange(
              categoryName: "Test",
              value: "500000"
            )
                            ↓
        setCategoryBudgets({ ...prev, "Test": 500000 })
                            ↓
        useEffect en useBudgets.js detecta cambio
        sessionStorage.setItem("orus_category_budgets", {...})
                            ↓
        ✅ Estado actualizado en memoria
        ✅ Guardado en sessionStorage
                            ↓
        BudgetsPage re-renderiza con nuevo valor
                            ↓
        Input muestra "500.000" en lugar de "Presupuesto"
                            ↓
┌──────────────────────────────────────────┐
│ ✅ RESULTADO: Presupuesto editado y      │
│    guardado en sessionStorage             │
└──────────────────────────────────────────┘
```

**Archivos Involucrados**:
- `BudgetsPage.jsx` → input onChange
- `useBudgets.js` → handleCategoryBudgetChange y useEffect
- `sessionStorage` → persistencia automática

---

## 3️⃣ FLUJO: Navegar Entre Pantallas (Mantener Cambios)

```
┌─────────────────────────────────────────────────────────────┐
│ Estado Inicial: categoryBudgets["Test"] = 500000 (en sesión) │
└─────────────────────────────────────────────────────────────┘
                            ↓
            USUARIO: Presupuestos → Ir a Configuración
                            ↓
        BudgetsPage.jsx se DESMONTA
        └─ Estado local se pierde, PERO sessionStorage persiste
                            ↓
        Usuario navega: Configuración → Presupuestos
                            ↓
        BudgetsPage.jsx se MONTA nuevamente
                            ↓
        useBudgets() useState initializer:
        ├─ Lee sessionStorage.getItem("orus_category_budgets")
        ├─ Encuentra: { "Test": 500000, "Arriendo": 700000, ... }
        └─ Inicializa con esos valores
                            ↓
┌──────────────────────────────────────────┐
│ ✅ RESULTADO: categoryBudgets["Test"]    │
│    sigue siendo 500000                    │
│    ✅ Cambios persistieron en navegación │
└──────────────────────────────────────────┘
```

**Archivos Involucrados**:
- `useBudgets.js` → useState initializer lee sessionStorage
- `sessionStorage` → persiste entre montajes/desmontajes
- BudgetsPage.jsx → se monta/desmonta sin perder estado

---

## 4️⃣ FLUJO: Recargar App (Reiniciar desde Dummy)

```
┌─────────────────────────────────────────────────────────────┐
│ Estado Actual: categoryBudgets["Test"] = 500000 (sesión)   │
└─────────────────────────────────────────────────────────────┘
                            ↓
            USUARIO: Presiona F5 (Recargar)
                            ↓
        ⚠️ sessionStorage se BORRA (especificación del navegador)
                            ↓
        App.jsx se REMONTA completamente
                            ↓
        useBudgets() useState initializer:
        ├─ Lee sessionStorage.getItem("orus_category_budgets")
        ├─ Retorna null (fue borrado)
        └─ Inicializa desde ALL_CATS
                            ↓
        categoryBudgets = {
          "Arriendo": 700000,        (desde ALL_CATS)
          "Servicios": 150000,       (desde ALL_CATS)
          "Test": 0,                 (desde ALL_CATS - no estaba en dummy)
          ...
        }
                            ↓
┌──────────────────────────────────────────┐
│ ✅ RESULTADO: Presupuestos reiniciados   │
│    "Test" vuelve a "Presupuesto" (0)     │
│    ✅ Ciclo de sesión completado        │
└──────────────────────────────────────────┘
```

**Archivos Involucrados**:
- `useBudgets.js` → inicializa desde ALL_CATS si sessionStorage es null
- `sessionStorage` → se borra automáticamente al recargar
- `constants.js` → ALL_CATS proporciona valores por defecto

---

## 5️⃣ FLUJO: Persistencia de Presupuestos de Pilares (localStorage)

```
┌─────────────────────────────────────────────────────────────┐
│ USUARIO: Presupuestos → Editar presupuesto de "Fijos" →   │
│ 5000000 → Guardar (✓ flotante)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    BudgetsPage.jsx
                    └─ Click ✓ → handleSave()
                            ↓
            handleSave() llama onSave(editedBudgets)
                            ↓
            App.jsx (línea 795-800):
            ├─ setCustomBudgets(prev => ({
            │   ...prev,
            │   [keyMesAño]: newBudgets
            │ }))
            └─ Actualiza customBudgets
                            ↓
            usePillarBudgets() useEffect detecta cambio
            localStorage.setItem("orus_pillar_budgets", {...})
                            ↓
        ✅ Presupuesto guardado en localStorage
        ✅ Persiste entre recargas
                            ↓
┌────────────────────────────────────────┐
│ ✅ RESULTADO: Presupuesto de "Fijos"   │
│    guardado permanentemente en localStorage │
└────────────────────────────────────────┘
```

**Archivos Involucrados**:
- `BudgetsPage.jsx` → handleSave() pasa editedBudgets
- `App.jsx` → recibe en onSave y actualiza customBudgets
- `usePillarBudgets.js` → persiste en localStorage automáticamente
- `localStorage` → persiste entre sesiones

---

## 📊 Tabla Comparativa de Persistencia

| Acción | Almacenamiento | En Navegación | En Recarga | En Nueva Sesión |
|--------|----------------|---------------|-----------|-----------------|
| **Crear Categoría** | React State | ✅ | ✅ | ✅ (desde BD) |
| **Editar Presupuesto Categoría** | sessionStorage | ✅ | ❌ | ❌ |
| **Editar Presupuesto Pilar** | localStorage | ✅ | ✅ | ✅ |
| **Crear Transacción** | DUMMY_TRANSACTIONS | ✅ | ✅ | ✅ (dummy) |

---

## 🔐 Seguridad y Privacidad

### sessionStorage (Presupuestos de Categorías)
- ✅ **Privado por pestaña**: No comparte entre pestañas
- ✅ **Se borra al cerrar**: No persiste después de cerrar navegador
- ✅ **Datos locales**: No se envían a servidor

### localStorage (Presupuestos de Pilares)
- ✅ **Privado por origen**: Cada dominio tiene su propio localStorage
- ✅ **Usuario controla borrado**: Puede limpiar caché del navegador
- ✅ **Datos locales**: No se envían a servidor

---

## 🚀 Flujo Completo de una Sesión Típica

```
1. INICIO (F5)
   └─ App.jsx carga useCategories() y usePillarBudgets()
   └─ localStorage restaura presupuestos de pilares
   └─ sessionStorage está vacío (nueva sesión)

2. CREAR CATEGORÍA
   └─ CategoriesPage → addCategoryToHook()
   └─ BudgetsPage recibe actualización via prop
   └─ Nueva categoría visible en Presupuestos

3. EDITAR PRESUPUESTOS
   ├─ Presupuesto de Pilar → localStorage (permanente)
   └─ Presupuesto de Categoría → sessionStorage (sesión)

4. NAVEGAR
   └─ Componentes se desmontan/montan
   └─ sessionStorage mantiene presupuestos de categorías
   └─ localStorage mantiene presupuestos de pilares

5. RECARGAR (F5)
   └─ sessionStorage se borra automáticamente
   └─ Presupuestos de categorías → valores dummy (ALL_CATS)
   └─ Presupuestos de pilares → restaurados desde localStorage
   └─ Nueva sesión lista para usar
```

---

## ✅ Estado de la Arquitectura v5.2

✅ Completamente desacoplada
✅ Cada componente responsable de su lógica
✅ Servicios/hooks reutilizables
✅ Persistencia inteligente (sesión vs permanente)
✅ Sincronización automática entre componentes
✅ Sin estado en App.jsx (solo navegación)

**Listo para escalar con backend** 🚀
