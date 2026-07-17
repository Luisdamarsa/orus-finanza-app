import { createContext, useContext } from "react";

/**
 * DashboardContext.jsx
 *
 * Provee el estado, handlers y métricas del Dashboard a los subcomponentes de la
 * vista (DashboardScreen y sus secciones), sin prop-drilling. El valor lo arma
 * Dashboard() en App.jsx y se expande a medida que se extraen secciones.
 *
 * Refactor del Dashboard — HU-1 (contrato de datos).
 */
export const DashboardContext = createContext(null);

export function useDashboard() {
  return useContext(DashboardContext);
}
