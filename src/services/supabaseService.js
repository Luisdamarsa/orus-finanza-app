import { createClient } from '@supabase/supabase-js';

// Obtener credenciales del .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exportar funciones útiles
export default supabase;