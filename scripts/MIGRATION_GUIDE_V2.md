# Guía: Migrar Usuarios a auth.users (v2 - Mejorada)

## ¿Qué cambió?

La versión anterior reportaba "Ya existen" pero no aparecía nada en Supabase Console.

**v2 arregla:**
- ✅ Verificación por EMAIL (más confiable que by ID)
- ✅ Mejor logging de cada paso
- ✅ Reporta claramente: creados vs ya existentes vs errores

---

## Pasos

### 1️⃣ Verificar .env.local

Confirma que tienes:

```
VITE_SUPABASE_URL=https://iwipnbyoufyvboqlokdg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

⚠️ El Service Role Key es sensible - no lo compartas.

### 2️⃣ Ejecutar el script

```bash
node scripts/migrate_users_to_auth_v2.js
```

### 3️⃣ Esperar resultado

Verás output como:

```
🚀 Iniciando migración v2 de usuarios a auth.users...

📥 Leyendo usuarios de tabla usuarios...
✅ 8 usuarios encontrados

📤 Procesando: andres@yopmail.com (ID: abc123...)
  🔐 Creando en auth.users con password temporal...
  ✅ Creado en auth.users (ID: abc123...)
  Password temporal: TempXy9z!123
  → Usuario debe usar "Olvidé contraseña" para establecer su password real

...

✅ MIGRACIÓN COMPLETADA

  ✅ Creados en auth.users:    8
  ⏭️  Ya existían:              0
  ❌ Errores:                  0
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 Total procesados:         8

✅ PERFECTO: Todos los usuarios fueron creados exitosamente en auth.users
```

### 4️⃣ Verificar en Supabase Console

1. Ve a **Supabase Dashboard** → tu proyecto
2. **Authentication** → **Users**
3. Deberías ver 8 usuarios listados

### 5️⃣ Próximos pasos

- Cada usuario irá a **Login** → **"¿Olvidaste tu contraseña?"**
- Reciben email de reset
- Establecen su contraseña real
- Después refactoriza Login para usar `supabase.auth.signInWithPassword()`

---

## ¿Qué si falla?

**Error: "Service Role Key invalid"**
- Verifica que `SUPABASE_SERVICE_ROLE_KEY` sea correcto
- Cópialo de Supabase Dashboard → Settings → API

**Error: "Email already exists"**
- El usuario ya está en auth.users (probablemente de v1)
- Limpia auth.users en Supabase Console y reinteneta

**No aparece nada en Supabase Console**
- Refresca la página (F5)
- Cierra sesión y abre de nuevo
- Si sigue sin aparecer, verifica que el script reportó "✅ Creados"

---

## Arquitectura Hybrid

```
auth.users (Supabase Auth)
├── id (UUID)
├── email
├── encrypted_password (manejado por Supabase)
└── email_verified

usuarios (tu tabla - visible admin)
├── id (mismo UUID)
├── nombre, apellido, phone
├── preferences, is_active, created_at
└── otros campos personalizados
```

Ambas sincronizadas por `id`.
