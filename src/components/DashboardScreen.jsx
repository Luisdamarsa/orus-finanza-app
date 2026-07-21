import HeaderService from "./HeaderService";
import Periodo from "./Periodo";
import ErrorBoundary from "./ErrorBoundary";
import Movimientos from "./MovimientosBar";
import TransactionsListService from "./TransactionsListService";
import DashboardExpandedState from "./DashboardExpandedState";
import DashboardCollapsedState from "./DashboardCollapsedState";
import DashboardOverlays from "./DashboardOverlays";
import { fmt } from "../utils/formatters";
import { filterTransactions } from "../services/transactionFilterService";
import { searchTransactions } from "../utils/searchTransactions";
import { userStorage } from "../utils/userStorage";
import { useDashboard } from "../contexts/DashboardContext";

/**
 * DashboardScreen.jsx
 *
 * Vista principal (home) del dashboard: header, zona sticky (saldo/mes + Estado 1 /
 * Estado 2 + barra de Movimientos), lista de transacciones, degradado inferior y
 * overlays. Consume el DashboardContext. Refactor del Dashboard — HU-5/HU-6.
 * Extraído tal cual desde App.jsx (comportamiento idéntico).
 */
export default function DashboardScreen() {
  const {
    isDark, t, headerRef, stickyZoneRef, stickyH, p1,
    showIncomes, setScreen, isMovementOpen, movementOpenedFrom, filterType, setFilterType,
    setFilteredPillar, setIsMovementOpen, setMovementOpenedFrom, totalSpent, incomingTotal,
    setScrollY, selectedPeriod, setShowUpdateBalance, setShowPeriodPicker, filteredPillar,
    transactions, startTransactionEditing, newTxnToast,
    searchOpen, searchQuery, setSearchQuery, setSearchOpen,
  } = useDashboard();

  // 🆕 key que reinicia scroll + paginación al cambiar de periodo/filtro/búsqueda
  const listKey = `${selectedPeriod?.year ?? "all"}-${selectedPeriod?.month ?? "all"}-${filterType ?? "none"}-${filteredPillar ?? "none"}-${searchOpen ? searchQuery : ""}`;

  // 🆕 Lista filtrada por periodo/pilar/tipo + búsqueda por texto (si está activa)
  const listedTransactions = searchTransactions(
    filterTransactions(transactions, { selectedPeriod, filteredPillar, filterType }),
    searchOpen ? searchQuery : ""
  );

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0D0D1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", maxWidth: "500px", background: t.bg, position: "relative", overflow: "hidden" }}>


        {/* Header Service */}
        <HeaderService
          ref={headerRef}
          isDark={isDark}
          showIncomes={showIncomes}
          setScreen={setScreen}
          isMovementOpen={isMovementOpen}
          movementOpenedFrom={movementOpenedFrom}
          filterType={filterType}
          setFilterType={setFilterType}
          setFilteredPillar={setFilteredPillar}
          setIsMovementOpen={setIsMovementOpen}
          setMovementOpenedFrom={setMovementOpenedFrom}
          totalSpent={totalSpent}
          incomingTotal={incomingTotal}
          t={t}
          fmt={fmt}
          userStorage={userStorage}
        />

        {/* Scroll Container */}
        <div onScroll={e => setScrollY(e.target.scrollTop)} style={{
          position: "absolute", top: showIncomes ? 149 : 115, left: 0, right: 0, bottom: isMovementOpen ? 0 : "auto",
          overflowY: isMovementOpen ? "auto" : "hidden", overflowX: "hidden", paddingBottom: 280, boxSizing: "border-box", scrollbarWidth: "none"
        }}>
          <style>{`::-webkit-scrollbar { display: none; }`}</style>

          <div style={{ padding: "0 22px 120px 22px", height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Sticky Zone */}
            {/* 🆕 Sticky Zone simple y eficiente */}
            <div ref={stickyZoneRef} style={{ position: "sticky", top: 0, zIndex: 30, background: t.bg, margin: "0 -22px", padding: "8px 22px", overflow: "visible", boxShadow: p1 > 0.05 ? "0 4px 16px rgba(0,0,0,0.4)" : "none" }}>

              {/* Saldo y Mes - SIEMPRE visible */}
              <ErrorBoundary fallback={null} resetKey={selectedPeriod}>
                <Periodo
                  isDark={isDark}
                  selectedPeriod={selectedPeriod}
                  setShowUpdateBalance={setShowUpdateBalance}
                  setShowPeriodPicker={setShowPeriodPicker}
                  newTxnToast={newTxnToast}
                />
              </ErrorBoundary>

              {/* ESTADO 1: EXPANDED (Donut + Tarjetas) */}
              {isMovementOpen === false && (
              <DashboardExpandedState />
              )}

              {/* ESTADO 2: COLLAPSED (Barra + Tags) - Solo si NO es INGRESOS */}
              {isMovementOpen === true && filterType !== "ingresos" && (
              <DashboardCollapsedState />
              )}

              {/* Movimientos - SIEMPRE visible */}
              <div style={{ marginTop: 0 }}>
                <Movimientos isDark={isDark} transactions={transactions} filteredPillar={filteredPillar} setFilteredPillar={setFilteredPillar} stickyTop={stickyH} selectedPeriod={selectedPeriod} onOpen={setIsMovementOpen} isOpen={isMovementOpen} filterType={filterType} setFilterType={setFilterType} movementOpenedFrom={movementOpenedFrom} setMovementOpenedFrom={setMovementOpenedFrom} setFilterTypeExternal={setFilterType} />
              </div>
            </div>
          </div>

          {/* Transacciones - position absolute si está abierto */}
          {isMovementOpen && (
            <div style={{ position: "absolute", top: `calc(${stickyH}px - 6px)`, left: 0, right: 0, bottom: 0, overflowY: "auto", overflowX: "hidden", overscrollBehavior: "contain", scrollbarWidth: "none", padding: "0 22px 120px 22px" }}>
              <style>{`::-webkit-scrollbar { display: none; }`}</style>

              {/* 🆕 Buscador (lupa del FAB): filtra por descripción, tipo, categoría y pilar */}
              {searchOpen && (
                <div style={{ position: "sticky", top: 0, zIndex: 6, background: t.bg, paddingTop: 6, paddingBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: isDark ? "#1E1E2E" : "#FFFFFF", border: `1.5px solid ${isDark ? "#2D2D3A" : "#E5E3F5"}`, borderRadius: 12, padding: "8px 12px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar: arriendo, Varios, ingreso, llave…"
                      style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 13.5 }}
                    />
                    <button
                      onClick={() => { setSearchQuery(""); setSearchOpen(false); setIsMovementOpen(false); }}
                      style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", border: "none", background: isDark ? "#2D2D3A" : "#F0EFF8", color: t.sub, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      aria-label="Cerrar búsqueda">✕</button>
                  </div>
                  {searchQuery.trim() !== "" && (
                    <div style={{ fontSize: 11, color: t.sub, marginTop: 6, paddingLeft: 4 }}>
                      {listedTransactions.length} resultado{listedTransactions.length === 1 ? "" : "s"} para “{searchQuery.trim()}”
                    </div>
                  )}
                </div>
              )}

              <div key={listKey}>
              <ErrorBoundary fallback={null} resetKey={selectedPeriod}>
              <TransactionsListService
                isDark={isDark}
                transactions={listedTransactions}
                onEditTransaction={(tx) => {
                  startTransactionEditing(tx);
                }}
              />
              </ErrorBoundary>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, pointerEvents: "none", zIndex: 34, background: `linear-gradient(to bottom, transparent, ${t.bg})` }} />

        <DashboardOverlays />
      </div>
    </div>
  );
}
