# CHANGELOG v5.3 - Fix: Botón Guardar Desactivado

## 🐛 Problema Identificado
El botón de guardar (✓ flotante) estaba **siempre activo**, incluso cuando no había cambios. Debería estar desactivado hasta que el usuario edite algún presupuesto.

## ✅ Solución Implementada

### Cambio en `BudgetsPage.jsx`

**Antes** (incorrecto):
```jsx
const categoryChanged = ALL_CATS.some(cat => 
  categoryBudgets[cat.name] !== cat.budget  // ❌ Comparaba contra ALL_CATS
);
```

**Después** (correcto):
```jsx
import { useState, useEffect, useRef } from "react";  // ✅ Agregar useRef

// Usar ref para guardar valores iniciales
const initialCategoryBudgetsRef = useRef(null);

useEffect(() => {
  // Guardar una sola vez cuando categoryBudgets está listo
  if (initialCategoryBudgetsRef.current === null) {
    initialCategoryBudgetsRef.current = { ...categoryBudgets };
  }
}, [categoryBudgets]);

// Detectar cambios comparando contra valores iniciales
useEffect(() => {
  const categoryChanged = initialCategoryBudgetsRef.current
    ? Object.keys(categoryBudgets).some(
        key => (categoryBudgets[key] || 0) !== (initialCategoryBudgetsRef.current[key] || 0)
      )
    : false;
  
  setHasChanged(pillarChanged || categoryChanged);
}, [editedBudgets, categoryBudgets, initialBudgets]);
```

### Cómo Funciona

1. **Se importa `useRef`** para mantener referencia persistente sin causar re-renders
2. **Se guarda snapshot inicial** de `categoryBudgets` la primera vez que se actualiza
3. **Se compara contra el snapshot** para detectar cambios reales
4. **El botón se desactiva** mientras `hasChanged === false`

### Ventajas de Este Enfoque

✅ El ref se actualiza solo una vez (no causa re-renders infinitos)
✅ Funciona correctamente con `updateWithNewCategories()`
✅ No añade estado innecesario al componente
✅ Detecta cambios reales vs. valores iniciales

---

## 🧪 Comportamiento Ahora

| Acción | Botón |
|--------|-------|
| Abrir Presupuestos (sin cambios) | ❌ Desactivado |
| Editar presupuesto de pilar | ✅ Activado |
| Editar presupuesto de categoría | ✅ Activado |
| Volver a valores iniciales | ❌ Desactivado |
| Crear nueva categoría (sin editar) | ❌ Desactivado |
| Editar presupuesto de nueva categoría | ✅ Activado |

---

## 📦 Archivo Modificado

- `src/components/BudgetsPage.jsx` (líneas 1, 24-47)

---

## ✨ Estado Final

✅ Botón de guardar correctamente desactivado
✅ Se activa solo cuando hay cambios reales
✅ Ofrece mejor UX (previene clics innecesarios)
✅ Código limpio con useRef

**Versión**: `PROD_v5.3_FINAL.tar.gz`
**Estado**: LISTO PARA USAR
