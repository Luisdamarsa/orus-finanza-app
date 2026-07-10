# CHANGELOG v5.4 - Fix: Categorías Fantasma en Presupuestos

## 🐛 Problema Identificado
Cuando se creaban categorías nuevas (ej: "Test 1"), y luego se recargaba o se eliminaban, los **presupuestos viejos persistían** en `sessionStorage`.

**Síntomas**:
- Crear "Test 1" en Fijos
- Recargar página
- Crear "Test 1" nuevamente
- ❌ "Test 1" aparece con presupuesto de 30K (del anterior)
- ✅ Debería aparecer con presupuesto 0 (nueva)

**Causa**: `updateWithNewCategories()` AGREGABA nuevas categorías pero NO ELIMINABA las viejas

---

## ✅ Solución Implementada

### Cambio en `useBudgets.js`

**Antes** (incorrecto):
```jsx
const updateWithNewCategories = useCallback((categoriesMap) => {
  setCategoryBudgets(prev => {
    const updated = { ...prev };
    
    // ❌ Solo agregaba, nunca eliminaba
    ALL_CATS.forEach(cat => {
      if (!updated.hasOwnProperty(cat.name)) {
        updated[cat.name] = cat.budget;
      }
    });
    
    Object.values(categoriesMap).forEach(categoryList => {
      categoryList.forEach(catName => {
        if (!updated.hasOwnProperty(catName)) {
          updated[catName] = 0;
        }
      });
    });
    
    return updated;  // Tenía categorías antiguas
  });
}, []);
```

**Después** (correcto):
```jsx
const updateWithNewCategories = useCallback((categoriesMap) => {
  setCategoryBudgets(prev => {
    // 1. Recolectar todas las categorías que EXISTEN
    const existingCategories = new Set();
    
    ALL_CATS.forEach(cat => {
      existingCategories.add(cat.name);
    });
    
    Object.values(categoriesMap).forEach(categoryList => {
      categoryList.forEach(catName => {
        existingCategories.add(catName);
      });
    });
    
    // 2. Crear presupuestos solo con categorías que existen
    const updated = {};
    
    ALL_CATS.forEach(cat => {
      updated[cat.name] = prev[cat.name] || cat.budget;
    });
    
    existingCategories.forEach(catName => {
      if (!updated.hasOwnProperty(catName)) {
        updated[catName] = prev[catName] || 0;
      }
    });
    
    // 3. ✅ NUEVO: Filtrar solo categorías existentes
    const filtered = {};
    Object.keys(updated).forEach(catName => {
      if (existingCategories.has(catName)) {
        filtered[catName] = updated[catName];
      }
    });
    
    return filtered;  // ✅ Limpio, solo categorías actuales
  });
}, []);
```

### Cómo Funciona

1. **Recolecta SET de categorías actuales** (de ALL_CATS + hook)
2. **Construye presupuestos** manteniendo valores previos
3. **✅ FILTRA** para eliminar categorías que no existen en el SET
4. **Resultado**: sessionStorage solo tiene categorías que existen actualmente

---

## 🧪 Comportamiento Ahora

| Acción | Antes (❌) | Después (✅) |
|--------|-----------|------------|
| Crear "Test 1" → presupuesto 30K → eliminar | "Test 1": 30K persiste | "Test 1": eliminado |
| Crear "Test 1" → recargar → crear "Test 1" nuevamente | "Test 1": 30K (viejo) | "Test 1": 0 (nuevo) |
| Navegar entre pantallas | Mantiene categorías viejas | Solo categorías actuales |
| Sincronizar con hook useCategories | No limpia viejas | ✅ Limpia automáticamente |

---

## 🧪 Casos de Prueba

### ✅ Crear y Recrear Categoría
1. Presupuestos → Expandir "Fijos" → "Test 1" con presupuesto 30K
2. Ir a Categorías → Eliminar "Test 1"
3. Ir a Presupuestos → Expandir "Fijos"
4. **Resultado**: "Test 1" NO aparece ✅

### ✅ Crear Categoría Después de Eliminar
1. Presupuestos → Expandir "Fijos" → "Test 1" con 30K
2. Categorías → Eliminar "Test 1"
3. Categorías → Crear "Test 1" nuevamente
4. Presupuestos → Expandir "Fijos" → Click "Test 1"
5. **Resultado**: Presupuesto es 0, no 30K ✅

### ✅ Múltiples Categorías Huérfanas
1. Crear "Test 2", "Test 3", "Test 4" en diferentes pilares
2. Editar presupuestos
3. Eliminar todas
4. **Resultado**: sessionStorage limpio de todas ✅

---

## 📦 Archivo Modificado

- `src/hooks/useBudgets.js` (líneas 59-99)

---

## 📊 Antes vs Después

**sessionStorage Antes (v5.3)**:
```json
{
  "Arriendo": 700000,
  "Test 1": 30000,      ❌ Viejo, debería estar eliminado
  "Test 2": 50000,      ❌ Viejo, debería estar eliminado
  "Servicios": 150000
}
```

**sessionStorage Después (v5.4)**:
```json
{
  "Arriendo": 700000,
  "Servicios": 150000
}
```
✅ Solo categorías que existen

---

## ✨ Estado Final

✅ Categorías antiguas se limpian automáticamente
✅ Nuevas categorías comienzan con presupuesto 0
✅ sessionStorage siempre sincronizado con hook useCategories
✅ No hay presupuestos fantasma

**Versión**: `PROD_v5.4_FINAL.tar.gz`
**Estado**: LISTO PARA USAR - **RECOMENDADO**
