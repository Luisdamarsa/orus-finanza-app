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

import { useState, useMemo } from "react";
import { DARK, LIGHT } from "../constants/tokens";
import { MONTHS_SHORT } from "../constants";
import { usePress } from "../hooks/usePress";

export default function PeriodSelector({ isDark, selectedPeriod, onSelect, onClose, monthHasData, transactions = [] }) {
  const tokens = isDark ? DARK : LIGHT;

  // 🆕 Calcular años dinámicamente desde las transacciones del usuario
  const availableYears = Array.from(
    new Set(transactions.map(t => new Date(t.date).getFullYear()))
  ).sort((a, b) => a - b);

  // Si no hay años con datos, usar 2026 como fallback
  const defaultYear = availableYears.length > 0 ? availableYears[0] : 2026;

  // Estado local para el año seleccionado en el picker
  const [pickerYear, setPickerYear] = useState(selectedPeriod?.year || defaultYear);
  const pressAllTime = usePress();
  const pressClose = usePress();

  // ✅ Crear hooks de usePress AL NIVEL SUPERIOR (no dentro de useMemo)
  // Años 2020-2030
  const pressYear2020 = usePress();
  const pressYear2021 = usePress();
  const pressYear2022 = usePress();
  const pressYear2023 = usePress();
  const pressYear2024 = usePress();
  const pressYear2025 = usePress();
  const pressYear2026 = usePress();
  const pressYear2027 = usePress();
  const pressYear2028 = usePress();
  const pressYear2029 = usePress();
  const pressYear2030 = usePress();

  // Meses 1-12
  const pressMonth1 = usePress();
  const pressMonth2 = usePress();
  const pressMonth3 = usePress();
  const pressMonth4 = usePress();
  const pressMonth5 = usePress();
  const pressMonth6 = usePress();
  const pressMonth7 = usePress();
  const pressMonth8 = usePress();
  const pressMonth9 = usePress();
  const pressMonth10 = usePress();
  const pressMonth11 = usePress();
  const pressMonth12 = usePress();

  // Map para acceder fácilmente
  const pressYears = useMemo(() => ({
    'year-2020': pressYear2020, 'year-2021': pressYear2021, 'year-2022': pressYear2022,
    'year-2023': pressYear2023, 'year-2024': pressYear2024, 'year-2025': pressYear2025,
    'year-2026': pressYear2026, 'year-2027': pressYear2027, 'year-2028': pressYear2028,
    'year-2029': pressYear2029, 'year-2030': pressYear2030,
  }), [pressYear2020, pressYear2021, pressYear2022, pressYear2023, pressYear2024, pressYear2025, pressYear2026, pressYear2027, pressYear2028, pressYear2029, pressYear2030]);

  const pressMonths = useMemo(() => ({
    'month-1': pressMonth1, 'month-2': pressMonth2, 'month-3': pressMonth3,
    'month-4': pressMonth4, 'month-5': pressMonth5, 'month-6': pressMonth6,
    'month-7': pressMonth7, 'month-8': pressMonth8, 'month-9': pressMonth9,
    'month-10': pressMonth10, 'month-11': pressMonth11, 'month-12': pressMonth12,
  }), [pressMonth1, pressMonth2, pressMonth3, pressMonth4, pressMonth5, pressMonth6, pressMonth7, pressMonth8, pressMonth9, pressMonth10, pressMonth11, pressMonth12]);

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

        {/* 🆕 BOTONES DE AÑO - Solo si hay 2+ años */}
        {availableYears.length > 1 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {availableYears.map((year) => {
              const isYearActive = pickerYear === year;
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
        )}

        {/* TEXTO AÑO SELECCIONADO + BOTÓN TODO EL AÑO (solo si 2+ años) */}
        {availableYears.length > 1 && (
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
        )}

        {/* 🆕 Solo mostrar año si hay 1 año */}
        {availableYears.length === 1 && (
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: tokens.sub }}>{pickerYear}</span>
          </div>
        )}

        {/* GRILLA DE MESES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {MONTHS_SHORT.map((mLabel, idx) => {
            const month = idx + 1;
            const sel = isSel(month);
            const hasData = monthHasData(month, pickerYear);
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
