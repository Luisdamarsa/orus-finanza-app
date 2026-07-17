import { useState, useEffect } from "react";
import { userStorage } from "../utils/userStorage";
import { CURRENCIES, LANGUAGES } from "../constants";
import { usePopup } from "../services/PopupService";
import { usePress } from "../hooks/usePress";
import PageLayout from "./PageLayout";
import DeleteAccountModal from "./DeleteAccountModal";
import { CheckmarkIcon, TrashIcon, CopyIcon, GoogleIcon, AppleIcon } from "../icons/Icons";
import LoadingWrapper from "./LoadingWrapper";
import { FormSkeleton } from "./LoadingSkeleton";

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
  onSaveSuccess, // Callback para navegar de vuelta a Settings
}) {
  // 🆕 Usar el servicio de popups
  const popup = usePopup();
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

  // Modal de eliminación de cuenta
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  // Datos del usuario (read-only)
  const [user, setUser] = useState(null);

  // Estados para detección de cambios
  const [hasChanged, setHasChanged] = useState(false);
  // Estado para mostrar que se copió el User ID
  const [copiedUserId, setCopiedUserId] = useState(false);

  // 🆕 Estado de loading para skeleton
  const [isLoading, setIsLoading] = useState(true);

  // 🆕 Usar hook de press effect para todos los botones
  const pressBack = usePress();
  const pressDelete = usePress();
  const pressGuardar = usePress();
  const pressLogout = usePress();

  // Función para generar User ID único (10 caracteres alfanuméricos)
  // Cargar datos del usuario al montar
  useEffect(() => {
    const userData = userStorage.getUser();
    setUser(userData);
    setDisplayName(userData.displayName);
    setCurrency(userData.currency);
    setLanguage(userData.language);
    setHasChanged(false); // Reset cambios al montar
    setIsLoading(false); // 🆕 Terminar loading
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

  // 🆕 Función para copiar User ID al portapapeles
  const handleCopyUserId = async () => {
    if (!user || !user.userId) return;

    try {
      await navigator.clipboard.writeText(user.userId);
      setCopiedUserId(true);
      // Mostrar "Copiado" por 2 segundos
      setTimeout(() => setCopiedUserId(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
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

    // 🆕 Mostrar popup de éxito usando el servicio
    popup.showEditPopup('Perfil');

    // Llamar a callback y regresa a Settings
    if (onSaveSuccess) {
      onSaveSuccess();
    } else {
      onBack();
    }
  };

  // Opciones de moneda
  const currencyOptions = CURRENCIES;

  // Opciones de idioma
  const languageOptions = LANGUAGES;

  const getCurrencyLabel = () => currencyOptions.find(o => o.value === currency)?.label || "Peso Colombiano (COP) - $";
  const getLanguageLabel = () => languageOptions.find(o => o.value === language)?.label || "Español (ES)";

  if (!user) return null; // Esperar a que carguen los datos

  // Componente para el botón Cerrar Sesión en el título
  const logoutButtonInTitle = (
    <button
      onClick={onBack}
      {...pressLogout.handlers}
      style={{
        position: "absolute",
        right: 22,
        padding: "8px 14px",
        borderRadius: 6,
        border: `1px solid ${t.border}`,
        background: isDark ? "#252535" : "#F5F3FF",
        color: t.text,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        outline: "none",
        ...pressLogout.getPressStyle({ scale: 0.95 }),
      }}
      onMouseEnter={(e) => {
        if (!pressLogout.pressing) {
          e.target.style.background = isDark ? "#2D2D3A" : "#F0EFF8";
        }
      }}
      onMouseLeave={(e) => {
        if (!pressLogout.pressing) {
          e.target.style.background = isDark ? "#252535" : "#F5F3FF";
        }
      }}>
      Cerrar Sesión
    </button>
  );

  return (
    <>
    <PageLayout
      isDark={isDark}
      onBack={onBack}
      title={
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          <span style={{ fontSize: 22 }}>👤</span>
          Perfil
        </div>
      }
      pressBack={pressBack}
      titleExtra={logoutButtonInTitle}
    >
      {/* LoadingWrapper para mostrar skeleton mientras carga */}
      <LoadingWrapper
        isLoading={isLoading}
        skeleton={<FormSkeleton isDark={isDark} fieldCount={4} />}
        isDark={isDark}
      >
        <>
            {/* SECCIÓN 1: Nombre de Usuario (SIEMPRE Editable) */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: t.sub,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}>
              Nombre de usuario
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => handleDisplayNameChange(e.target.value)}
              style={{
                flex: 1,
                padding: "6px 14px",
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

          {/* User ID - Alineado a la derecha debajo del input */}
          {user && user.userId && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginLeft: 0 }}>
              <span style={{ fontSize: 11, color: t.sub, fontWeight: 500 }}>
                User ID: <strong style={{ color: t.text, fontFamily: "monospace" }}>{user.userId}</strong>
              </span>
              <button
                onClick={handleCopyUserId}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = "0.7";
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = "1";
                }}
                title={copiedUserId ? "¡Copiado!" : "Copiar User ID"}>
                <CopyIcon width={14} height={14} color={copiedUserId ? "#22C55E" : t.sub} strokeWidth={2} />
              </button>
              {copiedUserId && (
                <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 600 }}>Copiado</span>
              )}
            </div>
          )}
        </div>

        {/* SECCIÓN 2: Datos Personales (Read-only) */}
        <div style={{ marginTop: 4, paddingTop: 28, borderTop: `1px solid ${t.border}`, marginBottom: 28 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: t.sub,
              marginBottom: 12,
              textTransform: "uppercase",
              textAlign: "left",
            }}>
            Información Personal
          </div>

          {/* Nombre(s) */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}>
              Nombre(s)
            </label>
            <input
              type="text"
              value={user.firstName}
              disabled
              style={{
                flex: 1,
                padding: "6px 14px",
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
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}>
              Apellido(s)
            </label>
            <input
              type="text"
              value={user.lastName}
              disabled
              style={{
                flex: 1,
                padding: "6px 14px",
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
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}>
              Correo Electrónico
            </label>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="email"
                value={user.email}
                disabled
                style={{
                  width: "100%",
                  padding: "6px 14px 6px 34px",
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
              {user.authProvider === "google" && (
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", display: "flex", pointerEvents: "none" }}>
                  <GoogleIcon size={16} />
                </span>
              )}
              {user.authProvider === "apple" && (
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", display: "flex", pointerEvents: "none" }}>
                  <AppleIcon size={16} color={isDark ? "#F0EEFF" : "#1A1830"} />
                </span>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: t.sub,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}>
              Teléfono
            </label>
            <input
              type="tel"
              value={user.phone}
              disabled
              style={{
                flex: 1,
                padding: "6px 14px",
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
        <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${t.border}`, marginBottom: 28 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: t.sub,
              marginBottom: 12,
              textTransform: "uppercase",
              textAlign: "left",
            }}>
            Preferencias
          </div>

          {/* Moneda - Popup */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: t.sub,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  flex: "0 0 auto",
                  paddingTop: 6,
                }}>
                Moneda
              </label>
              <div style={{ flex: 1 }}>
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  style={{
                    width: "100%",
                    padding: "6px 14px",
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
                      padding: "6px 14px",
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
            </div>
          </div>

          {/* Idioma - Popup */}
          <div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: t.sub,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  flex: "0 0 auto",
                  paddingTop: 6,
                }}>
                Idioma
              </label>
              <div style={{ flex: 1 }}>
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  style={{
                    width: "100%",
                    padding: "6px 14px",
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
                      padding: "6px 14px",
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
        </div>

        {/* SECCIÓN 4: Zona de Peligro - Eliminar Cuenta */}
        <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${t.border}` }}>
          <button
            onClick={() => setDeleteAccountModalOpen(true)}
            {...pressDelete.handlers}
            style={{
              width: "100%",
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: "#EF4444",
              fontSize: 14,
              fontWeight: 700,
              boxSizing: "border-box",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              ...pressDelete.getPressStyle(),
            }}
            onMouseEnter={(e) => {
              if (!pressDelete.pressing) {
                e.target.style.background = "#DC2626";
              }
            }}
            onMouseLeave={(e) => {
              if (!pressDelete.pressing) {
                e.target.style.background = "#EF4444";
              }
            }}
          >
            {/* Icono de papelera centralizado */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                flexShrink: 0,
              }}>
              <TrashIcon width={14} height={14} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <span style={{ color: "#FFFFFF" }}>Eliminar Cuenta</span>
          </button>
        </div>
        </>
      </LoadingWrapper>
    </PageLayout>

    {/* Modal de Eliminación de Cuenta */}
    <DeleteAccountModal
      isDark={isDark}
      isOpen={deleteAccountModalOpen}
      onCancel={() => setDeleteAccountModalOpen(false)}
      onConfirm={() => {
        popup.showDeletePopup('cuenta');
        setDeleteAccountModalOpen(false);
      }}
    />

    {/* Botón Guardar Flotante (✓) - Esquina Inferior Derecha */}
    <div style={{ position: "fixed", bottom: 24, right: 22 }}>
      <button
        onClick={handleSave}
        onPointerDown={() => hasChanged && pressGuardar.handlers.onPointerDown()}
        onPointerUp={() => pressGuardar.handlers.onPointerUp()}
        onPointerLeave={() => pressGuardar.handlers.onPointerLeave()}
        disabled={!hasChanged}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
          cursor: hasChanged ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: hasChanged ? (pressGuardar.pressing ? 0.9 : 1) : 0.45,
          ...(hasChanged ? pressGuardar.getPressStyle({ scale: 0.93 }) : {}),
        }}
      >
        <CheckmarkIcon width={22} height={22} color="white" strokeWidth={3} />
      </button>
    </div>
    </>
  );
}
