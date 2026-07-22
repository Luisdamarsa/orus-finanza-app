import { useState, useRef, useEffect } from "react";
import { PILLARS } from "../constants";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";
import { getCategoryName } from "../utils/categoryUtils";
import LoadingWrapper from "./LoadingWrapper";
import { MenuListSkeleton } from "./LoadingSkeleton";

/**
 * CategoriesPage.jsx
 *
 * Página de administración de categorías
 * Muestra todas las categorías agrupadas por pilar
 * Permite agregar nuevas categorías
 *
 * Props:
 *   isDark - Tema oscuro
 *   onBack - Callback para volver atrás
 *   onAddCategory - Callback para abrir AddCategoryPage (nueva)
 *   onEditCategory - Callback para editar categoría (categoryName, pillarId)
 *   categories - {pillarId: [cat1, cat2, ...]}
 */
export default function CategoriesPage({
  isDark,
  onBack,
  onAddCategory,
  onEditCategory,
  categories = {},
  tab = "gastos",
  setTab,
}) {
  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  // 🆕 Ref para medir altura de descripción dinámicamente
  const descriptionRef = useRef(null);
  const [contentTop, setContentTop] = useState(220);
  // 🆕 Hooks para animación de press
  const pressBack = usePress();
  const pressAdd = usePress();
  // 🆕 Estado para rastrear qué categoría está siendo presionada
  const [pressingCategoryId, setPressingCategoryId] = useState(null);
  // 🆕 Tab activa ("gastos"/"ingresos") viene de props (persiste al ir/volver de crear categoría)
  const incomeCategories = categories["ingreso"] || [];

  // 🆕 Estado de loading para skeleton
  const [isLoading] = useState(false);

  // 🆕 Medir altura dinámicamente de la descripción
  useEffect(() => {
    if (descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.offsetHeight;
      // Descripción comienza en top: 164, más su altura, más padding bottom 6px
      const newContentTop = 164 + descriptionHeight + 6;
      setContentTop(newContentTop);
    }
  }, []);

  return (
    <>
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      title="🏷️ Categorías"
      pressBack={pressBack}
      description={
        <>
          {/* Descripción 1 */}
          <div style={{
            fontSize: 13,
            color: t.sub,
            marginBottom: 4,
            lineHeight: 1.4,
            fontWeight: 400,
            textAlign: "left",
          }}>
            Organiza tus movimientos en categorías. Los gastos van por pilar; los ingresos, por fuente.
          </div>

          {/* Descripción 2 (Ejemplos) */}
          <div style={{
            fontSize: 12,
            color: t.sub,
            opacity: 0.75,
            fontStyle: "italic",
            textAlign: "left",
          }}>
            Ej.: "Arriendo" en Fijos (gasto) · "Sueldo" en Ingresos.
          </div>
        </>
      }
      descriptionRef={descriptionRef}
      contentTopOffset={contentTop}
    >
      {/* LoadingWrapper para mostrar skeleton mientras carga */}
      <LoadingWrapper
        isLoading={isLoading}
        skeleton={<MenuListSkeleton isDark={isDark} itemCount={12} />}
        isDark={isDark}
      >
          <>
            {/* Tabs: Gastos / Ingresos */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[["gastos", "Gastos"], ["ingresos", "Ingresos"]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  style={{ flex: 1, padding: "4px 0", borderRadius: 10, border: `1.5px solid ${tab === id ? "#9B6DFF" : t.border}`, background: tab === id ? "#9B6DFF22" : "transparent", color: tab === id ? "#9B6DFF" : t.sub, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {label}
                </button>
              ))}
            </div>

            {tab === "gastos" && (
            <div>
            {/* Pilares y sus categorías (carga desde abajo con .orus-rise) */}
            {PILLARS.map((pillar, pillarIdx) => {
          const pillarCategories = categories[pillar.id] || [];

          return (
            <div key={pillar.id} className="orus-rise" style={{ marginBottom: 16, animationDelay: `${pillarIdx * 0.1}s` }}>
              {/* Título del Pilar - Con tag/badge (icono + nombre dentro) — ancho completo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                  padding: "0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: pillar.color + "22",
                    border: `1px solid ${pillar.color}44`,
                    width: "100%",
                  }}
                >
                  <span style={{ fontSize: 20.7 }}>{pillar.icon}</span>
                  <span style={{ fontSize: 16.1, fontWeight: 700, color: pillar.color, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {pillar.label}
                  </span>
                </div>
              </div>

              {/* Categorías del Pilar */}
              <div
                style={{
                  background: "transparent",
                  border: `1px solid ${t.border}`,
                  borderRadius: 12,
                  padding: 0,
                  marginBottom: 8,
                  overflow: "hidden",
                }}
              >
                {pillarCategories.length > 0 ? (
                  pillarCategories.map((catId, idx) => {
                    const isPressingThisCategory = pressingCategoryId === catId;
                    return (
                      <button
                        key={catId}
                        onClick={() => onEditCategory(catId, pillar.id)}
                        onPointerDown={() => setPressingCategoryId(catId)}
                        onPointerUp={() => setPressingCategoryId(null)}
                        onPointerLeave={() => setPressingCategoryId(null)}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          borderBottom: idx < pillarCategories.length - 1 ? `1px solid ${t.border}` : "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          color: t.text,
                          background: isPressingThisCategory ? (isDark ? "#252538" : "#F0EFF8") : "transparent",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          textAlign: "left",
                          transform: isPressingThisCategory ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                          boxShadow: isPressingThisCategory ? "inset 0 2px 4px rgba(0, 0, 0, 0.2)" : "none",
                          transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isPressingThisCategory) {
                            e.currentTarget.style.background = isDark ? "#252538" : "#F0EFF8";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isPressingThisCategory) {
                            e.currentTarget.style.background = "transparent";
                          }
                        }}
                      >
                        <span>{getCategoryName(catId)}</span>
                      </button>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "12px 16px",
                      fontSize: 13,
                      color: t.sub,
                      fontStyle: "italic",
                    }}
                  >
                    Sin categorías
                  </div>
                )}
              </div>
            </div>
          );
            })}
            </div>
            )}

            {tab === "ingresos" && (
              <div>
                <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
                  {incomeCategories.length > 0 ? (
                    incomeCategories.map((catId, idx) => (
                      <button
                        key={catId}
                        onClick={() => onEditCategory(catId, "ingreso")}
                        onPointerDown={() => setPressingCategoryId(catId)}
                        onPointerUp={() => setPressingCategoryId(null)}
                        onPointerLeave={() => setPressingCategoryId(null)}
                        style={{ width: "100%", padding: "12px 16px", borderBottom: idx < incomeCategories.length - 1 ? `1px solid ${t.border}` : "none", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.text, background: pressingCategoryId === catId ? (isDark ? "#252538" : "#F0EFF8") : "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                        <span style={{ fontSize: 15 }}>💵</span>
                        <span>{getCategoryName(catId)}</span>
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: "18px 16px", fontSize: 13, color: t.sub, fontStyle: "italic", textAlign: "center" }}>
                      Aún no tienes categorías de ingreso. Toca “+ Añadir categoría”.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
      </LoadingWrapper>
    </PageLayout>

    {/* Botón Flotante Añadir Categoría */}
    <div style={{ position: "fixed", bottom: 24, right: 22 }}>
      <button
        onClick={() => onAddCategory(tab === "ingresos")}
        {...pressAdd.handlers}
        style={{
          padding: "12px 18px",
          borderRadius: 20,
          border: "none",
          background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: pressAdd.pressing ? 0.9 : 1,
          fontSize: 14,
          color: "white",
          fontWeight: 700,
          whiteSpace: "nowrap",
          ...pressAdd.getPressStyle(),
        }}
        onMouseEnter={(e) => {
          if (!pressAdd.pressing) {
            e.currentTarget.style.transform = "scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!pressAdd.pressing) {
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        <span style={{ fontSize: 18 }}>+</span>
        <span>Añadir categoría</span>
      </button>
    </div>
    </>
  );
}
