import { usePress } from "../hooks/usePress";
import { DARK, LIGHT, SHADOWS } from "../constants/tokens";

/**
 * FloatingActionButtons.jsx
 *
 * Barra flotante con 3 botones de acción (Estado 1 y 2):
 *  - Lupa (búsqueda): 48×48px, secundario, izquierda
 *  - Lápiz (nueva transacción): 48×48px, secundario, derecha
 *  - Micrófono (voz): 58×58px, principal (gradiente púrpura), derecha
 *
 * En modo búsqueda, se abre una barra de input entre lupa y lápiz/mic.
 */
export default function FloatingActionButtons({
  isDark, pressingFAB, setPressingFAB, setScreen, onMic,
  onSearch, searchOpen, searchQuery, setSearchQuery, onCloseSearch,
}) {
  const tokens = isDark ? DARK : LIGHT;
  const pressSearch = usePress();
  const pressEdit = usePress();
  const pressMic = usePress();

  // Botón lápiz (nueva transacción) — 48×48px, secundario
  const pencilButton = (
    <button
      onClick={() => setScreen("new-transaction")}
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
        ...pressEdit.getPressStyle(),
      }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h4L20 8l-4-4L4 16v4z" />
        <path d="M14 6l4 4" />
      </svg>
    </button>
  );

  // Botón micrófono (voz) — 58×58px, principal, gradiente púrpura
  const micButton = (
    <button
      onClick={onMic}
      {...pressMic.handlers}
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
        ...pressMic.getPressStyle(),
      }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );

  // MODO BÚSQUEDA: barra de input + lápiz + micrófono en la misma línea
  if (searchOpen) {
    return (
      <div style={{
        position: "absolute",
        bottom: 22,
        left: 22,
        right: 22,
        zIndex: 35,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        {/* Barra de búsqueda */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: tokens.raised,
          border: `1px solid ${tokens.border}`,
          borderRadius: 12,
          padding: "8px 12px",
          boxShadow: SHADOWS.shadowSm,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: tokens.sub, flexShrink: 0 }}>
            <circle cx="10" cy="10" r="6" />
            <path d="M20 20l-5-5" />
          </svg>
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar…"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: tokens.text,
              fontSize: 12.5,
              fontWeight: 500,
            }}
          />
          <button
            onClick={onCloseSearch}
            aria-label="Cerrar búsqueda"
            style={{
              flexShrink: 0,
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              color: tokens.sub,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
              transition: "opacity 0.15s",
            }}>
            ✕
          </button>
        </div>
        {pencilButton}
        {micButton}
      </div>
    );
  }

  // MODO NORMAL: lupa izquierda; lápiz + micrófono derecha
  return (
    <>
      {/* Lupa — 48×48px, izquierda inferior */}
      <button
        onClick={onSearch}
        {...pressSearch.handlers}
        style={{
          position: "absolute",
          bottom: 22,
          left: 22,
          zIndex: 35,
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
          ...pressSearch.getPressStyle(),
        }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="10" cy="10" r="6" />
          <path d="M20 20l-5-5" />
        </svg>
      </button>

      {/* Lápiz + Micrófono — derecha inferior, gap 10px */}
      <div style={{
        position: "absolute",
        bottom: 22,
        right: 22,
        zIndex: 35,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        {pencilButton}
        {micButton}
      </div>
    </>
  );
}
