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
  filterType,
  setFilterType,
  isDark,
  t,
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {/* Tags de pilares */}
      {PILLARS.map((p, i) => {
        const isFiltered = filteredPillar === p.id;
        return (
          <button
            key={p.id}
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
