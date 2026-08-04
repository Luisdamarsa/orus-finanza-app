import { useState } from "react";
import { PILLARS } from "../constants";

export default function NewCategoryPage({ isDark, onBack, onSave }) {
  const [name, setName] = useState("");
  const [pillarId, setPillarId] = useState(PILLARS[0].id);

  const t = isDark
    ? {
        bg: "#000000",
        card: "linear-gradient(155deg,#211d2c 0%,#141220 100%)",
        border: "rgba(255,255,255,0.07)",
        text: "#F5F3FF",
        sub: "#8B87A3",
        accent: "#9B6DFF",
        raised: "rgba(255,255,255,0.04)",
      }
    : {
        bg: "#F3F1FA",
        card: "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
        border: "rgba(30,20,60,0.08)",
        text: "#1A1830",
        sub: "#726E8C",
        accent: "#7C4DFF",
        raised: "rgba(30,20,60,0.04)",
      };

  const pillarColors = {
    food: "#FF6B6B",
    transportation: "#4ECDC4",
    entertainment: "#FFE66D",
    utilities: "#95E1D3",
    other: "#A8E6CF",
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim(), pillarId });
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "26px 22px",
        display: "flex",
        flexDirection: "column",
        background: t.bg,
        fontFamily: "Manrope, system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: t.sub,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          padding: 0,
          fontFamily: "Manrope",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 5l-7 7 7 7" />
        </svg>
        <span>Atrás</span>
      </button>

      {/* Centered card zone */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "100%",
            padding: "18px 16px",
            borderRadius: 20,
            background: t.card,
            boxShadow:
              "0 20px 40px -16px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Label */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: t.accent,
              letterSpacing: ".7px",
              textTransform: "uppercase",
            }}
          >
            Nueva Categoría
          </div>

          {/* Input nombre */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Describe la categoría (Arriendo, Salidas, etc...)"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 14,
              fontWeight: 700,
              color: t.text,
              marginTop: 12,
              padding: 0,
              fontFamily: "Manrope",
              placeholder: t.sub,
            }}
          />

          {/* Separador */}
          <div
            style={{
              height: 1,
              background: t.border,
              margin: "14px 0 12px",
            }}
          />

          {/* Label pilar */}
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: t.sub,
              letterSpacing: ".6px",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Pilar
          </div>

          {/* Selector pilares */}
          <div style={{ display: "flex", gap: 6 }}>
            {PILLARS.map((pillar) => {
              const isActive = pillarId === pillar.id;
              const pillarColor = pillarColors[pillar.id] || "#A8E6CF";
              return (
                <button
                  key={pillar.id}
                  onClick={() => setPillarId(pillar.id)}
                  style={{
                    flex: 1,
                    minWidth: 60,
                    padding: "8px 6px",
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    border: isActive
                      ? `2px solid ${pillarColor}`
                      : "2px solid transparent",
                    background: isActive
                      ? `${pillarColor}22`
                      : t.raised,
                    color: isActive ? pillarColor : t.sub,
                    cursor: "pointer",
                    fontFamily: "Manrope",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{pillar.icon}</span>
                  <span style={{ textAlign: "center", lineHeight: 1.2 }}>
                    {pillar.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save button (check) */}
      <button
        onClick={handleSave}
        disabled={!name.trim()}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: name.trim()
            ? "linear-gradient(155deg,#B18CFF,#8B5CF6)"
            : "rgba(139,92,246,0.4)",
          color: "#fff",
          border: "none",
          cursor: name.trim() ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 16px 28px -10px rgba(139,92,246,0.6)",
          transition: "all 0.2s",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}
