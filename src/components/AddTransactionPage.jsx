import { useState } from "react";
import { usePress } from "../hooks/usePress";
import {
  PILLARS, MANUAL_METHODS, ALL_CATS
} from "../constants";
import { CheckmarkIcon } from "../icons/Icons";
import { getCategoryName } from "../utils/categoryUtils";
import LoadingWrapper from "./LoadingWrapper";
import { FormSkeleton } from "./LoadingSkeleton";

/**
 * Página para agregar una transacción manualmente
 *
 * Funcionalidades:
 * - Ingresar descripción del movimiento
 * - Especificar monto en pesos
 * - Elegir tipo: ingreso (+) o gasto (-)
 * - Seleccionar método de pago
 * - Clasificar gasto por concepto y categoría
 * - Crear nuevos conceptos dinámicamente
 */
export default function AddTransactionPage({
  onBack,
  onDone,
  isDark,
  customConcepts,
  categories = {},
  onCreateCategory
}) {
  /**
   * Convierte {pillarId: [catId1, catId2, ...]} a [{id, name, pillar}, ...]
   * Itera sobre PILLARS para garantizar orden correcto
   */
  const getFormattedCategories = () => {
    const formatted = [];
    // Iterar sobre PILLARS en lugar de Object.entries para garantizar orden
    PILLARS.forEach(pillar => {
      const catIdList = categories[pillar.id] || [];
      if (Array.isArray(catIdList)) {
        catIdList.forEach(catId => {
          formatted.push({ id: catId, name: getCategoryName(catId), pillar: pillar.id });
        });
      }
    });
    return formatted;
  };

  // 🆕 Hook para animación de press en botón de atrás
  const pressBack = usePress();
  // 🆕 Hook para animación de press en botón de guardar
  const pressSave = usePress();
  // 🆕 Estado para trackear qué botón de método está siendo presionado
  const [pressingMethod, setPressingMethod] = useState(null);
  // 🆕 Estado para trackear si el dropdown de categoría está siendo presionado
  const [pressingCategory, setPressingCategory] = useState(false);
  // 🆕 Estado para trackear qué botón de pilar está siendo presionado
  const [pressingPillar, setPressingPillar] = useState(null);
  // 🆕 Estado para trackear qué opción del dropdown está siendo presionada
  const [pressingConcept, setPressingConcept] = useState(null);

  // 🆕 Estado de loading para skeleton
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [desc, setDesc] = useState("");
  const [rawAmount, setRawAmount] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [method, setMethod] = useState(null);
  const [concept, setConcept] = useState(null);
  const [pillarId, setPillarId] = useState(null);
  const [conceptOpen, setConceptOpen] = useState(false);
  const [newConceptText, setNewConceptText] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false); // 🆕 Rastrear si es categoría nueva

  // Cálculos derivados
  const numericAmount = parseInt(rawAmount.replace(/\D/g, "")) || 0;
  const hasAmount = numericAmount > 0;
  const t = isDark
    ? {
        bg: "#0D0D1A",
        card: "#181828",
        border: "#2D2D3A",
        cardBorder: "#2D2D4A",
        text: "#F0EEFF",
        sub: "#7B7A99",
        ph: "#4A4A6A",
        divider: "#252538"
      }
    : {
        bg: "#F8F7FF",
        card: "#FFFFFF",
        border: "#E5E3F5",
        cardBorder: "#E5E3F5",
        text: "#1A1830",
        sub: "#9896B0",
        ph: "#C4C2E0",
        divider: "#F0EFF8"
      };
  const amountColor = hasAmount ? (isIncome ? "#22C55E" : "#EF4444") : t.sub;

  /**
   * Selecciona un concepto del listado de categorías
   */
  function handleConceptPick(cat) {
    setConcept(cat.name);
    setPillarId(cat.pillar);
    setConceptOpen(false);
    setNewConceptText("");
  }

  /**
   * Crea una nueva categoría (temporal, se guardarán al seleccionar pilar)
   */
  function handleCreateCategory() {
    const name = newConceptText.trim();
    if (!name) return;
    setConcept(name);
    setPillarId(null);
    setIsNewCategory(true); // 🆕 Marcar como nueva
    setConceptOpen(false);
    setNewConceptText("");
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        padding: "56px 22px 24px",
        boxSizing: "border-box"
      }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ddDown   { from{opacity:0;transform:scaleY(0.92);transform-origin:top} to{opacity:1;transform:scaleY(1)} }
      `}</style>

      {/* Botón Atrás */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 0 }}>
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

      {/* Contenido del formulario - centrado en toda la pantalla */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "22px",
          right: "22px",
          transform: "translateY(-50%)",
          zIndex: 41
        }}>
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: 20,
            padding: "18px 18px 16px",
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(100,80,200,0.08)"
          }}>
          {/* Título */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#9B6DFF",
              letterSpacing: 1,
              marginBottom: 12
            }}>
            NUEVA TRANSACCIÓN
          </div>

          <style>{`
            .add-transaction-input::placeholder {
              color: #9896B0;
              opacity: 0.35;
            }
          `}</style>

          {/* 🆕 LoadingWrapper para mostrar skeleton mientras carga */}
          <LoadingWrapper
            isLoading={isLoading}
            skeleton={<FormSkeleton isDark={isDark} fieldCount={6} />}
            isDark={isDark}
          >
            <>

          {/* Input Descripción */}
          <input
            type="text"
            className="add-transaction-input"
            placeholder="Descripción del movimiento..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 14,
              fontWeight: desc ? 700 : 400,
              color: desc ? t.text : t.ph,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              marginBottom: 14,
              padding: 0,
              boxSizing: "border-box"
            }}
          />

          <div style={{ height: 1, background: t.divider, marginBottom: 12 }} />

          {/* Input Monto + Botones +/- */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12
            }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              {/* 🆕 $ solo aparece cuando hay valor */}
              {numericAmount > 0 && (
                <span style={{ fontSize: 13, fontWeight: 700, color: amountColor }}>
                  $
                </span>
              )}
              <input
                type="text"
                inputMode="numeric"
                className="add-transaction-input"
                placeholder="Monto"
                value={
                  numericAmount > 0
                    ? numericAmount.toLocaleString("es-CO")
                    : ""
                }
                onChange={(e) => setRawAmount(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: 22,
                  fontWeight: 800,
                  color: amountColor,
                  width: 140,
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  padding: 0
                }}
              />
            </div>

            {/* Botones +/- */}
            {hasAmount && (
              <div
                style={{
                  display: "flex",
                  borderRadius: 8,
                  overflow: "hidden",
                  border: `1px solid ${t.border}`,
                  animation: "fadeInUp 0.18s ease",
                  flexShrink: 0
                }}>
                <button
                  onClick={() => setIsIncome(false)}
                  style={{
                    padding: "4px 9px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    background: !isIncome
                      ? "#FCA5A5"
                      : isDark
                        ? "#252538"
                        : "#F8F7FF",
                    color: !isIncome ? "#991B1B" : t.sub,
                    transition: "all 0.15s"
                  }}>
                  −
                </button>
                <div style={{ width: 1, background: t.border }} />
                <button
                  onClick={() => setIsIncome(true)}
                  style={{
                    padding: "4px 9px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    background: isIncome
                      ? "#86EFAC"
                      : isDark
                        ? "#252538"
                        : "#F8F7FF",
                    color: isIncome ? "#14532D" : t.sub,
                    transition: "all 0.15s"
                  }}>
                  +
                </button>
              </div>
            )}
          </div>

          {/* Método de pago */}
          <div style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 14,
            marginLeft: "-36px",
            marginRight: "-36px",
            paddingLeft: "36px",
            paddingRight: "36px"
          }}>
            {MANUAL_METHODS.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  onPointerDown={() => setPressingMethod(m.id)}
                  onPointerUp={() => setPressingMethod(null)}
                  onPointerLeave={() => setPressingMethod(null)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    border: "none",
                    cursor: "pointer",
                    background: pressingMethod === m.id
                      ? `${m.color}44`
                      : active
                        ? m.color + "22"
                        : isDark
                          ? "#252538"
                          : "#F0EFF8",
                    color: active ? m.color : t.sub,
                    fontSize: 11,
                    fontWeight: 700,
                    outline: active
                      ? `1.5px solid ${m.color}66`
                      : "1.5px solid transparent",
                    transition: "all 0.18s",
                    transform: pressingMethod === m.id ? "scale(0.94)" : "scale(1)",
                    opacity: pressingMethod === m.id ? 0.7 : 1,
                  }}>
                  {m.icon} {m.id}
                </button>
              );
            })}
          </div>

          {!isIncome && (
            <div style={{ height: 1, background: t.divider, marginBottom: 12 }} />
          )}

          {/* Info de ingreso */}
          {isIncome && hasAmount && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 14px",
                borderRadius: 14,
                background: isDark ? "#0d2118" : "#F0FDF4",
                border: "1px solid #86EFAC44",
                animation: "fadeInUp 0.2s ease"
              }}>
              <span style={{ fontSize: 16 }}>💰</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>
                  → Tu saldo
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: isDark ? "#5ebd8a" : "#4ade80",
                    marginTop: 1
                  }}>
                  El ingreso se suma directamente a tu saldo
                </div>
              </div>
            </div>
          )}

          {/* Selector de Concepto (solo para gastos) */}
          {!isIncome && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setConceptOpen((o) => !o)}
                onPointerDown={() => setPressingCategory(true)}
                onPointerUp={() => setPressingCategory(false)}
                onPointerLeave={() => setPressingCategory(false)}
                style={{
                  width: "100%",
                  padding: "8px 14px",
                  borderRadius: 20,
                  cursor: "pointer",
                  border: `1.5px dashed ${
                    concept ? "#9B6DFF99" : "#9B6DFF66"
                  }`,
                  background: pressingCategory ? "#9B6DFF22" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "border 0.2s",
                  transform: pressingCategory ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                  boxShadow: pressingCategory ? "inset 0 2px 4px rgba(155, 109, 255, 0.3)" : "none",
                }}>
                <span style={{ fontSize: 13 }}>🏷</span>
                <span
                  style={{
                    fontSize: 12,
                    color: concept ? t.text : "#9B6DFF",
                    fontWeight: concept ? 700 : 500,
                    flex: 1,
                    textAlign: "left"
                  }}>
                  {concept || "Selecciona la categoría"}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9B6DFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: conceptOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s"
                  }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown de conceptos */}
              {conceptOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    background: isDark ? "#1C1C2E" : "#FAFAFE",
                    border: `1px solid ${isDark ? "#2D2D4A" : "#E5E3F5"}`,
                    borderRadius: 20,
                    boxShadow: isDark
                      ? "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(155,109,255,0.12)"
                      : "0 12px 40px rgba(100,80,200,0.14), 0 0 0 1px rgba(155,109,255,0.08)",
                    maxHeight: 230,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    animation: "ddDown 0.18s ease",
                    padding: "6px"
                  }}>
                  {/* Input para crear concepto */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      background: isDark ? "#252540" : "#F0EEFF",
                      borderRadius: 14,
                      marginBottom: 6
                    }}>
                    <span style={{ fontSize: 14 }}>✦</span>
                    <input
                      type="text"
                      placeholder="Nueva categoría..."
                      value={newConceptText}
                      onChange={(e) => setNewConceptText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCreateCategory()
                      }
                      style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        fontSize: 12,
                        color: t.text,
                        fontStyle: "italic",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                      }}
                    />
                    {newConceptText.trim() && (
                      <button
                        onClick={handleCreateCategory}
                        style={{
                          padding: "4px 11px",
                          borderRadius: 20,
                          border: "none",
                          background: "linear-gradient(135deg,#9B6DFF,#4F8EF7)",
                          color: "white",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          flexShrink: 0
                        }}>
                        Crear
                      </button>
                    )}
                  </div>

                  {/* Lista de conceptos - Iterando sobre PILLARS para mantener orden */}
                  {PILLARS.map(p => {
                    const allCats = [...getFormattedCategories(), ...(customConcepts || [])];
                    const cats = allCats.filter(cat => cat.pillar === p.id);

                    return (
                      <div key={p.id} style={{ marginBottom: 4 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            margin: "2px 4px 4px",
                            padding: "2px 9px",
                            borderRadius: 20,
                            background: isDark
                              ? `${p.color}22`
                              : `${p.color}18`,
                            border: `1px solid ${p.color}44`
                          }}>
                          <span style={{ fontSize: 9 }}>{p.icon}</span>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              color: p.color,
                              letterSpacing: 0.6
                            }}>
                            {p.label.toUpperCase()}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            padding: "0 2px"
                          }}>
                          {cats.map((cat) => {
                            const isActive = concept === cat.name;
                            return (
                              <button
                                key={cat.name}
                                onClick={() => handleConceptPick(cat)}
                                onPointerDown={() => setPressingConcept(cat.name)}
                                onPointerUp={() => setPressingConcept(null)}
                                onPointerLeave={() => setPressingConcept(null)}
                                style={{
                                  width: "100%",
                                  padding: "7px 12px",
                                  border: "none",
                                  cursor: "pointer",
                                  borderRadius: 12,
                                  background: pressingConcept === cat.name
                                    ? `${p.color}44`
                                    : isActive
                                      ? isDark
                                        ? `${p.color}30`
                                        : `${p.color}18`
                                      : "transparent",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  transition: "background 0.15s",
                                  transform: pressingConcept === cat.name ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                                  opacity: pressingConcept === cat.name ? 0.7 : 1,
                                }}>
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: isActive ? 700 : 400,
                                    color: isActive ? p.color : t.text
                                  }}>
                                  {cat.name}
                                </span>
                                {isActive && (
                                  <CheckmarkIcon width={12} height={12} color={p.color} strokeWidth={3} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selector de categoría (solo si concepto seleccionado y es gasto) */}
          {!isIncome && concept && !conceptOpen && (
            <div style={{ marginTop: 12, animation: "fadeInUp 0.2s ease" }}>
              <div
                style={{
                  fontSize: 10,
                  marginBottom: 8,
                  fontWeight: 600,
                  color: pillarId ? t.sub : "#F59E0B",
                  display: "flex",
                  alignItems: "center",
                  gap: 5
                }}>
                {pillarId ? (
                  <>
                    Pilar <span style={{ opacity: 0.6 }}>· toca para cambiar</span>
                  </>
                ) : (
                  <>⚑ Elige un pilar para esta categoría</>
                )}
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {PILLARS.map((p) => {
                  const active = pillarId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPillarId(p.id);
                        // 🆕 Si es una categoría nueva, guardarla en categories
                        if (isNewCategory && concept && onCreateCategory) {
                          onCreateCategory(concept, p.id);
                          setIsNewCategory(false);
                        }
                      }}
                      onPointerDown={() => setPressingPillar(p.id)}
                      onPointerUp={() => setPressingPillar(null)}
                      onPointerLeave={() => setPressingPillar(null)}
                      style={{
                        flex: 1,
                        padding: "7px 2px",
                        borderRadius: 12,
                        border: "none",
                        cursor: "pointer",
                        background: pressingPillar === p.id
                          ? `${p.color}44`
                          : active
                            ? isDark
                              ? p.darkBg
                              : p.bg
                            : isDark
                              ? "#252538"
                              : "#F0EFF8",
                        outline: active
                          ? `2px solid ${p.color}88`
                          : "2px solid transparent",
                        transition: "all 0.18s",
                        transform: pressingPillar === p.id ? "scale(0.94)" : "scale(1)",
                        opacity: pressingPillar === p.id ? 0.7 : 1,
                      }}>
                      <div style={{ fontSize: 16 }}>{p.icon}</div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          marginTop: 2,
                          color: active
                            ? isDark
                              ? p.color
                              : p.darkColor
                            : t.sub
                        }}>
                        {p.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
            </>
      <div style={{ position: "absolute", bottom: 24, right: 22 }}>
        <button
          onClick={() =>
            onDone({
              desc,
              rawAmount,
              isIncome,
              method,
              concept,
              pillarId
            })
          }
          onPointerDown={() => (desc || hasAmount) && pressSave.handlers.onPointerDown()}
          onPointerUp={() => pressSave.handlers.onPointerUp()}
          onPointerLeave={() => pressSave.handlers.onPointerLeave()}
          disabled={!desc && !hasAmount}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
            cursor: desc || hasAmount ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: desc || hasAmount ? (pressSave.pressing ? 0.9 : 1) : 0.45,
            ...(desc || hasAmount ? pressSave.getPressStyle() : {}),
          }}>
          <CheckmarkIcon width={22} height={22} color="white" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
