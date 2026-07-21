
/**
 * FloatingActionButtons.jsx
 *
 * Controles flotantes del dashboard (Estado 1 y 2):
 *  - Lupa (buscar): esquina inferior IZQUIERDA (opuesta al micrófono).
 *  - Lápiz (nueva transacción a mano) + Micrófono (voz): esquina inferior DERECHA.
 * Al activar la búsqueda, la barra aparece ABAJO en la misma línea que el lápiz y el
 * micrófono: va desde la esquina izquierda hasta el lápiz, y el mic sigue visible a la derecha.
 * Extraído de DashboardOverlays para tener su propio ErrorBoundary.
 */
export default function FloatingActionButtons({
  isDark, pressingFAB, setPressingFAB, setScreen, onMic,
  onSearch, searchOpen, searchQuery, setSearchQuery, onCloseSearch,
}) {
  const t = isDark
    ? { card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };

  // Botón lápiz (nueva transacción a mano) — se reutiliza en ambos modos
  const pencilButton = (
    <button
      onClick={() => setScreen("new-transaction")}
      onPointerDown={() => setPressingFAB("pencil")}
      onPointerUp={() => setPressingFAB(null)}
      onPointerLeave={() => setPressingFAB(null)}
      style={{
        width: 32, height: 32, borderRadius: "50%", border: "none",
        background: isDark ? "#3A3A52" : "#94A3B8",
        cursor: "pointer",
        boxShadow: "0 3px 10px rgba(0,0,0,0.28)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transform: pressingFAB === "pencil" ? "scale(0.90)" : "scale(1)",
        opacity: pressingFAB === "pencil" ? 0.7 : 1,
        transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );

  // Botón micrófono (voz) — se reutiliza en ambos modos
  const micButton = (
    <button
      onClick={onMic}
      onPointerDown={() => setPressingFAB("mic")}
      onPointerUp={() => setPressingFAB(null)}
      onPointerLeave={() => setPressingFAB(null)}
      style={{
        width: 52, height: 52, borderRadius: "50%", border: "none",
        background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
        cursor: "pointer",
        boxShadow: "0 6px 24px rgba(155,109,255,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transform: pressingFAB === "mic" ? "scale(0.93)" : "scale(1)",
        opacity: pressingFAB === "mic" ? 0.8 : 1,
        transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none" />
        <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    </button>
  );

  // MODO BÚSQUEDA: barra + lápiz + micrófono en la misma línea (la barra va de la izquierda al lápiz)
  if (searchOpen) {
    return (
      <div style={{ position: "absolute", bottom: 24, left: 22, right: 22, zIndex: 35, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, background: t.card, border: `1.5px solid ${t.border}`, borderRadius: 22, padding: "9px 14px", boxShadow: "0 6px 20px rgba(0,0,0,0.22)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar: arriendo, Varios…"
            style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 13.5 }}
          />
          <button
            onClick={onCloseSearch}
            aria-label="Cerrar búsqueda"
            style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", border: "none", background: isDark ? "#2D2D3A" : "#F0EFF8", color: t.sub, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
        </div>
        {pencilButton}
        {micButton}
      </div>
    );
  }

  // MODO NORMAL: lupa a la izquierda; lápiz + micrófono a la derecha
  return (
    <>
      {/* Lupa — esquina inferior izquierda */}
      <button
        onClick={onSearch}
        onPointerDown={() => setPressingFAB("search")}
        onPointerUp={() => setPressingFAB(null)}
        onPointerLeave={() => setPressingFAB(null)}
        style={{
          position: "absolute", bottom: 24, left: 22, zIndex: 35,
          width: 32, height: 32, borderRadius: "50%", border: "none",
          background: isDark ? "#3A3A52" : "#94A3B8",
          cursor: "pointer",
          boxShadow: "0 3px 10px rgba(0,0,0,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: pressingFAB === "search" ? "scale(0.90)" : "scale(1)",
          opacity: pressingFAB === "search" ? 0.7 : 1,
          transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* Lápiz + Micrófono — esquina inferior derecha */}
      <div style={{ position: "absolute", bottom: 24, right: 22, zIndex: 35, display: "flex", alignItems: "center", gap: 10 }}>
        {pencilButton}
        {micButton}
      </div>
    </>
  );
}
