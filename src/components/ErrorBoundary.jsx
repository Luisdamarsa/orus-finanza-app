import { Component } from "react";
import { reportError } from "../services/reportError";

/**
 * ErrorBoundary.jsx
 *
 * Boundary reutilizable. Dos usos:
 *  - Sin `fallback` (o fallback undefined) → pantalla global "Oops! Algo salió mal"
 *    (para la app entera y para páginas que no cargan).
 *  - Con `fallback={null}` (o cualquier nodo) → aísla la sección: si esa sección falla,
 *    se oculta/colapsa y el resto de la app sigue viva.
 *
 * `resetKey`: cuando cambia, el boundary limpia el error y reintenta renderizar
 * (útil para recuperar una sección al cambiar de período/filtro sin recargar).
 */

// Pantalla Oops (fallback por defecto)
function OopsScreen() {
  return (
    <div style={{
      // position: fixed + inset 0 → centra respecto al viewport, ignorando el layout
      // de columna del #root (estilos sobrantes de la plantilla). Así queda centrado siempre.
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0D0D1A",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: 20, boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "400px", textAlign: "center" }}>
        <div style={{ fontSize: 100, marginBottom: 24, lineHeight: 1 }}>⚠️</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#F0EEFF", marginBottom: 8 }}>
          Oops! Algo salió mal
        </div>
        <div style={{ fontSize: 14, color: "#7B7A99", marginBottom: 32, lineHeight: 1.8 }}>
          No estamos seguros qué sucedió, pero ya estamos trabajando en solucionarlo.
        </div>
        <button onClick={() => window.location.reload()} style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          border: "none", background: "linear-gradient(135deg, #9B6DFF, #6366F1)",
          color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: "pointer", transition: "all 0.3s",
          boxShadow: "0 8px 24px rgba(155, 109, 255, 0.3)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Inténtalo de nuevo
        </button>
      </div>
    </div>
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    reportError(error, { errorInfo, boundary: true });
  }

  componentDidUpdate(prevProps) {
    // Recuperar automáticamente cuando cambia resetKey (ej. cambio de período)
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      // fallback definido (incluye null → ocultar) tiene prioridad; si no, pantalla Oops
      return this.props.fallback !== undefined ? this.props.fallback : <OopsScreen />;
    }
    return this.props.children;
  }
}
