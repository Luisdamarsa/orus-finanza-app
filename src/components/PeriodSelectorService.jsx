/**
 * PeriodSelectorService
 * Componente para seleccionar período de tiempo (Todo el tiempo, Meses específicos)
 *
 * Props:
 * - isDark: boolean (tema oscuro/claro)
 * - selectedPeriod: object { year, month } o null
 * - onSelect: function (callback al seleccionar período)
 * - onClose: function (callback para cerrar popup)
 * - monthHasData: function (mes, año) => boolean (verificar si mes tiene datos)
 */

import { useState } from "react";
import { MONTHS_SHORT } from "../constants";

export default function PeriodSelector({ isDark, selectedPeriod, onSelect, onClose, monthHasData }) {
  const t = isDark ? { bg: "#1A1A2B", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" } : { bg: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  // Estado local para el año seleccionado en el picker
  const [pickerYear, setPickerYear] = useState(selectedPeriod?.year || 2026);
  // 🆕 Estado para trackear qué botón está siendo presionado
  const [pressingButton, setPressingButton] = useState(null);
  const isSel = (month) => selectedPeriod && selectedPeriod.year === pickerYear && selectedPeriod.month === month;

  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 55,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <style>{`@keyframes scaleIn { from { transform:scale(0.9); opacity: 0 } to { transform:scale(1); opacity: 1 } }`}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%",
        maxWidth: "420px",
        background: t.bg,
        borderRadius: "22px",
        border: `1px solid ${t.border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        animation: "scaleIn 0.3s cubic-bezier(.34,1.56,.64,1)",
        maxHeight: "80vh",
        overflowY: "auto",
        scrollbarWidth: "none",
        paddingBottom: 20,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 14px",
          borderBottom: `1px solid ${t.border}`,
          marginBottom: 12,
        }}>
          {/* Título "Período" */}
          <span style={{ fontSize: 13, fontWeight: 800, color: t.text, whiteSpace: "nowrap" }}>Período</span>

          {/* Grupo derecha: Botón + X */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Botón "Todo el tiempo" */}
            <button
              onClick={() => { onSelect(null); onClose(); }}
              onPointerDown={() => setPressingButton("all-time")}
              onPointerUp={() => setPressingButton(null)}
              onPointerLeave={() => setPressingButton(null)}
              style={{
                padding: "6px 6px", borderRadius: 10, border: "none",
                cursor: "pointer", textAlign: "right",
                background: !selectedPeriod ? "#9B6DFF22" : (isDark ? "#1E1E2E" : "#F0EFF8"),
                outline: !selectedPeriod ? "1.5px solid #9B6DFF88" : "1.5px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
                transition: "all 0.15s",
                transform: pressingButton === "all-time" ? "scale(0.95)" : "scale(1)",
                opacity: pressingButton === "all-time" ? 0.7 : 1,
              }}>
              <span style={{ fontSize: 13 }}>📅</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: !selectedPeriod ? "#9B6DFF" : t.text }}>Todo el tiempo</span>
              {!selectedPeriod && <span style={{ fontSize: 11, color: "#9B6DFF" }}>✓</span>}
            </button>

            {/* Botón cerrar X */}
            <button
              onClick={onClose}
              onPointerDown={() => setPressingButton("close")}
              onPointerUp={() => setPressingButton(null)}
              onPointerLeave={() => setPressingButton(null)}
              style={{
                width: 26, height: 26, borderRadius: "50%",
                background: isDark ? "#2D2D3A" : "#F0EFF8",
                border: "none", cursor: "pointer",
                color: t.sub, fontSize: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transform: pressingButton === "close" ? "scale(0.90)" : "scale(1)",
                opacity: pressingButton === "close" ? 0.7 : 1,
                transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>✕</button>
          </div>
        </div>
        <div style={{ padding: "0 14px" }}>

          {/* BOTONES DE AÑO */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[2025, 2026].map((year) => {
              // Resaltar si es el año que estoy navegando (pickerYear)
              const isYearActive = pickerYear === year;
              return (
                <button
                  key={year}
                  onClick={() => setPickerYear(year)}
                  onPointerDown={() => setPressingButton(`year-${year}`)}
                  onPointerUp={() => setPressingButton(null)}
                  onPointerLeave={() => setPressingButton(null)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: isYearActive ? "1.5px solid #9B6DFF" : `1.5px solid ${t.border}`,
                    background: isYearActive ? "#9B6DFF22" : (isDark ? "#2D2D3A" : "#F0EFF8"),
                    color: isYearActive ? "#9B6DFF" : t.text,
                    fontSize: 12,
                    fontWeight: isYearActive ? 800 : 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    transform: pressingButton === `year-${year}` ? "scale(0.96)" : "scale(1)",
                    opacity: pressingButton === `year-${year}` ? 0.7 : 1,
                  }}
                >
                  {year}
                </button>
              );
            })}
          </div>

          {/* TEXTO AÑO SELECCIONADO + BOTÓN TODO EL AÑO */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: t.sub, letterSpacing: 0.6 }}>{pickerYear}</span>
            <button
              onClick={() => { onSelect({ year: pickerYear, month: null }); onClose(); }}
              onPointerDown={() => setPressingButton("all-year")}
              onPointerUp={() => setPressingButton(null)}
              onPointerLeave={() => setPressingButton(null)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "none",
                background: isDark ? "#2D2D3A" : "#F0EFF8",
                color: t.text,
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                transform: pressingButton === "all-year" ? "scale(0.96)" : "scale(1)",
                opacity: pressingButton === "all-year" ? 0.7 : 1,
              }}>
              Todo el año
            </button>
          </div>

          {/* GRILLA DE MESES (solo del año seleccionado) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
            {MONTHS_SHORT.map((mLabel, idx) => {
              const month = idx + 1;
              const sel = isSel(month);
              const hasData = monthHasData(month, pickerYear);
              return (
                <button
                  key={`${pickerYear}-${month}`}
                  onClick={() => { onSelect({ year: pickerYear, month }); onClose(); }}
                  onPointerDown={() => hasData && setPressingButton(`month-${month}`)}
                  onPointerUp={() => setPressingButton(null)}
                  onPointerLeave={() => setPressingButton(null)}
                  disabled={!hasData}
                  style={{
                    padding: "8px 2px",
                    borderRadius: 9,
                    border: "none",
                    cursor: hasData ? "pointer" : "not-allowed",
                    background: sel ? "#9B6DFF" : (isDark ? "#2D2D3A" : "#EDEDF7"),
                    color: sel ? "#fff" : (hasData ? t.text : t.sub),
                    fontSize: 10,
                    fontWeight: sel ? 800 : 600,
                    transition: "all 0.15s",
                    opacity: pressingButton === `month-${month}` ? 0.6 : (hasData ? 1 : 0.4),
                    transform: pressingButton === `month-${month}` ? "scale(0.94)" : "scale(1)",
                  }}
                >
                  {mLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
