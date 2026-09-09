-- 🆕 SCRIPT: Cambiar todos los emails de @test.com a @yopmail.com
-- Ejecutar en Supabase SQL Editor

-- 1️⃣ Actualizar tabla usuarios (public)
UPDATE usuarios SET email = 'andres@yopmail.com' WHERE id = '4209c9c4-b508-4247-b46c-16ebba88ee04';
UPDATE usuarios SET email = 'pedro@yopmail.com' WHERE id = '464bd52a-059e-46f9-9862-4a091ff1ddad';
UPDATE usuarios SET email = 'luis@yopmail.com' WHERE id = '550e8400-e29b-41d4-a716-446655440000';
UPDATE usuarios SET email = 'maria@yopmail.com' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE usuarios SET email = 'carlos@yopmail.com' WHERE id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE usuarios SET email = 'carlos.restrepo@yopmail.com' WHERE id = '550e8400-e29b-41d4-a716-446655440003';
UPDATE usuarios SET email = 'sofia.rodriguez@yopmail.com' WHERE id = '550e8400-e29b-41d4-a716-446655440004';
UPDATE usuarios SET email = 'juan.sanchez@yopmail.com' WHERE id = '550e8400-e29b-41d4-a716-446655440005';

-- 2️⃣ Actualizar tabla auth.users (Supabase Auth)
-- NOTA: auth.users es manejado por Supabase, generalmente no se edita directamente
-- Pero si necesitas cambiar emails, esto lo hace:
UPDATE auth.users SET email = 'andres@yopmail.com', email_confirmed_at = NOW() WHERE email = 'andres@test.com';
UPDATE auth.users SET email = 'pedro@yopmail.com', email_confirmed_at = NOW() WHERE email = 'pedro@test.com';
UPDATE auth.users SET email = 'luis@yopmail.com', email_confirmed_at = NOW() WHERE email = 'luis@test.com';
UPDATE auth.users SET email = 'maria@yopmail.com', email_confirmed_at = NOW() WHERE email = 'maria@test.com';
UPDATE auth.users SET email = 'carlos@yopmail.com', email_confirmed_at = NOW() WHERE email = 'carlos@test.com';
UPDATE auth.users SET email = 'carlos.restrepo@yopmail.com', email_confirmed_at = NOW() WHERE email = 'carlos.restrepo@test.com';
UPDATE auth.users SET email = 'sofia.rodriguez@yopmail.com', email_confirmed_at = NOW() WHERE email = 'sofia.rodriguez@test.com';
UPDATE auth.users SET email = 'juan.sanchez@yopmail.com', email_confirmed_at = NOW() WHERE email = 'juan.sanchez@test.com';

-- 3️⃣ Verificar cambios
SELECT id, email FROM usuarios ORDER BY created_at;
SELECT id, email FROM auth.users WHERE email LIKE '%yopmail%';
