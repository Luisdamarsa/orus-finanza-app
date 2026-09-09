/**
 * migrate_users_to_auth.js
 *
 * Script para migrar usuarios de tabla 'usuarios' a auth.users de Supabase
 *
 * REQUISITOS:
 * - Node.js instalado
 * - Variables de entorno configuradas (.env.local)
 * - Supabase Admin API Key (con permisos para auth)
 *
 * EJECUCIÓN:
 * npm install dotenv @supabase/supabase-js
 * node scripts/migrate_users_to_auth.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ⚠️ CUIDADO: Service Key (no Anon Key)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Falta VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  console.error('Necesitas:');
  console.error('  1. VITE_SUPABASE_URL=https://...');
  console.error('  2. SUPABASE_SERVICE_ROLE_KEY=eyJ... (desde Dashboard → Settings → API)');
  process.exit(1);
}

// Crear cliente con Service Role Key (para auth.admin)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

async function migrateUsersToAuth() {
  console.log('🚀 Iniciando migración de usuarios a auth.users...\n');

  try {
    // 1️⃣ Obtener usuarios de tabla 'usuarios'
    console.log('📥 Obteniendo usuarios de tabla usuarios...');
    const { data: usuarios, error: fetchError } = await supabase
      .from('usuarios')
      .select('id, email, password, nombre, apellido, phone, is_active')
      .order('created_at', { ascending: true });

    if (fetchError) throw fetchError;
    if (!usuarios || usuarios.length === 0) {
      console.log('❌ No hay usuarios en tabla usuarios');
      return;
    }

    console.log(`✅ ${usuarios.length} usuarios encontrados\n`);

    // 2️⃣ Para cada usuario, crear en auth.users
    let createdCount = 0;
    let skippedCount = 0;

    for (const user of usuarios) {
      try {
        console.log(`\n📤 Procesando: ${user.email}`);

        // Verificar si el usuario ya existe en auth.users
        const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserById(user.id);

        if (existingUser) {
          console.log(`  ⏭️  Ya existe en auth.users (saltando)`);
          skippedCount++;
          continue;
        }

        if (checkError && checkError.status !== 404) {
          console.log(`  ⚠️  Error al verificar: ${checkError.message}`);
          continue;
        }

        // Crear usuario en auth.users con la password actual
        // ⚠️ NOTA: La password está hasheada en tabla usuarios con bcrypt
        // No podemos "unhashear" así que usamos un password temporal
        const tempPassword = `Temp${Math.random().toString(36).substr(2, 9)}!`;

        console.log(`  🔐 Creando en auth.users...`);

        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
          id: user.id, // Mantener ID consistente
          email: user.email,
          password: tempPassword,
          email_confirm: true, // Marcar como confirmado
          user_metadata: {
            nombre: user.nombre,
            apellido: user.apellido,
            phone: user.phone,
          }
        });

        if (createError) throw createError;

        console.log(`  ✅ Creado en auth.users (ID: ${authUser.user.id})`);
        console.log(`  ⚠️  PASSWORD TEMPORAL: ${tempPassword}`);
        console.log(`     El usuario necesitará resetear contraseña (olvidé la contraseña)`);

        createdCount++;

      } catch (err) {
        console.log(`  ❌ Error: ${err.message}`);
      }
    }

    // 3️⃣ Resumen
    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n✅ MIGRACIÓN COMPLETADA`);
    console.log(`  - Creados en auth.users: ${createdCount}`);
    console.log(`  - Saltados (ya existían): ${skippedCount}`);
    console.log(`  - Total: ${usuarios.length}`);
    console.log(`\n⚠️  IMPORTANTE:`);
    console.log(`  1. Los usuarios tienen contraseñas TEMPORALES`);
    console.log(`  2. Deben usar "Olvidé mi contraseña" para resetear`);
    console.log(`  3. O actualizar manualmente en Supabase Console → Auth`);
    console.log(`\n`);

  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
}

migrateUsersToAuth();
