import React, { useState } from "react";
import PillarProgressBar from "./PillarProgressBar";

/**
 * PillarProgressBar.demo.jsx
 *
 * Componente de demostración para ver la barra animándose
 * Muestra cómo se vería en Estado 2 (Movimientos)
 */
export default function PillarProgressBarDemo() {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Datos de ejemplo con todos los pilares en orden
  const pillarData = [
    { id: "fijos", label: "Fijos", color: "#22C55E", percentage: 30 },
    { id: "deuda", label: "Deuda", color: "#EF4444", percentage: 25 },
    { id: "ahorro", label: "Ahorro", color: "#10B981", percentage: 20 },
    { id: "ocio", label: "Ocio", color: "#F59E0B", percentage: 15 },
    { id: "varios", label: "Varios", color: "#8B5CF6", percentage: 10 },
  ];

  const saldoData = {
    exists: true,
    percentage: 5,
    color: "#94A3B8",
  };

  const handleReset = () => {
    setShouldAnimate(false);
    // Pequeño delay para que React vea el cambio
    setTimeout(() => setShouldAnimate(true), 100);
  };

  return (
    <div style={{ padding: "40px", backgroundColor: isDark ? "#1A1830" : "#F0EEFF", minHeight: "100vh" }}>
      <h1 style={{ color: isDark ? "#F0EEFF" : "#1A1830", marginBottom: "30px" }}>
        🎨 PillarProgressBar Demo
      </h1>

      {/* Controles */}
      <div style={{
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: isDark ? "#2D2D3A" : "#E5E3F5",
        borderRadius: "8px",
        display: "flex",
        gap: "15px",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <button
          onClick={handleReset}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          🔄 Reproducir animación
        </button>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: isDark ? "#F0EEFF" : "#1A1830" }}>
          <input
            type="checkbox"
            checked={isDark}
            onChange={(e) => setIsDark(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          Tema oscuro
        </label>

        <span style={{ color: isDark ? "#AAA" : "#666", fontSize: "12px" }}>
          {shouldAnimate ? "✅ Animando" : "⏸️ Pausado"}
        </span>
      </div>

      {/* Barra principal con animación */}
      <div style={{
        marginBottom: "40px",
        padding: "20px",
        backgroundColor: isDark ? "#2D2D3A" : "#E5E3F5",
        borderRadius: "8px",
      }}>
        <h2 style={{ color: isDark ? "#F0EEFF" : "#1A1830", marginBottom: "15px", fontSize: "14px" }}>
          Con animación ({shouldAnimate ? "activada" : "desactivada"})
        </h2>
        <PillarProgressBar
          pillars={pillarData}
          saldo={saldoData}
          shouldAnimate={shouldAnimate}
          isDark={isDark}
          height={32}
        />
        <div style={{
          marginTop: "12px",
          fontSize: "12px",
          color: isDark ? "#AAA" : "#666",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}>
          <span>🟢 Fijos: 30%</span>
          <span>🔴 Deuda: 25%</span>
          <span>🟢 Ahorro: 20%</span>
          <span>🟠 Ocio: 15%</span>
          <span>🟣 Varios: 10%</span>
          <span>⚪ Saldo: 5%</span>
        </div>
      </div>

      {/* Ejemplo sin animación (como se ve al filtrar) */}
      <div style={{
        padding: "20px",
        backgroundColor: isDark ? "#2D2D3A" : "#E5E3F5",
        borderRadius: "8px",
      }}>
        <h2 style={{ color: isDark ? "#F0EEFF" : "#1A1830", marginBottom: "15px", fontSize: "14px" }}>
          Sin animación (al filtrar por sección)
        </h2>
        <PillarProgressBar
          pillars={pillarData}
          saldo={saldoData}
          shouldAnimate={false}
          isDark={isDark}
          height={32}
        />
        <div style={{
          marginTop: "12px",
          fontSize: "12px",
          color: isDark ? "#AAA" : "#666",
        }}>
          ℹ️ La barra aparece completa sin animación de relleno
        </div>
      </div>

      {/* Información técnica */}
      <div style={{
        marginTop: "40px",
        padding: "20px",
        backgroundColor: isDark ? "#1A1830" : "#F5F3FF",
        borderRadius: "8px",
        borderLeft: "4px solid #3B82F6",
      }}>
        <h3 style={{ color: isDark ? "#F0EEFF" : "#1A1830", marginBottom: "10px" }}>
          📋 Información técnica
        </h3>
        <ul style={{ color: isDark ? "#AAA" : "#666", fontSize: "12px", lineHeight: "1.6", margin: 0, paddingLeft: "20px" }}>
          <li>✅ Animación usa <code style={{ background: isDark ? "#2D2D3A" : "#E5E3F5", padding: "2px 6px", borderRadius: "3px" }}>@keyframes pillarFill</code></li>
          <li>✅ Cada segmento se anima con 0.1s de delay (staggered)</li>
          <li>✅ Anima de <code style={{ background: isDark ? "#2D2D3A" : "#E5E3F5", padding: "2px 6px", borderRadius: "3px" }}>width: 0%</code> a <code style={{ background: isDark ? "#2D2D3A" : "#E5E3F5", padding: "2px 6px", borderRadius: "3px" }}>width: --target-width</code></li>
          <li>✅ Usa variable CSS <code style={{ background: isDark ? "#2D2D3A" : "#E5E3F5", padding: "2px 6px", borderRadius: "3px" }}>--target-width</code> para cada segmento</li>
          <li>✅ Duración: 0.6s con ease-out timing</li>
          <li>✅ Sin animación al filtrar (<code style={{ background: isDark ? "#2D2D3A" : "#E5E3F5", padding: "2px 6px", borderRadius: "3px" }}>shouldAnimate=false</code>)</li>
        </ul>
      </div>
    </div>
  );
}
