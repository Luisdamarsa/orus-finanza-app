import { useState } from "react";
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

  // Agrupar transacciones por fecha
  const groups = groupByDate(transactions);

  return (
    <>
      {groups.map((group) => (
        <div key={group.date} style={{ display: "contents" }}>
          {/* Fecha - Sticky Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 6,
              paddingBottom: 3,
              position: "sticky",
              top: stickyTop,
              zIndex: 20,
              background: "#000000",
              marginBottom: 6,
              marginTop: 0,
            }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: t.sub }}>
              {group.label.toUpperCase()}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: group.dayTotal < 0 ? "#EF4444" : "#22C55E",
              }}>
              {group.dayTotal < 0 ? "-" : "+"}
              {fmt(Math.abs(group.dayTotal))}
            </span>
          </div>

          {/* Contenedor de transacciones */}
          <div
            style={{
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${t.divider}`,
              position: "relative",
              zIndex: 0,
            }}>
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
                    gap: 12,
                    padding: "13px 16px",
                    borderBottom:
                      i < group.items.length - 1
                        ? `1px solid ${t.divider}`
                        : "none",
                    background: isPressingThisTransaction
                      ? "rgba(0, 0, 0, 0.1)"
                      : isIngreso
                      ? isDark
                        ? "#0b1f14"
                        : "#f0fdf4"
                      : isDark
                      ? "#1A1A28"
                      : "#FFFFFF",
                    position: "relative",
                    zIndex: 0,
                    cursor: onEditTransaction ? "pointer" : "default",
                    transform: isPressingThisTransaction ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                    opacity: isPressingThisTransaction ? 0.7 : 1,
                    boxShadow: isPressingThisTransaction ? "inset 0 2px 6px rgba(0, 0, 0, 0.2)" : "none",
                    transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}>
                  {/* Ícono/Badge */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      flexShrink: 0,
                      background: isIngreso
                        ? "#22C55E28"
                        : pillar.color + "28",
                      border: `1px solid ${
                        isIngreso ? "#22C55E44" : pillar.color + "44"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}>
                    {isIngreso ? "💚" : pillar.icon}
                  </div>

                  {/* Descripción y categoría */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: t.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                      {tx.desc}
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
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 5,
                          background: isDark
                            ? method.darkBg || "#1e2535"
                            : method.bg || "#F1F5F9",
                          color: method.color,
                        }}>
                        {tx.method}
                      </span>
                      {isIngreso ? (
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

                  {/* Monto y hora */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: isIngreso
                          ? "#22C55E"
                          : tx.pillar === "ahorro"
                          ? isDark
                            ? "#86EFAC"
                            : "#22C55E"
                          : isDark
                          ? "#FCA5A5"
                          : "#EF4444",
                      }}>
                      {isIngreso ? "+" : "-"}
                      {fmt(Math.abs(tx.amount))}
                    </div>
                    <div style={{ fontSize: 10, color: t.sub, marginTop: 2 }}>
                      {tx.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
