import { useState } from "react";
import { PILLARS } from "../constants";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { getCategoryName } from "../utils/categoryUtils";
import LoadingWrapper from "./LoadingWrapper";
import { MenuListSkeleton } from "./LoadingSkeleton";
import { DARK, LIGHT } from "../constants/tokens";

export default function CategoriesPage({
  onBack,
  onAddCategory,
  onEditCategory,
  categories = {},
  tab = "gastos",
  setTab,
}) {
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;

  const t = {
    bg: tokens.bg,
    surface: tokens.surfaceFlat,
    raised: isDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    border: tokens.border,
    text: tokens.text,
    sub: tokens.sub,
    accent: "#9B6DFF",
    shadowSm: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  const pillarSoftBg = {
    fijos: isDark ? "rgba(147, 197, 253, 0.16)" : "rgba(37, 99, 235, 0.14)",
    deuda: isDark ? "rgba(252, 165, 165, 0.16)" : "rgba(225, 29, 72, 0.14)",
    ahorro: isDark ? "rgba(134, 239, 172, 0.16)" : "rgba(22, 163, 74, 0.14)",
    ocio: isDark ? "rgba(196, 181, 253, 0.16)" : "rgba(147, 51, 234, 0.14)",
    varios: isDark ? "rgba(253, 230, 138, 0.16)" : "rgba(217, 119, 6, 0.14)",
  };

  const pressAdd = usePress();
  const [pressingCategoryId, setPressingCategoryId] = useState(null);
  const incomeCategories = categories["ingreso"] || [];
  const [isLoading] = useState(false);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* Header fijo */}
        <HeaderBar
          onBack={onBack}
          pageIcon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l9-9h6v6l-9 9-6-6z"/>
              <circle cx="15" cy="9" r="1"/>
            </svg>
          }
          pageTitle="Categorías"
          isDark={isDark}
        />

        {/* Contenido scrollable */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 90px", boxSizing: "border-box" }}>

        <div style={{ fontSize: 12, fontWeight: 600, color: t.sub, textAlign: "center", lineHeight: 1.5, marginBottom: 0, paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
          Organiza tus movimientos en categorías. Los gastos van por pilar; los ingresos, por fuente.
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 0, background: t.raised, borderRadius: 16, padding: 5, boxShadow: t.shadowSm }}>
          {[["gastos", "Gastos"], ["ingresos", "Ingresos"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 12,
                border: "none",
                background: tab === id ? t.accent : "transparent",
                color: tab === id ? "#fff" : t.sub,
                fontSize: "12.5px",
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "Manrope",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <LoadingWrapper isLoading={isLoading} skeleton={<MenuListSkeleton isDark={isDark} itemCount={12} />} isDark={isDark}>
          {tab === "gastos" && (
            <div style={{ marginTop: 22 }}>
              {PILLARS.map((pillar) => {
                const pillarCategories = categories[pillar.id] || [];
                return (
                  <div key={pillar.id} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 14, background: pillarSoftBg[pillar.id] || t.raised, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{pillar.icon}</span>
                      <span style={{ fontSize: "12.5px", fontWeight: 800, color: t.text, textTransform: "uppercase", letterSpacing: ".4px" }}>
                        {pillar.label}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {pillarCategories.length > 0 ? (
                        pillarCategories.map((catId) => (
                          <button
                            key={catId}
                            onClick={() => onEditCategory(catId, pillar.id)}
                            onPointerDown={() => setPressingCategoryId(catId)}
                            onPointerUp={() => setPressingCategoryId(null)}
                            onPointerLeave={() => setPressingCategoryId(null)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "13px 16px",
                              borderRadius: 14,
                              border: "none",
                              background: isDark
                                ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)"
                                : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
                              color: t.text,
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: "pointer",
                              boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                              fontFamily: "Manrope",
                              transform: pressingCategoryId === catId ? "scale(0.98) translateY(1px)" : "scale(1)",
                              transition: "all 0.1s",
                            }}
                          >
                            {getCategoryName(catId)}
                          </button>
                        ))
                      ) : (
                        <div style={{ padding: "12px 16px", fontSize: 13, color: t.sub, fontStyle: "italic", textAlign: "center" }}>
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
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 8 }}>
              {incomeCategories.length > 0 ? (
                incomeCategories.map((catId) => (
                  <button
                    key={catId}
                    onClick={() => onEditCategory(catId, "ingreso")}
                    onPointerDown={() => setPressingCategoryId(catId)}
                    onPointerUp={() => setPressingCategoryId(null)}
                    onPointerLeave={() => setPressingCategoryId(null)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "13px 16px",
                      borderRadius: 14,
                      border: "none",
                      background: isDark
                        ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)"
                        : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
                      color: t.text,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                      fontFamily: "Manrope",
                      transform: pressingCategoryId === catId ? "scale(0.98) translateY(1px)" : "scale(1)",
                      transition: "all 0.1s",
                    }}
                  >
                    {getCategoryName(catId)}
                  </button>
                ))
              ) : (
                <div style={{ padding: "18px 16px", fontSize: 13, color: t.sub, fontStyle: "italic", textAlign: "center" }}>
                  Aun no tienes categorias de ingreso. Toca "+ Anadir categoria".
                </div>
              )}
            </div>
          )}
        </LoadingWrapper>
      </div>

      <div style={{ position: "fixed", bottom: 24, right: 24 }}>
        <button
          onClick={() => onAddCategory(tab === "ingresos")}
          {...pressAdd.handlers}
          style={{
            padding: "14px 20px",
            borderRadius: 18,
            border: "none",
            background: "linear-gradient(155deg,#B18CFF,#8B5CF6)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 16px 28px -10px rgba(139,92,246,0.6)",
            fontFamily: "Manrope",
            opacity: pressAdd.pressing ? 0.9 : 1,
            transform: pressAdd.pressing ? "scale(0.95)" : "scale(1)",
            transition: "all 0.1s",
          }}
        >
          <span style={{ fontSize: 14 }}>+</span>
          <span>Anadir categoria</span>
        </button>
        </div>
      </div>
    </>
  );
}
