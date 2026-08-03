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
    <div
      onClick={handleOpen}
      style={{
        marginTop: "8px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 15px",
        borderRadius: "16px",
        background: "linear-gradient(155deg, #262231 0%, #17151f 100%)",
        boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        border: "none",
        boxSizing: "border-box",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onPointerDown={() => setPressingMovimientos(true)}
      onPointerUp={() => setPressingMovimientos(false)}
      onPointerLeave={() => setPressingMovimientos(false)}
    >
      {/* Label + Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <button
          onClick={handleOpen}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 0,
            outline: "none",
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 800, color: "#F5F3FF" }}>Movimientos</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#9B6DFF",
              background: "rgba(155,109,255,0.16)",
              padding: "1px 6px",
              borderRadius: "10px",
              whiteSpace: "nowrap",
            }}
          >
            {displayTxns.length}
          </span>
        </button>

        {/* Chips de filtros activos */}
        {filterType && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setFilterType(null);
            }}
            style={{
              background: "rgba(255,255,255,0.08)",
              color: filterType === "gastado" ? "#FF8A8A" : "#86EFAC",
              padding: "3px 8px",
              borderRadius: "20px",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {filterType === "gastado" ? "Gastado" : "Ingresos"}
            <span>✕</span>
          </div>
        )}

        {filteredPillar && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setFilteredPillar(null);
            }}
            style={{
              background: "rgba(255,255,255,0.08)",
              color: PILLAR_MAP[filteredPillar]?.color,
              padding: "3px 8px",
              borderRadius: "20px",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {PILLAR_MAP[filteredPillar]?.icon}
            {PILLAR_MAP[filteredPillar]?.label}
            <span>✕</span>
          </div>
        )}
      </div>

      {/* Chevron */}
      <button
        onClick={handleOpen}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          flexShrink: 0,
          padding: 0,
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8B87A3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="M5 9l7 7 7-7" />
        </svg>
      </button>
    </div>
  );
}
