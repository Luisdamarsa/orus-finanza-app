import { useRef, useEffect, useState } from "react";
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
    searchOpen, searchQuery, setSearchOpen, showPillarBars,
  } = useDashboard();

  // 🆕 key que reinicia scroll + paginación al cambiar de periodo/filtro/búsqueda
  const listKey = `${selectedPeriod?.year ?? "all"}-${selectedPeriod?.month ?? "all"}-${filterType ?? "none"}-${filteredPillar ?? "none"}-${searchOpen ? searchQuery : ""}`;

  // 🆕 Lista filtrada por periodo/pilar/tipo + búsqueda por texto (si está activa)
  const listedTransactions = searchTransactions(
    filterTransactions(transactions, { selectedPeriod, filteredPillar, filterType }),
    searchOpen ? searchQuery : ""
  );

  // 🆕 Al cambiar la búsqueda, mostrar el inicio de la lista (no dejar el scroll donde estaba)
  const listScrollRef = useRef(null);
  useEffect(() => {
    if (searchOpen && listScrollRef.current) listScrollRef.current.scrollTop = 0;
  }, [searchQuery, searchOpen]);

  // 🆕 Medir altura dinámica del header para calcular el top del scroll container
  const [headerHeight, setHeaderHeight] = useState(showIncomes ? 149 : 115);
  useEffect(() => {
    const measureHeaderHeight = () => {
      if (headerRef?.current) {
        const height = headerRef.current.offsetHeight;
        // El header comienza en top: 52, más su altura = total
        setHeaderHeight(52 + height);
      }
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(measureHeaderHeight);
    });

    window.addEventListener("resize", measureHeaderHeight);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measureHeaderHeight);
    };
  }, [showIncomes]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: isDark ? "#0D0D1A" : "#E9E7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
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
          position: "absolute", top: headerHeight, left: 0, right: 0, bottom: isMovementOpen ? 0 : "auto",
          overflowY: isMovementOpen ? "auto" : "hidden", overflowX: "hidden", paddingBottom: 280, boxSizing: "border-box", scrollbarWidth: "none",
          pointerEvents: showPillarBars ? "none" : "auto"
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

              {/* Movimientos - SIEMPRE visible. Entra desde abajo; en Estado 1 después de
                  las tarjetas, en Estado 2 justo tras los tags. La key re-anima al cambiar de estado. */}
              <div key={isMovementOpen ? "mov-e2" : "mov-e1"} className="orus-rise" style={{ marginTop: 0, animationDelay: isMovementOpen ? "0.12s" : "0.36s" }}>
                <Movimientos isDark={isDark} transactions={transactions} filteredPillar={filteredPillar} setFilteredPillar={setFilteredPillar} stickyTop={stickyH} selectedPeriod={selectedPeriod} onOpen={setIsMovementOpen} isOpen={isMovementOpen} filterType={filterType} setFilterType={setFilterType} movementOpenedFrom={movementOpenedFrom} setMovementOpenedFrom={setMovementOpenedFrom} setFilterTypeExternal={setFilterType} />
              </div>
            </div>
          </div>

          {/* Transacciones - position absolute si está abierto */}
          {isMovementOpen && (
            <div ref={listScrollRef} style={{ position: "absolute", top: `calc(${stickyH}px - 6px)`, left: 0, right: 0, bottom: 0, overflowY: "auto", overflowX: "hidden", overscrollBehavior: "contain", scrollbarWidth: "none", padding: "0 22px 120px 22px" }}>
              <style>{`::-webkit-scrollbar { display: none; }`}</style>

              {/* 🆕 Contador de resultados (la barra de búsqueda vive abajo, en el FAB) */}
              {searchOpen && searchQuery.trim() !== "" && (
                <div style={{ fontSize: 11, color: t.sub, padding: "8px 4px 4px" }}>
                  {listedTransactions.length} resultado{listedTransactions.length === 1 ? "" : "s"} para “{searchQuery.trim()}”
                </div>
              )}

              {/* orus-rise en el wrapper externo → las 15 primeras entran TODAS a la vez al
                  abrir Estado 2. El div interno (key=listKey) resetea paginación al buscar/cambiar
                  período sin re-disparar la animación. */}
              <div className="orus-rise" style={{ animationDelay: "0.18s" }}>
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
