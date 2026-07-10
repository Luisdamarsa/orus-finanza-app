# 📋 Sistema de Presupuestos Históricos

## Descripción General

Sistema de presupuestos con histórico de cambios por fecha. Permite:
- ✅ Cambiar presupuestos a partir de una fecha
- ✅ Consultar presupuesto histórico de cualquier mes/año
- ✅ Mantener histórico completo de cambios
- ✅ Agnóstico de datos (constants, API, BD)

---

## 📁 Archivos Involucrados

### 1. `src/utils/budgetUtils.js`
**Funciones de utilidad** - Lógica de presupuestos independiente de datos
- `getBudgetForDate(budgetHistory, date)` - Obtener presupuesto para una fecha
- `setBudgetFromDate(budgetHistory, newBudget, fromDate)` - Establecer nuevo presupuesto
- `getBudgetHistory(budgetHistory)` - Ver historial completo
- `getPillarBudgetForDate(allCats, pillarId, date)` - Presupuesto total de pilar
- `getCurrentBudget(budgetHistory)` - Presupuesto actual (hoy)
- `getCurrentPillarBudget(allCats, pillarId)` - Presupuesto actual de pilar

### 2. `src/constants/index.js`
**Datos** - Estructura de ALL_CATS con `budgetHistory`
```javascript
{
  name: "Arriendo",
  pillar: "fijos",
  spent: 700000,
  budgetHistory: [
    { fromDate: "2025-01-01", budget: 700000 },  // Histórico anterior
    { fromDate: "2026-07-01", budget: 1500000 }, // Cambio en julio
    { fromDate: "2026-08-15", budget: 1800000 }, // Cambio en agosto
  ]
}
```

---

## 🔧 Cómo Usar

### Obtener presupuesto para una fecha específica

```javascript
import { getBudgetForDate } from "./utils/budgetUtils";
import { ALL_CATS } from "./constants";

// Encontrar categoría
const arriendo = ALL_CATS.find(cat => cat.name === "Arriendo");

// Obtener presupuesto para junio 2026
const budgetJune = getBudgetForDate(arriendo.budgetHistory, "2026-06-30");
// Retorna: 700000

// Obtener presupuesto para julio 2026
const budgetJuly = getBudgetForDate(arriendo.budgetHistory, "2026-07-15");
// Retorna: 1500000
```

### Cambiar presupuesto a partir de una fecha

```javascript
import { setBudgetFromDate } from "./utils/budgetUtils";
import { ALL_CATS } from "./constants";

const arriendo = ALL_CATS.find(cat => cat.name === "Arriendo");

// Cambiar a 1,500,000 a partir del 1 de julio 2026
arriendo.budgetHistory = setBudgetFromDate(
  arriendo.budgetHistory,
  1500000,
  "2026-07-01"
);

// Ahora:
// - Junio 2026: 700,000 ✅
// - Julio 2026+: 1,500,000 ✅
```

### Ver historial completo

```javascript
import { getBudgetHistory } from "./utils/budgetUtils";
import { ALL_CATS } from "./constants";

const arriendo = ALL_CATS.find(cat => cat.name === "Arriendo");
const history = getBudgetHistory(arriendo.budgetHistory);

console.log(history);
// Retorna:
// [
//   { fromDate: "2025-01-01", budget: 700000 },
//   { fromDate: "2026-07-01", budget: 1500000 },
//   { fromDate: "2026-08-15", budget: 1800000 },
// ]
```

### Obtener presupuesto total de un pilar para una fecha

```javascript
import { getPillarBudgetForDate } from "./utils/budgetUtils";
import { ALL_CATS } from "./constants";

// Presupuesto total de "fijos" en junio 2026
const budgetJune = getPillarBudgetForDate(ALL_CATS, "fijos", "2026-06-30");
// Retorna: 1,100,000 (suma de todas categorías)

// Presupuesto total de "fijos" en julio 2026
const budgetJuly = getPillarBudgetForDate(ALL_CATS, "fijos", "2026-07-15");
// Retorna: 1,400,000 (Arriendo cambió a 1,500,000, espera...restaría)
```

### Obtener presupuesto actual (hoy)

```javascript
import { getCurrentBudget, getCurrentPillarBudget } from "./utils/budgetUtils";
import { ALL_CATS } from "./constants";

const arriendo = ALL_CATS.find(cat => cat.name === "Arriendo");
const currentBudget = getCurrentBudget(arriendo.budgetHistory);
// Retorna: presupuesto vigente hoy

const currentPillarBudget = getCurrentPillarBudget(ALL_CATS, "fijos");
// Retorna: presupuesto total de "fijos" vigente hoy
```

---

## 🗂️ Estructura de Datos

### ALL_CATS (antes)
```javascript
{ name: "Arriendo", pillar: "fijos", spent: 700000, budget: 700000 }
```
❌ Problema: `budget` es un número fijo, no tiene historial

### ALL_CATS (ahora)
```javascript
{
  name: "Arriendo",
  pillar: "fijos",
  spent: 700000,
  budgetHistory: [
    { fromDate: "2025-01-01", budget: 700000 },
    { fromDate: "2026-07-01", budget: 1500000 }
  ]
}
```
✅ Beneficio: Historial completo con fechas

---

## 📊 Caso de Uso: Cambiar Presupuesto en UI

```javascript
// En un componente de "Editar Presupuesto"
import { setBudgetFromDate } from "./utils/budgetUtils";
import { ALL_CATS } from "./constants";

function EditBudgetForm({ categoryName, newBudget, effectiveDate }) {
  const handleSave = () => {
    const category = ALL_CATS.find(cat => cat.name === categoryName);
    
    // Cambiar presupuesto
    category.budgetHistory = setBudgetFromDate(
      category.budgetHistory,
      newBudget,
      effectiveDate  // Ej: "2026-07-01"
    );
    
    // Los meses anteriores mantienen presupuesto viejo ✅
    // El mes efectiveDate y posteriores tienen nuevo presupuesto ✅
  };

  return (
    // Formulario con campos:
    // - newBudget (número)
    // - effectiveDate (fecha picker)
  );
}
```

---

## 🚀 Migración a Base de Datos

Cuando sea tiempo de migrar a BD, la estructura es agnóstica:

### Paso 1: Crear tabla en BD
```sql
CREATE TABLE budget_history (
  id INT PRIMARY KEY,
  pillar_id VARCHAR(50),
  category_name VARCHAR(100),
  from_date DATE,
  budget DECIMAL(10, 2),
  UNIQUE(pillar_id, category_name, from_date)
);
```

### Paso 2: Cambiar origen de datos en constants
```javascript
// Antes: const ALL_CATS = [...]

// Después:
async function getAllCats() {
  const response = await fetch("/api/categories");
  return response.json(); // Devuelve same structure
}
```

### Paso 3: Funciones de budgetUtils siguen igual
```javascript
// ✅ NO necesita cambios - recibe array, retorna resultado
// Funciona igual con datos de constants o de BD
const budget = getBudgetForDate(budgetHistory, date);
```

---

## ⚡ Ventajas

| Característica | Beneficio |
|---|---|
| **Histórico** | Consultar presupuestos de meses pasados |
| **Agnóstico** | Funciona con constants, API, BD |
| **Fácil migración** | Cambiar origen de datos sin tocar lógica |
| **Sem Errores** | Funciones puras, sin efectos secundarios |
| **Flexible** | Agregar nuevas funciones sin romper existentes |

---

## 📝 Notas

- Todas las fechas están en formato `"YYYY-MM-DD"` (ISO 8601)
- Las funciones son **puras** - no modifican inputs (excepto `setBudgetFromDate` que retorna nuevo array)
- El `budgetHistory` siempre está **ordenado cronológicamente**
- Si no existe presupuesto para una fecha, retorna `null`

---

**Versión:** 1.0  
**Última actualización:** 2026-07-07  
**Estado:** ✅ Producción Ready (estructura lista para migrar a BD)
