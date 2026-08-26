-- ========================================
-- MIGRATION: Seed Data para 3 usuarios nuevos (CON TODOS LOS CAMPOS)
-- ========================================
-- Crea 3 usuarios con historial completo de transacciones (2025-2026)
-- Ejecutar en: Supabase SQL Editor
-- ✅ Incluye: username, category_name en transacciones

-- ========================================
-- 1. CREAR 3 USUARIOS NUEVOS
-- ========================================

INSERT INTO usuarios (id, email, nombre, apellido, phone, username, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440003', 'carlos.restrepo@test.com', 'Carlos', 'Restrepo', '+57 300 2222222', 'carlos_restrepo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'sofia.rodriguez@test.com', 'Sofía', 'Rodríguez', '+57 300 3333333', 'sofia_rodriguez', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'juan.sanchez@test.com', 'Juan Pablo', 'Sánchez', '+57 300 4444444', 'juan_sanchez', NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nombre = EXCLUDED.nombre,
  apellido = EXCLUDED.apellido,
  phone = EXCLUDED.phone,
  username = EXCLUDED.username;

-- ========================================
-- 2. MIGRAR CATEGORÍAS PARA CARLOS
-- ========================================

INSERT INTO categorias_usuario (id, user_id, pillar, name, spent, budget, created_at, updated_at, deleted_at)
VALUES
  -- 🏠 FIJOS
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'fijos', 'Arriendo', 0, 700000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'fijos', 'Internet', 0, 130000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'fijos', 'Servicios', 0, 200000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'fijos', 'Suscripciones', 0, 170000, NOW(), NOW(), NULL),
  -- 💰 DEUDA
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'deuda', 'Tarjeta Visa', 0, 300000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'deuda', 'Crédito banco', 0, 200000, NOW(), NOW(), NULL),
  -- 🐖 AHORRO
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ahorro', 'Fondo emergencia', 0, 200000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ahorro', 'Meta viaje', 0, 100000, NOW(), NOW(), NULL),
  -- 🎉 OCIO
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ocio', 'Restaurantes', 0, 150000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ocio', 'Domicilios', 0, 100000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ocio', 'Cine / Planes', 0, 80000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ocio', 'Bares', 0, 70000, NOW(), NOW(), NULL),
  -- 🛒 VARIOS
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'varios', 'Supermercado', 0, NULL, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'varios', 'Transporte', 0, NULL, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'varios', 'Salud', 0, NULL, NOW(), NOW(), NULL)
ON CONFLICT (user_id, name, pillar) DO NOTHING;

-- ========================================
-- 3. MIGRAR CATEGORÍAS PARA SOFÍA
-- ========================================

INSERT INTO categorias_usuario (id, user_id, pillar, name, spent, budget, created_at, updated_at, deleted_at)
VALUES
  -- 🏠 FIJOS
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'fijos', 'Arriendo', 0, 650000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'fijos', 'Internet', 0, 120000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'fijos', 'Servicios', 0, 180000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'fijos', 'Suscripciones', 0, 150000, NOW(), NOW(), NULL),
  -- 💰 DEUDA
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'deuda', 'Tarjeta Visa', 0, 250000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'deuda', 'Crédito banco', 0, 150000, NOW(), NOW(), NULL),
  -- 🐖 AHORRO
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'ahorro', 'Fondo emergencia', 0, 180000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'ahorro', 'Meta viaje', 0, 120000, NOW(), NOW(), NULL),
  -- 🎉 OCIO
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'ocio', 'Restaurantes', 0, 140000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'ocio', 'Domicilios', 0, 90000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'ocio', 'Cine / Planes', 0, 75000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'ocio', 'Bares', 0, 60000, NOW(), NOW(), NULL),
  -- 🛒 VARIOS
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'varios', 'Supermercado', 0, NULL, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'varios', 'Transporte', 0, NULL, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'varios', 'Salud', 0, NULL, NOW(), NOW(), NULL)
ON CONFLICT (user_id, name, pillar) DO NOTHING;

-- ========================================
-- 4. MIGRAR CATEGORÍAS PARA JUAN PABLO
-- ========================================

INSERT INTO categorias_usuario (id, user_id, pillar, name, spent, budget, created_at, updated_at, deleted_at)
VALUES
  -- 🏠 FIJOS
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'fijos', 'Arriendo', 0, 800000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'fijos', 'Internet', 0, 150000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'fijos', 'Servicios', 0, 220000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'fijos', 'Suscripciones', 0, 200000, NOW(), NOW(), NULL),
  -- 💰 DEUDA
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'deuda', 'Tarjeta Visa', 0, 350000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'deuda', 'Crédito banco', 0, 250000, NOW(), NOW(), NULL),
  -- 🐖 AHORRO
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'ahorro', 'Fondo emergencia', 0, 250000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'ahorro', 'Meta viaje', 0, 150000, NOW(), NOW(), NULL),
  -- 🎉 OCIO
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'ocio', 'Restaurantes', 0, 180000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'ocio', 'Domicilios', 0, 120000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'ocio', 'Cine / Planes', 0, 100000, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'ocio', 'Bares', 0, 80000, NOW(), NOW(), NULL),
  -- 🛒 VARIOS
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'varios', 'Supermercado', 0, NULL, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'varios', 'Transporte', 0, NULL, NOW(), NOW(), NULL),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'varios', 'Salud', 0, NULL, NOW(), NOW(), NULL)
ON CONFLICT (user_id, name, pillar) DO NOTHING;

-- ========================================
-- 5. MIGRAR TRANSACCIONES PARA CARLOS (60+ desde Enero 2025 - Mayo 2026)
-- ========================================
-- ✅ Campos: user_id, date, time, description, method, amount, pillar, category (UUID), category_name

-- ENERO 2026 (8 transacciones)
INSERT INTO transacciones (user_id, date, time, description, method, amount, pillar, category, category_name, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-01'::date, '08:00', 'Arriendo Apto 301', 'Banco', -700000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-05'::date, '14:20', 'Rappi Comida', 'Nequi', -42000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-10'::date, '09:15', 'Agua EAAB', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-15'::date, '08:30', 'Pago Tarjeta Visa', 'Banco', -280000, 'deuda', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Tarjeta Visa' LIMIT 1), 'Tarjeta Visa', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-20'::date, '15:30', 'Luz EPM', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-22'::date, '18:15', 'Restaurante Masa', 'Tarjeta', -75000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-25'::date, '10:45', 'Supermercado D1', 'Tarjeta', -95000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-01-30'::date, '12:00', 'Sueldo Empresa ABC', 'Banco', 2800000, 'ingreso', NULL, NULL, NOW()),

  -- FEBRERO 2026 (17 transacciones)
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-01'::date, '08:00', 'Arriendo Apto 301', 'Banco', -700000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-02'::date, '10:30', 'Internet Claro', 'Banco', -120000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Internet' LIMIT 1), 'Internet', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-04'::date, '14:20', 'Uber Eats', 'Nequi', -55000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-06'::date, '19:45', 'Cine Royal', 'Tarjeta', -45000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Cine / Planes' LIMIT 1), 'Cine / Planes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-08'::date, '08:00', 'Agua EAAB', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-10'::date, '20:00', 'El Corral Gourmet', 'Tarjeta', -88000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-12'::date, '08:30', 'Pago Tarjeta Visa', 'Banco', -320000, 'deuda', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Tarjeta Visa' LIMIT 1), 'Tarjeta Visa', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-14'::date, '11:00', 'Carrefour Market', 'Tarjeta', -112000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-16'::date, '15:30', 'Gas Natural Fenosa', 'Banco', -40000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-18'::date, '18:15', 'Bar La Puerta', 'Tarjeta', -52000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Bares' LIMIT 1), 'Bares', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-20'::date, '10:45', 'Meta Viaje Deposito', 'Banco', -280000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Meta viaje' LIMIT 1), 'Meta viaje', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-22'::date, '16:20', 'TransMilenio Recarga', 'Llave', -35000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Transporte' LIMIT 1), 'Transporte', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-24'::date, '12:30', 'Domicilio iFood', 'Nequi', -48000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-26'::date, '19:00', 'Andrés Carne de Res', 'Tarjeta', -95000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-27'::date, '09:15', 'Fondo Emergencia', 'Banco', -250000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Fondo emergencia' LIMIT 1), 'Fondo emergencia', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-27'::date, '11:45', 'Cine Colombia', 'Tarjeta', -40000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Cine / Planes' LIMIT 1), 'Cine / Planes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-02-28'::date, '12:00', 'Sueldo Empresa ABC', 'Banco', 2900000, 'ingreso', NULL, NULL, NOW()),

  -- MARZO 2026 (5 transacciones)
  ('550e8400-e29b-41d4-a716-446655440003', '2026-03-01'::date, '08:00', 'Arriendo Apto 301', 'Banco', -700000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-03-10'::date, '08:00', 'Agua EAAB', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-03-15'::date, '08:30', 'Pago Tarjeta Visa', 'Banco', -300000, 'deuda', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Tarjeta Visa' LIMIT 1), 'Tarjeta Visa', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-03-20'::date, '15:30', 'Luz EPM', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-03-30'::date, '12:00', 'Sueldo Empresa ABC', 'Banco', 2800000, 'ingreso', NULL, NULL, NOW()),

  -- ABRIL 2026 (11 transacciones)
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-01'::date, '08:00', 'Arriendo Apto 301', 'Banco', -700000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-01'::date, '14:30', 'Rappi Comida', 'Nequi', -42000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-05'::date, '14:20', 'Uber Eats', 'Nequi', -55000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-10'::date, '08:00', 'Agua EAAB', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-15'::date, '08:30', 'Pago Tarjeta Visa', 'Banco', -380000, 'deuda', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Tarjeta Visa' LIMIT 1), 'Tarjeta Visa', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-18'::date, '11:00', 'Makro Supermercado', 'Tarjeta', -128000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-20'::date, '15:30', 'Gas Natural Fenosa', 'Banco', -40000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-25'::date, '10:45', 'Meta Viaje Deposito', 'Banco', -320000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Meta viaje' LIMIT 1), 'Meta viaje', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-27'::date, '16:20', 'TransMilenio Recarga', 'Llave', -32000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Transporte' LIMIT 1), 'Transporte', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-30'::date, '08:00', 'Internet Claro', 'Banco', -120000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Internet' LIMIT 1), 'Internet', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-04-30'::date, '11:00', 'Sueldo Empresa ABC', 'Banco', 3100000, 'ingreso', NULL, NULL, NOW()),

  -- MAYO 2026 (11 transacciones)
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-01'::date, '08:00', 'Arriendo Apto 301', 'Banco', -700000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-05'::date, '14:20', 'iFood Comida', 'Nequi', -50000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-08'::date, '19:45', 'Cine Colombia', 'Tarjeta', -43000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Cine / Planes' LIMIT 1), 'Cine / Planes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-10'::date, '08:00', 'Agua EAAB', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-12'::date, '20:00', 'Restaurante Wok', 'Tarjeta', -68000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-15'::date, '08:30', 'Pago Tarjeta Visa', 'Banco', -350000, 'deuda', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Tarjeta Visa' LIMIT 1), 'Tarjeta Visa', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-18'::date, '11:00', 'Carrefour', 'Tarjeta', -105000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-20'::date, '15:30', 'Luz EPM', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-22'::date, '18:15', 'Stiefel Pub', 'Tarjeta', -52000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Bares' LIMIT 1), 'Bares', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-25'::date, '10:45', 'Fondo Emergencia', 'Banco', -200000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Fondo emergencia' LIMIT 1), 'Fondo emergencia', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2026-05-30'::date, '12:00', 'Sueldo Empresa ABC', 'Banco', 2700000, 'ingreso', NULL, NULL, NOW()),

  -- ENERO 2025 (12 transacciones - historial)
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-01'::date, '08:00', 'Arriendo Apto 301', 'Banco', -700000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-03'::date, '10:30', 'Internet Claro', 'Banco', -120000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Internet' LIMIT 1), 'Internet', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-05'::date, '14:20', 'Rappi Comida', 'Nequi', -55000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-08'::date, '08:00', 'Agua EAAB', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-10'::date, '20:00', 'Restaurante Masa', 'Tarjeta', -95000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-12'::date, '08:30', 'Pago Tarjeta Visa', 'Banco', -420000, 'deuda', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Tarjeta Visa' LIMIT 1), 'Tarjeta Visa', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-15'::date, '15:30', 'Luz EPM', 'Banco', -60000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-18'::date, '11:00', 'Carrefour Market', 'Tarjeta', -125000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-20'::date, '18:15', 'Cine Colombia', 'Tarjeta', -43000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Cine / Planes' LIMIT 1), 'Cine / Planes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-22'::date, '19:30', 'Bar La Puerta', 'Tarjeta', -52000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Bares' LIMIT 1), 'Bares', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-25'::date, '10:45', 'Meta Viaje Deposito', 'Banco', -300000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440003' AND name = 'Meta viaje' LIMIT 1), 'Meta viaje', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', '2025-01-30'::date, '12:00', 'Sueldo Empresa ABC', 'Banco', 2800000, 'ingreso', NULL, NULL, NOW()),

  -- SOFÍA RODRÍGUEZ (20 transacciones - Abril a Agosto 2026)
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-01'::date, '08:00', 'Arriendo Apto 202', 'Banco', -600000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-05'::date, '14:30', 'Rappi Comida', 'Nequi', -38000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-08'::date, '08:00', 'Agua EAAB', 'Banco', -50000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-10'::date, '19:00', 'Restaurante Bonito', 'Tarjeta', -72000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-12'::date, '08:30', 'Pago Tarjeta Crédito', 'Banco', -200000, 'deuda', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Tarjeta Crédito' LIMIT 1), 'Tarjeta Crédito', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-15'::date, '11:00', 'Carrefour', 'Tarjeta', -95000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-18'::date, '15:30', 'Luz EPM', 'Banco', -55000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-20'::date, '16:00', 'Cine Royal', 'Tarjeta', -40000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Cine / Planes' LIMIT 1), 'Cine / Planes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-25'::date, '10:30', 'Ahorro Fondo', 'Banco', -150000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Fondo emergencia' LIMIT 1), 'Fondo emergencia', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-04-30'::date, '12:00', 'Sueldo Empresa Tech', 'Banco', 2400000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-05-01'::date, '08:00', 'Arriendo Apto 202', 'Banco', -600000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-05-05'::date, '14:20', 'iFood', 'Nequi', -42000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-05-10'::date, '08:00', 'Internet Claro', 'Banco', -100000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Internet' LIMIT 1), 'Internet', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-05-12'::date, '19:00', 'Pizza Hut', 'Tarjeta', -55000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-05-18'::date, '11:00', 'Makro', 'Tarjeta', -110000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-05-25'::date, '10:45', 'Ahorro Vacaciones', 'Banco', -200000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Meta viaje' LIMIT 1), 'Meta viaje', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-05-30'::date, '12:00', 'Sueldo Empresa Tech', 'Banco', 2450000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-06-01'::date, '08:00', 'Arriendo Apto 202', 'Banco', -600000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440004' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', '2026-06-30'::date, '12:00', 'Sueldo Empresa Tech', 'Banco', 2400000, 'ingreso', NULL, NULL, NOW()),

  -- JUAN PABLO SÁNCHEZ (20 transacciones - Abril a Agosto 2026)
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-01'::date, '08:00', 'Arriendo Casa 5', 'Banco', -800000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-03'::date, '10:30', 'Uber Eats', 'Nequi', -60000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-08'::date, '08:00', 'Agua EAAB', 'Banco', -65000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-10'::date, '20:00', 'Andrés Carne de Res', 'Tarjeta', -120000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-15'::date, '08:30', 'Pago Tarjeta Falabella', 'Banco', -300000, 'deuda', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Tarjeta Falabella' LIMIT 1), 'Tarjeta Falabella', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-18'::date, '11:00', 'Carrefour Market', 'Tarjeta', -135000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-20'::date, '15:30', 'Gas Natural Fenosa', 'Banco', -45000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-22'::date, '18:00', 'Cine Colombia', 'Tarjeta', -48000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Cine / Planes' LIMIT 1), 'Cine / Planes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-25'::date, '10:45', 'Meta Viaje', 'Banco', -350000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Meta viaje' LIMIT 1), 'Meta viaje', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-04-30'::date, '12:00', 'Sueldo Empresa XYZ', 'Banco', 3200000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-01'::date, '08:00', 'Arriendo Casa 5', 'Banco', -800000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-05'::date, '14:30', 'iFood Premium', 'Nequi', -70000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Domicilios' LIMIT 1), 'Domicilios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-10'::date, '08:00', 'Internet Claro', 'Banco', -120000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Internet' LIMIT 1), 'Internet', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-12'::date, '19:30', 'Restaurante Masa', 'Tarjeta', -95000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Restaurantes' LIMIT 1), 'Restaurantes', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-18'::date, '11:00', 'Makro Supermercado', 'Tarjeta', -150000, 'varios', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Supermercado' LIMIT 1), 'Supermercado', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-20'::date, '15:30', 'Luz EPM', 'Banco', -65000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Servicios' LIMIT 1), 'Servicios', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-25'::date, '18:00', 'Bar Stiefel', 'Tarjeta', -60000, 'ocio', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Bares' LIMIT 1), 'Bares', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-28'::date, '10:30', 'Fondo Emergencia', 'Banco', -400000, 'ahorro', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Fondo emergencia' LIMIT 1), 'Fondo emergencia', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-05-30'::date, '12:00', 'Sueldo Empresa XYZ', 'Banco', 3200000, 'ingreso', NULL, NULL, NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-06-01'::date, '08:00', 'Arriendo Casa 5', 'Banco', -800000, 'fijos', (SELECT id FROM categorias_usuario WHERE user_id = '550e8400-e29b-41d4-a716-446655440005' AND name = 'Arriendo' LIMIT 1), 'Arriendo', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', '2026-06-30'::date, '12:00', 'Sueldo Empresa XYZ', 'Banco', 3100000, 'ingreso', NULL, NULL, NOW());

-- ========================================
-- 6. CREAR PRESUPUESTOS MENSUALES (Agosto 2026)
-- ========================================

INSERT INTO pillar_budgets (id, user_id, pillar_id, month_year, amount, created_at, updated_at)
VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'fijos', '2026-08', 1200000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'deuda', '2026-08', 500000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ahorro', '2026-08', 300000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ocio', '2026-08', 600000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'fijos', '2026-08', 1100000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'deuda', '2026-08', 400000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'ahorro', '2026-08', 280000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'ocio', '2026-08', 550000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'fijos', '2026-08', 1370000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'deuda', '2026-08', 600000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'ahorro', '2026-08', 400000, NOW(), NOW()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'ocio', '2026-08', 700000, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ========================================
-- ✅ RESUMEN FINAL
-- ========================================
--
-- ✅ 3 USUARIOS CREADOS:
--    1. Carlos Restrepo (550e8400-e29b-41d4-a716-446655440003) - 60+ transacciones 2025-2026
--    2. Sofía Rodríguez (550e8400-e29b-41d4-a716-446655440004) - listo para probar
--    3. Juan Pablo Sánchez (550e8400-e29b-41d4-a716-446655440005) - listo para probar
--
-- ✅ CAMPOS INCLUIDOS:
--    - usuarios: id, email, nombre, apellido, phone, username, created_at
--    - transacciones: user_id, date, time, description, method, amount, pillar, category, category_name, created_at
--    - categorias_usuario: id, user_id, pillar, name, spent, budget, created_at, updated_at, deleted_at
--    - pillar_budgets: id, user_id, pillar_id, month_year, amount, created_at, updated_at
--
-- ✅ PRÓXIMOS PASOS:
--    1. Ejecutar este script en Supabase SQL Editor
--    2. Cambiar de usuario en la app (CAMBIAR USUARIO)
--    3. Seleccionar "Carlos Restrepo" para ver historial completo
--    4. Probar cambios de mes en Movimientos
