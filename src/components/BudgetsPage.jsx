import { useState, useEffect, useRef } from "react";
import { PILLARS, ALL_CATS } from "../constants";
import { usePress } from "../hooks/usePress";
import { usePopup } from "../services/PopupService";
import { useCategories } from "../hooks/useCategories";
import { useBudgets } from "../hooks/useBudgets";
import { CheckmarkIcon } from "../icons/Icons";
import { getCategoryName } from "../utils/categoryUtils";
import { getAttributeAtDate } from "../services/attributeHistoryService";

export default function BudgetsPage({ isDark, onBack, onSave, initialBudgets, onSaveSuccess, categories: categoriesFromProps, editPillarBudget, editCategoryBudget }) {
  // 🆕 Usar servicios/hooks independientes
  const popup = usePopup();
  // Si viene como prop, usarla; si no, crear instancia propia (retrocompatibilidad)
  const { categories: categoriesFromHook } = useCategories();
  const categories = categoriesFromProps || categoriesFromHook;
  const { categoryBudgets, handleCategoryBudgetChange, updateWithNewCategories } = useBudgets();

  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  // Estado para los presupuestos editados (del pilar y categorías)
  const [editedBudgets, setEditedBudgets] = useState(initialBudgets || {});
  // 🆕 Estado para detectar cambios
  const [hasChanged, setHasChanged] = useState(false);
  // 🆕 Estado para pilares expandidos
  const [expandedPillars, setExpandedPillars] = useState({});
  // 🆕 Usar ref para guardar valores iniciales solo una vez
  const initialCategoryBudgetsRef = useRef(null);
  // 🆕 Ref para medir altura de descripción dinámicamente
  const descriptionRef = useRef(null);
  const [contentTop, setContentTop] = useState(220);
  // 🆕 Estado para track de inputs siendo editados (raw values)
  const [editingInputs, setEditingInputs] = useState({});
  // 🆕 Hook para animación de press en botón de atrás
  const pressBack = usePress();
  // 🆕 Hook para animación de press en botón de guardar
  const pressSave = usePress();

  // 🆕 Guardar valores iniciales después de que categoryBudgets esté listo
  useEffect(() => {
    if (initialCategoryBudgetsRef.current === null) {
      initialCategoryBudgetsRef.current = { ...categoryBudgets };
    }
  }, [categoryBudgets]);

  // 🆕 Medir altura dinámicamente de la descripción
  useEffect(() => {
    if (descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.offsetHeight;
      // Descripción comienza en top: 164, más su altura, más padding bottom 6px
      const newContentTop = 164 + descriptionHeight + 6;
      setContentTop(newContentTop);
    }
  }, []);

  // 🆕 Detectar cambios comparando con valores iniciales
  useEffect(() => {
    const pillarChanged = Object.keys(initialBudgets || {}).some(
      key => (editedBudgets[key] || 0) !== (initialBudgets[key] || 0)
    );

    const categoryChanged = initialCategoryBudgetsRef.current
      ? Object.keys(categoryBudgets).some(
          key => (categoryBudgets[key] || 0) !== (initialCategoryBudgetsRef.current[key] || 0)
        )
      : false;

    setHasChanged(pillarChanged || categoryChanged);
  }, [editedBudgets, categoryBudgets, initialBudgets]);

  // 🆕 NO cargar desde localStorage - reiniciar desde ALL_CATS cada vez
  // (funciona igual que presupuestos de pilares)

  // 🆕 Sincronizar categoryBudgets cuando cambien las categorías
  useEffect(() => {
    // Ejecutar cada vez que cambien las categorías (incluyendo al montar)
    updateWithNewCategories(categories);
  }, [categories, updateWithNewCategories]);

  // 🆕 Validar y limpiar input - Solo números y comas, máximo 2 decimales
  const validateBudgetInput = (value) => {
    // Solo permitir dígitos y comas
    let cleaned = value.replace(/[^\d,]/g, "");

    // Si hay múltiples comas, mantener solo la primera
    const parts = cleaned.split(",");
    if (parts.length > 2) {
      cleaned = parts[0] + "," + parts.slice(1).join("");
    }

    // Limitar a máximo 2 decimales después de la coma
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + "," + parts[1].substring(0, 2);
    }

    return cleaned;
  };

  const handleBudgetChange = (pillarId, value) => {
    // 🆕 Validar que solo sea números y comas
    const cleanedValue = validateBudgetInput(value);

    // 🆕 Convertir a número con decimales (reemplazar coma por punto para parseFloat)
    const numValue = parseFloat(cleanedValue.replace(",", ".")) || 0;

    setEditedBudgets(prev => ({
      ...prev,
      [pillarId]: numValue
    }));
  };

  // 🆕 Cambiar presupuesto de categoría
  // ✅ handleCategoryBudgetChange viene del hook useBudgets

  // 🆕 Toggle expansión de pilar (solo una a la vez)
  const togglePillarExpanded = (pillarId) => {
    setExpandedPillars(prev => {
      // Si ya está expandido, colapsarlo
      if (prev[pillarId]) {
        return {
          ...prev,
          [pillarId]: false
        };
      }
      // Si no está expandido, expandirlo y cerrar los demás
      const newState = {};
      PILLARS.forEach(p => {
        newState[p.id] = p.id === pillarId;
      });
      return newState;
    });
  };

  const handleSave = () => {
    // 🆕 Llamar a funciones CRUD para mutar ALL_CATS y PILLARS directamente

    // 1. Guardar presupuestos de pilares
    if (editPillarBudget) {
      Object.entries(editedBudgets).forEach(([pillarId, budget]) => {
        if ((initialBudgets[pillarId] || 0) !== budget) {
          editPillarBudget(pillarId, budget);
        }
      });
    }

    // 2. Guardar presupuestos de categorías
    if (editCategoryBudget) {
      Object.entries(categoryBudgets).forEach(([categoryId, budget]) => {
        if ((initialCategoryBudgetsRef.current?.[categoryId] || 0) !== budget) {
          editCategoryBudget(categoryId, budget);
        }
      });
    }

    // 3. Llamar al callback onSave
    if (onSave) {
      onSave(editedBudgets);
    }

    // 🆕 Mostrar popup de éxito usando el servicio
    popup.showEditPopup('Presupuestos');

    // Llamar al nuevo callback
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  // 🆕 Formato colombiano: 1.000,50 (punto para miles, coma para decimales)
  const formatNumber = (num) => {
    if (num === 0 || !num) return "0";

    // Convertir a string y separar enteros y decimales
    const str = num.toString();
    const [integerPart, decimalPart] = str.split(".");

    // Agregar puntos cada 3 dígitos en la parte entera
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Si hay decimales, añadir coma y limitar a 2 decimales
    if (decimalPart) {
      return formattedInteger + "," + decimalPart.substring(0, 2);
    }

    return formattedInteger;
  };

  // 🆕 Parsear número desde formato colombiano
  const parseNumber = (str) => {
    // Solo números y comas
    return str.replace(/[^\d,]/g, "");
  };

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

      {/* Sección de Título Centrado (top: 104, height: 60) */}
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 0,
          right: 0,
          height: 60,
          background: t.bg,
          padding: "0 22px",
          paddingBottom: "3px",
          boxSizing: "border-box",
          zIndex: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: t.text,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
          <span style={{ fontSize: 22 }}>💰</span>
          Presupuestos
        </div>
      </div>

      {/* Sección de Descripción (Componente Aparte) */}
      <div
        ref={descriptionRef}
        style={{
          position: "absolute",
          top: 164,
          left: 0,
          right: 0,
          background: t.bg,
          padding: "3px 22px",
          paddingBottom: "6px",
          boxSizing: "border-box",
          zIndex: 25,
        }}>
        {/* Descripción 1 */}
        <div
          style={{
            fontSize: 13,
            color: t.sub,
            marginBottom: 4,
            lineHeight: 1.4,
            fontWeight: 400,
            textAlign: "left",
          }}>
          Define cuánto quieres gastar en cada categoría y pilar. Los cambios se guardan automáticamente.
        </div>

        {/* Descripción 2 (Ayuda) */}
        <div
          style={{
            fontSize: 12,
            color: t.sub,
            opacity: 0.75,
            fontStyle: "italic",
            textAlign: "left",
          }}>
          Expande el Pilar para ver presupuestos de cada categoría
        </div>
      </div>

      {/* Contenido scrolleable - después del contenedor de descripción */}
      <div style={{
        position: "absolute", top: contentTop, left: 0, right: 0, bottom: 0,
        overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none",
        padding: "6px 22px 40px 22px", boxSizing: "border-box"
      }}>
        <style>{`
          ::-webkit-scrollbar { display: none; }
          [data-pillar-card] {
            -webkit-tap-highlight-color: transparent;
          }
          [data-pillar-card]:active {
            background: inherit !important;
            box-shadow: none !important;
          }
        `}</style>

        {/* Lista de pilares */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {PILLARS.map(pillar => {
            // 🆕 Traer categorías del pilar
            const pillarCategories = categories[pillar.id] || [];
            const isExpanded = expandedPillars[pillar.id] || false;

            return (
              <div key={pillar.id}>
                {/* Tarjeta del pilar - clickeable excepto el input */}
                <div
                  data-pillar-card="true"
                  onClick={(e) => {
                    // Solo expandir si NO se clickea en el input
                    if (e.target.tagName !== "INPUT") {
                      togglePillarExpanded(pillar.id);
                    }
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 14px", borderRadius: 11, border: `1.5px solid ${pillar.color}44`,
                    background: pillar.color + "22",
                    cursor: "pointer",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    WebkitTouchCallout: "none",
                    outline: "none",
                    boxShadow: "none",
                    WebkitFocusRingColor: "transparent",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  onMouseDown={(e) => {
                    // Solo prevenir si NO es el input
                    if (e.target.tagName !== "INPUT") {
                      e.preventDefault();
                    }
                  }}
                  onFocus={(e) => e.currentTarget.blur()}>
                  {/* Ícono y nombre */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 18 }}>{pillar.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: pillar.color }}>
                      {pillar.label}
                    </span>
                  </div>

                  {/* Input de presupuesto del pilar - NO clickeable para expandir */}
                  <input
                    type="text"
                    onClick={(e) => e.stopPropagation()}
                    value={
                      editingInputs[`pillar_${pillar.id}`] !== undefined
                        ? formatNumber(parseFloat(editingInputs[`pillar_${pillar.id}`].replace(",", ".")) || 0)
                        : (editedBudgets[pillar.id] || 0) === 0 ? "Presupuesto" : formatNumber(editedBudgets[pillar.id] || 0)
                    }
                    onChange={(e) => {
                      // 🆕 Validar en tiempo real: solo números y comas
                      const validatedValue = validateBudgetInput(e.target.value);
                      // Guardar el raw value en editingInputs para que se muestre mientras edita
                      setEditingInputs(prev => ({
                        ...prev,
                        [`pillar_${pillar.id}`]: validatedValue
                      }));
                      // 🆕 También guardar en editedBudgets para detectar cambios
                      handleBudgetChange(pillar.id, validatedValue);
                    }}
                    onBlur={(e) => {
                      // Al salir del input, guardar el valor procesado
                      const rawValue = editingInputs[`pillar_${pillar.id}`];
                      if (rawValue !== undefined) {
                        handleBudgetChange(pillar.id, rawValue);
                        // Limpiar del estado editingInputs
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
                      flex: 1, padding: "8px 10px", borderRadius: 8,
                      border: `1.5px solid ${pillar.color}66`,
                      background: isDark ? "#1E1E2E" : "#F5F3FF",
                      color: (editedBudgets[pillar.id] || 0) === 0 ? "#9896B0" : pillar.color,
                      opacity: (editedBudgets[pillar.id] || 0) === 0 ? 0.6 : 1,
                      fontSize: 13, fontWeight: 700,
                      textAlign: "right",
                      fontFamily: "monospace",
                      outline: "none",
                      transition: "all 0.15s",
                      cursor: "text",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = pillar.color;
                      e.target.style.boxShadow = `0 0 8px ${pillar.color}33`;
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = "none";
                    }}
                  />

                  {/* Flecha expandible a la derecha */}
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 20, height: 20,
                    color: pillar.color, fontSize: 16,
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}>
                    ›
                  </span>
                </div>

                {/* 🆕 Categorías expandidas */}
                {isExpanded && (
                  <div style={{
                    marginTop: 8,
                    display: "flex", flexDirection: "column", gap: 8,
                    paddingLeft: 16,
                  }}>
                    {pillarCategories.length > 0 ? (
                      pillarCategories.map((categoryId) => (
                        <div
                          key={categoryId}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 12px", borderRadius: 8,
                            background: "transparent",
                            border: `1px solid ${pillar.color}33`,
                          }}>
                          <span style={{ fontSize: 13, color: t.text, flex: 1, fontWeight: 600, textAlign: "left" }}>
                            {getCategoryName(categoryId)}
                          </span>
                          {/* 🆕 Input de presupuesto de categoría */}
                          <input
                            type="text"
                            value={
                              editingInputs[`cat_${categoryId}`] !== undefined
                                ? formatNumber(parseFloat(editingInputs[`cat_${categoryId}`].replace(",", ".")) || 0)
                                : (categoryBudgets[categoryId] || 0) === 0 ? "Presupuesto" : formatNumber(categoryBudgets[categoryId] || 0)
                            }
                            onChange={(e) => {
                              // 🆕 Validar en tiempo real: solo números y comas
                              const validatedValue = validateBudgetInput(e.target.value);
                              // Guardar el raw value en editingInputs para que se muestre mientras edita
                              setEditingInputs(prev => ({
                                ...prev,
                                [`cat_${categoryId}`]: validatedValue
                              }));
                              // 🆕 También guardar en categoryBudgets para detectar cambios
                              handleCategoryBudgetChange(categoryId, validatedValue);
                            }}
                            onBlur={(e) => {
                              // Al salir del input, guardar el valor procesado
                              const rawValue = editingInputs[`cat_${categoryId}`];
                              if (rawValue !== undefined) {
                                handleCategoryBudgetChange(categoryId, rawValue);
                                // Limpiar del estado editingInputs
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
                              width: 100, padding: "6px 8px", borderRadius: 6,
                              border: `1.5px solid ${pillar.color}55`,
                              background: isDark ? "#252535" : "#F5F3FF",
                              color: (categoryBudgets[categoryId] || 0) === 0 ? "#9896B0" : pillar.color,
                              opacity: (categoryBudgets[categoryId] || 0) === 0 ? 0.6 : 1,
                              fontSize: 12, fontWeight: 700,
                              textAlign: "right",
                              fontFamily: "monospace",
                              outline: "none",
                              transition: "all 0.15s",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = pillar.color;
                              e.target.style.boxShadow = `0 0 6px ${pillar.color}22`;
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = "none";
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 12, color: t.sub, fontStyle: "italic", paddingLeft: 8 }}>
                        Sin categorías
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🆕 Botón Guardar Flotante (✓) - Esquina Inferior Derecha */}
      <div style={{ position: "absolute", bottom: 24, right: 22 }}>
        <button
          onClick={handleSave}
          disabled={!hasChanged}
          onPointerDown={() => hasChanged && pressSave.handlers.onPointerDown()}
          onPointerUp={() => pressSave.handlers.onPointerUp()}
          onPointerLeave={() => pressSave.handlers.onPointerLeave()}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
            cursor: hasChanged ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hasChanged ? (pressSave.pressing ? 0.9 : 1) : 0.45,
            ...(hasChanged ? pressSave.getPressStyle() : {}),
          }}
        >
          <CheckmarkIcon width={22} height={22} color="white" strokeWidth={3} />
        </button>
      </div>

    </div>
  );
}
