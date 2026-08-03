import { useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";

export default function SettingsPage({
  onBack,
  onBudgets,
  onProfile,
  onCategories,
  onShowIncomes,
  showIncomes,
  setShowIncomes,
  onAutomatizaciones,
  onTerms,
  onPrivacy,
  onAbout,
  onPermissions,
  onSubscription,
  onPreferences,
  onInformes,
  onLogout,
}) {
  const { isDark } = useTheme();
  const pressBack = usePress();
  const [pressingButton, setPressingButton] = useState(null);

  // Íconos SVG
  const iconSVG = {
    perfil: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>,
    categorias: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9h6v6l-9 9-6-6z"/><circle cx="15" cy="9" r="1"/></svg>,
    presupuestos: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></svg>,
    ingresos: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15l5-5 4 3 6-7"/></svg>,
    plan: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l3 6-9 12L3 9z"/><path d="M9 3l3 6 3-6M3 9h18"/></svg>,
    automatizacion: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/></svg>,
    permisos: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6l7-3z"/></svg>,
    informes: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>,
    preferencias: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h13"/><circle cx="15" cy="7" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
    acerca: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>,
  };

  // Configuración de filas con badges
  const rows = [
    { id: "perfil", label: "Perfil", iconKey: "perfil", badgeBg: "rgba(155,109,255,0.16)", badgeColor: "#9B6DFF", onClick: onProfile },
    { id: "categorias", label: "Categorías", iconKey: "categorias", badgeBg: "rgba(253,230,138,0.16)", badgeColor: "#FDE68A", onClick: onCategories },
    { id: "presupuestos", label: "Presupuestos", iconKey: "presupuestos", badgeBg: "rgba(253,230,138,0.16)", badgeColor: "#FDE68A", onClick: onBudgets },
    { id: "ingresos", label: "Mostrar Ingresos", iconKey: "ingresos", badgeBg: "rgba(255,255,255,0.07)", badgeColor: "#8B87A3", isToggle: true },
    { id: "plan", label: "Mi Plan", iconKey: "plan", badgeBg: "rgba(255,255,255,0.07)", badgeColor: "#8B87A3", onClick: onSubscription },
    { id: "automatizacion", label: "Automatizaciones", iconKey: "automatizacion", badgeBg: "rgba(253,230,138,0.16)", badgeColor: "#FDE68A", onClick: onAutomatizaciones },
    { id: "permisos", label: "Permisos", iconKey: "permisos", badgeBg: "rgba(253,230,138,0.16)", badgeColor: "#FDE68A", onClick: onPermissions },
    { id: "informes", label: "Informes", iconKey: "informes", badgeBg: "rgba(255,255,255,0.07)", badgeColor: "#8B87A3", onClick: onInformes },
    { id: "preferencias", label: "Preferencias", iconKey: "preferencias", badgeBg: "rgba(255,255,255,0.07)", badgeColor: "#8B87A3", onClick: onPreferences },
    { id: "acerca", label: "Acerca de ORUS Finanzas", iconKey: "acerca", badgeBg: "rgba(255,255,255,0.07)", badgeColor: "#8B87A3", onClick: onAbout },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", padding: "26px 22px 50px", background: "#000000" }}>
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
          color: "#8B87A3",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          padding: "6px 0",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        Atrás
      </button>

      {/* Título */}
      <div style={{ fontSize: 19, fontWeight: 800, color: "#F5F3FF", textAlign: "center", marginTop: 8 }}>
        Configuración
      </div>

      {/* Lista de filas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 22 }}>
        {rows.map((row) => {
          const isPressing = pressingButton === row.id;

          if (row.isToggle) {
            return (
              <div
                key={row.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "15px 16px",
                  borderRadius: 16,
                  background: "linear-gradient(155deg,#211d2c 0%,#141220 100%)",
                  boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 11,
                      background: row.badgeBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: row.badgeColor,
                    }}>
                    {iconSVG[row.iconKey]}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#F5F3FF" }}>
                    {row.label}
                  </span>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => setShowIncomes(!showIncomes)}
                  onPointerDown={() => setPressingButton(row.id)}
                  onPointerUp={() => setPressingButton(null)}
                  onPointerLeave={() => setPressingButton(null)}
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 13,
                    border: "none",
                    background: showIncomes ? "#9B6DFF" : "rgba(255,255,255,0.07)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.18s ease",
                  }}>
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      left: showIncomes ? 20 : 2,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
                      transition: "left 0.18s ease",
                    }}
                  />
                </button>
              </div>
            );
          }

          return (
            <button
              key={row.id}
              onClick={() => row.onClick && row.onClick()}
              onPointerDown={() => setPressingButton(row.id)}
              onPointerUp={() => setPressingButton(null)}
              onPointerLeave={() => setPressingButton(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px 16px",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(155deg,#211d2c 0%,#141220 100%)",
                boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                cursor: "pointer",
                width: "100%",
                transform: isPressing ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                opacity: isPressing ? 0.7 : 1,
                transition: "all 0.1s ease",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 11,
                    background: row.badgeBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: row.badgeColor,
                  }}>
                  {iconSVG[row.iconKey]}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#F5F3FF" }}>
                  {row.label}
                </span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B87A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", color: "#8B87A3", fontSize: 11, paddingTop: 28, marginTop: 28 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
          <span onClick={onTerms} style={{ color: "#9B6DFF", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
            Términos y Condiciones
          </span>
          <span onClick={onPrivacy} style={{ color: "#9B6DFF", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
            Términos de Privacidad
          </span>
        </div>
        <div>ORUS Finanzas v1.0.0</div>
        <div style={{ marginTop: 4 }}>© 2026 ORUS. Todos los derechos reservados.</div>
      </div>
    </div>
  );
}
