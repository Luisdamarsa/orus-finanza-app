import { useState } from "react";
import { usePress } from "../hooks/usePress";

/**
 * DeleteAccountModal.jsx
 * Popup clay exacto para confirmar eliminación de cuenta
 *
 * Props:
 *   isDark - Tema oscuro
 *   isOpen - Si el modal está visible
 *   onCancel - Callback al hacer click en Cancelar
 *   onConfirm - Callback al hacer click en Eliminar Cuenta
 */
export default function DeleteAccountModal({ isDark, isOpen, onCancel, onConfirm }) {
  const pressCancelar = usePress();
  const pressEliminar = usePress();

  // Tokens de diseño
  const tokens = {
    accent: "#9B6DFF",
    surface: "linear-gradient(155deg,#211d2c 0%,#141220 100%)",
    raised: "linear-gradient(155deg,#262231 0%,#17151f 100%)",
    shadowLg: "0 24px 48px -16px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
    text: "#F5F3FF",
    sub: "#8B87A3",
    errorBg: "rgba(228,87,75,0.16)",
    errorColor: "#E4574B",
    errorGrad: "linear-gradient(155deg,#FF8A8A,#E4574B)",
    errorShadow: "0 14px 26px -12px rgba(228,87,75,0.5)",
  };

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(3px)",
          zIndex: 50,
        }}
      />

      {/* WRAPPER CENTRADOR */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 51,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 22px",
          pointerEvents: "none",
        }}>
        {/* TARJETA */}
        <div
          style={{
            width: "100%",
            pointerEvents: "auto",
            borderRadius: 22,
            background: tokens.surface,
            boxShadow: tokens.shadowLg,
            padding: "26px 22px",
            textAlign: "center",
            animation: "clayRise .3s ease both",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Manrope",
          }}>
          {/* ÍCONO */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: tokens.errorBg,
              color: tokens.errorColor,
              margin: "0 auto 16px",
            }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>
          </div>

          {/* TÍTULO */}
          <div style={{ fontSize: 17, fontWeight: 800, color: tokens.text, marginTop: 16, fontFamily: "Manrope" }}>
            ¿Estás seguro?
          </div>

          {/* DESCRIPCIÓN */}
          <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text, marginTop: 6, fontFamily: "Manrope" }}>
            ¿Quieres eliminar tu cuenta?
          </div>

          {/* TEXTO DE ADVERTENCIA */}
          <div style={{ fontSize: "11.5px", fontWeight: 600, color: tokens.sub, marginTop: 10, lineHeight: 1.5, fontFamily: "Manrope" }}>
            Esta acción es <span style={{ color: "#FF8A8A", fontWeight: 800 }}>irreversible</span>. Se borrarán todos tus datos, transacciones y configuraciones de la app.
          </div>

          {/* BOTONES */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, width: "100%" }}>
            {/* Botón Cancelar */}
            <button
              onClick={onCancel}
              {...pressCancelar.handlers}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 14,
                border: "none",
                background: tokens.raised,
                color: tokens.text,
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                fontFamily: "Manrope",
                whiteSpace: "nowrap",
                ...pressCancelar.getPressStyle({ scale: 0.97 }),
              }}>
              Cancelar
            </button>

            {/* Botón Eliminar Cuenta */}
            <button
              onClick={onConfirm}
              {...pressEliminar.handlers}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 14,
                border: "none",
                background: tokens.errorGrad,
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: tokens.errorShadow,
                fontFamily: "Manrope",
                whiteSpace: "nowrap",
                ...pressEliminar.getPressStyle({ scale: 0.97 }),
              }}>
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes clayRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}
