import { useState, useEffect, useRef, useMemo } from "react";
import { usePagination } from "../hooks/usePagination";
import { groupByDate, fmt } from "../utils/formatters";
import { PILLAR_MAP, METHOD_META, ALL_CATS } from "../constants";
import { getAttributeAtDate } from "../services/attributeHistoryService";

/**
 * TransactionsListService
 * Componente reutilizable para renderizar lista de transacciones con scroll, sticky headers y fechas
 * Se utiliza en MovimientosPage y Dashboard (Estado 2)
 *
 * Props:
 * - isDark: boolean (tema)
 * - transactions: array de transacciones YA FILTRADAS (no filtra internamente)
 * - stickyTop: número (opcional) - top value para las fechas sticky (default: 0)
 * - onEditTransaction: function(transaction) - callback al hacer click en una transacción
 */
export default function TransactionsListService({ isDark, transactions, stickyTop = 0, onEditTransaction }) {
  // 🆕 Estado para trackear qué transacción está siendo presionada
  const [pressingTransactionId, setPressingTransactionId] = useState(null);
  const t = isDark
    ? { text: "#F0EEFF", sub: "#7B7A99", divider: "#2D2D3A", bg: "#141420" }
    : { text: "#1A1830", sub: "#9896B0", divider: "#E5E3F5", bg: "#F8F7FF" };

  // 🆕 Ordenar por fecha+hora DESCENDENTE antes de paginar.
  // Si no, slice(0,15) toma un trozo en el orden del array (no por fecha) y al cargar
  // más entran transacciones más nuevas que saltan arriba. Ordenar aquí lo arregla.
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      if (a.date !== b.date) return (b.date || "").localeCompare(a.date || "");
      return (b.time || "").localeCompare(a.time || "");
    });
  }, [transactions]);

  // 🆕 Paginación: 15 a la vez, carga más al llegar al final (acumulativo)
  const { visibleItems, hasMore, loading, loadMore } = usePagination(sortedTransactions, 15, 350);
  const sentinelRef = useRef(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: "120px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadMore]);

  // Agrupar SOLO las visibles por fecha
  const groups = groupByDate(visibleItems);

  return (
    <>
      {groups.length === 0 && (
        <div style={{ textAlign: "center", color: t.sub, fontSize: 13, padding: "28px 0" }}>
          Sin movimientos
        </div>
      )}
      {/* Contenedor externo de la lista */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 10 }}>
        {groups.map((group) => (
          <div key={group.date}>
            {/* Fecha - Sticky Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 2px 6px",
                position: "sticky",
                top: stickyTop,
                zIndex: 20,
                background: isDark ? "#000000" : t.bg,
              }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#8B87A3", letterSpacing: "0.4px" }}>
                {group.label.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: group.dayTotal < 0 ? "#FF8A8A" : "#86EFAC",
                }}>
                {group.dayTotal < 0 ? "-" : "+"}
                {fmt(Math.abs(group.dayTotal))}
              </span>
            </div>

            {/* Contenedor de transacciones del día */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
              {group.items.map((tx, i) => {
              const isIngreso = tx.amount > 0 || tx.pillar === "ingreso";
              const pillar = PILLAR_MAP[tx.pillar] || PILLAR_MAP["varios"];
              const method = METHOD_META[tx.method] || METHOD_META["Banco"];

              const isPressingThisTransaction = pressingTransactionId === tx.id;

              return (
                <div
                  key={tx.id}
                  onClick={() => onEditTransaction && onEditTransaction(tx)}
                  onPointerDown={() => setPressingTransactionId(tx.id)}
                  onPointerUp={() => setPressingTransactionId(null)}
                  onPointerLeave={() => setPressingTransactionId(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 14px",
                    borderRadius: 16,
                    background: "#1a1725",
                    boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                    position: "relative",
                    zIndex: 0,
                    cursor: onEditTransaction ? "pointer" : "default",
                    transform: isPressingThisTransaction ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                    opacity: isPressingThisTransaction ? 0.7 : 1,
                    transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}>
                  {/* Contenedor izquierdo: Ícono + Descripción */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    {/* Ícono/Badge */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 11,
                        flexShrink: 0,
                        background: isIngreso
                          ? "rgba(134,239,172,0.16)"
                          : pillar.color + "28",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        color: isIngreso ? "#86EFAC" : pillar.color,
                      }}>
                      {isIngreso ? "💚" : pillar.icon}
                    </div>

                    {/* Descripción y categoría */}
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "#F5F3FF",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "left",
                      }}>
                      {tx.description}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 3,
                      }}>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#8B87A3",
                          background: "linear-gradient(155deg,#262231,#17151f)",
                          padding: "1px 6px",
                          borderRadius: 8,
                        }}>
                        {tx.method}
                      </span>
                      {isIngreso ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: 5,
                              background: isDark ? "#0d2118" : "#dcfce7",
                              color: "#22C55E",
                            }}>
                            Ingreso
                          </span>
                          {tx.category ? (
                            <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 600 }}>
                              {(() => {
                                const category = ALL_CATS.find((cat) => cat.id === tx.category);
                                if (!category) return tx.category;
                                return getAttributeAtDate(category, "name", tx.date);
                              })()}
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, color: t.sub }}>
                          <span
                            style={{
                              color: pillar.color,
                              fontWeight: 600,
                            }}>
                            {pillar.label}
                          </span>
                          {tx.category ? (
                            <>
                              {" → "}
                              {(() => {
                                // 🆕 Obtener nombre histórico de la categoría en la fecha de la transacción
                                const category = ALL_CATS.find(cat => cat.id === tx.category);
                                if (!category) return tx.category;
                                return getAttributeAtDate(category, "name", tx.date);
                              })()}
                            </>
                          ) : null}
                        </span>
                      )}
                    </div>
                    </div>
                  </div>

                  {/* Monto y hora (derecha) */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: isIngreso
                          ? "#86EFAC"
                          : "#FF8A8A",
                      }}>
                      {isIngreso ? "+" : "-"}
                      {fmt(Math.abs(tx.amount))}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#5F5C74", marginTop: 2 }}>
                      {tx.time}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "18px 0 28px", minHeight: 20 }}>
          <style>{`@keyframes orusSpin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2.5px solid ${t.divider}`, borderTopColor: "#9B6DFF", animation: "orusSpin 0.7s linear infinite", opacity: loading ? 1 : 0 }} />
        </div>
      )}
    </>
  );
}
