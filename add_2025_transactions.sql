-- Agregar transacciones para 2025 a los tres usuarios

INSERT INTO transacciones (user_id, date, time, description, method, amount, pillar, category, category_name, created_at)
VALUES
  -- CARLOS 2025-01
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-01'::date, '08:00', 'Arriendo Apto 301', 'Banco', -700000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-15'::date, '12:00', 'Sueldo Empresa ABC', 'Banco', 2800000, 'ingreso', NULL, NULL, NOW()),

  -- SOFÍA 2025-01
  ('550e8400-e29b-41d4-a716-446655440004', '2025-01-02'::date, '08:00', 'Arriendo Apto 202', 'Banco', -600000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2025-01-20'::date, '12:00', 'Sueldo Empresa Tech', 'Banco', 2400000, 'ingreso', NULL, NULL, NOW()),

  -- JUAN PABLO 2025-01
  ('550e8400-e29b-41d4-a716-446655440005', '2025-01-03'::date, '08:00', 'Arriendo Casa 5', 'Banco', -800000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2025-01-25'::date, '12:00', 'Sueldo Empresa XYZ', 'Banco', 3200000, 'ingreso', NULL, NULL, NOW()),

  -- CARLOS 2025-02
  ('550e8400-e29b-41d4-a716-446655440003', '2025-02-01'::date, '08:00', 'Arriendo Apto 301', 'Banco', -700000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-02-15'::date, '12:00', 'Sueldo Empresa ABC', 'Banco', 2750000, 'ingreso', NULL, NULL, NOW()),

  -- SOFÍA 2025-02
  ('550e8400-e29b-41d4-a716-446655440004', '2025-02-01'::date, '08:00', 'Arriendo Apto 202', 'Banco', -600000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2025-02-18'::date, '12:00', 'Sueldo Empresa Tech', 'Banco', 2400000, 'ingreso', NULL, NULL, NOW()),

  -- JUAN PABLO 2025-02
  ('550e8400-e29b-41d4-a716-446655440005', '2025-02-01'::date, '08:00', 'Arriendo Casa 5', 'Banco', -800000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2025-02-20'::date, '12:00', 'Sueldo Empresa XYZ', 'Banco', 3100000, 'ingreso', NULL, NULL, NOW())
ON CONFLICT DO NOTHING;
