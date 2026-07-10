import { useState, useEffect } from "react";
import { PILLARS } from "../constants";

export default function BudgetsPage({ isDark, onBack, onSave, initialBudgets, onSaveSuccess }) {
  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  // Estado para los presupuestos editados
  const [editedBudgets, setEditedBudgets] = useState(initialBudgets || {});
  // 🆕 Estado para detectar cambios
  const [hasChanged, setHasChanged] = useState(false);

  // 🆕 Detectar cambios comparando con initialBudgets
  useEffect(() => {
    const changed = Object.keys(initialBudgets || {}).some(
      key => (editedBudgets[key] || 0) !== (initialBudgets[key] || 0)
    );
    setHasChanged(changed);
  }, [editedBudgets, initialBudgets]);

  const handleBudgetChange = (pillarId, value) => {
    const numValue = parseInt(value.replace(/\D/g, "")) || 0;
    setEditedBudgets(prev => ({
      ...prev,
      [pillarId]: numValue
    }));
  };

  const handleSave = () => {
    // Guardar con el callback antiguo si existe
    if (onSave) {
      onSave(editedBudgets);
    }
    // Llamar al nuevo callback
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString("es-CO");
  };

  const parseNumber = (str) => {
    return str.replace(/\D/g, "");
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

      {/* Sección de Título + Botón Guardar */}
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 0,
          right: 0,
          height: 60,
          background: t.bg,
          padding: "0 22px",
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
            flex: 1,
            textAlign: "center",
            minWidth: 0,
            overflow: "visible",
          }}>
          Presupuestos
        </div>

        {/* Botón Guardar */}
        <div style={{ position: "absolute", right: 22 }}>
          <button
            onClick={handleSave}
            disabled={!hasChanged}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: hasChanged ? "pointer" : "not-allowed",
              background: hasChanged ? "#22C55E" : "#22C55E80",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              transition: "all 0.15s",
              boxShadow: hasChanged ? "0 2px 8px rgba(34, 197, 94, 0.3)" : "none",
              opacity: hasChanged ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (hasChanged) {
                e.target.style.background = "#16A34A";
                e.target.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (hasChanged) {
                e.target.style.background = "#22C55E";
                e.target.style.boxShadow = "0 2px 8px rgba(34, 197, 94, 0.3)";
              }
            }}>
            Guardar
          </button>
        </div>
      </div>

      {/* Contenido scrolleable (a partir de 164px) */}
      <div style={{
        position: "absolute", top: 164, left: 0, right: 0, bottom: 0,
        overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none",
        padding: "20px 22px 40px 22px", boxSizing: "border-box"
      }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* Lista de pilares */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {PILLARS.map(pillar => (
            <div key={pillar.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 14px", borderRadius: 11, border: `1.5px solid ${pillar.color}44`,
              background: isDark ? pillar.color + "08" : pillar.color + "08",
            }}>
              {/* Ícono y nombre */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 18 }}>{pillar.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: pillar.color }}>
                  {pillar.label}
                </span>
              </div>

              {/* Input de presupuesto */}
              <input
                type="text"
                value={formatNumber(editedBudgets[pillar.id] || 0)}
                onChange={(e) => handleBudgetChange(pillar.id, e.target.value)}
                style={{
                  flex: 1, padding: "8px 10px", borderRadius: 8,
                  border: `1.5px solid ${pillar.color}66`,
                  background: isDark ? "#1E1E2E" : "#F5F3FF",
                  color: pillar.color, fontSize: 13, fontWeight: 700,
                  textAlign: "right",
                  fontFamily: "monospace",
                  outline: "none",
                  transition: "all 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = pillar.color;
                  e.target.style.boxShadow = `0 0 8px ${pillar.color}33`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🆕 Gradiente de desvanecimiento flotante */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.9) 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(248, 247, 255, 0.4) 40%, rgba(248, 247, 255, 0.9) 100%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </div>
  );
}
