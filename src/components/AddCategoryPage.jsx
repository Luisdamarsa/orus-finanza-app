import { useState, useEffect } from "react";
import { PILLARS } from "../constants";
import { usePopup } from "../services/PopupService";
import SaveDeleteButtons from "./SaveDeleteButtons";

/**
 * AddCategoryPage.jsx - Clay Design (Crear + Editar)
 *
 * Página para agregar o editar una categoría con clay design system
 *
 * Props:
 *   isDark - Tema oscuro
 *   onBack - Callback para volver atrás
 *   onSave - Callback(pillarId, categoryName) para guardar
 *   onDelete - Callback() para eliminar (solo edición)
 *   categories - {pillarId: [cat1, cat2, ...]} para validar duplicados
 *   isEditing - Boolean si está editando
 *   editingCategoryName - Nombre de la categoría a editar
 *   editingPillarId - Pilar actual de la categoría
 */
export default function AddCategoryPage({
  isDark,
  onBack,
  onSave,
  onDelete,
  categories = {},
  isEditing = false,
  editingCategoryName = null,
  editingPillarId = null,
}) {
  const popup = usePopup();
  const [description, setDescription] = useState("");
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  const isIncome = editingPillarId === "ingreso";

  // Pre-llenar datos en modo edición
  useEffect(() => {
    if (isEditing && editingCategoryName) {
      setDescription(editingCategoryName);
      setSelectedPillar(editingPillarId || null);
      setHasChanged(false);
    }
  }, [isEditing, editingCategoryName, editingPillarId]);

  const t = isDark
    ? {
        bg: "#000000",
        card: "linear-gradient(155deg,#211d2c 0%,#141220 100%)",
        border: "rgba(255,255,255,0.07)",
        text: "#F5F3FF",
        sub: "#8B87A3",
        accent: "#9B6DFF",
        raised: "rgba(255,255,255,0.04)",
      }
    : {
        bg: "#F3F1FA",
        card: "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
        border: "rgba(30,20,60,0.08)",
        text: "#1A1830",
        sub: "#726E8C",
        accent: "#7C4DFF",
        raised: "rgba(30,20,60,0.04)",
      };

  // Validar si descripción tiene >= 2 caracteres
  const isValidLength = description.trim().length >= 2;

  // Detectar cambios (solo en modo edición)
  useEffect(() => {
    if (isEditing) {
      const descriptionChanged = description.trim() !== editingCategoryName?.trim();
      const pillarChanged = selectedPillar !== editingPillarId;
      setHasChanged(descriptionChanged || pillarChanged);
    }
  }, [description, selectedPillar, isEditing, editingCategoryName, editingPillarId]);

  // En modo nuevo: necesita 2+ caracteres
  // En modo edición: necesita cambio + 2+ caracteres
  const canSave = isValidLength && (isEditing ? hasChanged : true);

  /**
   * Obtiene el nombre final con número de deduplicación si existe duplicado
   * @param {string} name - Nombre a verificar
   * @returns {string} Nombre con número agregado si existe duplicado
   */
  const getDeduplicatedName = (name) => {
    const trimmedName = name.trim();

    // Recolectar todos los nombres de categorías en ALL pilares
    const allCategoryNames = new Set();
    Object.values(categories).forEach(catList => {
      if (Array.isArray(catList)) {
        catList.forEach(cat => allCategoryNames.add(cat));
      }
    });

    // En modo edición, excluir el nombre actual de la búsqueda de duplicados
    if (isEditing && editingCategoryName) {
      allCategoryNames.delete(editingCategoryName);
    }

    // Si no existe el nombre, retornar tal cual
    if (!allCategoryNames.has(trimmedName)) {
      return trimmedName;
    }

    // Si existe, buscar el siguiente número disponible
    let counter = 2;
    let newName = `${trimmedName} ${counter}`;

    while (allCategoryNames.has(newName)) {
      counter++;
      newName = `${trimmedName} ${counter}`;
    }

    return newName;
  };

  // 🆕 FASE 3A: handleSave ahora es async (onSave es async)
  const handleSave = async () => {
    if (!canSave) return;

    const finalName = isEditing ? description.trim() : getDeduplicatedName(description);
    // Ingreso → siempre "ingreso"; gasto → el pilar elegido o Varios por defecto.
    const pillarToSave = isIncome ? "ingreso" : (selectedPillar || "varios");

    try {
      await onSave(pillarToSave, finalName);

      // 🆕 Mostrar popup de éxito usando el servicio
      if (isEditing) {
        popup.showEditPopup('Categoría');
      } else {
        popup.showCreatePopup('Categoría');
      }
    } catch (err) {
      console.error("Error al guardar categoría:", err);
      popup.showErrorPopup(`No se pudo ${isEditing ? "actualizar" : "crear"} la categoría`);
    }
  };

  // 🆕 FASE 3A: handleDelete ahora es async (onDelete es async)
  const handleDelete = async () => {
    if (isEditing && onDelete) {
      try {
        // Eliminar directamente sin confirmación
        await onDelete();
        // 🆕 Mostrar popup de éxito usando el servicio
        popup.showDeletePopup('Categoría');
      } catch (err) {
        console.error("Error al eliminar categoría:", err);
        popup.showErrorPopup("No se pudo eliminar la categoría");
      }
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "26px 22px",
        display: "flex",
        flexDirection: "column",
        background: t.bg,
        fontFamily: "Manrope, system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: t.sub,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          padding: 0,
          fontFamily: "Manrope",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 5l-7 7 7 7" />
        </svg>
        <span>Atrás</span>
      </button>

      {/* Centered card zone */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "100%",
            padding: "18px 16px",
            borderRadius: 20,
            background: t.card,
            boxShadow:
              "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Label */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: t.accent,
              letterSpacing: ".7px",
              textTransform: "uppercase",
            }}
          >
            {isEditing ? "Categoría" : "Nueva Categoría"}
          </div>

          {/* Input nombre */}
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe la categoría (Arriendo, Salidas, etc...)"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 14,
              fontWeight: 700,
              color: t.text,
              marginTop: 12,
              padding: 0,
              fontFamily: "Manrope",
            }}
          />

          {/* Separador */}
          {!isIncome && (
            <>
              <div
                style={{
                  height: 1,
                  background: t.border,
                  margin: "14px 0 12px",
                }}
              />

              {/* Label pilar */}
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: t.sub,
                  letterSpacing: ".6px",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Pilar
              </div>

              {/* Selector pilares */}
              <div style={{ display: "flex", gap: 6 }}>
                {PILLARS.map((pillar) => {
                  const isActive = selectedPillar === pillar.id;
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => setSelectedPillar(isActive ? null : pillar.id)}
                      style={{
                        flex: 1,
                        minWidth: 60,
                        padding: "8px 6px",
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        border: isActive
                          ? `2px solid ${pillar.color}`
                          : "2px solid transparent",
                        background: isActive ? `${pillar.color}22` : t.raised,
                        color: isActive ? pillar.color : t.sub,
                        cursor: "pointer",
                        fontFamily: "Manrope",
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{pillar.icon}</span>
                      <span style={{ textAlign: "center", lineHeight: 1.2 }}>
                        {pillar.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Save and Delete buttons */}
      <SaveDeleteButtons
        onSave={handleSave}
        onDelete={isEditing ? handleDelete : undefined}
        disabledSave={!canSave}
        showDelete={isEditing}
      />
    </div>
  );
}
