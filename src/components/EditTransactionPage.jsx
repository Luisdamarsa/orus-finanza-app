import { useState } from "react";
import { usePress } from "../hooks/usePress";
import SimplePageLayout from "./SimplePageLayout";
import { PILLARS, MANUAL_METHODS, ALL_CATS } from "../constants";
import { getCategoryName } from "../utils/categoryUtils";
import LoadingWrapper from "./LoadingWrapper";
import { FormSkeleton } from "./LoadingSkeleton";

/**
 * EditTransactionPage.jsx
 *
 * Página para editar una transacción existente
 * - Precarga todos los datos de la transacción
 * - Permite editar: descripción, monto, tipo, método, categoría, pilar
 * - Botón Guardar: sobrescribe la transacción (mantiene fecha/período)
 * - Botón Eliminar: borra la transacción
 */
export default function EditTransactionPage({
  transaction, // transacción a editar {id, date, time, description, amount, category, pillar, ...}
  onBack,
  onSave, // (transactionId, updatedData)
  onDelete, // (transactionId)
  isDark,
  categories = {},
}) {
  // 🆕 Hooks para animación
  const pressBack = usePress();
  const pressSave = usePress();
  const pressDelete = usePress();
  const [pressingMethod, setPressingMethod] = useState(null);
  const [pressingCategory, setPressingCategory] = useState(false);
  const [pressingPillar, setPressingPillar] = useState(null);
  const [pressingConcept, setPressingConcept] = useState(null);

  // 🆕 Estado del formulario (precarado con valores actuales)
  const [desc, setDesc] = useState(transaction?.description || "");
  const [rawAmount, setRawAmount] = useState(String(Math.abs(transaction?.amount || 0)));
  const [isIncome, setIsIncome] = useState(transaction?.amount > 0); // positivo = ingreso
  const [method, setMethod] = useState(transaction?.method || null);
  const [concept, setConcept] = useState(transaction?.category || null);
  const [pillarId, setPillarId] = useState(transaction?.pillar || null);
  const [conceptOpen, setConceptOpen] = useState(false);

  // 🆕 Estado de loading para skeleton
  const [isLoading, setIsLoading] = useState(false);

  // Cálculos
  const numericAmount = parseInt(rawAmount.replace(/\D/g, "")) || 0;
  const hasAmount = numericAmount > 0;
  const t = isDark
    ? {
        bg: "#0D0D1A",
        card: "#181828",
        border: "#2D2D3A",
        text: "#F0EEFF",
        sub: "#7B7A99",
      }
    : {
        bg: "#FFFFFF",
        card: "#F8F7FF",
        border: "#E5E3F5",
        text: "#1A1830",
        sub: "#9896B0",
      };

  // 🆕 Obtener categorías formateadas
  const getFormattedCategories = () => {
    const formatted = [];
    PILLARS.forEach(pillar => {
      const catIdList = categories[pillar.id] || [];
      if (Array.isArray(catIdList)) {
        catIdList.forEach(catId => {
          formatted.push({ id: catId, name: getCategoryName(catId), pillar: pillar.id });
        });
      }
    });
    return formatted;
  };

  const formattedCategories = getFormattedCategories();
  const selectedCategory = formattedCategories.find(c => c.id === concept);
  const selectedPillar = PILLARS.find(p => p.id === pillarId);

  // 🆕 Validación: puede guardar si hay descripción y monto
  const canSave = desc.trim() && hasAmount && method && concept && pillarId;

  // 🆕 Guardar cambios (sobrescribe la transacción anterior)
  const handleSave = () => {
    if (!canSave) return;

    const updatedTransaction = {
      ...transaction,
      description: desc,
      amount: isIncome ? numericAmount : -numericAmount,
      method,
      category: concept,
      pillar: pillarId,
      // Mantiene: id, date, time (no cambian al editar)
    };

    onSave(transaction.id, updatedTransaction);
  };

  // 🆕 Eliminar transacción
  const handleDelete = () => {
    if (window.confirm(`¿Eliminar transacción de $${Math.abs(transaction.amount)}?`)) {
      onDelete(transaction.id);
    }
  };

  return (
    <SimplePageLayout
      isDark={isDark}
      onBack={onBack}
      pressBack={pressBack}
    >
      {/* LoadingWrapper para mostrar skeleton mientras carga */}
      <LoadingWrapper
        isLoading={isLoading}
        skeleton={<FormSkeleton isDark={isDark} fieldCount={6} />}
        isDark={isDark}
      >
          <>
            {/* Descripción */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: t.sub, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Descripción
          </label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="ej: Café en Starbucks"
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              border: `1.5px solid ${t.border}`, background: t.card, color: t.text,
              fontSize: 14, boxSizing: "border-box",
            }}
          />
        </div>

        {/* Monto */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: t.sub, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Monto
          </label>
          <input
            type="text"
            value={rawAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            onChange={(e) => setRawAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              border: `1.5px solid ${t.border}`, background: t.card, color: t.text,
              fontSize: 14, boxSizing: "border-box",
            }}
          />
        </div>

        {/* Tipo: Ingreso / Gasto */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: t.sub, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Tipo
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Ingreso", value: true, emoji: "📈" },
              { label: "Gasto", value: false, emoji: "📉" },
            ].map(type => (
              <button
                key={type.value}
                onClick={() => setIsIncome(type.value)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 8,
                  border: `1.5px solid ${isIncome === type.value ? "#9B6DFF" : t.border}`,
                  background: isIncome === type.value ? "#9B6DFF22" : t.card,
                  color: t.text, cursor: "pointer", fontSize: 13, fontWeight: 600,
                  transition: "all 0.1s",
                }}
              >
                {type.emoji} {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Método */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: t.sub, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Método
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MANUAL_METHODS.map(m => (
              <button
                key={m.id}
                onPointerDown={() => setPressingMethod(m.id)}
                onPointerUp={() => setPressingMethod(null)}
                onPointerLeave={() => setPressingMethod(null)}
                onClick={() => setMethod(m.id)}
                style={{
                  padding: "8px 12px", borderRadius: 6,
                  border: `1.5px solid ${method === m.id ? m.color : t.border}`,
                  background: method === m.id ? m.color + "22" : t.card,
                  color: method === m.id ? m.color : t.text,
                  cursor: "pointer", fontSize: 12, fontWeight: 600,
                  transform: pressingMethod === m.id ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.1s",
                }}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría (Dropdown) */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: t.sub, fontWeight: 600, display: "block", marginBottom: 6 }}>
            Categoría
          </label>
          <div
            onPointerDown={() => setPressingCategory(true)}
            onPointerUp={() => setPressingCategory(false)}
            onPointerLeave={() => setPressingCategory(false)}
            onClick={() => setConceptOpen(!conceptOpen)}
            style={{
              padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${t.border}`,
              background: pressingCategory ? "rgba(0,0,0,0.1)" : t.card,
              color: t.text, cursor: "pointer", display: "flex",
              justifyContent: "space-between", alignItems: "center",
              transform: pressingCategory ? "scale(0.98)" : "scale(1)",
              transition: "all 0.1s",
            }}
          >
            <span>{selectedCategory?.name || "Seleccionar"}</span>
            <span>{conceptOpen ? "▲" : "▼"}</span>
          </div>
          {conceptOpen && (
            <div style={{
              marginTop: 8, borderRadius: 8, border: `1px solid ${t.border}`,
              background: t.card, maxHeight: 200, overflowY: "auto",
            }}>
              {formattedCategories.map(cat => (
                <button
                  key={cat.id}
                  onPointerDown={() => setPressingConcept(cat.id)}
                  onPointerUp={() => setPressingConcept(null)}
                  onPointerLeave={() => setPressingConcept(null)}
                  onClick={() => {
                    setConcept(cat.id);
                    setPillarId(cat.pillar);
                    setConceptOpen(false);
                  }}
                  style={{
                    width: "100%", padding: "10px 12px", border: "none",
                    background: concept === cat.id ? "#9B6DFF22" : "transparent",
                    color: t.text, cursor: "pointer", fontSize: 13,
                    textAlign: "left", borderBottom: `1px solid ${t.border}`,
                    transform: pressingConcept === cat.id ? "scale(0.98)" : "scale(1)",
                    transition: "all 0.1s",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pilar (solo lectura, derivado de categoría) */}
        {selectedPillar && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: t.sub, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Pilar
            </label>
            <div style={{
              padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${selectedPillar.color}44`,
              background: selectedPillar.color + "11", color: selectedPillar.color,
              fontSize: 13, fontWeight: 600,
            }}>
              {selectedPillar.emoji} {selectedPillar.label}
            </div>
          </div>
        )}

        {/* Espacio */}
        <div style={{ height: 20 }} />

        {/* Botones: Guardar y Eliminar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
          {/* Guardar */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            {...pressSave.handlers}
            style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none",
              background: canSave ? "#9B6DFF" : "#9B6DFF66",
              color: "white", fontSize: 14, fontWeight: 700,
              cursor: canSave ? "pointer" : "default",
              opacity: pressSave.pressing ? 0.7 : 1,
              transform: pressSave.pressing ? "scale(0.98)" : "scale(1)",
              transition: "all 0.1s",
            }}
          >
            Guardar Cambios
          </button>

          {/* Eliminar */}
          <button
            onClick={handleDelete}
            {...pressDelete.handlers}
            style={{
              padding: "12px 16px", borderRadius: 10, border: "none",
              background: "#EF4444", color: "white", fontSize: 14,
              fontWeight: 700, cursor: "pointer",
              opacity: pressDelete.pressing ? 0.7 : 1,
              transform: pressDelete.pressing ? "scale(0.98)" : "scale(1)",
              transition: "all 0.1s",
            }}
          >
              🗑️ Eliminar
            </button>
          </div>
        </>
      </LoadingWrapper>
    </SimplePageLayout>
  );
}
