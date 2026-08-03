import { useState, useEffect } from "react";
import { userStorage } from "../utils/userStorage";
import { usePopup } from "../services/PopupService";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import DeleteAccountModal from "./DeleteAccountModal";

/**
 * Página de Perfil del usuario
 * Layout clay exacto con tarjeta centrada y formularios
 */
export default function ProfilePage({
  onBack,
  onSaveSuccess,
  setScreen,
}) {
  const { isDark } = useTheme();
  const popup = usePopup();

  // Tokens de diseño
  const tokens = {
    accent: "#9B6DFF",
    accentSoft: "rgba(155,109,255,0.16)",
    surface: "linear-gradient(155deg,#211d2c 0%,#141220 100%)",
    raised: "linear-gradient(155deg,#262231 0%,#17151f 100%)",
    shadowSm: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
    text: "#F5F3FF",
    sub: "#8B87A3",
    muted: "#5F5C74",
    border: "rgba(139,135,163,0.15)",
    inputBg: "rgba(53,48,69,0.4)",
    errorGrad: "linear-gradient(155deg,#FF8A8A,#E4574B)",
    errorShadow: "0 14px 26px -12px rgba(228,87,75,0.5)",
  };

  const pressBack = usePress();
  const pressLogout = usePress();
  const pressDelete = usePress();
  const pressSave = usePress();

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  // Cargar datos del usuario
  useEffect(() => {
    const userData = userStorage.getUser();
    setUser(userData);
    setDisplayName(userData.displayName);
  }, []);

  // Detectar cambios
  useEffect(() => {
    if (!user) return;
    setHasChanged(displayName !== user.displayName);
  }, [displayName, user]);

  const handleDisplayNameChange = (value) => {
    setDisplayName(value);
  };

  const handleCopyUserId = async () => {
    if (!user?.userId) return;
    try {
      await navigator.clipboard.writeText(user.userId);
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const handleSave = () => {
    if (!hasChanged) return;
    try {
      userStorage.updateUser({ displayName });
      setHasChanged(false);
      popup.showEditPopup('Perfil');
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      popup.showErrorPopup("No se pudo actualizar el perfil");
    }
  };

  if (!user) return null;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, overflowY: "auto", padding: "26px 22px 60px", background: "#000000", textAlign: "left", fontFamily: "Manrope" }}>

        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Botón Atrás */}
          <button
            onClick={onBack}
            {...pressBack.handlers}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: tokens.sub,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              padding: "6px 0",
              fontFamily: "Manrope",
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Atrás
          </button>

          {/* Botón Cerrar Sesión */}
          <button
            onClick={() => setScreen("onboarding")}
            {...pressLogout.handlers}
            style={{
              padding: "9px 16px",
              borderRadius: 14,
              border: "none",
              background: tokens.raised,
              color: tokens.text,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              boxShadow: tokens.shadowSm,
              fontFamily: "Manrope",
              ...pressLogout.getPressStyle({ scale: 0.97 }),
            }}>
            Cerrar Sesión
          </button>
        </div>

        {/* TÍTULO con ícono */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              background: tokens.accentSoft,
              color: tokens.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: tokens.text, fontFamily: "Manrope" }}>Perfil</span>
        </div>

        {/* TARJETA: Nombre de Usuario */}
        <div
          style={{
            padding: "16px 18px",
            borderRadius: 16,
            background: tokens.surface,
            boxShadow: tokens.shadowSm,
            marginTop: 22,
            textAlign: "left",
            fontFamily: "Manrope",
          }}>
          <div style={{ fontSize: "10.5px", fontWeight: 800, color: tokens.sub, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Nombre de Usuario
          </div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "none",
              border: "none",
              fontSize: 15,
              fontWeight: 800,
              color: tokens.text,
              marginTop: 6,
              padding: 0,
              outline: "none",
              fontFamily: "Manrope",
            }}
          />
          {user.userId && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, justifyContent: "flex-start" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 600, color: tokens.muted }}>
                User ID: {user.userId}
              </span>
              <button
                onClick={handleCopyUserId}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  opacity: 0.7,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.opacity = "1"}
                onMouseLeave={(e) => e.target.style.opacity = "0.7"}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={copiedUserId ? "#22C55E" : tokens.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
              {copiedUserId && (
                <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#22C55E" }}>Copiado</span>
              )}
            </div>
          )}
        </div>

        {/* SECCIÓN: Información Personal */}
        <div style={{ marginTop: 26, fontFamily: "Manrope" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: tokens.sub, letterSpacing: "0.6px", textTransform: "uppercase" }}>
            Información Personal
          </div>

          {/* Nombre(s) */}
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: "10.5px", fontWeight: 700, color: tokens.sub, display: "block", marginBottom: 6, fontFamily: "Manrope", textTransform: "uppercase" }}>
              Nombre(s)
            </label>
            <input
              type="text"
              value={user.firstName || ""}
              disabled
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: `1px solid ${tokens.border}`,
                background: tokens.inputBg,
                color: tokens.muted,
                fontSize: "13.5px",
                fontWeight: 600,
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "Manrope",
              }}
            />
          </div>

          {/* Apellido(s) */}
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: "10.5px", fontWeight: 700, color: tokens.sub, display: "block", marginBottom: 6, fontFamily: "Manrope", textTransform: "uppercase" }}>
              Apellido(s)
            </label>
            <input
              type="text"
              value={user.lastName || ""}
              disabled
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: `1px solid ${tokens.border}`,
                background: tokens.inputBg,
                color: tokens.muted,
                fontSize: "13.5px",
                fontWeight: 600,
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "Manrope",
              }}
            />
          </div>

          {/* Correo Electrónico */}
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: "10.5px", fontWeight: 700, color: tokens.sub, display: "block", marginBottom: 6, fontFamily: "Manrope", textTransform: "uppercase" }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 16px",
                borderRadius: 14,
                border: `1px solid ${tokens.border}`,
                background: tokens.inputBg,
                color: tokens.muted,
                fontSize: "13.5px",
                fontWeight: 600,
                outline: "none",
                fontFamily: "Manrope",
                cursor: "not-allowed",
              }}
            />
          </div>

          {/* Teléfono */}
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: "10.5px", fontWeight: 700, color: tokens.sub, display: "block", marginBottom: 6, fontFamily: "Manrope", textTransform: "uppercase" }}>
              Teléfono
            </label>
            <input
              type="tel"
              value={user.phone || ""}
              disabled
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: `1px solid ${tokens.border}`,
                background: tokens.inputBg,
                color: tokens.muted,
                fontSize: "13.5px",
                fontWeight: 600,
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "Manrope",
              }}
            />
          </div>
        </div>

        {/* BOTÓN Eliminar Cuenta */}
        <button
          onClick={() => setDeleteAccountModalOpen(true)}
          {...pressDelete.handlers}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 16,
            border: "none",
            background: tokens.errorGrad,
            color: "#fff",
            fontWeight: 800,
            fontSize: "13.5px",
            marginTop: 26,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: tokens.errorShadow,
            fontFamily: "Manrope",
            ...pressDelete.getPressStyle({ scale: 0.97 }),
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>
          Eliminar Cuenta
        </button>
      </div>

      {/* Modal de Eliminación de Cuenta */}
      <DeleteAccountModal
        isDark={isDark}
        isOpen={deleteAccountModalOpen}
        onCancel={() => setDeleteAccountModalOpen(false)}
        onConfirm={() => {
          popup.showDeletePopup('cuenta');
          setDeleteAccountModalOpen(false);
        }}
      />

      {/* FAB flotante - Guardar cambios */}
      <button
        onClick={handleSave}
        disabled={!hasChanged}
        onPointerDown={() => hasChanged && pressSave.handlers.onPointerDown()}
        onPointerUp={() => pressSave.handlers.onPointerUp()}
        onPointerLeave={() => pressSave.handlers.onPointerLeave()}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: 17,
          border: "none",
          background: "linear-gradient(155deg,#B18CFF,#8B5CF6)",
          cursor: hasChanged ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 18px 30px -10px rgba(139,92,246,0.65), inset 0 1px 0 rgba(255,255,255,0.3)",
          opacity: hasChanged ? 1 : 0.4,
          transition: "opacity 0.2s ease",
          ...(hasChanged ? pressSave.getPressStyle({ scale: 0.94 }) : {}),
        }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
      </button>
    </>
  );
}
