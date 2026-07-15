import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { usePress } from "../hooks/usePress";
import { groupByDate, fmt } from "../utils/formatters";
import { METHOD_META, ALL_CATS } from "../constants";
import TransactionsListService from "./TransactionsListService";
import CategoryProgressBar from "./CategoryProgressBar";
import { getCategoryById, getCategoryName } from "../utils/categoryUtils";
import { getAttributeAtDate } from "../services/attributeHistoryService";

/**
 * Página de Movimientos de un pilar específico
 * Muestra:
 * - Total gastado en el pilar
 * - Porcentaje del presupuesto (a favor o sobrepasado)
 * - Desglose por categoría
 * - Lista de movimientos (igual al Estado 2 filtrado)
 */
export default function MovimientosPage({
  isDark,
  onBack,
  pilar,
  transactions,
  selectedPeriod,
  categories = {},
  categoryBudgets = {},
  onEditTransaction, // 🆕 Callback para editar transacción
}) {
  // 🆕 Hooks para animación de press en botones
  const pressBack = usePress();
  const pressClearFilter = usePress();
  // 🆕 Estado para trackear qué tag de categoría está siendo presionado (mantener por múltiples tags)
  const [pressingCategoryTag, setPressingCategoryTag] = useState(null);

  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0" };

  // Filtrar transacciones por pilar y período
  const pillarTxns = transactions.filter((tx) => {
    const matchesPillar = tx.pillar === pilar.id;
    if (!selectedPeriod) return matchesPillar; // "Todo"
    const [y, m, d] = tx.date.split("-").map(Number);
    return matchesPillar && y === selectedPeriod.year && m === selectedPeriod.month;
  });

  // Calcular total gastado (sum de amounts negativos)
  const totalSpent = Math.abs(
    pillarTxns.reduce((sum, tx) => sum + Math.min(tx.amount, 0), 0)
  );

  // 🆕 Obtener categorías del pilar desde el estado `categories` (ahora con IDs)
  const pillarCategories = categories[pilar.id] || [];

  // Desglose por categoría - mostrar TODAS las categorías del pilar
  const categorySpent = {};
  // Inicializar todas las categorías del pilar en 0 (usando IDs)
  pillarCategories.forEach((catId) => {
    categorySpent[catId] = 0;
  });
  // Sumar los gastos reales (usando IDs de categoría)
  pillarTxns.forEach((tx) => {
    const catId = tx.category || null;
    if (catId) {
      categorySpent[catId] = (categorySpent[catId] || 0) + Math.abs(Math.min(tx.amount, 0));
    }
  });

  // Porcentaje del presupuesto
  const budget = pilar.budget || null;
  const percentage = budget ? (totalSpent / budget) * 100 : null;
  const isOverBudget = percentage && percentage > 100;

  // 🆕 Obtener el color oscuro del pilar CON OPACIDAD (15%) para la barra de categorías
  const pillarSoftColor = (pilar.darkColor || "#22C55E") + "26";

  // 🆕 Obtener color suave de Deuda para cuando se pasa presupuesto
  const debtSoftColor = "#FCA5A5";

  // 🆕 Estado para filtros de categorías seleccionadas (ahora con IDs)
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 🆕 Filtrar transacciones por categorías seleccionadas (usando IDs)
  const filteredTxns = selectedCategories.length > 0
    ? pillarTxns.filter(tx => tx.category && selectedCategories.includes(tx.category))
    : pillarTxns;

  // Agrupar transacciones por fecha (usando las filtradas)
  const groups = groupByDate(filteredTxns);

  // Expandir/contraer alturas
  const [expandedHeights, setExpandedHeights] = useState({});
  const contentRefs = useRef({});

  // 🆕 Estado para la altura dinámica de MOVIMIENTOS
  const [movimientosHeight, setMovimientosHeight] = useState(0); // 0 inicialmente
  const movimientosRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // 🆕 Calcular top del contenedor scrolleable (constante: 104 header + 76 presupuesto = 180px)
  const contentTop = 180;

  // 🆕 Medir altura de MOVIMIENTOS
  useEffect(() => {
    const measureHeight = () => {
      if (movimientosRef.current) {
        const height = movimientosRef.current.offsetHeight;
        setMovimientosHeight(height);
      }
    };

    // Medir después de montar (para tener el valor correcto)
    setTimeout(measureHeight, 50);

    // Re-medir en cambios (filtros)
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, [selectedCategories]);

  useEffect(() => {
    groups.forEach((group) => {
      const ref = contentRefs.current[group.date];
      if (ref && !expandedHeights[group.date]) {
        setExpandedHeights((prev) => ({
          ...prev,
          [group.date]: ref.scrollHeight,
        }));
      }
    });
  }, [groups]);

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, position: "relative" }}>
      {/* Header fijo (top: 52, height: 52) */}
      <div style={{
        position: "absolute",
        top: 52,
        left: 0,
        right: 0,
        height: 52,
        background: t.bg,
        padding: "8px 22px",
        boxSizing: "border-box",
        borderBottom: `1px solid ${t.border}`,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            {...pressBack.handlers}
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
              ...pressBack.getPressStyle(),
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
          <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>
            Atrás
          </span>
        </div>
      </div>

      {/* Sección de Título - Barra del Pilar + Filtros (top: 104, height: 76px) */}
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 0,
          right: 0,
          background: t.bg,
          padding: "10px 22px",
          boxSizing: "border-box",
          zIndex: 25,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
        {/* Barra del pilar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
          <div
            style={{
              flex: 1,
              height: 32,
              borderRadius: 8,
              background: isDark ? "#2D2D3A" : "#E5E3F5",
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              position: "relative",
              overflow: "hidden",
            }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                background: isOverBudget ? debtSoftColor : pillarSoftColor,
                width: percentage ? Math.min(percentage, 100) + "%" : "100%",
                borderRadius: 8,
                zIndex: 1,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: t.text,
                display: "flex",
                alignItems: "center",
                gap: 6,
                position: "relative",
                zIndex: 2,
              }}>
              {pilar.icon} {pilar.label}
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: isOverBudget ? "#FCA5A5" : pilar.darkColor,
              textAlign: "right",
              minWidth: 80,
            }}>
            -{fmt(totalSpent)}
          </div>
        </div>

        {/* Porcentaje */}
        {percentage !== null && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isOverBudget ? "#FCA5A5" : pilar.darkColor,
            }}>
            {percentage.toFixed(0)}% del presupuesto
          </div>
        )}
      </div>

      {/* Contenido scrolleable (top: 184px = 104 + 60 + 20) */}
      <div
        ref={scrollContainerRef}
        style={{
          position: "absolute",
          top: contentTop,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          padding: "0 22px 120px 22px",
          boxSizing: "border-box",
        }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* 🆕 Desglose por categoría (adaptativo, sin presupuesto) */}
        {Object.keys(categorySpent).length > 0 && (
          <div style={{ marginBottom: 32, paddingTop: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 16 }}>
              Categoría
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(() => {
                const entries = Object.entries(categorySpent).sort(([, a], [, b]) => b - a);

                // 🆕 Calcular maxSpent basado en la categoría con más gasto
                // Si esa categoría tiene borde punteado (gasto > 50% presupuesto), usar presupuesto
                // Si no, usar gasto
                let maxSpent = 1;
                if (entries.length > 0) {
                  const [maxCategoryId, maxCategorySpent] = entries[0];
                  const maxCategoryBudget = categoryBudgets[maxCategoryId] || null;
                  const budgetPercentage = maxCategoryBudget ? (maxCategorySpent / maxCategoryBudget) * 100 : 0;
                  const hasVisibleBorder = maxCategoryBudget && budgetPercentage > 50;

                  maxSpent = hasVisibleBorder ? maxCategoryBudget : maxCategorySpent;
                }

                return entries.map(([categoryId, spent]) => {
                  const categoryBudget = categoryBudgets[categoryId] || null;

                  // 🆕 Obtener nombre histórico de la categoría en la fecha del período
                  let categoryName = getCategoryName(categoryId);
                  const category = ALL_CATS.find(cat => cat.id === categoryId);
                  if (category && selectedPeriod && selectedPeriod.month && selectedPeriod.year) {
                    const queryDate = `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}-15`;
                    categoryName = getAttributeAtDate(category, "name", queryDate);
                  }

                  return (
                    <CategoryProgressBar
                      key={categoryId}
                      categoryId={categoryId}
                      categoryName={categoryName}
                      spent={spent}
                      budget={categoryBudget}
                      maxSpent={maxSpent}
                      pillarColor={pilar.darkColor}
                      isDark={isDark}
                      onClickBar={() => {
                        // Toggle: si ya está seleccionada, remover; si no, agregar
                        setSelectedCategories(prev =>
                          prev.includes(categoryId)
                            ? prev.filter(c => c !== categoryId)
                            : [...prev, categoryId]
                        );
                      }}
                      isSelected={selectedCategories.includes(categoryId)}
                    />
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* 🆕 MOVIMIENTOS - Sticky DENTRO del scroll */}
        {pillarTxns.length > 0 && (
          <div
            ref={movimientosRef}
            style={{
              position: "sticky",
              top: 0,
              zIndex: 25,
              background: t.bg,
              padding: "0px 0",
              marginBottom: 0,
            }}>
            {/* Header de Movimientos - Centrado (sin filtros) o con Filtros (con filtros) */}
            {selectedCategories.length === 0 ? (
              // Sin filtros: MOVIMIENTOS centrado
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: t.sub,
                  textAlign: "center",
                }}>
                MOVIMIENTOS
              </div>
            ) : (
              // Con filtros: MOVIMIENTOS + Tags alineados a la izquierda
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: t.sub,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}>
                {/* 🆕 Comportamiento condicional según cantidad de filtros */}
                {selectedCategories.length === 1 ? (
                  // CASO 1: Solo 1 filtro → al lado de MOVIMIENTOS
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}>
                      <span>MOVIMIENTOS</span>
                      {selectedCategories.map((cat, idx) => {
                        const catColor = pilar.darkColor || "#22C55E";

                        // 🆕 Obtener nombre histórico de la categoría filtrada
                        let displayName = getCategoryName(cat);
                        const category = ALL_CATS.find(c => c.id === cat);
                        if (category && selectedPeriod && selectedPeriod.month && selectedPeriod.year) {
                          const queryDate = `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}-15`;
                          displayName = getAttributeAtDate(category, "name", queryDate);
                        }

                        const isPressingThisTag = pressingCategoryTag === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedCategories(prev =>
                                prev.filter(c => c !== cat)
                              );
                            }}
                            onPointerDown={() => setPressingCategoryTag(idx)}
                            onPointerUp={() => setPressingCategoryTag(null)}
                            onPointerLeave={() => setPressingCategoryTag(null)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "3px 8px",
                              borderRadius: 5,
                              border: `1px solid ${catColor}`,
                              background: isPressingThisTag ? catColor + "40" : (catColor + "15"),
                              color: catColor,
                              fontSize: 10,
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.2s",
                              transform: isPressingThisTag ? "scale(0.95)" : "scale(1)",
                              opacity: isPressingThisTag ? 0.7 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!isPressingThisTag) {
                                e.target.style.background = catColor + "25";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isPressingThisTag) {
                                e.target.style.background = catColor + "15";
                              }
                            }}>
                            {displayName}
                            <span style={{ fontSize: 9, marginLeft: 2, fontWeight: 700 }}>✕</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Botón Limpiar filtro a la derecha */}
                    {selectedCategories.length > 1 && (
                      <button
                        onClick={() => {
                          console.log("✅ Limpiar filtro - onClick");
                          setSelectedCategories([]);
                        }}
                        {...pressClearFilter.handlers}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 8px",
                          borderRadius: 5,
                          border: "1px solid #6B7280",
                          background: "#6B728066",
                          color: "#E5E7EB",
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          ...pressClearFilter.getPressStyle(),
                        }}
                        onMouseEnter={(e) => {
                          if (!pressClearFilter.pressing) {
                            e.target.style.background = "#6B728099";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!pressClearFilter.pressing) {
                            e.target.style.background = "#6B728066";
                          }
                        }}>
                        Limpiar filtro
                      </button>
                    )}
                  </div>
                ) : (
                  // CASO 2: 2 o más filtros → debajo de MOVIMIENTOS centrado
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                      }}>
                      <span>MOVIMIENTOS</span>

                      {/* Botón Limpiar filtro a la derecha - posición absoluta */}
                      {selectedCategories.length > 1 && (
                        <button
                          onClick={() => {
                            console.log("✅ Limpiar filtro (2do) - onClick");
                            setSelectedCategories([]);
                          }}
                          {...pressClearFilter.handlers}
                          style={{
                            position: "absolute",
                            right: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px 8px",
                            borderRadius: 5,
                            border: "1px solid #6B7280",
                            background: "#6B728066",
                            color: "#E5E7EB",
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            ...pressClearFilter.getPressStyle(),
                          }}
                          onMouseEnter={(e) => {
                            if (!pressClearFilter.pressing) {
                              e.target.style.background = "#6B728099";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!pressClearFilter.pressing) {
                              e.target.style.background = "#6B728066";
                            }
                          }}>
                          Limpiar filtro
                        </button>
                      )}
                    </div>

                    {/* Tags de Filtros debajo */}
                    {selectedCategories.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                        }}>
                        {selectedCategories.map((cat, idx) => {
                          const catColor = pilar.darkColor || "#22C55E";

                          // 🆕 Obtener nombre histórico de la categoría filtrada (caso múltiples filtros)
                          let displayName = getCategoryName(cat);
                          const category = ALL_CATS.find(c => c.id === cat);
                          if (category && selectedPeriod && selectedPeriod.month && selectedPeriod.year) {
                            const queryDate = `${selectedPeriod.year}-${String(selectedPeriod.month).padStart(2, '0')}-15`;
                            displayName = getAttributeAtDate(category, "name", queryDate);
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedCategories(prev =>
                                  prev.filter(c => c !== cat)
                                );
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 8px",
                                borderRadius: 5,
                                border: `1px solid ${catColor}`,
                                background: catColor + "15",
                                color: catColor,
                                fontSize: 10,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = catColor + "25";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = catColor + "15";
                              }}>
                              {displayName}
                              <span style={{ fontSize: 9, marginLeft: 2, fontWeight: 700 }}>✕</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Grupos de transacciones por fecha */}
        {pillarTxns.length > 0 ? (
          <TransactionsListService isDark={isDark} transactions={filteredTxns} stickyTop={movimientosHeight} onEditTransaction={onEditTransaction} />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: t.sub,
              fontSize: 14,
            }}>
            Sin movimientos en este período
          </div>
        )}
      </div>

      {/* 🆕 Gradiente de desvanecimiento flotante (sobre el contenedor scrolleable) */}
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
