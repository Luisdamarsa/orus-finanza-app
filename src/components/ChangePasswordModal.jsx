import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { DARK, LIGHT } from "../constants/tokens";
import { getCTAButtonStyle } from "../utils/buttonStyles";
import { supabase } from "../services/supabaseService";
import bcrypt from "bcryptjs"; // 🆕 FASE 3F - Para hashear contraseña

/**
 * ChangePasswordModal.jsx
 * Modal para cambiar contraseña estando logueado
 *
 * Props:
 * - isDark: boolean
 * - onClose: function
 */
export default function ChangePasswordModal({ isDark, onClose }) {
  const tokens = isDark ? DARK : LIGHT;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = {
    bg: tokens.bg,
    text: tokens.text,
    sub: tokens.sub,
    surface: tokens.surface,
    danger: "#FF8A8A",
    success: "#86EFAC",
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validaciones
    if (!currentPassword) {
      setError("Ingresa tu contraseña actual");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("La nueva contraseña debe contener al menos 1 mayúscula");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError("La nueva contraseña debe contener al menos 1 número");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setIsLoading(true);

    try {
      // 🆕 FASE 3F - Obtener userId del usuario actual
      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) {
        throw new Error("Usuario no identificado. Por favor, cierra sesión y vuelve a ingresar.");
      }

      // 🆕 FASE 3F - Obtener usuario actual de BD
      const { data: userData, error: fetchError } = await supabase
        .from("usuarios")
        .select("password")
        .eq("id", currentUserId)
        .single();

      if (fetchError || !userData) {
        throw new Error("No se pudo verificar la contraseña actual");
      }

      // 🆕 FASE 3F - Validar contraseña actual con bcrypt
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
      if (!isCurrentPasswordValid) {
        throw new Error("La contraseña actual es incorrecta");
      }

      // 🆕 FASE 3F - Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 🆕 FASE 3F - Actualizar en tabla usuarios (no en auth.users)
      const { error: updateError } = await supabase
        .from("usuarios")
        .update({ password: hashedPassword })
        .eq("id", currentUserId);

      if (updateError) throw updateError;

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Cerrar modal después de 1.5s
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const errorMsg = err.message || "Error al cambiar contraseña";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        animation: "fadeIn 0.25s ease",
      }}
      onPointerDown={onClose}
    >
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>

      <div
        style={{
          background: t.bg,
          borderRadius: 16,
          padding: "18px 16px",
          maxWidth: 320,
          width: "88%",
          boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
          animation: "scaleUp 0.25s cubic-bezier(0.32, 0.72, 0.12, 1)",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes scaleUp { from { transform:scale(0.9);opacity:0 } to { transform:scale(1);opacity:1 } }`}</style>

        {/* Cerrar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: t.text,
              margin: 0,
            }}
          >
            Cambiar Contraseña
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: t.sub,
              fontSize: 20,
              cursor: "pointer",
              padding: 0,
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <div
            style={{
              background: "rgba(134,239,172,0.1)",
              color: t.success,
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            ✓ Contraseña cambiada
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div
            style={{
              background: "rgba(255,138,138,0.1)",
              color: t.danger,
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Contraseña Actual */}
          <div>
            <label
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 5,
                display: "block",
              }}
            >
              ACTUAL
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading || success}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 14px 8px 36px",
                  fontSize: 13,
                  border: `1px solid ${error ? t.danger : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 10,
                  background: t.surface,
                  color: t.text,
                  outline: "none",
                  transition: "all 0.3s",
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: t.sub,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔒
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 5,
                display: "block",
              }}
            >
              NUEVA
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading || success}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 18px 10px 40px",
                  fontSize: 14,
                  border: `1px solid ${error ? t.danger : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12,
                  background: t.surface,
                  color: t.text,
                  outline: "none",
                  transition: "all 0.3s",
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: t.sub,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔒
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 5,
                display: "block",
              }}
            >
              CONFIRMAR
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading || success}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 18px 10px 40px",
                  fontSize: 14,
                  border: `1px solid ${error ? t.danger : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12,
                  background: t.surface,
                  color: t.text,
                  outline: "none",
                  transition: "all 0.3s",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: t.sub,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔒
              </button>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || success}
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 10,
                border: "none",
                background: t.surface,
                color: t.text,
                fontWeight: 600,
                cursor: isLoading || success ? "not-allowed" : "pointer",
                fontSize: 11,
                transition: "all 0.3s",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!currentPassword || !newPassword || !confirmPassword || isLoading || success}
              style={{
                flex: 1,
                ...getCTAButtonStyle(currentPassword && newPassword && confirmPassword && !isLoading && !success),
              }}
            >
              {isLoading ? "Cambiando..." : "Cambiar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
