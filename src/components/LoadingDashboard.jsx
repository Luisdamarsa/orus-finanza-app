/**
 * LoadingDashboard.jsx
 * Skeleton loading mientras se carga el Dashboard
 */

export default function LoadingDashboard({ isDark }) {
  const bg = isDark ? "#0a0810" : "#f5f3ff";
  const skeleton = isDark ? "#1a1620" : "#e8e6f0";
  const pulse = isDark ? "#252030" : "#dcdae8";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        overflow: "auto",
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-color: ${skeleton}; }
          50% { background-color: ${pulse}; }
          100% { background-color: ${skeleton}; }
        }
        .skeleton {
          animation: shimmer 2s infinite;
          border-radius: 12px;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          className="skeleton"
          style={{ width: 120, height: 24, marginBottom: 8 }}
        />
        <div
          className="skeleton"
          style={{ width: 80, height: 16 }}
        />
      </div>

      {/* Donut Chart Skeleton */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div
          className="skeleton"
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Cards Grid Skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: 80,
              padding: 12,
            }}
          />
        ))}
      </div>

      {/* Transactions Skeleton */}
      <div>
        <div
          className="skeleton"
          style={{ width: 140, height: 18, marginBottom: 12 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: 60,
                borderRadius: 10,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
