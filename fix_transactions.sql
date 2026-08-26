-- Limpiar y reinsertar transacciones simples para Carlos y Sofía

-- Eliminar transacciones fallidas de Carlos y Sofía
DELETE FROM transacciones WHERE user_id IN (
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004'
);

-- Insertar transacciones simples sin depender de categorías
INSERT INTO transacciones (user_id, date, time, description, method, amount, pillar, category, category_name, created_at)
VALUES
  -- CARLOS - 2025
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-01'::date, '08:00', 'Arriendo', 'Banco', -700000, 'fijos', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-15'::date, '12:00', 'Sueldo', 'Banco', 2800000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-02-01'::date, '08:00', 'Arriendo', 'Banco', -700000, 'fijos', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-02-15'::date, '12:00', 'Sueldo', 'Banco', 2750000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-01'::date, '08:00', 'Arriendo', 'Banco', -700000, 'fijos', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-15'::date, '12:00', 'Sueldo', 'Banco', 2800000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-30'::date, '12:00', 'Sueldo', 'Banco', 2700000, 'ingreso', NULL, NULL, NOW()),

  -- SOFÍA - 2025
  ('550e8400-e29b-41d4-a716-446655440004', '2025-01-02'::date, '08:00', 'Arriendo', 'Banco', -600000, 'fijos', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2025-01-20'::date, '12:00', 'Sueldo', 'Banco', 2400000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2025-02-01'::date, '08:00', 'Arriendo', 'Banco', -600000, 'fijos', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2025-02-18'::date, '12:00', 'Sueldo', 'Banco', 2400000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-30'::date, '12:00', 'Sueldo', 'Banco', 2450000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-06-30'::date, '12:00', 'Sueldo', 'Banco', 2400000, 'ingreso', NULL, NULL, NOW())
ON CONFLICT DO NOTHING;
