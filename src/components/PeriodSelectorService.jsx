/**
 * PeriodSelectorService
 * Bottom sheet para seleccionar período de tiempo (Todo el tiempo, Meses específicos)
 *
 * Props:
 * - isDark: boolean (tema oscuro/claro)
 * - selectedPeriod: object { year, month } o null
 * - onSelect: function (callback al seleccionar período)
 * - onClose: function (callback para cerrar popup)
 * - monthHasData: function (mes, año) => boolean (verificar si mes tiene datos)
 */

import { useState } from "react";
import { DARK, LIGHT } from "../constants/tokens";
import { MONTHS_SHORT } from "../constants";
import { usePress } from "../hooks/usePress";

export default function PeriodSelector({ isDark, selectedPeriod, onSelect, onClose, monthHasData }) {
  const tokens = isDark ? DARK : LIGHT;

  // Estado local para el año seleccionado en el picker
  const [pickerYear, setPickerYear] = useState(selectedPeriod?.year || 2026);
  const pressAllTime = usePress();
  const pressClose = usePress();
  const pressYears = {};
  const pressMonths = {};

  const isSel = (month) => selectedPeriod && selectedPeriod.year === pickerYear && selectedPeriod.month === month;

  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      style={{
        position: "fixed", inset: 0, zIndex: 55,
        background: "rgba(0,0,0,0.55)",
        animation: "fadeIn 0.25s ease",
        pointerEvents: "auto",
      }}>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }@keyframes clayRise { from { transform:translateY(100%);opacity:0 } to { transform:translateY(0);opacity:1 } }`}</style>
      <div
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          maxHeight: "80vh",
          boxSizing: "border-box",
          background: tokens.surface || tokens.bg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -20px 40px rgba(0,0,0,0.5)",
          animation: "clayRise 0.25s cubic-bezier(0.32, 0.72, 0.12, 1)",
          overflowY: "auto",
          scrollbarWidth: "none",
          padding: "18px 18px 26px",
          pointerEvents: "auto",
        }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 16,
        }}>
          {/* Título "Período" */}
          <span style={{ fontSize: 13, fontWeight: 800, color: tokens.text }}>Período</span>

          {/* Grupo derecha: Botón "Todo el tiempo" + Botón cerrar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Botón "Todo el tiempo" */}
            <button
              onClick={() => { onSelect(null); onClose(); }}
              {...pressAllTime.handlers}
              style={{
                padding: "7px 12px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                background: !selectedPeriod ? "rgba(155,109,255,0.2)" : tokens.raised,
                color: !selectedPeriod ? "#9B6DFF" : tokens.text,
                fontSize: 11,
                fontWeight: 700,
                transition: "all 0.15s",
                ...pressAllTime.getPressStyle(),
              }}>
              Todo el tiempo
            </button>

            {/* Botón cerrar X */}
            <button
              onClick={onClose}
              {...pressClose.handlers}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: tokens.raised,
                color: "#8B87A3",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s",
                ...pressClose.getPressStyle(),
              }}>
              ✕
            </button>
          </div>
        </div>

        {/* BOTONES DE AÑO */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {[2025, 2026].map((year) => {
            const isYearActive = pickerYear === year;
            if (!pressYears[`year-${year}`]) {
              pressYears[`year-${year}`] = usePress();
            }
            const press = pressYears[`year-${year}`];
            return (
              <button
                key={year}
                onClick={() => setPickerYear(year)}
                {...press.handlers}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 12,
                  border: isYearActive ? "1.5px solid #9B6DFF" : "1.5px solid transparent",
                  background: isYearActive ? "rgba(155,109,255,0.2)" : tokens.raised,
                  color: isYearActive ? "#9B6DFF" : "#8B87A3",
                  fontSize: 12,
                  fontWeight: isYearActive ? 800 : 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  ...press.getPressStyle(),
                }}>
                {year}
              </button>
            );
          })}
        </div>

        {/* TEXTO AÑO SELECCIONADO + BOTÓN TODO EL AÑO */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: tokens.sub }}>{pickerYear}</span>
          <button
            onClick={() => { onSelect({ year: pickerYear, month: null }); onClose(); }}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "none",
              background: tokens.raised,
              color: tokens.text,
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}>
            Todo el año
          </button>
        </div>

        {/* GRILLA DE MESES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {MONTHS_SHORT.map((mLabel, idx) => {
            const month = idx + 1;
            const sel = isSel(month);
            const hasData = monthHasData(month, pickerYear);
            if (!pressMonths[`month-${month}`] && hasData) {
              pressMonths[`month-${month}`] = usePress();
            }
            const press = pressMonths[`month-${month}`];

            return (
              <button
                key={`${pickerYear}-${month}`}
                onClick={() => { if (hasData) { onSelect({ year: pickerYear, month }); onClose(); } }}
                {...(hasData && press ? press.handlers : {})}
                disabled={!hasData}
                style={{
                  padding: "8px 2px",
                  borderRadius: 10,
                  border: "none",
                  cursor: hasData ? "pointer" : "default",
                  background: sel
                    ? "linear-gradient(155deg, #B18CFF, #8B5CF6)"
                    : hasData
                    ? tokens.raised
                    : "transparent",
                  color: sel ? "#fff" : (hasData ? tokens.text : "#5F5C74"),
                  fontSize: 10,
                  fontWeight: sel ? 800 : 600,
                  transition: "all 0.15s",
                  ...(hasData && press ? press.getPressStyle() : {}),
                }}>
                {mLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
