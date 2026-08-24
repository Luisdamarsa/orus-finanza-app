# ADR-003: Refactorización de Presupuestos a Supabase (FASE 3B)

**Status:** Proposed  
**Date:** 2026-08-24  
**Deciders:** Luis, Nacho (Tech Lead)  
**Related:** FASE 3A (Transacciones + Categorías async/Supabase)

---

## Context

**Situación actual:**
- **Presupuestos de pilares:** `usePillarBudgets` hook (en memoria, sin persistencia)
- **Presupuestos de categorías:** `categoryCatalogService.setCategoryBudget` (muta `ALL_CATS` en memoria)
- **Historial:** Sistema genérico en `attributeHistoryService` (en memoria)
- **Problema:** Ningún presupuesto persiste en BD; se reinicia cada sesión

**Fuerzas:**
1. **Consistencia:** FASE 3A migró transacciones + categorías a Supabase → presupuestos quedan atrás
2. **Historial:** Sistema de historial existe pero no persiste → imposible auditar cambios
3. **Multi-usuario:** Presupuestos deben ser por usuario (actualmente soportado en `usePillarBudgets`)
4. **Complejidad:** Refactorizar requiere cambios en 3+ servicios + componentes async

---

## Decision

**Refactorizar presupuestos a Supabase EN FASE 3B** con:
1. Dos nuevas tablas: `pillar_budgets` y `category_budgets`
2. Una tabla de historial: `budget_history`
3. Tres servicios async: `budgetService.js`, refactor `usePillarBudgets`, refactor `categoryCatalogService`
4. Componentes async en `BudgetsPage.jsx`

**Timing:** Post-FASE 3A (después que transacciones + categorías estén estables en Supabase)

---

## Options Considered

### Option A: Refactorizar Ahora (FASE 3B Inmediato)
| Dimensión | Evaluación |
|-----------|-----------|
| **Complejidad** | Alta (3-4 servicios, 2-3 componentes async) |
| **Tiempo estimado** | 45 min - 1 hora |
| **Riesgo** | Medio (toca BudgetsPage, usePillarBudgets, categoryCatalogService) |
| **Consistencia con FASE 3A** | ✅ Alta (mantiene patrón async/Supabase) |
| **Valor de negocio** | Alto (historial auditable, persistencia) |

**Pros:**
- Completar FASE 3A → 3B en una sesión
- Mantener patrón uniforme async en toda la app
- Historial de cambios auditable desde el inicio
- Presupuestos no se pierden entre sesiones

**Cons:**
- Alto número de cambios coordinados
- Requiere actualizar BudgetsPage (es un componente complejo)
- Testing manual necesario para casos de historial

---

### Option B: Dejar en Memoria (Fase Posterior)
| Dimensión | Evaluación |
|-----------|-----------|
| **Complejidad** | Baja (sin cambios de código) |
| **Tiempo estimado** | 0 min (no hacer nada) |
| **Riesgo** | Bajo |
| **Inconsistencia técnica** | ❌ Muy alta (mezcla memoria + Supabase) |
| **Deuda técnica** | Alta (posterga problema) |

**Pros:**
- Sin cambios inmediatos
- Pasar rápido a OPCIÓN 3 (testing + versión)

**Cons:**
- Presupuestos se pierden entre sesiones (UX pobre)
- Inconsistencia arquitectónica (categorías + transacciones en BD, presupuestos en memoria)
- Historial nunca se materializa
- Deuda técnica aumenta

---

## Trade-off Analysis

| Criterio | Opción A | Opción B |
|----------|----------|----------|
| **Esfuerzo** | ~1 hora | 0 min |
| **Consistencia arquitectónica** | ✅ Excelente | ❌ Pobre |
| **Persistencia de datos** | ✅ Sí | ❌ No |
| **Historial auditable** | ✅ Sí | ❌ No |
| **Multi-usuario correcto** | ✅ Sí | ⚠️ Parcial |
| **Deuda técnica** | ✅ Baja | ❌ Alta |
| **Riesgo de bugs** | ⚠️ Medio | ✅ Ninguno |

**Recomendación:** **OPCIÓN A (Refactorizar Ahora)**

Razones:
1. Mantiene momentum de FASE 3A
2. No añade deuda técnica
3. Esfuerzo es manejable (~1 hora)
4. Valor de negocio es claro (historial + persistencia)

---

## Consequences

### Positivas
- **Datos persistentes:** Presupuestos se guardan automáticamente
- **Auditoría:** `budget_history` permite ver quién cambió qué y cuándo
- **Arquitectura limpia:** Toda la capa de datos ahora usa Supabase
- **Multi-usuario robusto:** Presupuestos aislados por usuario

### Negativas
- **Más queries a Supabase:** 2-3 queries adicionales por sesión (costo mínimo)
- **Complejidad en BudgetsPage:** Componente debe manejar async/loading/error
- **Testing más complejo:** Historial requiere pruebas de timestamps

### A Revisar Después
- **Performance:** ¿Carga lenta al cargar presupuestos?
- **UX de historial:** ¿Mostrar historial en UI?
- **Borrado de presupuestos:** ¿Soft-delete con historial?

---

## Implementation Plan (FASE 3B)

### Paso 1: Crear Tablas Supabase (5 min)
```sql
-- Presupuestos de pilares
CREATE TABLE pillar_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  pillar_id TEXT NOT NULL,
  month_year TEXT NOT NULL,  -- "2026-08"
  amount INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Presupuestos de categorías
CREATE TABLE category_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  amount INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Historial de cambios
CREATE TABLE budget_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  entity_type TEXT,  -- "pillar" | "category"
  entity_id TEXT NOT NULL,
  field TEXT,  -- "amount"
  old_value INTEGER,
  new_value INTEGER,
  changed_at TIMESTAMP DEFAULT NOW()
);
```

### Paso 2: Crear `budgetService.js` (10 min)
Servicios async:
- `getPillarBudgets(userId, monthYear)`
- `setPillarBudget(userId, pillarId, monthYear, amount)`
- `getCategoryBudget(userId, categoryId)`
- `setCategoryBudget(userId, categoryId, amount)`
- `getBudgetHistory(userId, entityType, entityId)`

### Paso 3: Refactorizar `usePillarBudgets` (10 min)
- Hacer async con useEffect
- Pasar userId
- Retornar isLoading, error
- Llamar a budgetService en lugar de useState

### Paso 4: Refactorizar `categoryCatalogService` (10 min)
- Hacer `setCategoryBudget` async
- Llamar a budgetService en lugar de mutar ALL_CATS
- Agregar addHistoryEntry a Supabase

### Paso 5: Actualizar `BudgetsPage.jsx` (10 min)
- Manejar async en handlers
- Agregar loading states + error UI
- Pasar isLoading/error a componentes

### Paso 6: Testing Manual (5 min)
- Crear presupuesto → guardar en BD
- Editar presupuesto → verifica historial
- Cambiar usuario → presupuestos distintos
- Recargar página → presupuestos persisten

---

## Action Items

- [ ] **Paso 1:** Crear tablas en Supabase
- [ ] **Paso 2:** Implementar `budgetService.js`
- [ ] **Paso 3:** Refactorizar `usePillarBudgets` → async
- [ ] **Paso 4:** Refactorizar `categoryCatalogService.setCategoryBudget` → async
- [ ] **Paso 5:** Actualizar `BudgetsPage.jsx` para async/loading/error
- [ ] **Paso 6:** Testing manual + commit `prod-v10.10.0`
- [ ] **Paso 7 (Opcional):** Agregar UI para visualizar historial

---

## References

- **FASE 3A:** `prod-v10.9.1+` (transacciones + categorías async)
- **Current Code:**
  - `src/hooks/usePillarBudgets.js` (línea 17-40)
  - `src/services/categoryCatalogService.js` (línea 97-102)
  - `src/components/BudgetsPage.jsx`
- **Historial Service:** `src/services/attributeHistoryService.js`
