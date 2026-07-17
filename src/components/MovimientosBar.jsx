import { useState } from "react";
import { filterTransactions } from "../services/transactionFilterService";
import { PILLAR_MAP } from "../constants";

/**
 * MovimientosBar.jsx
 *
 * Barra de "Movimientos" del dashboard: botón que abre/cierra el Estado 2,
 * con el conteo de movimientos y los chips de filtro (tipo y pilar).
 *
 * Refactor del Dashboard — HU-5. Extraído tal cual desde App.jsx (idéntico).
 * Recibe props (no usa contexto) — igual que antes.
 */
export default function Movimientos({ isDark, transactions, filteredPillar, setFilteredPillar, selectedPeriod, onOpen, isOpen, filterType, setFilterType, setMovementOpenedFrom, setFilterTypeExternal }) {
  // 🆕 Estado para trackear si el botón está siendo presionado
  const [pressingMovimientos, setPressingMovimientos] = useState(false);

  const handleOpen = () => {
    // 🆕 Lógica: la barra SIEMPRE puede cerrar, sin importar cómo se abrió
    if (isOpen) {
      // Cerrar Estado 2 (importa cómo se abrió)
      onOpen(false);
      setMovementOpenedFrom(null);
      setFilterTypeExternal(null);
    } else if (!isOpen) {
      // Abrir desde la barra
      onOpen(true);
      setMovementOpenedFrom("bar");
    }
  };
  const t = isDark ? { text: "#F0EEFF", sub: "#7B7A99", divider: "#2D2D3A", bg: "#141420" } : { text: "#1A1830", sub: "#9896B0", divider: "#E5E3F5", bg: "#F8F7FF" };

  // Filtra por período, pillar y tipo (gastado/ingresos)
  const displayTxns = filterTransactions(transactions, { selectedPeriod, filteredPillar, filterType });

  return (
    <div style={{ marginTop: 0 }}>
      <button
        onClick={handleOpen}
        onPointerDown={() => {
          console.log("🔻 Movimientos presionado");
          setPressingMovimientos(true);
        }}
        onPointerUp={() => {
          console.log("🔺 Movimientos soltado");
          setPressingMovimientos(false);
        }}
        onPointerLeave={() => {
          console.log("🚫 Mouse salió de Movimientos");
          setPressingMovimientos(false);
        }}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: pressingMovimientos ? "rgba(0, 0, 0, 0.2)" : t.bg,
          border: `1.5px solid ${t.divider}`, padding: "10px 8px 10px", cursor: "pointer",
          position: "sticky", top: 0, zIndex: 20, borderRadius: 24, marginBottom: 0,
          overflow: "hidden", boxSizing: "border-box",
          transform: pressingMovimientos ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
          boxShadow: pressingMovimientos ? "inset 0 2px 6px rgba(0, 0, 0, 0.3)" : "none",
          transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Movimientos</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, background: isDark ? "#2D2D3A" : "#E5E3F5", color: t.sub }}>{displayTxns.length}</span>
          {/* 🆕 Badge para filtro de tipo (Gastado/Ingresos) */}
          {filterType && (
            <div onClick={e => { e.stopPropagation(); setFilterType(null); }} style={{
              marginLeft: 6, padding: "1px 7px", borderRadius: 10, border: "none",
              background: filterType === "gastado" ? "#EF444422" : "#22C55E22",
              color: filterType === "gastado" ? "#EF4444" : "#22C55E",
              fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}>
              {filterType === "gastado" ? "Gastado" : "Ingresos"}<span>✕</span>
            </div>
          )}
          {filteredPillar && (
            <div onClick={e => { e.stopPropagation(); setFilteredPillar(null); }} style={{
              marginLeft: 6, padding: "1px 7px", borderRadius: 10, border: "none", background: PILLAR_MAP[filteredPillar]?.color + "22", color: PILLAR_MAP[filteredPillar]?.color, fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}>
              {PILLAR_MAP[filteredPillar]?.icon}{PILLAR_MAP[filteredPillar]?.label}<span>✕</span>
            </div>
          )}
        </div>
        <span style={{ fontSize: 11, color: t.sub, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", marginRight: 8 }}>▼</span>
      </button>
    </div>
  );
}
