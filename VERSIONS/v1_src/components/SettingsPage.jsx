import { useState } from "react";

export default function SettingsPage({ isDark, onBack, onBudgets, onProfile, showProfileSaveSuccess, showBudgetsSaveSuccess, showIncomes, setShowIncomes }) {
  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  const allItems = [
    { id: "perfil", icon: "👤", label: "Perfil", type: "menu" },
    { id: "categorias", icon: "🏷️", label: "Categorías", type: "menu" },
    { id: "presupuestos", icon: "💰", label: "Presupuestos", type: "menu" },
    { id: "ingresos", icon: "📈", label: "Mostrar Ingresos", type: "toggle", value: showIncomes, onChange: setShowIncomes },
    { id: "automatizacion", icon: "⚙️", label: "Automatización", type: "menu" },
    { id: "permisos", icon: "🔐", label: "Permisos", type: "menu" },
    { id: "informes", icon: "📊", label: "Informes", type: "menu" },
    { id: "acerca", icon: "ℹ️", label: "Acerca de ORUS Finanzas", type: "menu" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, position: "relative" }}>
      {/* Header fijo (top: 52, height: 52) */}
      <div style={{
        position: "absolute", top: 52, left: 0, right: 0, height: 52,
        background: t.bg, padding: "8px 22px", boxSizing: "border-box",
        borderBottom: `1px solid ${t.border}`, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              border: "none",
              background: isDark ? "#1E1E2E" : "#EEE9FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#C4C2E0" : "#6B7280"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>Atrás</span>
        </div>
      </div>

      {/* Sección de Título (top: 104, height: 60) */}
      <div style={{
        position: "absolute",
        top: 104,
        left: 0,
        right: 0,
        height: 60,
        background: t.bg,
        padding: "0 22px",
        boxSizing: "border-box",
        zIndex: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          color: t.text,
          flex: 1,
          textAlign: "center",
        }}>
          ⚙️ Configuración
        </div>
      </div>

      {/* Contenido scrolleable (top: 164) */}
      <div style={{
        position: "absolute", top: 164, left: 0, right: 0, bottom: 0,
        overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none",
        padding: "20px 22px 20px 22px", boxSizing: "border-box"
      }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* Menu Items + Toggles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
          {allItems.map((item, idx) => {
            // Si es un toggle, renderizar con switch
            if (item.type === "toggle") {
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 11, border: `1.5px solid ${t.border}`,
                  background: t.card,
                }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.text, flex: 1, textAlign: "left" }}>
                    {item.label}
                  </span>
                  {/* Toggle Switch */}
                  <button onClick={() => item.onChange(!item.value)} style={{
                    display: "inline-flex", alignItems: "center",
                    width: 44, height: 24, borderRadius: 12, border: "none",
                    background: item.value ? "#9B6DFF" : (isDark ? "#3D3D4D" : "#D5D3E8"),
                    cursor: "pointer",
                    padding: 2,
                    boxSizing: "border-box",
                    transition: "all 0.3s",
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#FFFFFF",
                      transition: "all 0.3s",
                      transform: item.value ? "translateX(20px)" : "translateX(0)",
                    }}></div>
                  </button>
                </div>
              );
            }
            // Si es un menu item, renderizar como botón
            return (
              <button key={item.id} onClick={() => {
                if (item.id === "perfil" && onProfile) onProfile();
                else if (item.id === "presupuestos" && onBudgets) onBudgets();
              }} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 11, border: `1.5px solid ${t.border}`,
                background: t.card, cursor: "pointer",
                transition: "all 0.15s",
                width: "100%",
              }} onMouseEnter={(e) => {
                e.target.style.background = isDark ? "#252535" : "#F5F3FF";
                e.target.style.borderColor = isDark ? "#3D3D4D" : "#D5D3E8";
              }} onMouseLeave={(e) => {
                e.target.style.background = t.card;
                e.target.style.borderColor = t.border;
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: t.text, flex: 1, textAlign: "left" }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 12, color: t.sub }}>→</span>
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: "center", color: t.sub, fontSize: 11, paddingBottom: 20 }}>
          <div>ORUS Finanzas v1.0.0</div>
          <div style={{ marginTop: 4 }}>© 2026 ORUS. Todos los derechos reservados.</div>
        </div>
      </div>

      {/* 🆕 Gradiente de desvanecimiento flotante */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.9) 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(248, 247, 255, 0.4) 40%, rgba(248, 247, 255, 0.9) 100%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      {/* 🆕 Popup flotante de Perfil guardado */}
      {showProfileSaveSuccess && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: 22,
            right: 22,
            maxWidth: "calc(100% - 44px)",
            padding: "14px 16px",
            borderRadius: 12,
            background: "#22C55E33", // Verde transparente
            border: `1px solid #22C55E66`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "slideInUp 0.3s ease",
            zIndex: 999,
          }}>
          <span style={{ fontSize: 18 }}>✓</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#16A34A",
            }}>
            Cambios en el Perfil guardados
          </span>
        </div>
      )}

      {/* 🆕 Popup flotante de Presupuestos guardados */}
      {showBudgetsSaveSuccess && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: 22,
            right: 22,
            maxWidth: "calc(100% - 44px)",
            padding: "14px 16px",
            borderRadius: 12,
            background: "#22C55E33", // Verde transparente
            border: `1px solid #22C55E66`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "slideInUp 0.3s ease",
            zIndex: 999,
          }}>
          <span style={{ fontSize: 18 }}>✓</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#16A34A",
            }}>
            Cambios en Presupuestos guardados
          </span>
        </div>
      )}
    </div>
  );
}
