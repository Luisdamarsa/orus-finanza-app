import { useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import HeaderBar from "./HeaderBar";
import { DARK, LIGHT } from "../constants/tokens";

export default function AutomatizacionesPage({ onBack, onPermissions, onNotificationsSetup, onShortcutsSetup, notificationListenerEnabled, setNotificationListenerEnabled, iosShortcutsEnabled, setIosShortcutsEnabled }) {
  const { isDark } = useTheme();
  const tokens = isDark ? DARK : LIGHT;

  const t = {
    bg: tokens.bg,
    surface: isDark ? "linear-gradient(155deg,#211d2c 0%,#141220 100%)" : "linear-gradient(155deg,#ffffff 0%,#eeeaf7 100%)",
    text: tokens.text,
    sub: tokens.sub,
    accent: isDark ? "#9B6DFF" : "#7C4DFF",
    accentSoft: isDark ? "rgba(155,109,255,0.2)" : "rgba(124,77,255,0.15)",
    raised: isDark ? "rgba(255,255,255,0.04)" : "rgba(30,20,60,0.04)",
    border: tokens.border,
    shadowSm: isDark ? "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 10px 22px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(0,0,0,0.04)",
  };

  const pressMethod = usePress();

  const Icon = ({ path, size = 18, fill = "none", stroke = "currentColor", strokeWidth = 1.8, color = "inherit" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
      <path d={path} />
    </svg>
  );

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: t.bg, fontFamily: "Manrope, system-ui, sans-serif" }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Header fijo */}
      <HeaderBar
        onBack={onBack}
        pageIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />
          </svg>
        }
        pageTitle="Automatizaciones"
        isDark={isDark}
      />

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", padding: "22px 22px 50px", boxSizing: "border-box" }}>
        {/* Subtitle */}
        <div style={{ fontSize: "12px", fontWeight: 600, color: t.sub, textAlign: "center", lineHeight: 1.5, marginBottom: 20 }}>
          ORUS capta tus movimientos de 3 formas. Activa las que quieras y olvídate de registrar.
        </div>

      {/* Separator */}
      <div style={{ height: "1px", background: t.border, margin: "20px 0" }} />

      {/* Métodos */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          {
            name: "Notificaciones de Wallet",
            desc: "Cuando payas con NFC, ORUS lee la notificación y te pregunta si registrarla.",
            badge: { bg: "rgba(147,197,253,0.16)", color: "#93C5FD", path: "M2 10h20M2 8v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2H4a2 2 0 00-2 2z" },
            enabled: notificationListenerEnabled,
            action: () => onNotificationsSetup && onNotificationsSetup(),
          },
          {
            name: "Atajo de Notificaciones",
            desc: "Lee pagos de Apple Pay mediante Atajos configurados.",
            badge: { bg: "rgba(134,239,172,0.16)", color: "#86EFAC", svg: (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#86EFAC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="9" cy="9" r="1.2" fill="#86EFAC" />
                <circle cx="15" cy="9" r="1.2" fill="#86EFAC" />
                <circle cx="9" cy="15" r="1.2" fill="#86EFAC" />
                <circle cx="15" cy="15" r="1.2" fill="#86EFAC" />
              </svg>
            ) },
            enabled: iosShortcutsEnabled,
            action: () => onShortcutsSetup && onShortcutsSetup(),
          },
        ].map((method, idx) => (
          <button
            key={idx}
            onClick={method.action}
            {...pressMethod.handlers}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "15px 16px",
              borderRadius: 16,
              background: t.surface,
              boxShadow: t.shadowSm,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              ...pressMethod.getPressStyle({ scale: 0.97, opacity: 0.9 }),
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 12, background: method.badge.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {method.badge.svg ? method.badge.svg : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={method.badge.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={method.badge.path} />
                </svg>
              )}
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 0 }}>
                <span style={{ fontSize: "13.5px", fontWeight: 800, color: t.text }}>{method.name}</span>
                {method.enabled && (
                  <span style={{ padding: "2px 7px", borderRadius: 8, background: "rgba(134,239,172,0.16)", color: "#86EFAC", fontSize: "8px", fontWeight: 800, letterSpacing: ".3px", textTransform: "uppercase" }}>
                    Activado
                  </span>
                )}
              </div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: t.sub, marginTop: 3, lineHeight: 1.4 }}>{method.desc}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Cómo Funciona */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28, fontSize: "14px", fontWeight: 800, color: t.text }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <path d="M9 18h6" />
        </svg>
        Cómo Funciona la Automatización
      </div>

      {/* Diagrama de 4 pasos */}
      <div style={{ marginTop: 14, padding: "18px 10px", borderRadius: 18, background: t.surface, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {[
          { label: "Haces un Gasto", bg: "rgba(147,197,253,0.16)", color: "#93C5FD", path: "M2 10h20M2 8v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2H4a2 2 0 00-2 2z" },
          { label: "ORUS lo Capta", bg: t.accentSoft, color: t.accent, path: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" },
          { label: "Categoriza", bg: "rgba(196,181,253,0.16)", color: "#C4B5FD", svg: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="6" height="6" />
              <rect x="14" y="4" width="6" height="6" />
              <rect x="4" y="14" width="6" height="6" />
              <rect x="14" y="14" width="6" height="6" />
            </svg>
          ) },
          { label: "Registrado", bg: "rgba(134,239,172,0.16)", color: "#86EFAC", path: "M5 13l4 4L19 7", strokeWidth: 2.2 },
        ].map((step, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, position: "relative" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", color: step.color }}>
              {step.svg ? step.svg : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth={step.strokeWidth || 1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d={step.path} />
                </svg>
              )}
            </div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: t.sub, textAlign: "center", lineHeight: 1.2 }}>{step.label}</div>
            {idx < 3 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: "-22px", top: "10px" }}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Beneficios */}
      <div style={{ fontSize: "14px", fontWeight: 800, color: t.text, textAlign: "center", marginTop: 28 }}>
        ✨ Beneficios Principales
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
        {[
          { title: "Ahorra Tiempo", desc: "No escribas nada. ORUS lo registra por ti automáticamente.", path: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 3\"/>" },
          { title: "Datos Precisos", desc: "La categorización automática clasifica tus gastos en segundos.", path: "<path d=\"M5 20V10M12 20V4M19 20v-7\"/>" },
          { title: "Control en Tiempo Real", desc: "Ve tu saldo actualizado al instante sin hacer nada.", path: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"12\" cy=\"12\" r=\"0.6\" fill=\"currentColor\"/>" },
          { title: "Mejora Financiera", desc: "Datos completos = mejores decisiones sobre tu dinero.", path: "<path d=\"M9 18h6M10 21h4M12 3a6 6 0 016 6c0 2.5-1.5 3.8-2.5 4.8-.5.5-.5 1.2-.5 2.2H9c0-1-.1-1.7-.5-2.2C7.5 12.8 6 11.5 6 9a6 6 0 016-6z\"/>" },
        ].map((benefit, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 11, background: isDark ? "linear-gradient(155deg,#262231,#17151f)" : "linear-gradient(155deg,#f5f3fa,#ede9f7)", boxShadow: t.shadowSm, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: t.text }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: benefit.path }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: t.text }}>{benefit.title}</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: t.sub, marginTop: 2 }}>{benefit.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Casos de Uso */}
      <div style={{ fontSize: "14px", fontWeight: 800, color: t.text, textAlign: "center", marginTop: 28 }}>
        📱 Casos de Uso Reales
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
        {[
          { title: "Cafés y Almuerzos", desc: "Pagas café con NFC → Wallet notifica → ORUS abre app con transacción pre-llena", bg: "rgba(245,180,77,0.16)", color: "#F5B44D", path: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" },
          { title: "Compras Urgentes", desc: "Tienda sin atención → Toma foto de recibo → Atajos lo categoriza automáticamente", bg: t.accentSoft, color: t.accent, path: "M9 18h6M12 2c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2zM5 9a7 7 0 0014 0" },
          { title: "Control de Presupuesto", desc: "Cada gasto se registra solo → Ves tu presupuesto actualizado en tiempo real", bg: "rgba(134,239,172,0.16)", color: "#86EFAC", path: "M5 20V10M12 20V4M19 20v-7" },
        ].map((usecase, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: usecase.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: usecase.color }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={usecase.path} />
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: t.text }}>{usecase.title}</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: t.sub, marginTop: 2, lineHeight: 1.5 }}>{usecase.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Impacto Final */}
      <div style={{ fontSize: "14px", fontWeight: 800, color: t.text, textAlign: "center", marginTop: 28 }}>
        🎯 El Impacto Final
      </div>

      <div style={{ padding: 16, borderRadius: 16, background: t.surface, marginTop: 14, fontSize: "12px", fontWeight: 600, color: t.text, lineHeight: 1.6, textAlign: "left" }}>
        <strong>Con automatización:</strong> Tienes datos 100% completos. Esto te permite:
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: t.sub, flexShrink: 0 }}>•</span>
            <span style={{ color: t.sub }}>Identificar patrones de gasto</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: t.sub, flexShrink: 0 }}>•</span>
            <span style={{ color: t.sub }}>Tomar decisiones reales basadas en datos</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: t.sub, flexShrink: 0 }}>•</span>
            <span style={{ color: t.sub }}>Cumplir presupuestos sin overspending</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: t.sub, flexShrink: 0 }}>•</span>
            <span style={{ color: t.sub }}>Ahorrar más viendo exactamente dónde va tu dinero</span>
          </div>
        </div>
      </div>

        {/* Tip Final */}
        <div style={{ padding: 16, borderRadius: 16, background: t.accentSoft, marginTop: 20, fontSize: "11.5px", fontWeight: 600, color: t.text, textAlign: "center", lineHeight: 1.5 }}>
          <strong style={{ color: t.accent }}>Consejo:</strong> Activa los canales que uses junto con las notificaciones de ORUS para mejor desempeño.
        </div>
      </div>
    </div>
  );
}
