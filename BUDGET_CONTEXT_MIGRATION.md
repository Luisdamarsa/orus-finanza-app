# 🏗️ Budget Context - Listo para Migración a BD

## Arquitectura Actual

```
┌─────────────────────────────────────────────────────┐
│  App.jsx (AppWithErrorBoundary)                     │
│  ├─ ErrorBoundary                                   │
│  ├─ PopupProvider                                   │
│  └─ BudgetProvider ⭐ (NUEVO)                       │
│     └─ Dashboard                                    │
│        └─ Componentes que usan useBudgets()         │
└─────────────────────────────────────────────────────┘

Estados:
  - budgets: Array de categorías en memory
  - loading: boolean
  - error: string | null

Métodos:
  - updateBudget(categoryName, newBudget, fromDate)
  - getBudgetForDate(categoryName, date)
  - getCurrentBudget(categoryName)
  - getBudgetsByPillar(pillarId)
  - getHistory(categoryName)
```

---

## Archivo Clave: `budgetService.js`

Este archivo es la **única capa agnóstica**. Todo lo demás NO cambia.

```javascript
// AHORA: Lee de constants/index.js
async getAllBudgets() {
  return JSON.parse(JSON.stringify(ALL_CATS));
}

// FUTURO: Lee de BD/API
// async getAllBudgets() {
//   const response = await fetch("/api/budgets");
//   return response.json();
// }
```

---

## 🚀 Cómo Usar Ahora (Constants)

### Obtener presupuestos en un componente

```javascript
import { useBudgets } from "../contexts/BudgetContext";

function MyComponent() {
  const { budgets, loading, error } = useBudgets();

  if (loading) return <div>Cargando presupuestos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {budgets.map(cat => (
        <div key={cat.name}>
          {cat.name}: {cat.budgetHistory[0]?.budget}
        </div>
      ))}
    </div>
  );
}
```

### Actualizar presupuesto

```javascript
const { updateBudget } = useBudgets();

async function handleEditBudget() {
  try {
    const today = new Date().toISOString().split("T")[0]; // "2026-07-07"
    
    await updateBudget(
      "Arriendo",      // categoryName
      1500000,         // newBudget
      today            // fromDate: HOY, no meses anteriores
    );
    
    console.log("✅ Presupuesto actualizado");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}
```

### Obtener presupuesto para una fecha específica

```javascript
const { getBudgetForDate } = useBudgets();

async function checkBudgetHistory() {
  const budgetJune = await getBudgetForDate("Arriendo", "2026-06-30");
  const budgetJuly = await getBudgetForDate("Arriendo", "2026-07-15");
  
  console.log("Junio:", budgetJune);   // 700000
  console.log("Julio:", budgetJuly);   // 1500000
}
```

---

## 🗄️ Migración a BD (Paso a Paso)

### Paso 1: Crear tabla en BD

```sql
-- Tabla de presupuestos históricos
CREATE TABLE budget_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL,
  pillar_id VARCHAR(50) NOT NULL,
  from_date DATE NOT NULL,
  budget DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_category_date (category_name, from_date)
);

-- Índices para queries rápidas
CREATE INDEX idx_category ON budget_history(category_name);
CREATE INDEX idx_pillar ON budget_history(pillar_id);
CREATE INDEX idx_date ON budget_history(from_date);
```

### Paso 2: Crear API endpoints

```javascript
// Backend (Node.js/Express ejemplo)

// GET /api/budgets
app.get("/api/budgets", async (req, res) => {
  const budgets = await db.query(
    "SELECT * FROM budget_history ORDER BY from_date"
  );
  // Transformar a estructura esperada
  res.json(transformToAllCatsFormat(budgets));
});

// PUT /api/budgets/category/:categoryName
app.put("/api/budgets/category/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  const { newBudget, fromDate } = req.body;
  
  await db.query(
    "INSERT INTO budget_history (category_name, pillar_id, from_date, budget) VALUES (?, ?, ?, ?)",
    [categoryName, getPillarId(categoryName), fromDate, newBudget]
  );
  
  res.json({ success: true });
});
```

### Paso 3: Reemplazar `budgetService.js`

```javascript
// src/services/budgetService.js

// ANTES: import { ALL_CATS } from "../constants";

// DESPUÉS:
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const budgetService = {
  async getAllBudgets() {
    const response = await fetch(`${API_BASE}/api/budgets`);
    return response.json();
  },

  async updateBudget(categoryName, newBudget, fromDate) {
    const response = await fetch(
      `${API_BASE}/api/budgets/category/${categoryName}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newBudget, fromDate })
      }
    );
    return response.json();
  },

  // ... resto de métodos igual
};
```

### Paso 4: ¡Listo!

Ningún otro archivo necesita cambios. Todo sigue funcionando igual.

```
App.jsx → BudgetContext → budgetService → BD/API
                          (SOLO archivo que cambió)
```

---

## ✅ Checklist de Migración

- [ ] Crear tabla `budget_history` en BD
- [ ] Crear API endpoints (`GET`, `PUT`)
- [ ] Reemplazar `budgetService.js` para usar fetch()
- [ ] Agregar `.env` con `REACT_APP_API_URL`
- [ ] Testear en local (BD local)
- [ ] Deployer a producción
- [ ] ¡Listo! Histórico de presupuestos por fecha ✅

---

## 🔒 Ventajas de Esta Estructura

| Aspecto | Ventaja |
|--------|---------|
| **Agnóstico** | Funciona con constants ahora, BD después |
| **Testing** | Fácil mockear `budgetService` en tests |
| **Escalabilidad** | Agregar caché, retry, logging sin tocar Context |
| **Mantenibilidad** | Cambios en BD no afectan componentes |
| **Performance** | Agregar paginación, lazy-load sin refactor |

---

## 📝 Notas Importantes

1. **Hoy (Constants):** Los cambios se pierden al recargar
   - Solución: Usar localStorage si necesitas persistencia local

2. **Mañana (BD):** Los cambios se guardan
   - Automático al reemplazar `budgetService.js`

3. **Seguridad:**
   - En BD, validar que el usuario tenga permisos
   - Agregar autenticación en los endpoints

4. **Auditoría:**
   - BD permite ver quién cambió qué y cuándo
   - Agregar `user_id` y `timestamp` a `budget_history`

---

## 🎯 Resumen

**Arquitectura agnóstica lista para producción:**
- ✅ Context maneja estado mutable
- ✅ Service agnóstico (constants ↔️ BD)
- ✅ Zero cambios en componentes al migrar
- ✅ Histórico de presupuestos por fecha
- ✅ Fácil testing y debugging

**Migración a BD es cambiar UN archivo:** `budgetService.js`

