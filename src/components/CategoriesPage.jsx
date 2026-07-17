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
            Organiza tus gastos en categorías personalizadas dentro de cada pilar financiero.
          </div>

          {/* Descripción 2 (Ejemplos) */}
          <div style={{
            fontSize: 12,
            color: t.sub,
            opacity: 0.75,
            fontStyle: "italic",
            textAlign: "left",
          }}>
            Ejemplos: Edita "Arriendo" en Fijos o Cine en Ocio
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
            {/* Pilares y sus categorías */}
            {PILLARS.map((pillar) => {
          const pillarCategories = categories[pillar.id] || [];

          return (
            <div key={pillar.id} style={{ marginBottom: 16 }}>
              {/* Título del Pilar - Con tag/badge (icono + nombre dentro) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                  padding: "0 12px",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: pillar.color + "22",
                    border: `1px solid ${pillar.color}44`,
                    marginLeft: "-12px",
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
        </>
      </LoadingWrapper>
    </PageLayout>

    {/* Botón Flotante Añadir Categoría */}
    <div style={{ position: "fixed", bottom: 24, right: 22 }}>
      <button
        onClick={onAddCategory}
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
