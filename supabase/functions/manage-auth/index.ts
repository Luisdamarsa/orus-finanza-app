import { createClient } from "jsr:@supabase/supabase-js@2";

interface ManageAuthRequest {
  action: "create" | "change-password" | "reset-password" | "delete-account";
  email: string;
  password?: string;
  newPassword?: string;
  nombre?: string;
  apellido?: string;
  phone?: string;
  token?: string;
}

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req: Request) => {
  // PREFLIGHT CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    console.log("[manage-auth] ✅ FUNCIÓN INVOCADA");
    console.log("[manage-auth] Método:", req.method);

    // Parsear body con error handling
    let body: ManageAuthRequest;
    try {
      body = await req.json();
      console.log("[manage-auth] Body parseado:", body);
    } catch (parseError) {
      console.error("[manage-auth] Error parseando JSON:", parseError);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON in request body" }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { action, email, password, newPassword, nombre, apellido, phone, token } = body;

    console.log(`[manage-auth] Action: ${action}, Email: ${email}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (action === "create") {
      console.log("[manage-auth] CREATE: creando usuario en auth.users");

      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: password!,
        email_confirm: true,
      });

      if (authError) {
        console.error("[manage-auth] CREATE: Error en auth.users:", authError.message);
        throw authError;
      }

      console.log("[manage-auth] CREATE: Usuario creado en auth.users, ID:", authUser.user.id);

      const { error: userError } = await supabase
        .from("usuarios")
        .insert({
          id: authUser.user.id,
          email,
          nombre: nombre || "",
          apellido: apellido || "",
          username: nombre || email?.split('@')[0] || 'Usuario',
          phone: phone || "",
          is_active: true,
        });

      if (userError) {
        console.error("[manage-auth] CREATE: Error en usuarios table:", userError.message);
        throw userError;
      }

      console.log("[manage-auth] CREATE: ✅ Exito");

      return new Response(
        JSON.stringify({ success: true, userId: authUser.user.id }),
        { headers: CORS_HEADERS }
      );
    }

    if (action === "change-password") {
      console.log("[manage-auth] CHANGE-PASSWORD: buscando usuario");

      const { data: userData, error: userLookupError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("email", email)
        .single();

      if (userLookupError || !userData) {
        console.error("[manage-auth] CHANGE-PASSWORD: Usuario no encontrado");
        throw new Error("Usuario no encontrado");
      }

      console.log("[manage-auth] CHANGE-PASSWORD: Usuario encontrado, ID:", userData.id);
      console.log("[manage-auth] CHANGE-PASSWORD: Actualizando contraseña en auth.users");

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userData.id,
        { password: newPassword! }
      );

      if (updateError) {
        console.error("[manage-auth] CHANGE-PASSWORD: Error actualizando:", updateError.message);
        throw updateError;
      }

      console.log("[manage-auth] CHANGE-PASSWORD: ✅ Exito");

      return new Response(
        JSON.stringify({ success: true }),
        { headers: CORS_HEADERS }
      );
    }

    if (action === "reset-password") {
      console.log("[manage-auth] RESET-PASSWORD: validando OTP");

      const { data: resetToken, error: tokenError } = await supabase
        .from("password_reset_tokens")
        .select("*")
        .eq("email", email)
        .eq("token", token)
        .is("used_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (tokenError || !resetToken) {
        console.error("[manage-auth] RESET-PASSWORD: Token no válido");
        throw new Error("Codigo invalido o expirado");
      }

      const now = new Date();
      const expiresAt = new Date(resetToken.expires_at);
      if (now > expiresAt) {
        console.error("[manage-auth] RESET-PASSWORD: Token expirado");
        throw new Error("Codigo expirado");
      }

      console.log("[manage-auth] RESET-PASSWORD: OTP válido, buscando usuario");

      const { data: userData, error: userLookupError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("email", email)
        .single();

      if (userLookupError || !userData) {
        console.error("[manage-auth] RESET-PASSWORD: Usuario no encontrado");
        throw new Error("Usuario no encontrado");
      }

      console.log("[manage-auth] RESET-PASSWORD: Actualizando contraseña");

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userData.id,
        { password: newPassword! }
      );

      if (updateError) {
        console.error("[manage-auth] RESET-PASSWORD: Error actualizando:", updateError.message);
        throw updateError;
      }

      console.log("[manage-auth] RESET-PASSWORD: Marcando token como usado");

      await supabase
        .from("password_reset_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("id", resetToken.id);

      console.log("[manage-auth] RESET-PASSWORD: ✅ Exito");

      return new Response(
        JSON.stringify({ success: true }),
        { headers: CORS_HEADERS }
      );
    }

    if (action === "delete-account") {
      console.log("[manage-auth] DELETE-ACCOUNT: buscando usuario");

      const { data: userData, error: userLookupError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("email", email)
        .single();

      if (userLookupError || !userData) {
        console.error("[manage-auth] DELETE-ACCOUNT: Usuario no encontrado");
        throw new Error("Usuario no encontrado");
      }

      console.log("[manage-auth] DELETE-ACCOUNT: Soft delete (is_active=false)");

      await supabase
        .from("usuarios")
        .update({ is_active: false })
        .eq("id", userData.id);

      console.log("[manage-auth] DELETE-ACCOUNT: ✅ Exito");

      return new Response(
        JSON.stringify({ success: true }),
        { headers: CORS_HEADERS }
      );
    }

    console.error("[manage-auth] Error: Accion no soportada:", action);
    throw new Error("Accion no soportada");
  } catch (error) {
    console.error("[manage-auth] ❌ Error fatal:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: CORS_HEADERS }
    );
  }
});
