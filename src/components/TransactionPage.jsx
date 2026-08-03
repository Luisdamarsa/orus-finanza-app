import { useState, useEffect } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import { PILLARS, MANUAL_METHODS, ALL_CATS } from "../constants";
import { CheckmarkIcon, TrashIcon } from "../icons/Icons";
import { getCategoryName } from "../utils/categoryUtils";
import LoadingWrapper from "./LoadingWrapper";
import { FormSkeleton } from "./LoadingSkeleton";
import { DARK, LIGHT, RADIUS } from "../constants/tokens";
import { inputStyles, buttonStyles, getClayShadow } from "../utils/clayStyles";
import { getPaymentMethodColor } from "../utils/colorUtils";

/**
 * TransactionPage.jsx - REFORMULADA (Crear + Editar)
 *
 * Página modal para agregar o editar una transacción
 *
 * Características:
 * - Modo NUEVO: Todos los campos vacíos
 * - Modo EDITAR: Pre-llena todos los datos, botón guardar deshabilitado hasta cambio
 * - Botón guardar (✓) flotante esquina inferior derecha
 * - Botón eliminar (🗑️) flotante esquina inferior izquierda (solo en modo edición)
 * - Mismas animaciones de press en ambos botones
 * - Mismo layout modal centrado para ambos casos
 *
 * Props:
 *   onBack - Callback para volver atrás
 *   onDone - Callback(datos) para guardar nueva transacción (modo crear)
 *   onSave - Callback(transactionId, updatedData) para guardar cambios (modo editar)
 *   onDelete - Callback(transactionId) para eliminar (modo editar)
 *   isDark - Tema oscuro
 *   categories - {pillarId: [cat1, cat2, ...]}
 *   isEditing - Boolean si está editando
 *   editingTransaction - Transacción a editar (si isEditing=true)
 */
export default function TransactionPage({
  onBack,
  onDone,
  onSave,
  onDelete,
  categories = {},
  isEditing = false,
  editingTransaction = null,
  prefill = null, // 🆕 datos por voz para pre-llenar (modo nuevo)
}) {
  // 🆕 Tema desde ThemeContext
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;
  // 🆕 Hook para animación de press en botón de atrás
  const pressBack = usePress();
  // 🆕 Hook para animación de press en botón de guardar
  const pressSave = usePress();
  // 🆕 Hook para animación de press en botón de eliminar
  const pressDelete = usePress();
  // 🆕 Estado para trackear qué botón de método está siendo presionado
  const [pressingMethod, setPressingMethod] = useState(null);
  // 🆕 Estado para trackear si el dropdown de categoría está siendo presionado
  const [pressingCategory, setPressingCategory] = useState(false);
  // 🆕 Estado para trackear qué botón de pilar está siendo presionado
  const [pressingPillar, setPressingPillar] = useState(null);
  // 🆕 Estado para trackear qué opción del dropdown está siendo presionada
  const [pressingConcept, setPressingConcept] = useState(null);

  // 🆕 Estado de loading para skeleton
  const [isLoading] = useState(false);

  // Estado del formulario (pre-llenado por voz si viene `prefill`)
  const [desc, setDesc] = useState(prefill?.desc || "");
  const [rawAmount, setRawAmount] = useState(prefill?.rawAmount || "");
  const [isIncome, setIsIncome] = useState(prefill?.isIncome || false);
  const [method, setMethod] = useState(prefill?.method || null);
  const [concept, setConcept] = useState(prefill?.concept || null);
  const [pillarId, setPillarId] = useState(prefill?.pillarId || null);
  const [conceptOpen, setConceptOpen] = useState(false);
  const [newConceptText, setNewConceptText] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // Pre-llenar datos en modo edición
  useEffect(() => {
    if (isEditing && editingTransaction) {
      setDesc(editingTransaction.description || "");
      setRawAmount(String(Math.abs(editingTransaction.amount || 0)));
      setIsIncome(editingTransaction.amount > 0);
      setMethod(editingTransaction.method || null);
      setConcept(editingTransaction.category || null);
      setPillarId(editingTransaction.pillar || null);
      setHasChanged(false);
    }
  }, [isEditing, editingTransaction]);

  // Detectar cambios en modo edición
  useEffect(() => {
    if (isEditing && editingTransaction) {
      const descChanged = desc !== editingTransaction.description;
      const amountChanged = rawAmount !== String(Math.abs(editingTransaction.amount || 0));
      const typeChanged = isIncome !== (editingTransaction.amount > 0);
      const methodChanged = method !== editingTransaction.method;
      const conceptChanged = concept !== editingTransaction.category;
      const pillarChanged = pillarId !== editingTransaction.pillar;

      setHasChanged(
        descChanged || amountChanged || typeChanged || methodChanged || conceptChanged || pillarChanged
      );
    }
  }, [desc, rawAmount, isIncome, method, concept, pillarId, isEditing, editingTransaction]);

  /**
   * Convierte {pillarId: [catId1, catId2, ...]} a [{id, name, pillar}, ...]
   */
  const getFormattedCategories = () => {
    const formatted = [];
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

  // 🆕 Obtener nombre de categoría por ID (resuelve cualquier categoría, incl. ingresos)
  const getCategoryDisplayName = (categoryId) => (categoryId ? getCategoryName(categoryId) : null);

  // 🆕 Categorías de INGRESO (pillar "ingreso"), lista plana
  const getIncomeCategories = () =>
    (categories["ingreso"] || []).map((catId) => ({ id: catId, name: getCategoryName(catId), pillar: "ingreso" }));

  // Cálculos derivados
  const numericAmount = parseInt(rawAmount.replace(/\D/g, "")) || 0;
  const hasAmount = numericAmount > 0;

  // 🆕 Tokens del design (Spatial UI + Claymorfismo)
  const t = {
    bg: tokens.bg,
    card: tokens.surfaceFlat,
    border: tokens.border,
    cardBorder: tokens.border,
    text: tokens.text,
    sub: tokens.sub,
    ph: tokens.muted,
    divider: tokens.border,
  };
  // Monto: muted (#5F5C74) mientras esté vacío, luego rojo/verde según signo
  const amountColor = hasAmount ? (isIncome ? "#86EFAC" : "#FF8A8A") : "#5F5C74";

  // Validación
  // Los ingresos no tienen categoría (concept) ni pilar → solo se exigen a gastos.
  const canSave = isEditing
    ? desc.trim() && hasAmount && method && hasChanged && (isIncome || (concept && pillarId))
    : desc.trim() && hasAmount;

  /**
   * Selecciona un concepto del listado de categorías
   */
  function handleConceptPick(cat) {
    setConcept(cat.id);
    setPillarId(cat.pillar);
    setIsNewCategory(false); // elegir existente → no es categoría nueva
    setConceptOpen(false);
    setNewConceptText("");
  }

  /**
   * Crea una nueva categoría (temporal)
   */
  function handleCreateCategory() {
    const name = newConceptText.trim();
    if (!name) return;
    setConcept(name);
    setPillarId(isIncome ? "ingreso" : null); // ingreso no elige pilar
    setIsNewCategory(true);
    setConceptOpen(false);
    setNewConceptText("");
  }

  /**
   * Guardar en modo crear
   */
  function handleCreate() {
    if (!canSave) return;
    onDone({
      desc,
      rawAmount,
      isIncome,
      method,
      concept,      // si isNewCategory, aquí va el NOMBRE; si no, el id de la categoría
      pillarId,
      isNewCategory // la categoría se crea/reutiliza al guardar (en createTransaction)
    });
  }

  /**
   * Guardar en modo editar
   */
  function handleEdit() {
    if (!canSave) return;
    const updatedTransaction = {
      ...editingTransaction,
      description: desc,
      amount: isIncome ? numericAmount : -numericAmount,
      method,
      category: concept,
      pillar: pillarId,
    };
    onSave(editingTransaction.id, updatedTransaction);
  }

  /**
   * Eliminar transacción
   */
  function handleDelete() {
    onDelete(editingTransaction.id);
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        background: isDark ? "#000000" : t.bg,
        padding: "26px 22px",
        display: "flex",
        flexDirection: "column"
      }}>
      <style>{`
        @keyframes clayRise { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ddDown   { from{opacity:0;transform:scaleY(0.92);transform-origin:top} to{opacity:1;transform:scaleY(1)} }
        .transaction-input::placeholder {
          color: #9896B0;
          opacity: 0.35;
        }
      `}</style>

      {/* Botón Atrás - Header fijo */}
      <button
        onClick={onBack}
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: "#8B87A3",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          padding: "6px 0",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        Atrás
      </button>

      {/* Zona centrada: ocupa todo el espacio restante */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>

        {/* Tarjeta clay principal */}
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            padding: "18px 16px",
            borderRadius: 20,
            background: "linear-gradient(155deg, #211d2c 0%, #141220 100%)",
            boxShadow: "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            animation: "clayRise .4s ease both",
            display: "flex",
            flexDirection: "column"
          }}>

        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.7px", color: "#9B6DFF", textAlign: "center" }}>
          {isEditing ? "TRANSACCIÓN" : "NUEVA TRANSACCIÓN"}
        </div>

        <LoadingWrapper isLoading={isLoading} skeleton={<FormSkeleton isDark={isDark} fieldCount={6} />} isDark={isDark}>
          <>

        {/* Descripción */}
        <input
          type="text"
          className="transaction-input"
          placeholder="Descripción del movimiento..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            outline: "none",
            fontSize: 13,
            fontWeight: 800,
            color: "#F5F3FF",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            marginTop: 14,
            marginBottom: 0,
            padding: 0,
            boxSizing: "border-box"
          }}
        />

        {/* Monto + Botones +/- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 0
          }}>
          <input
            type="text"
            inputMode="numeric"
            className="transaction-input"
            placeholder="0"
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
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              padding: 0,
              flex: 1
            }}
          />

          {/* Botones +/- - Solo se muestran si hay monto */}
          {hasAmount && (
            <div
              style={{
                display: "flex",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 6px 12px -8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(0,0,0,0.3)",
                flexShrink: 0,
                marginLeft: 12
              }}>
              <button
                onClick={() => setIsIncome(false)}
                style={{
                  width: 26,
                  height: 26,
                  border: "none",
                  background: !isIncome ? "rgba(239,68,68,0.22)" : "linear-gradient(155deg,#262231,#17151f)",
                  color: !isIncome ? "#FF8A8A" : "#8B87A3",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}>
                –
              </button>
              <button
                onClick={() => setIsIncome(true)}
                style={{
                  width: 26,
                  height: 26,
                  border: "none",
                  background: isIncome ? "rgba(134,239,172,0.22)" : "linear-gradient(155deg,#262231,#17151f)",
                  color: isIncome ? "#86EFAC" : "#8B87A3",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}>
                +
              </button>
            </div>
          )}
        </div>

        {/* Selector de método */}
        <div style={{
          display: "flex",
          gap: 6,
          marginTop: 14,
          marginBottom: 0
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
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  padding: "9px 4px",
                  borderRadius: 14,
                  border: `1.5px solid ${active ? m.color : "transparent"}`,
                  background: active ? `rgba(${m.color.slice(1,3)}, ${m.color.slice(3,5)}, ${m.color.slice(5,7)}, 0.18)` : "linear-gradient(155deg,#262231,#17151f)",
                  color: active ? m.color : "#8B87A3",
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  transform: pressingMethod === m.id ? "scale(0.94)" : "scale(1)",
                  opacity: pressingMethod === m.id ? 0.7 : 1,
                }}>
                <span style={{ fontSize: 13 }}>{m.icon}</span>
                {m.id}
              </button>
            );
          })}
        </div>

        {/* Selector de categoría de INGRESO (opcional) */}
        {isIncome && (
          <div style={{ position: "relative", marginTop: 12, marginBottom: 0 }}>
            <button
              onClick={() => setConceptOpen((o) => !o)}
              onPointerDown={() => setPressingCategory(true)}
              onPointerUp={() => setPressingCategory(false)}
              onPointerLeave={() => setPressingCategory(false)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: 16,
                border: "1.5px dashed #22C55E66",
                background: "rgba(34,197,94,0.14)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer"
              }}>
              {(isNewCategory ? concept : getCategoryDisplayName(concept)) || "Categoría"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: conceptOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
              {conceptOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50, background: isDark ? "#1C1C2E" : "#FAFAFE", border: `1px solid ${isDark ? "#2D2D4A" : "#E5E3F5"}`, borderRadius: 20, boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(100,80,200,0.14)", maxHeight: 230, overflowY: "auto", scrollbarWidth: "none", padding: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: isDark ? "#12291c" : "#EAFBF0", borderRadius: 14, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>✦</span>
                    <input type="text" placeholder="Nueva categoría de ingreso..." value={newConceptText} onChange={(e) => setNewConceptText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()} style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 12, color: t.text, fontStyle: "italic" }} />
                    {newConceptText.trim() && (
                      <button onClick={handleCreateCategory} style={{ padding: "4px 11px", borderRadius: 20, border: "none", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Crear</button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1, padding: "0 2px" }}>
                    {(() => {
                      const q = newConceptText.trim().toLowerCase();
                      const list = getIncomeCategories().filter((c) => !q || (c.name || "").toLowerCase().includes(q));
                      return list.map((cat) => {
                        const isActive = concept === cat.id;
                        return (
                          <button key={cat.id} onClick={() => handleConceptPick(cat)} onPointerDown={() => setPressingConcept(cat.id)} onPointerUp={() => setPressingConcept(null)} onPointerLeave={() => setPressingConcept(null)}
                            style={{ width: "100%", padding: "7px 12px", border: "none", cursor: "pointer", borderRadius: 12, background: pressingConcept === cat.id ? "#22C55E44" : isActive ? (isDark ? "#22C55E30" : "#22C55E18") : "transparent", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 400, color: isActive ? "#22C55E" : t.text }}>{cat.name}</span>
                            {isActive && <span style={{ fontSize: 12, color: "#22C55E", fontWeight: 700 }}>✓</span>}
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

            {/* Card "Tu saldo" (solo para ingreso + con monto) */}
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
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#22C55E", textAlign: "left" }}>
                  → Tu saldo
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: isDark ? "#5ebd8a" : "#4ade80",
                    marginTop: 1,
                    textAlign: "left"
                  }}>
                  El ingreso se suma directamente a tu saldo
                </div>
              </div>
            </div>
          )}

        {/* Selector de Concepto (solo para gastos) */}
        {!isIncome && (
          <div style={{ position: "relative", marginTop: 12, marginBottom: 0 }}>
            <button
              onClick={() => setConceptOpen((o) => !o)}
              onPointerDown={() => setPressingCategory(true)}
              onPointerUp={() => setPressingCategory(false)}
              onPointerLeave={() => setPressingCategory(false)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: 16,
                border: `1.5px dashed #9B6DFF`,
                background: "rgba(155,109,255,0.14)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer"
              }}>
              {(isNewCategory ? concept : getCategoryDisplayName(concept)) || "Selecciona la categoría"}
              <svg
                width="14"
                height="14"
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
                      onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                      style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        fontSize: 12,
                        color: t.text,
                        fontStyle: "italic",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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

                  {/* Lista de conceptos — el input de arriba filtra (typeahead):
                      al escribir muestra las categorías que coinciden; si no hay ninguna,
                      la lista queda vacía y el usuario sabe que puede crear una nueva. */}
                  {PILLARS.map(p => {
                    const q = newConceptText.trim().toLowerCase();
                    const allCats = getFormattedCategories();
                    const cats = allCats.filter(cat => cat.pillar === p.id && (!q || (cat.name || "").toLowerCase().includes(q)));
                    if (cats.length === 0) return null; // oculta pilares sin coincidencias

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
                            background: isDark ? `${p.color}22` : `${p.color}18`,
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
                            const isActive = concept === cat.id;
                            return (
                              <button
                                key={cat.id}
                                onClick={() => handleConceptPick(cat)}
                                onPointerDown={() => setPressingConcept(cat.id)}
                                onPointerUp={() => setPressingConcept(null)}
                                onPointerLeave={() => setPressingConcept(null)}
                                style={{
                                  width: "100%",
                                  padding: "7px 12px",
                                  border: "none",
                                  cursor: "pointer",
                                  borderRadius: 12,
                                  background: pressingConcept === cat.id
                                    ? `${p.color}44`
                                    : isActive
                                      ? isDark ? `${p.color}30` : `${p.color}18`
                                      : "transparent",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  transition: "background 0.15s",
                                  transform: pressingConcept === cat.id ? "scale(0.98) translateY(1px)" : "scale(1) translateY(0)",
                                  opacity: pressingConcept === cat.id ? 0.7 : 1,
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
                                  <span style={{ fontSize: 12, color: p.color, fontWeight: 700 }}>✓</span>
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

        {/* Selector de pilar (solo si concepto seleccionado y es gasto) */}
        {!isIncome && concept && !conceptOpen && (
          <div style={{ marginTop: 14, animation: "fadeInUp 0.2s ease" }}>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "#8B87A3",
                marginBottom: 6,
                letterSpacing: "0.3px"
              }}>
              PILAR · TOCA PARA CAMBIAR
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {PILLARS.map((p) => {
                const active = pillarId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPillarId(p.id);
                    }}
                    onPointerDown={() => setPressingPillar(p.id)}
                    onPointerUp={() => setPressingPillar(null)}
                    onPointerLeave={() => setPressingPillar(null)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      padding: "10px 0",
                      borderRadius: 14,
                      border: `1.5px solid ${active ? p.color : "transparent"}`,
                      background: active ? `rgba(${parseInt(p.color.slice(1,3), 16)}, ${parseInt(p.color.slice(3,5), 16)}, ${parseInt(p.color.slice(5,7), 16)}, 0.14)` : "linear-gradient(155deg,#262231,#17151f)",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.18s",
                      transform: pressingPillar === p.id ? "scale(0.94)" : "scale(1)",
                      opacity: pressingPillar === p.id ? 0.7 : 1,
                    }}>
                    <div style={{ fontSize: 16 }}>{p.icon}</div>
                    <div
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: active ? p.color : "#F5F3FF"
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
        </LoadingWrapper>
        </div>
      </div>

      {/* Botones flotantes - Guardar + Eliminar (editar) o solo Guardar (crear) */}
      {isEditing ? (
        <>
          {/* Botón Eliminar - Esquina inferior izquierda */}
          <button
            onClick={handleDelete}
            {...pressDelete.handlers}
            style={{
              position: "absolute",
              bottom: 20,
              left: 16,
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "none",
              background: "#EF4444",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...pressDelete.getPressStyle(),
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>

          {/* Botón Guardar - Esquina inferior derecha */}
          <button
            onClick={handleEdit}
            disabled={!canSave}
            {...pressSave.handlers}
            style={{
              position: "absolute",
              bottom: 22,
              right: 22,
              width: 58,
              height: 58,
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(155deg, #B18CFF, #8B5CF6)",
              cursor: canSave ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: canSave ? 1 : 0.5,
              boxShadow: "0 18px 30px -10px rgba(139,92,246,0.65), inset 0 1px 0 rgba(255,255,255,0.3)",
              ...pressSave.getPressStyle(),
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </>
      ) : (
        <>
          {/* Modo Crear: Solo Guardar */}
          <button
            onClick={handleCreate}
            disabled={!canSave}
            {...pressSave.handlers}
            style={{
              position: "absolute",
              bottom: 22,
              right: 22,
              width: 58,
              height: 58,
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(155deg, #B18CFF, #8B5CF6)",
              cursor: canSave ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: canSave ? 1 : 0.5,
              boxShadow: "0 18px 30px -10px rgba(139,92,246,0.65), inset 0 1px 0 rgba(255,255,255,0.3)",
              ...pressSave.getPressStyle(),
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
