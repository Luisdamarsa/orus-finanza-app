/**
 * LoadingSpinner.jsx
 *
 * Spinner circular elegante que va encima de los skeleton screens
 * Indica que la sección está cargando
 */
export default function LoadingSpinner({ isDark, size = 40 }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{
          animation: "spin 1s linear infinite",
        }}
      >
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={isDark ? "#9B6DFF" : "#4F8EF7"}
          strokeWidth="3"
          strokeDasharray="31.4 62.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
