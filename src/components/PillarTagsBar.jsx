import { useState } from "react";

/**
 * PillarTagsBar.jsx
 *
 * ESTADO 2: Barra de tags de pilares
 * Renderiza los tags horizontales con porcentajes de cada pilar + saldo
 * Se muestra cuando Estado 2 está abierto (isMovementOpen === true)
 *
 * Props:
 *   PILLARS, chipPcts, saldoPctFinal, hasSaldo, SALDO_COLOR
 *   filteredPillar, setFilteredPillar, filterType, setFilterType
 *   isDark, t (tema)
 */
export default function PillarTagsBar({
  PILLARS,
  chipPcts,
  saldoPctFinal,
  hasSaldo,
  SALDO_COLOR,
  filteredPillar,
  setFilteredPillar,
  setFilterType,
}) {
  // 🆕 Estado para trackear qué tag está siendo presionado
  const [pressingId, setPressingId] = useState(null);

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {/* Tags de pilares */}
      {PILLARS.map((p, i) => {
        const isFiltered = filteredPillar === p.id;
        const isPressing = pressingId === p.id; // 🆕 Verificar si este tag está siendo presionado
        if (isPressing) console.log("🎯 RENDERING TAG PRESSED:", p.id, "isPressing:", isPressing);

        return (
          <button
            key={p.id}
            onMouseDown={() => {
              console.log("🔻 TAG PRESS DOWN:", p.id);
              setPressingId(p.id);
            }} // 🆕 Al presionar (desktop)
            onMouseUp={() => {
              console.log("🔺 TAG PRESS UP:", p.id);
              setPressingId(null);
            }} // 🆕 Al soltar (desktop)
            onMouseLeave={() => {
              console.log("🚫 TAG MOUSE LEAVE:", p.id);
              setPressingId(null);
            }} // 🆕 Si el mouse deja el elemento (desktop)
            onTouchStart={() => {
              console.log("👆 TAG TOUCH START:", p.id);
              setPressingId(p.id);
            }} // 🆕 Al presionar (móvil)
            onTouchEnd={() => {
              console.log("👆 TAG TOUCH END:", p.id);
              setPressingId(null);
            }} // 🆕 Al soltar (móvil)
            onTouchCancel={() => {
              console.log("👆 TAG TOUCH CANCEL:", p.id);
              setPressingId(null);
            }} // 🆕 Si se cancela el touch (móvil)
            onClick={() => {
              // Filtros mutuamente excluyentes: limpiar filterType
              if (!isFiltered) {
                setFilterType(null);
              }
              setFilteredPillar(isFiltered ? null : p.id);
            }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 2px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              background: isFiltered ? p.color + "33" : p.color + "1A",
              outline: isFiltered ? `1.5px solid ${p.color}BB` : `1px solid ${p.color}44`,
              transform: isPressing ? "scale(0.88) translateY(0.5px)" : "scale(1) translateY(0)", // 🆕 Se empequeñece más al presionar
              opacity: isPressing ? 0.5 : 1, // 🆕 Opacidad más baja al presionar
              boxShadow: isPressing ? "inset 0 2px 4px rgba(0, 0, 0, 0.3)" : "none", // 🆕 Sombra inset al presionar
              transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)", // 🆕 Transición suave
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, color: p.color }}>{p.label}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: p.color, opacity: 0.8 }}>{chipPcts[i]}%</div>
          </button>
        );
      })}

      {/* Tag de Saldo - Solo si existe saldo */}
      {hasSaldo && (
        <button
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 2px",
            borderRadius: 9,
            border: "none",
            cursor: "default",
            background: SALDO_COLOR + "1A",
            outline: `1px solid ${SALDO_COLOR}44`,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, color: SALDO_COLOR }}>Saldo</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: SALDO_COLOR, opacity: 0.8 }}>{saldoPctFinal}%</div>
        </button>
      )}
    </div>
  );
}
