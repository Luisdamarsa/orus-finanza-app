import { useState } from "react";
import { usePress } from "../hooks/usePress";
import LoadingWrapper from "./LoadingWrapper";
import { MenuListSkeleton } from "./LoadingSkeleton";

export default function SettingsPage({ isDark, onBack, onBudgets, onProfile, onCategories, onShowIncomes, showIncomes, setShowIncomes }) {
  // 🆕 Hook para animación de press en botón de atrás
  const pressBack = usePress();
  // 🆕 Estado para trackear qué botón está siendo presionado (para menú e items)
  const [pressingButton, setPressingButton] = useState(null);
  // 🆕 Estado de loading para skeleton
  const [isLoading, setIsLoading] = useState(false);

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
            {...pressBack.handlers}
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
              ...pressBack.getPressStyle(),
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

        {/* 🆕 LoadingWrapper para mostrar skeleton mientras carga */}
        <LoadingWrapper
          isLoading={isLoading}
          skeleton={<MenuListSkeleton isDark={isDark} itemCount={8} />}
          isDark={isDark}
        >
          <>
            {/* Menu Items + Toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
          {allItems.map((item, idx) => {
            // Si es un toggle, renderizar con switch clickeable
            if (item.type === "toggle") {
              const isPressingToggleRow = pressingButton === "toggle-row-" + item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    // Si es el item de ingresos, navegar a la página
                    if (item.id === "ingresos" && onShowIncomes) {
                      onShowIncomes();
                    }
                  }}
                  onPointerDown={() => setPressingButton("toggle-row-" + item.id)}
                  onPointerUp={() => setPressingButton(null)}
                  onPointerLeave={() => setPressingButton(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 11,
                    border: `1.5px solid ${t.border}`,
                    background: isPressingToggleRow ? "rgba(0, 0, 0, 0.15)" : t.card, // Oscurecer al presionar como otros botones
                    cursor: "pointer",
                    userSelect: "none",
                    transform: isPressingToggleRow ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                    boxShadow: isPressingToggleRow ? "inset 0 2px 6px rgba(0, 0, 0, 0.2)" : "none",
                    transition: item.id === "ingresos" ? "none" : "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)", // Inmediato para Mostrar Ingresos
                  }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.text, flex: 1, textAlign: "left" }}>
                    {item.label}
                  </span>
                  {/* Toggle Switch */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevenir que el click en toggle navegue
                      item.onChange(!item.value);
                    }}
                    onPointerDown={() => setPressingButton("toggle-" + item.id)}
                    onPointerUp={() => setPressingButton(null)}
                    onPointerLeave={() => setPressingButton(null)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      border: "none",
                      background: item.value ? "#9B6DFF" : isDark ? "#3D3D4D" : "#D5D3E8",
                      cursor: "pointer",
                      padding: 2,
                      boxSizing: "border-box",
                      transform: pressingButton === "toggle-" + item.id ? "scale(0.92)" : "scale(1)",
                      opacity: pressingButton === "toggle-" + item.id ? 0.8 : 1,
                      transition: item.id === "ingresos" ? "none" : "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)", // Inmediato para Mostrar Ingresos
                    }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#FFFFFF",
                        transform: item.value ? "translateX(20px)" : "translateX(0)",
                      }}
                    />
                  </button>
                </div>
              );
            }
            // Si es un menu item, renderizar como botón
            const isPressingThisButton = pressingButton === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "perfil" && onProfile) onProfile();
                  else if (item.id === "presupuestos" && onBudgets) onBudgets();
                  else if (item.id === "categorias" && onCategories) onCategories();
                }}
                onPointerDown={() => setPressingButton(item.id)}
                onPointerUp={() => setPressingButton(null)}
                onPointerLeave={() => setPressingButton(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 11, border: `1.5px solid ${t.border}`,
                  background: isPressingThisButton ? "rgba(0, 0, 0, 0.15)" : t.card,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  width: "100%",
                  transform: isPressingThisButton ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                  boxShadow: isPressingThisButton ? "inset 0 2px 6px rgba(0, 0, 0, 0.2)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (pressingButton !== item.id) {
                    e.target.style.background = isDark ? "#252535" : "#F5F3FF";
                    e.target.style.borderColor = isDark ? "#3D3D4D" : "#D5D3E8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (pressingButton !== item.id) {
                    e.target.style.background = t.card;
                    e.target.style.borderColor = t.border;
                  }
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
          </>
        </LoadingWrapper>
      </div>


    </div>
  );
}
