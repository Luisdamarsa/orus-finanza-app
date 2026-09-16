/**
 * migrate_users_to_auth_v2.js
 *
 * Script mejorado para migrar usuarios de tabla 'usuarios' a auth.users de Supabase
 *
 * CAMBIOS vs v1:
 * - Verificación por email (no por ID - más confiable)
 * - Mejor logging de cada paso
 * - Manejo de errores robusto
 * - Reporta usuarios creados vs ya existentes vs fallidos
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Falta VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

async function migrateUsersToAuth() {
  console.log('🚀 Iniciando migración v2 de usuarios a auth.users...\n');

  try {
    // 1️⃣ Obtener usuarios de tabla 'usuarios'
    console.log('📥 Leyendo usuarios de tabla usuarios...');
    const { data: usuarios, error: fetchError } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, phone, is_active')
      .order('created_at', { ascending: true });

    if (fetchError) throw fetchError;
    if (!usuarios || usuarios.length === 0) {
      console.log('❌ No hay usuarios en tabla usuarios');
      return;
    }

    console.log(`✅ ${usuarios.length} usuarios encontrados\n`);

    // 2️⃣ Para cada usuario, intentar crear en auth.users
    let createdCount = 0;
    let alreadyExistsCount = 0;
    let failedCount = 0;
    const results = [];

    for (const user of usuarios) {
      try {
        console.log(`\n📤 Procesando: ${user.email} (ID: ${user.id})`);

        // Verificar si el usuario ya existe en auth.users por EMAIL
        // (más confiable que by ID)
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
          console.log(`  ⚠️  Error al listar usuarios: ${listError.message}`);
          failedCount++;
          results.push({ email: user.email, status: 'error', reason: listError.message });
          continue;
        }

        const userExists = existingUsers?.users?.find(u => u.email === user.email);

        if (userExists) {
          console.log(`  ⏭️  Ya existe en auth.users (ID: ${userExists.id})`);
          alreadyExistsCount++;
          results.push({ email: user.email, status: 'already_exists' });
          continue;
        }

        // Crear usuario en auth.users con password temporal
        const tempPassword = `Temp${Math.random().toString(36).substr(2, 9)}!123`;

        console.log(`  🔐 Creando en auth.users con password temporal...`);

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
        console.log(`     Email: ${authUser.user.email}`);
        console.log(`     Password temporal: ${tempPassword}`);
        console.log(`     → Usuario debe usar "Olvidé contraseña" para establecer su password real`);

        createdCount++;
        results.push({ email: user.email, status: 'created', authUserId: authUser.user.id });

      } catch (err) {
        console.log(`  ❌ Error: ${err.message}`);
        failedCount++;
        results.push({ email: user.email, status: 'error', reason: err.message });
      }
    }

    // 3️⃣ Resumen
    console.log(`\n${'='.repeat(70)}`);
    console.log(`\n✅ MIGRACIÓN COMPLETADA\n`);
    console.log(`  ✅ Creados en auth.users:    ${createdCount}`);
    console.log(`  ⏭️  Ya existían:              ${alreadyExistsCount}`);
    console.log(`  ❌ Errores:                  ${failedCount}`);
    console.log(`  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  📊 Total procesados:         ${usuarios.length}`);

    if (failedCount === 0 && alreadyExistsCount === 0) {
      console.log(`\n✅ PERFECTO: Todos los usuarios fueron creados exitosamente en auth.users`);
    } else if (failedCount > 0) {
      console.log(`\n⚠️  Hubo ${failedCount} error(s). Revisa el log arriba.`);
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`\n📋 PRÓXIMOS PASOS:\n`);
    console.log(`  1. Verifica en Supabase Console → Authentication → Users`);
    console.log(`     Deberías ver ${createdCount} usuarios nuevos`);
    console.log(`\n  2. Cada usuario debe ir a Login → "¿Olvidaste tu contraseña?"`)
    console.log(`     Desde allí pueden establecer su contraseña real`);
    console.log(`\n  3. Después refactoriza Login para usar supabase.auth.signInWithPassword()`);
    console.log(`\n`);

  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
}

migrateUsersToAuth();
