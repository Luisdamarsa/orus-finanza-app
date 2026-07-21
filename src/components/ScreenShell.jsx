/**
 * ScreenShell.jsx
 *
 * Envoltorio común de las pantallas full-screen del app: fondo oscuro + centrado
 * + contenedor interno de ancho máx 500px. Antes se repetía inline en cada rama
 * de pantalla de App.jsx.
 *
 * Uso:  <ScreenShell bg={t.bg}><MiPagina /></ScreenShell>
 */
export default function ScreenShell({ children, bg }) {
  // Bezel exterior según el tema: en día el bg interno es claro (#F8F7FF/#FFFFFF) → bezel claro.
  const outer = (bg === "#F8F7FF" || bg === "#FFFFFF") ? "#E9E7F5" : "#0D0D1A";
  return (
    <div style={{ width: "100vw", height: "100vh", background: outer, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: bg, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}
