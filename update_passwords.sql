-- PASO 2: Actualizar password para TODOS los usuarios con "Password1!"
-- Hash bcrypt (10 rounds): Password1!
UPDATE usuarios
SET password = '$2b$10$1FXCMuj3hiWihLib1c8bEOo3j7G/6tnp0cQ5974R900zngGP3RTyC'
WHERE id IS NOT NULL;

-- Verificar que se actualizaron todos
SELECT id, email, password FROM usuarios;
