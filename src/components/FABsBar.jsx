import { usePress } from "../hooks/usePress";
import { DARK, LIGHT, SHADOWS } from "../constants/tokens";

/**
 * FABsBar.jsx
 *
 * Barra flotante con 3 botones de acción:
 * - Lupa (búsqueda)
 * - Lápiz (editar/automatizaciones)
 * - Micrófono (VoiceCapture)
 *
 * Props:
 * - isDark: boolean
 * - onSearchToggle: function (abrir/cerrar búsqueda)
 * - onMicrophonePress: function (iniciar grabación)
 * - onEditPress: function (abrir editar/automatizaciones)
 */
export default function FABsBar({ isDark, onSearchToggle, onMicrophonePress, onEditPress }) {
  const tokens = isDark ? DARK : LIGHT;
  const pressSearch = usePress();
  const pressEdit = usePress();
  const pressMicrophone = usePress();

  return (
    <div style={{
      position: "absolute",
      bottom: 22,
      left: 22,
      right: 22,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 32,
      pointerEvents: "auto"
    }}>
      {/* FAB izquierdo: búsqueda */}
      <button
        onClick={onSearchToggle}
        {...pressSearch.handlers}
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          background: tokens.raised,
          color: tokens.sub,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: SHADOWS.shadowSm,
          outline: "none",
          transition: "all 0.15s",
          ...pressSearch.getPressStyle()
        }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="10" cy="10" r="6" />
          <path d="M20 20l-5-5" />
        </svg>
      </button>

      {/* Grupo derecho: lápiz + micrófono */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* FAB secundario: lápiz (editar/automatizaciones) */}
        <button
          onClick={onEditPress}
          {...pressEdit.handlers}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: tokens.raised,
            color: tokens.sub,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: SHADOWS.shadowSm,
            outline: "none",
            transition: "all 0.15s",
            ...pressEdit.getPressStyle()
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h4L20 8l-4-4L4 16v4z" />
            <path d="M14 6l4 4" />
          </svg>
        </button>

        {/* FAB principal: micrófono (VoiceCapture) */}
        <button
          onClick={onMicrophonePress}
          {...pressMicrophone.handlers}
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(155deg, #B18CFF, #8B5CF6)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 18px 30px -10px rgba(139,92,246,0.65), inset 0 1px 0 rgba(255,255,255,0.3)",
            outline: "none",
            transition: "all 0.15s",
            ...pressMicrophone.getPressStyle()
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0114 0M12 18v3M9 21h6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
