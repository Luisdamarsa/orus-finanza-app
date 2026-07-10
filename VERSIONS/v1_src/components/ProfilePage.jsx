import { useState, useEffect } from "react";
import { userStorage } from "../utils/userStorage";

/**
 * Página de Perfil del usuario
 * Muestra y permite editar:
 * - Nombre de visualización (editable)
 * - Datos personales (read-only)
 * - Preferencias: moneda, idioma
 */
export default function ProfilePage({
  isDark,
  onBack,
  onSaveSuccess, // 🆕 Callback cuando se guardan cambios
}) {
  const t = isDark
    ? { bg: "#000000", card: "#1E1E2E", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99", inputBg: "#2D2D3A", inputText: "#F0EEFF", disabled: "#9B99B3", disabledBg: "#3D3D4D" }
    : { bg: "#F8F7FF", card: "#FFFFFF", border: "#E5E3F5", text: "#1A1830", sub: "#9896B0", inputBg: "#F1F0FF", inputText: "#1A1830", disabled: "#7B7A99", disabledBg: "#F5F3FF" };

  // Estado local para los campos editables
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("COP");
  const [language, setLanguage] = useState("ES");

  // Popups para dropdowns
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  // Datos del usuario (read-only)
  const [user, setUser] = useState(null);

  // Estados para detección de cambios
  const [hasChanged, setHasChanged] = useState(false);

  // Cargar datos del usuario al montar
  useEffect(() => {
    const userData = userStorage.getUser();
    setUser(userData);
    setDisplayName(userData.displayName);
    setCurrency(userData.currency);
    setLanguage(userData.language);
    setHasChanged(false); // Reset cambios al montar
  }, []);

  // 🆕 Detectar cambios en tiempo real
  const checkForChanges = () => {
    if (!user) return;
    const changed =
      displayName !== user.displayName ||
      currency !== user.currency ||
      language !== user.language;
    setHasChanged(changed);
  };

  // Ejecutar checkForChanges cuando cualquier campo cambia
  useEffect(() => {
    checkForChanges();
  }, [displayName, currency, language, user]);

  // Manejar cambios en displayName
  const handleDisplayNameChange = (value) => {
    setDisplayName(value);
  };

  // Manejar cambios en moneda
  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setCurrencyOpen(false);
  };

  // Manejar cambios en idioma
  const handleLanguageChange = (value) => {
    setLanguage(value);
    setLanguageOpen(false);
  };

  // 🆕 Guardar cambios
  const handleSave = () => {
    if (!hasChanged) return; // No hacer nada si no hay cambios

    userStorage.updateUser({
      displayName,
      currency,
      language,
    });

    setHasChanged(false);

    // 🆕 Llamar a callback y regresa a Settings (el popup se muestra en Settings)
    if (onSaveSuccess) {
      onSaveSuccess();
    } else {
      onBack();
    }
  };

  // Opciones de moneda
  const currencyOptions = [
    { value: "COP", label: "Peso Colombiano (COP) - $" },
    { value: "USD", label: "Dólar Estadounidense (USD) - $" },
    { value: "EUR", label: "Euro (EUR) - €" },
  ];

  // Opciones de idioma
  const languageOptions = [
    { value: "ES", label: "Español (ES)" },
    { value: "EN", label: "English (EN)" },
  ];

  const getCurrencyLabel = () => currencyOptions.find(o => o.value === currency)?.label || "Peso Colombiano (COP) - $";
  const getLanguageLabel = () => languageOptions.find(o => o.value === language)?.label || "Español (ES)";

  if (!user) return null; // Esperar a que carguen los datos

  return (
    <div style={{ width: "100%", height: "100%", background: t.bg, position: "relative" }}>
      {/* Header fijo */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          height: 52,
          background: t.bg,
          padding: "8px 22px",
          boxSizing: "border-box",
          borderBottom: `1px solid ${t.border}`,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              border: "none",
              background: isDark ? "#1E1E2E" : "#EEE9FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#C4C2E0" : "#6B7280"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: 12, color: t.sub, fontWeight: 500 }}>Atrás</span>
        </div>
      </div>

      {/* Sección de Título + Botón Guardar */}
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 0,
          right: 0,
          height: 60,
          background: t.bg,
          padding: "0 22px",
          boxSizing: "border-box",
          zIndex: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: t.text,
            flex: 1,
            textAlign: "center",
          }}>
          Perfil
        </div>

        {/* Botón Guardar */}
        <div style={{ position: "absolute", right: 22 }}>
          <button
            onClick={handleSave}
            disabled={!hasChanged}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: hasChanged ? "pointer" : "not-allowed",
              background: hasChanged ? "#22C55E" : "#22C55E80",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              transition: "all 0.15s",
              boxShadow: hasChanged ? "0 2px 8px rgba(34, 197, 94, 0.3)" : "none",
              opacity: hasChanged ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (hasChanged) {
                e.target.style.background = "#16A34A";
                e.target.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (hasChanged) {
                e.target.style.background = "#22C55E";
                e.target.style.boxShadow = "0 2px 8px rgba(34, 197, 94, 0.3)";
              }
            }}>
            Guardar
          </button>
        </div>
      </div>

      {/* Contenido scrolleable */}
      <div
        style={{
          position: "absolute",
          top: 164,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          padding: "20px 22px",
          paddingBottom: 100,
          boxSizing: "border-box",
        }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {/* SECCIÓN 1: Nombre de Visualización (SIEMPRE Editable) */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: t.sub,
              marginBottom: 8,
              textTransform: "uppercase",
            }}>
            Cómo quieres que te llamemos?
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => handleDisplayNameChange(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: t.inputBg,
              color: t.inputText,
              fontSize: 14,
              fontWeight: 600,
              boxSizing: "border-box",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#7C3AED";
              e.target.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = t.border;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* SECCIÓN 2: Datos Personales (Read-only) */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: t.sub,
              marginBottom: 12,
              textTransform: "uppercase",
            }}>
            Información Personal
          </div>

          {/* Nombre(s) */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 6,
                textTransform: "uppercase",
              }}>
              Nombre(s)
            </label>
            <input
              type="text"
              value={user.firstName}
              disabled
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.disabledBg,
                color: t.disabled,
                fontSize: 14,
                fontWeight: 600,
                boxSizing: "border-box",
                cursor: "not-allowed",
              }}
            />
          </div>

          {/* Apellido(s) */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 6,
                textTransform: "uppercase",
              }}>
              Apellido(s)
            </label>
            <input
              type="text"
              value={user.lastName}
              disabled
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.disabledBg,
                color: t.disabled,
                fontSize: 14,
                fontWeight: 600,
                boxSizing: "border-box",
                cursor: "not-allowed",
              }}
            />
          </div>

          {/* Correo */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 6,
                textTransform: "uppercase",
              }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.disabledBg,
                color: t.disabled,
                fontSize: 14,
                fontWeight: 600,
                boxSizing: "border-box",
                cursor: "not-allowed",
              }}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 6,
                textTransform: "uppercase",
              }}>
              Teléfono
            </label>
            <input
              type="tel"
              value={user.phone}
              disabled
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.disabledBg,
                color: t.disabled,
                fontSize: 14,
                fontWeight: 600,
                boxSizing: "border-box",
                cursor: "not-allowed",
              }}
            />
          </div>
        </div>

        {/* SECCIÓN 3: Preferencias (SIEMPRE Editable) */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: t.sub,
              marginBottom: 12,
              textTransform: "uppercase",
            }}>
            Preferencias
          </div>

          {/* Moneda - Popup */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 6,
                textTransform: "uppercase",
              }}>
              Moneda
            </label>
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.inputBg,
                color: t.inputText,
                fontSize: 14,
                fontWeight: 600,
                boxSizing: "border-box",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "left",
              }}>
              {getCurrencyLabel()}
              <span style={{ transform: currencyOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                ▼
              </span>
            </button>

            {/* Popup de opciones de moneda */}
            {currencyOpen && (
              <div
                style={{
                  marginTop: 8,
                  borderRadius: 12,
                  border: `1px solid ${t.border}`,
                  background: t.card,
                  overflow: "hidden",
                  animation: "fadeInUp 0.2s ease",
                }}>
                {currencyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleCurrencyChange(option.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "none",
                      borderBottom: option !== currencyOptions[currencyOptions.length - 1] ? `1px solid ${t.border}` : "none",
                      background: currency === option.value ? (isDark ? "#2D2D3A" : "#F0EFF8") : "transparent",
                      color: currency === option.value ? "#7C3AED" : t.text,
                      fontSize: 14,
                      fontWeight: currency === option.value ? 700 : 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (currency !== option.value) {
                        e.target.style.background = isDark ? "#252535" : "#F5F3FF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currency !== option.value) {
                        e.target.style.background = "transparent";
                      }
                    }}>
                    {option.label}
                    {currency === option.value && (
                      <span style={{ marginLeft: 8, color: "#7C3AED" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Idioma - Popup */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                marginBottom: 6,
                textTransform: "uppercase",
              }}>
              Idioma
            </label>
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.inputBg,
                color: t.inputText,
                fontSize: 14,
                fontWeight: 600,
                boxSizing: "border-box",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "left",
              }}>
              {getLanguageLabel()}
              <span style={{ transform: languageOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                ▼
              </span>
            </button>

            {/* Popup de opciones de idioma */}
            {languageOpen && (
              <div
                style={{
                  marginTop: 8,
                  borderRadius: 12,
                  border: `1px solid ${t.border}`,
                  background: t.card,
                  overflow: "hidden",
                  animation: "fadeInUp 0.2s ease",
                }}>
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleLanguageChange(option.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "none",
                      borderBottom: option !== languageOptions[languageOptions.length - 1] ? `1px solid ${t.border}` : "none",
                      background: language === option.value ? (isDark ? "#2D2D3A" : "#F0EFF8") : "transparent",
                      color: language === option.value ? "#7C3AED" : t.text,
                      fontSize: 14,
                      fontWeight: language === option.value ? 700 : 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (language !== option.value) {
                        e.target.style.background = isDark ? "#252535" : "#F5F3FF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== option.value) {
                        e.target.style.background = "transparent";
                      }
                    }}>
                    {option.label}
                    {language === option.value && (
                      <span style={{ marginLeft: 8, color: "#7C3AED" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🆕 Gradiente de desvanecimiento flotante */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.9) 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(248, 247, 255, 0.4) 40%, rgba(248, 247, 255, 0.9) 100%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </div>
  );
}
