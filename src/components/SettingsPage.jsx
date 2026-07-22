import { useState } from "react";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";
import LoadingWrapper from "./LoadingWrapper";
import { MenuListSkeleton } from "./LoadingSkeleton";

export default function SettingsPage({ isDark, onBack, onBudgets, onProfile, onCategories, onShowIncomes, showIncomes, setShowIncomes, onAutomatizaciones, onTerms, onPrivacy, onAbout, onPermissions, onSubscription, onPreferences }) {
  // 🆕 Hook para animación de press en botón de atrás
  const pressBack = usePress();
  // 🆕 Estado para trackear qué botón está siendo presionado (para menú e items)
  const [pressingButton, setPressingButton] = useState(null);
  // 🆕 Estado de loading para skeleton
  const [isLoading] = useState(false);

  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  const allItems = [
    { id: "perfil", icon: "👤", label: "Perfil", type: "menu" },
    { id: "categorias", icon: "🏷️", label: "Categorías", type: "menu" },
    { id: "presupuestos", icon: "💰", label: "Presupuestos", type: "menu" },
    { id: "ingresos", icon: "📈", label: "Mostrar Ingresos", type: "toggle", value: showIncomes, onChange: setShowIncomes },
    { id: "plan", icon: "💎", label: "Mi Plan", type: "menu" },
    { id: "automatizacion", icon: "⚡", label: "Automatizaciones", type: "menu" },
    { id: "permisos", icon: "🔐", label: "Permisos", type: "menu" },
    { id: "informes", icon: "📊", label: "Informes", type: "menu" },
    { id: "preferencias", icon: "🎛️", label: "Preferencias", type: "menu" },
    { id: "acerca", icon: "ℹ️", label: "Acerca de ORUS Finanzas", type: "menu" },
  ];

  return (
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      title="⚙️ Configuración"
      pressBack={pressBack}
    >
      {/* LoadingWrapper para mostrar skeleton mientras carga */}
      <LoadingWrapper
        isLoading={isLoading}
        skeleton={<MenuListSkeleton isDark={isDark} itemCount={8} />}
        isDark={isDark}
      >
        <>
          {/* Menu Items + Toggles — cada item sube uno por uno */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
            {allItems.map((item, idx) => {
              // Si es un toggle, renderizar con switch clickeable
              if (item.type === "toggle") {
                const isPressingToggleRow = pressingButton === "toggle-row-" + item.id;
                return (
                  <div
                    key={item.id}
                    className="orus-rise"
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
                      background: isPressingToggleRow ? "rgba(0, 0, 0, 0.15)" : t.card,
                      cursor: "pointer",
                      userSelect: "none",
                      transform: isPressingToggleRow ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                      boxShadow: isPressingToggleRow ? "inset 0 2px 6px rgba(0, 0, 0, 0.2)" : "none",
                      transition: item.id === "ingresos" ? "none" : "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
                      animationDelay: `${idx * 0.05}s`,
                    }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: t.text, flex: 1, textAlign: "left" }}>
                      {item.label}
                    </span>
                    {/* Toggle Switch */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
                        transition: item.id === "ingresos" ? "none" : "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          transform: item.value ? "translateX(20px)" : "translateX(0)",
                          transition: item.id === "ingresos" ? "none" : "transform 0.2s",
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
                  className="orus-rise"
                  onClick={() => {
                    if (item.id === "perfil" && onProfile) onProfile();
                    else if (item.id === "presupuestos" && onBudgets) onBudgets();
                    else if (item.id === "categorias" && onCategories) onCategories();
                    else if (item.id === "automatizacion" && onAutomatizaciones) onAutomatizaciones();
                    else if (item.id === "acerca" && onAbout) onAbout();
                    else if (item.id === "permisos" && onPermissions) onPermissions();
                    else if (item.id === "plan" && onSubscription) onSubscription();
                    else if (item.id === "preferencias" && onPreferences) onPreferences();
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
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    if (pressingButton !== item.id) {
                      e.currentTarget.style.background = isDark ? "#252535" : "#F5F3FF";
                      e.currentTarget.style.borderColor = isDark ? "#3D3D4D" : "#D5D3E8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pressingButton !== item.id) {
                      e.currentTarget.style.background = t.card;
                      e.currentTarget.style.borderColor = t.border;
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

          {/* Footer Info — efecto de carga desde abajo, después del último item */}
          <div className="orus-rise" style={{ textAlign: "center", color: t.sub, fontSize: 11, paddingBottom: 20, animationDelay: `${allItems.length * 0.05}s` }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
              <span onClick={onTerms} style={{ color: "#9B6DFF", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Términos y Condiciones</span>
              <span onClick={onPrivacy} style={{ color: "#9B6DFF", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Términos de Privacidad</span>
            </div>
            <div>ORUS Finanzas v1.0.0</div>
            <div style={{ marginTop: 4 }}>© 2026 ORUS. Todos los derechos reservados.</div>
          </div>
        </>
      </LoadingWrapper>
    </PageLayout>
  );
}
