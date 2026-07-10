/**
 * LoadingWrapper.jsx
 *
 * Componente envolvedor que muestra skeleton + spinner mientras carga
 * Si no está cargando, muestra el componente real
 *
 * Uso:
 *   <LoadingWrapper
 *     isLoading={isLoading}
 *     skeleton={<DonutSkeleton isDark={isDark} />}
 *     isDark={isDark}
 *   >
 *     <DonutChartComponent {...props} />
 *   </LoadingWrapper>
 */
export default function LoadingWrapper({ isLoading, skeleton, children, isDark }) {
  if (isLoading) {
    return (
      <div style={{ position: "relative" }}>
        {skeleton}
      </div>
    );
  }

  return children;
}
