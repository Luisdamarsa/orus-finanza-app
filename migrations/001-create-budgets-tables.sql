-- FASE 3B: Crear tablas para presupuestos (pilares + categorías + historial)
-- Ejecutar en Supabase SQL Editor

-- 1. Presupuestos de pilares (por mes/año)
CREATE TABLE IF NOT EXISTS pillar_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  pillar_id TEXT NOT NULL,
  month_year TEXT NOT NULL,  -- Formato: "2026-08"
  amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, pillar_id, month_year)
);

-- 2. Presupuestos de categorías (globales, no por mes)
CREATE TABLE IF NOT EXISTS category_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

-- 3. Historial de cambios de presupuestos (para auditoría)
CREATE TABLE IF NOT EXISTS budget_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,  -- "pillar" | "category"
  entity_id TEXT NOT NULL,
  field TEXT NOT NULL,  -- "amount" (extensible para futuros campos)
  old_value INTEGER,
  new_value INTEGER,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Índices para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_pillar_budgets_user ON pillar_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_pillar_budgets_pillar ON pillar_budgets(pillar_id);
CREATE INDEX IF NOT EXISTS idx_pillar_budgets_month ON pillar_budgets(month_year);

CREATE INDEX IF NOT EXISTS idx_category_budgets_user ON category_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_category_budgets_category ON category_budgets(category_id);

CREATE INDEX IF NOT EXISTS idx_budget_history_user ON budget_history(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_history_entity ON budget_history(entity_type, entity_id);

-- Comentarios para documentación
COMMENT ON TABLE pillar_budgets IS 'Presupuestos mensuales de pilares por usuario';
COMMENT ON TABLE category_budgets IS 'Presupuestos de categorías por usuario (sin restricción mensual)';
COMMENT ON TABLE budget_history IS 'Auditoría: historial de cambios en presupuestos';
