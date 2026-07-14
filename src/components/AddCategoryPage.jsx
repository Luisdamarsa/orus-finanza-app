import { useState, useEffect } from "react";
import { usePress } from "../hooks/usePress";
import { PILLARS } from "../constants";
import { usePopup } from "../services/PopupService";
import { CheckmarkIcon, TrashIcon } from "../icons/Icons";

/**
 * AddCategoryPage.jsx - REFORMULADA (Crear + Editar)
 *
 * Página para agregar o editar una categoría (mismo formato que Nueva Transacción)
 *
 * Características:
 * - Modo NUEVO: Input vacío, pilar sin seleccionar
 * - Modo EDITAR: Pre-llena nombre y pilar, botón guardar deshabilitado hasta cambio
 * - Botón guardar (✓) en esquina inferior derecha
 * - Botón eliminar (🗑️) en esquina inferior izquierda (solo en modo edición)
 * - Deduplicación automática con números crecientes
 *
 * Props:
 *   isDark - Tema oscuro
 *   onBack - Callback para volver atrás
 *   onSave - Callback(pillarId, categoryName) para guardar
 *   onDelete - Callback(categoryName, pillarId) para eliminar (solo edición)
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
  // 🆕 Usar el servicio de popups
  const popup = usePopup();
  // 🆕 Hooks para animación de press en botones
  const pressBack = usePress();
  const pressSave = usePress();
  const pressDelete = usePress();
  const [description, setDescription] = useState("");
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  // 🆕 Estado para trackear qué botón de pilar está siendo presionado
  const [pressingPillar, setPressingPillar] = useState(null);

  // Pre-llenar datos en modo edición
  useEffect(() => {
    if (isEditing && editingCategoryName) {
      setDescription(editingCategoryName);
      setSelectedPillar(editingPillarId || null);
      setHasChanged(false);
    }
  }, [isEditing, editingCategoryName, editingPillarId]);

  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

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

  const handleSave = () => {
    if (!canSave) return;

    const finalName = isEditing ? description.trim() : getDeduplicatedName(description);
    const pillarToSave = selectedPillar || "varios";

    onSave(pillarToSave, finalName);

    // 🆕 Mostrar popup de éxito usando el servicio
    if (isEditing) {
      popup.showEditPopup('Categoría');
    } else {
      popup.showCreatePopup('Categoría');
    }
  };

  const handleDelete = () => {
    if (isEditing && onDelete) {
      // Eliminar directamente sin confirmación
      onDelete();
      // 🆕 Mostrar popup de éxito usando el servicio
      popup.showDeletePopup('Categoría');
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        padding: "60px 22px 24px",
        boxSizing: "border-box"
      }}
    >
      <style>{`@keyframes popIn { from { transform:scale(0.92);opacity:0 } to { transform:scale(1);opacity:1 } }`}</style>

      {/* Botón Atrás */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 0 }}>
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
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDark ? "#C4C2E0" : "#6B7280"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>
          Atrás
        </span>
      </div>

      {/* Contenido del formulario - centrado en toda la pantalla */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "22px",
          right: "22px",
          transform: "translateY(-50%)",
          zIndex: 41
        }}
      >
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: "18px 18px 16px",
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(100,80,200,0.08)"
          }}
        >
          {/* ===== SECCIÓN 1: Título + Descripción ===== */}

          {/* Título */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#9B6DFF",
              letterSpacing: 1,
              marginBottom: 12
            }}
          >
            {isEditing ? "CATEGORÍA" : "NUEVA CATEGORÍA"}
          </div>

          <style>{`
            .add-category-input::placeholder {
              color: #9896B0;
              opacity: 0.35;
            }
          `}</style>

          {/* Input de Descripción */}
          <input
            type="text"
            className="add-category-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe la categoría (Arriendo, Salidas, etc...)"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 14,
              fontWeight: description ? 700 : 400,
              color: description ? t.text : "#7B7A99",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              marginBottom: 14,
              padding: 0,
              boxSizing: "border-box"
            }}
          />

          {/* Separador */}
          <div style={{ height: 1, background: t.border, marginBottom: 12 }} />

          {/* ===== SECCIÓN 2: Selector de Pilar ===== */}

          {/* Label Pilar */}
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: t.sub,
              letterSpacing: 0.6,
              marginBottom: 8,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>Pilar</span>
            {!selectedPillar && (
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: t.sub,
                  opacity: 0.7
                }}
              >
                Sin selección = Varios (defecto)
              </span>
            )}
          </div>

          {/* Botones de Pilar - 5 columnas */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 0
            }}
          >
            {PILLARS.map((pillar) => {
              const isSelected = selectedPillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(isSelected ? null : pillar.id)}
                  onPointerDown={() => setPressingPillar(pillar.id)}
                  onPointerUp={() => setPressingPillar(null)}
                  onPointerLeave={() => setPressingPillar(null)}
                  style={{
                    flex: "1 1 auto",
                    minWidth: 60,
                    padding: "6px 8px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    background: pressingPillar === pillar.id
                      ? `${pillar.color}44`
                      : isSelected
                        ? pillar.color + "22"
                        : isDark
                          ? "#252538"
                          : "#F0EFF8",
                    color: isSelected ? pillar.color : t.sub,
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 600,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    outline: isSelected
                      ? `1.5px solid ${pillar.color}66`
                      : "1.5px solid transparent",
                    transition: "all 0.18s",
                    transform: pressingPillar === pillar.id ? "scale(0.94)" : "scale(1)",
                    opacity: pressingPillar === pillar.id ? 0.7 : 1,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{pillar.icon}</span>
                  <span>{pillar.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botón Eliminar (🗑️) - Esquina Inferior Izquierda (solo en edición) */}
      {isEditing && (
        <div style={{ position: "absolute", bottom: 24, left: 22 }}>
          <button
            onClick={handleDelete}
            onPointerDown={pressDelete.handlers.onPointerDown}
            onPointerUp={pressDelete.handlers.onPointerUp}
            onPointerLeave={pressDelete.handlers.onPointerLeave}
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(135deg, #EF4444, #DC2626)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1,
              ...pressDelete.getPressStyle(),
            }}
            onMouseEnter={(e) => {
              if (!pressDelete.pressing) {
                e.currentTarget.style.transform = "scale(1.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (!pressDelete.pressing) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <TrashIcon width={22} height={22} color="white" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Botón Guardar (✓) - Esquina Inferior Derecha */}
      <div style={{ position: "absolute", bottom: 24, right: 22 }}>
        <button
          onClick={handleSave}
          disabled={!canSave}
          onPointerDown={() => canSave && pressSave.handlers.onPointerDown()}
          onPointerUp={() => pressSave.handlers.onPointerUp()}
          onPointerLeave={() => pressSave.handlers.onPointerLeave()}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
            cursor: canSave ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: canSave ? (pressSave.pressing ? 0.9 : 1) : 0.45,
            ...(canSave ? pressSave.getPressStyle() : {}),
          }}
        >
          <CheckmarkIcon width={22} height={22} color="white" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
