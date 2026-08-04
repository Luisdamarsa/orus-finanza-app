import { useState, useEffect, useRef } from "react";
import { PILLARS, ALL_CATS } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { usePopup } from "../services/PopupService";
import { useCategories } from "../hooks/useCategories";
import { useBudgets } from "../hooks/useBudgets";
import { getCategoryName } from "../utils/categoryUtils";
import { userStorage } from "../utils/userStorage";
import LoadingWrapper from "./LoadingWrapper";
import { MenuListSkeleton } from "./LoadingSkeleton";
import HeaderBar from "./HeaderBar";

export default function BudgetsPage({
  onBack,
  onSave,
  initialBudgets,
  categories: categoriesFromProps,
  editPillarBudget,
  editCategoryBudget,
}) {
  const { isDark } = useTheme();
  const popup = usePopup();
  const { categories: categoriesFromHook } = useCategories();
  const categories = categoriesFromProps || categoriesFromHook;
  const { categoryBudgets, handleCategoryBudgetChange, updateWithNewCategories } = useBudgets();

  const t = isDark
    ? {
        bg: "#000000",
        surface: "linear-gradient(155deg,#211d2c 0%,#141220 100%)",
        surfaceFlat: "#1A1725",
        border: "rgba(255,255,255,0.07)",
        text: "#F5F3FF",
        sub: "#8B87A3",
        accent: "#9B6DFF",
        accentSoft: "rgba(155,109,255,0.2)",
        shadowSm: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
      }
    : {
        bg: "#F3F1FA",
        surface: "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
        surfaceFlat: "#FFFFFF",
        border: "rgba(30,20,60,0.08)",
        text: "#1A1830",
        sub: "#726E8C",
        accent: "#7C4DFF",
        accentSoft: "rgba(124,77,255,0.15)",
        shadowSm: "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
      };

  const pillarSoftBg = {
    fijos: isDark ? "rgba(147, 197, 253, 0.16)" : "rgba(147, 197, 253, 0.14)",
    deuda: isDark ? "rgba(252, 165, 165, 0.16)" : "rgba(252, 165, 165, 0.14)",
    ahorro: isDark ? "rgba(134, 239, 172, 0.16)" : "rgba(134, 239, 172, 0.14)",
    ocio: isDark ? "rgba(196, 181, 253, 0.16)" : "rgba(196, 181, 253, 0.14)",
    varios: isDark ? "rgba(253, 230, 138, 0.16)" : "rgba(253, 230, 138, 0.14)",
  };

  const initialBudgetAlertEnabled = userStorage.get("budgetAlertEnabled", true);

  const [editedBudgets, setEditedBudgets] = useState(initialBudgets || {});
  const [hasChanged, setHasChanged] = useState(false);
  const [expandedPillars, setExpandedPillars] = useState({});
  const [isLoading] = useState(false);
  const [editingInputs, setEditingInputs] = useState({});
  const [budgetAlertEnabled, setBudgetAlertEnabled] = useState(initialBudgetAlertEnabled);

  useEffect(() => {
    const pillarChanged = Object.keys(initialBudgets || {}).some(
      key => (editedBudgets[key] || 0) !== (initialBudgets[key] || 0)
    );
    const categoryChanged = Object.keys(categoryBudgets || {}).some(
      key => categoryBudgets[key] !== null && categoryBudgets[key] !== (ALL_CATS.find(c => c.id === key)?.budget || 0)
    );
    const alertChanged = budgetAlertEnabled !== initialBudgetAlertEnabled;
    setHasChanged(pillarChanged || categoryChanged || alertChanged);
  }, [editedBudgets, categoryBudgets, initialBudgets, budgetAlertEnabled, initialBudgetAlertEnabled]);

  useEffect(() => {
    updateWithNewCategories(categories);
  }, [categories, updateWithNewCategories]);

  const validateBudgetInput = (value) => {
    let cleaned = value.replace(/[^\d,]/g, "");
    const parts = cleaned.split(",");
    if (parts.length > 2) {
      cleaned = parts[0] + "," + parts.slice(1).join("");
    }
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + "," + parts[1].substring(0, 2);
    }
    return cleaned;
  };

  const handleBudgetChange = (pillarId, value) => {
    const cleanedValue = validateBudgetInput(value);
    const numValue = parseFloat(cleanedValue.replace(",", ".")) || 0;
    setEditedBudgets(prev => ({ ...prev, [pillarId]: numValue }));
  };

  const togglePillarExpanded = (pillarId) => {
    setExpandedPillars(prev => {
      if (prev[pillarId]) {
        return { ...prev, [pillarId]: false };
      }
      const newState = {};
      PILLARS.forEach(p => {
        newState[p.id] = p.id === pillarId;
      });
      return newState;
    });
  };

  const formatNumber = (num) => {
    if (num === 0 || !num) return "0";
    const str = num.toString();
    const [integerPart, decimalPart] = str.split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (decimalPart) {
      return formattedInteger + "," + decimalPart.substring(0, 2);
    }
    return formattedInteger;
  };

  const handleSave = () => {
    try {
      // Guardar cambios de pilares
      if (editPillarBudget) {
        Object.entries(editedBudgets).forEach(([pillarId, budget]) => {
          if ((initialBudgets[pillarId] || 0) !== budget) {
            editPillarBudget(pillarId, budget);
          }
        });
      }

      // Guardar cambios de categorías
      if (editCategoryBudget) {
        Object.entries(categoryBudgets).forEach(([catId, newBudget]) => {
          const currentCategory = ALL_CATS.find(c => c.id === catId);
          const oldBudget = currentCategory?.budget || 0;
          if (oldBudget !== newBudget) {
            editCategoryBudget(catId, newBudget);
          }
        });
      }

      // Guardar cambio del toggle de alertas
      if (budgetAlertEnabled !== initialBudgetAlertEnabled) {
        userStorage.set("budgetAlertEnabled", budgetAlertEnabled);
      }

      popup.showEditPopup("Presupuestos");
      setHasChanged(false);
    } catch (err) {
      console.error("Error al guardar presupuestos:", err);
      popup.showErrorPopup("No se pudo guardar los presupuestos");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: t.bg,
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
    >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Header fijo */}
      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        }
        pageTitle="Presupuestos"
        isDark={isDark}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 90px", boxSizing: "border-box" }}>

      {/* Subtitle */}
      <div style={{ fontSize: 12, fontWeight: 600, color: t.sub, textAlign: "center", lineHeight: 1.5, marginTop: 0, marginBottom: 24 }}>
        Define cuánto quieres gastar en cada categoría y pilar. Los cambios se guardan automáticamente.
      </div>

      <LoadingWrapper isLoading={isLoading} skeleton={<MenuListSkeleton isDark={isDark} itemCount={8} />} isDark={isDark}>
        {/* Tarjetas de pilares */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PILLARS.map((pillar) => {
            const pillarCategories = categories[pillar.id] || [];
            const isExpanded = expandedPillars[pillar.id] || false;

            return (
              <div key={pillar.id}>
                {/* Tarjeta pilar */}
                <div
                  style={{
                    borderRadius: 18,
                    background: pillarSoftBg[pillar.id] || t.surface,
                    padding: 6,
                    boxShadow: t.shadowSm,
                  }}
                >
                  {/* Header tarjeta */}
                  <div
                    onClick={() => togglePillarExpanded(pillar.id)}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 10px",
                      cursor: "pointer",
                      alignItems: "center",
                    }}
                  >
                    {/* Icon + Nombre */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1 }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{pillar.icon}</span>
                      <div style={{ fontSize: "13.5px", fontWeight: 800, color: t.text }}>
                        {pillar.label}
                      </div>
                    </div>

                    {/* Input presupuesto */}
                    <input
                      type="text"
                      onClick={(e) => e.stopPropagation()}
                      value={
                        editingInputs[`pillar_${pillar.id}`] !== undefined
                          ? formatNumber(parseFloat(editingInputs[`pillar_${pillar.id}`].replace(",", ".")) || 0)
                          : (editedBudgets[pillar.id] || 0) === 0 ? "Presupuesto" : formatNumber(editedBudgets[pillar.id] || 0)
                      }
                      onChange={(e) => {
                        const validatedValue = validateBudgetInput(e.target.value);
                        setEditingInputs(prev => ({
                          ...prev,
                          [`pillar_${pillar.id}`]: validatedValue
                        }));
                        handleBudgetChange(pillar.id, validatedValue);
                      }}
                      onBlur={() => {
                        const rawValue = editingInputs[`pillar_${pillar.id}`];
                        if (rawValue !== undefined) {
                          handleBudgetChange(pillar.id, rawValue);
                          setEditingInputs(prev => {
                            const newState = { ...prev };
                            delete newState[`pillar_${pillar.id}`];
                            return newState;
                          });
                        }
                      }}
                      placeholder="Presupuesto"
                      inputMode="decimal"
                      style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        background: t.surfaceFlat,
                        border: "none",
                        fontSize: "12.5px",
                        fontWeight: 800,
                        color: (editedBudgets[pillar.id] || 0) === 0 ? t.sub : t.text,
                        textAlign: "right",
                        fontFamily: "Manrope",
                        outline: "none",
                        cursor: "text",
                        flexShrink: 0,
                        opacity: (editedBudgets[pillar.id] || 0) === 0 ? 0.6 : 1,
                      }}
                    />
                  </div>

                  {/* Categorías expandidas */}
                  {isExpanded && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "2px 6px 8px" }}>
                      {pillarCategories.length > 0 ? (
                        pillarCategories.map((categoryId) => (
                          <div
                            key={categoryId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px 14px",
                              borderRadius: 12,
                              background: t.surfaceFlat,
                            }}
                          >
                            <span style={{ fontSize: "12.5px", fontWeight: 700, color: t.text }}>
                              {getCategoryName(categoryId)}
                            </span>
                            <input
                              type="text"
                              onClick={(e) => e.stopPropagation()}
                              value={
                                editingInputs[`cat_${categoryId}`] !== undefined
                                  ? formatNumber(parseFloat(editingInputs[`cat_${categoryId}`].replace(",", ".")) || 0)
                                  : (categoryBudgets[categoryId] || 0) === 0 ? "Presupuesto" : formatNumber(categoryBudgets[categoryId] || 0)
                              }
                              onChange={(e) => {
                                const validatedValue = validateBudgetInput(e.target.value);
                                setEditingInputs(prev => ({
                                  ...prev,
                                  [`cat_${categoryId}`]: validatedValue
                                }));
                                handleCategoryBudgetChange(categoryId, validatedValue);
                              }}
                              onBlur={() => {
                                const rawValue = editingInputs[`cat_${categoryId}`];
                                if (rawValue !== undefined) {
                                  handleCategoryBudgetChange(categoryId, rawValue);
                                  setEditingInputs(prev => {
                                    const newState = { ...prev };
                                    delete newState[`cat_${categoryId}`];
                                    return newState;
                                  });
                                }
                              }}
                              placeholder="Presupuesto"
                              inputMode="decimal"
                              style={{
                                padding: "0",
                                borderRadius: "0",
                                background: "transparent",
                                border: "none",
                                fontSize: "12.5px",
                                fontWeight: 800,
                                color: (categoryBudgets[categoryId] || 0) === 0 ? t.sub : t.text,
                                textAlign: "right",
                                fontFamily: "Manrope",
                                outline: "none",
                                cursor: "text",
                                opacity: (categoryBudgets[categoryId] || 0) === 0 ? 0.6 : 1,
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "12px 14px", fontSize: "12px", color: t.sub, textAlign: "center" }}>
                          Sin categorías
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Alertas de presupuesto */}
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              padding: "15px 16px",
              borderRadius: 16,
              background: isDark
                ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)"
                : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
              boxShadow: t.shadowSm,
            }}
          >
            {/* Left: Badge + Text */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: "0 0 auto" }}>
              {/* Badge icono alerta */}
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: "rgba(155,109,255,0.16)",
                  color: "#9B6DFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  flex: "0 0 auto",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.3 3.9L2.5 17a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
              </div>

              {/* Contenido */}
              <div style={{ alignSelf: "flex-start" }}>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: t.text }}>
                  Alertas de presupuesto
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: t.sub, marginTop: 2 }}>
                  Avisa cuando un pilar se pase de su límite
                </div>
              </div>
            </div>

            {/* Switch */}
            <button
              onClick={() => setBudgetAlertEnabled(!budgetAlertEnabled)}
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                border: "none",
                background: budgetAlertEnabled ? "#9B6DFF" : "rgba(255,255,255,0.07)",
                cursor: "pointer",
                position: "relative",
                padding: 0,
                flexShrink: 0,
                transition: "background .18s ease",
                marginLeft: "auto",
                alignSelf: "center",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: budgetAlertEnabled ? 20 : 2,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
                  transition: "left .18s ease",
                }}
              />
            </button>
          </div>
        </div>
      </LoadingWrapper>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!hasChanged}
        style={{
          position: "fixed",
          bottom: 24,
          right: 22,
          width: 52,
          height: 52,
          borderRadius: 17,
          background: hasChanged
            ? "linear-gradient(155deg,#B18CFF,#8B5CF6)"
            : "rgba(139,92,246,0.4)",
          color: "#fff",
          border: "none",
          cursor: hasChanged ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 16px 28px -10px rgba(139,92,246,0.6)",
          transition: "all 0.2s",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
      </div>
    </div>
  );
}
