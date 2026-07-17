import { useState } from "react";
import { usePress } from "../hooks/usePress";
import PageHeader from "./PageHeader";
import { PAGE_HEADERS } from "../data/pageHeaders";

/**
 * ShowIncomesPage.jsx
 *
 * Página para gestionar la visualización de ingresos
 * Muestra descripción y toggle para activar/desactivar ingresos
 *
 * Props:
 *   isDark - Tema oscuro
 *   onBack - Callback para volver atrás
 *   showIncomesEnabled - Estado actual del toggle
 *   onToggleShowIncomes - Callback cuando cambia el toggle
 */
export default function ShowIncomesPage({
  isDark,
  onBack,
  showIncomesEnabled,
  onToggleShowIncomes,
}) {
  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  // 🆕 Estado para el top del contenido dinámico
  const [contentTop, setContentTop] = useState(220);
  // 🆕 Hook para animación de press en botón de atrás
  const pressBack = usePress();

  // 🆕 Callback cuando PageHeader notifica el cambio de altura de descripción
  const handleDescriptionHeightChange = (height) => {
    const newContentTop = 164 + height + 6;
    setContentTop(newContentTop);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, position: "relative" }}>
      {/* Header fijo (top: 52, height: 52) */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          height: 52,
          background: t.bg,
          padding: "8px 22px",
          boxSizing: "border-box",
          borderBottom: `1px solid ${t.border}`,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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

      {/* PageHeader Component */}
      <PageHeader
        icon={PAGE_HEADERS.showIncomes.icon}
        title={PAGE_HEADERS.showIncomes.title}
        description={PAGE_HEADERS.showIncomes.description}
        hint={PAGE_HEADERS.showIncomes.hint}
        isDark={isDark}
        onDescriptionHeightChange={handleDescriptionHeightChange}
        showTitleToggle={true}
        toggleValue={showIncomesEnabled}
        onToggleChange={onToggleShowIncomes}
      />

      {/* Contenido scrolleable (vacío en esta versión) */}
      <div
        style={{
          position: "absolute",
          top: contentTop,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          padding: "20px 22px 40px 22px",
          boxSizing: "border-box",
        }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </div>
  );
}
