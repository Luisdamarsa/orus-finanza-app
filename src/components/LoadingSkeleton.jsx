import LoadingSpinner from "./LoadingSpinner";

/**
 * LoadingSkeleton.jsx
 *
 * Esqueletos de carga para diferentes secciones
 * Con animación de shimmer (brillo) y spinner encima
 */

/**
 * Skeleton para el Donut Chart (Estado 1)
 */
export function DonutSkeleton({ isDark }) {
  const bgColor = isDark ? "#1E1E2E" : "#F0EFF8";

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
      <LoadingSpinner isDark={isDark} size={50} />

      {/* Círculo del donut */}
      <div
        style={{
          width: 228,
          height: 228,
          borderRadius: "50%",
          background: bgColor,
          position: "relative",
          opacity: 0.6,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "40%",
            borderRadius: "50%",
            background: "#000000",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Skeleton para PillarCardsGrid (Estado 1)
 */
export function CardsGridSkeleton({ isDark }) {
  const bgColor = isDark ? "#1E1E2E" : "#FFFFFF";
  const shimmerColor = isDark ? "#252535" : "#E5E3F5";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            borderRadius: 11,
            padding: "12px 8px",
            background: bgColor,
            border: `1.5px solid ${shimmerColor}`,
            opacity: 0.6,
            animation: `pulse 2s ease-in-out infinite`,
          }}
        >
          {/* Header de la tarjeta */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div
              style={{
                width: "60%",
                height: 12,
                borderRadius: 4,
                background: shimmerColor,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "30%",
                height: 12,
                borderRadius: 4,
                background: shimmerColor,
                opacity: 0.5,
              }}
            />
          </div>

          {/* Monto */}
          <div
            style={{
              width: "70%",
              height: 16,
              borderRadius: 4,
              background: shimmerColor,
              opacity: 0.5,
              marginBottom: 6,
            }}
          />

          {/* Barra de progreso */}
          <div
            style={{
              width: "100%",
              height: 8,
              borderRadius: 2,
              background: shimmerColor,
              opacity: 0.5,
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/**
 * Skeleton para ColorBar (Estado 2)
 */
export function ColorBarSkeleton({ isDark }) {
  const shimmerColor = isDark ? "#252535" : "#E5E3F5";

  return (
    <div style={{ display: "flex", height: 7, borderRadius: 5, overflow: "hidden", gap: 2, marginBottom: 9 }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: shimmerColor,
            borderRadius: 3,
            opacity: 0.5,
            animation: `pulse 2s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/**
 * Skeleton para PillarTagsBar (Estado 2)
 */
export function TagsBarSkeleton({ isDark }) {
  const bgColor = isDark ? "#1E1E2E" : "#F0EFF8";
  const shimmerColor = isDark ? "#252535" : "#E5E3F5";

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 2px",
            borderRadius: 9,
            border: `1px solid ${shimmerColor}`,
            background: bgColor,
            opacity: 0.6,
            animation: `pulse 2s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div
            style={{
              width: "60%",
              height: 8,
              borderRadius: 2,
              background: shimmerColor,
              marginBottom: 4,
              opacity: 0.5,
            }}
          />
          <div
            style={{
              width: "50%",
              height: 8,
              borderRadius: 2,
              background: shimmerColor,
              opacity: 0.5,
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/**
 * Skeleton para formularios (ProfilePage, AddTransactionPage, EditTransactionPage)
 */
export function FormSkeleton({ isDark, fieldCount = 5 }) {
  const bgColor = isDark ? "#1E1E2E" : "#F8F7FF";
  const shimmerColor = isDark ? "#252535" : "#E5E3F5";

  return (
    <div style={{ padding: "20px 22px" }}>
      {[...Array(fieldCount)].map((_, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          {/* Label */}
          <div
            style={{
              width: "30%",
              height: 12,
              borderRadius: 4,
              background: shimmerColor,
              opacity: 0.5,
              marginBottom: 8,
            }}
          />
          {/* Input */}
          <div
            style={{
              width: "100%",
              height: 40,
              borderRadius: 8,
              background: bgColor,
              border: `1.5px solid ${shimmerColor}`,
              opacity: 0.6,
              animation: `pulse 2s ease-in-out infinite`,
            }}
          />
        </div>
      ))}

      {/* Botón */}
      <div
        style={{
          width: "100%",
          height: 44,
          borderRadius: 10,
          background: shimmerColor,
          opacity: 0.5,
          marginTop: 30,
          animation: `pulse 2s ease-in-out infinite`,
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/**
 * Skeleton para lista de items/settings (SettingsPage, CategoriesPage, BudgetsPage)
 */
export function MenuListSkeleton({ isDark, itemCount = 6 }) {
  const bgColor = isDark ? "#1E1E2E" : "#FFFFFF";
  const shimmerColor = isDark ? "#252535" : "#E5E3F5";

  return (
    <div style={{ padding: "20px 22px" }}>
      {[...Array(itemCount)].map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderRadius: 11,
            border: `1.5px solid ${shimmerColor}`,
            background: bgColor,
            marginBottom: 8,
            opacity: 0.6,
            animation: `pulse 2s ease-in-out infinite`,
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {/* Icono + Texto */}
          <div style={{ display: "flex", gap: 12, flex: 1 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: shimmerColor,
                opacity: 0.5,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  width: "60%",
                  height: 12,
                  borderRadius: 4,
                  background: shimmerColor,
                  opacity: 0.5,
                }}
              />
            </div>
          </div>

          {/* Flecha */}
          <div
            style={{
              width: 12,
              height: 12,
                borderRadius: 2,
              background: shimmerColor,
              opacity: 0.5,
              flexShrink: 0,
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/**
 * Skeleton para una lista de transacciones
 */
export function TransactionListSkeleton({ isDark, count = 5 }) {
  const bgColor = isDark ? "#1E1E2E" : "#FFFFFF";
  const shimmerColor = isDark ? "#252535" : "#E5E3F5";

  return (
    <div>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          {/* Fecha */}
          <div
            style={{
              width: "30%",
              height: 12,
              borderRadius: 4,
              background: shimmerColor,
              opacity: 0.5,
              marginBottom: 8,
            }}
          />

          {/* Transacciones */}
          {[1, 2].map((j) => (
            <div
              key={j}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px",
                background: bgColor,
                borderRadius: 8,
                marginBottom: 8,
                border: `1px solid ${shimmerColor}`,
                opacity: 0.6,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: "60%",
                    height: 12,
                    borderRadius: 4,
                    background: shimmerColor,
                    opacity: 0.5,
                    marginBottom: 4,
                  }}
                />
                <div
                  style={{
                    width: "40%",
                    height: 10,
                    borderRadius: 4,
                    background: shimmerColor,
                    opacity: 0.5,
                  }}
                />
              </div>
              <div
                style={{
                  width: "20%",
                  height: 12,
                  borderRadius: 4,
                  background: shimmerColor,
                  opacity: 0.5,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
