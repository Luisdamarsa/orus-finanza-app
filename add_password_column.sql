-- PASO 1: Agregar columna password a tabla usuarios
ALTER TABLE usuarios
ADD COLUMN password TEXT NOT NULL DEFAULT '';

-- Nota: Luego actualizaremos con los hashes reales
