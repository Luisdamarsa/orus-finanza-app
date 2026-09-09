# Guía: Migrar Usuarios a auth.users

## Problema
Los usuarios están en tabla `usuarios` pero NO en `auth.users` de Supabase.

## Solución
Usar script Node.js para crear usuarios en `auth.users` automáticamente.

---

## Pasos

### 1️⃣ Obtener Service Role Key

1. Ve a **Supabase Dashboard** → tu proyecto
2. **Settings** → **API**
3. Busca **Service Role Key** (NO la Anon Key)
4. Cópialo

⚠️ **CUIDADO:** Esta key es sensible, no la compartas.

### 2️⃣ Crear archivo `.env.local` (si no existe)

En la raíz del proyecto (`Codigo/.env.local`):

```
VITE_SUPABASE_URL=https://izqiingyygdqogqfdk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3️⃣ Instalar dependencias

```bash
npm install dotenv @supabase/supabase-js
```

### 4️⃣ Ejecutar el script

```bash
node scripts/migrate_users_to_auth.js
```

### 5️⃣ Resultado esperado

```
🚀 Iniciando migración de usuarios a auth.users...

📥 Obteniendo usuarios de tabla usuarios...
✅ 8 usuarios encontrados

📤 Procesando: andres@yopmail.com
  🔐 Creando en auth.users...
  ✅ Creado en auth.users (ID: 4209c9c4-b508-4247-b46c-16ebba88ee04)
  ⚠️  PASSWORD TEMPORAL: TempX9k2mLp!

...

✅ MIGRACIÓN COMPLETADA
  - Creados en auth.users: 8
  - Saltados (ya existían): 0
```

---

## ⚠️ Contraseñas Temporales

Cada usuario recibe una **contraseña temporal aleatoria**.

**El usuario necesita:**
1. Ir a **LoginPage** → **¿Olvidaste tu contraseña?**
2. Ingresar su email
3. Recibir email con link de reset
4. Establecer nueva contraseña

O vosotros (admin) pueden:
1. Ir a **Supabase Console** → **Authentication** → **Users**
2. Buscar al usuario
3. Click en los 3 puntos → **Reset password** → email se envía

---

## Verificar que funcionó

1. Supabase Console → **Authentication** → **Users**
2. Deberías ver 8 usuarios listados
3. Prueba login con cualquier usuario

---

## Próximos pasos

Ahora el login/cambiar contraseña usará `auth.users`:

```
Login → authService.loginUser()
  ↓
Cambiar contraseña → supabase.auth.updateUser()
  ↓
auth.users (seguro, manejado por Supabase)
```

La tabla `usuarios` sigue siendo visible para admin con datos personales.

---

## ¿Qué si falla?

- **Error de API Key**: Verifica que `SUPABASE_SERVICE_ROLE_KEY` es correcto
- **Usuario ya existe**: El script detecta y salta usuarios duplicados
- **Email ya existe**: Probablemente el usuario ya fue migrado (verifica en Supabase Console)

Contacta si necesitas help 👍
