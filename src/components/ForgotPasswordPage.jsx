import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { usePress } from "../hooks/usePress";
import { useAuth } from "../hooks/useAuth";
import { DARK, LIGHT } from "../constants/tokens";
import { getClayShadow } from "../utils/clayStyles";
import { getCTAButtonStyle } from "../utils/buttonStyles";

// Lock Icon SVG
const LockIconSvg = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// Back Button
const BackButtonSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B87A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

// Alert Icon SVG
const AlertIconSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function ForgotPasswordPage({ setScreen }) {
  const { isDark } = useTheme();
  const { resetPassword } = useAuth();
  const tokens = isDark ? DARK : LIGHT;

  const [step, setStep] = useState(1); // 1: email, 2: code, 3: password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);

  const t = {
    bg: tokens.bg,
    text: tokens.text,
    sub: tokens.sub,
    accent: tokens.accent,
    danger: "#FF8A8A",
    success: "#86EFAC",
  };

  // Validate email format
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ===== STEP 1: EMAIL =====
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    if (!isEmailValid(email)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Simulación: aceptar cualquier correo
      setStep(2);
      setResendCountdown(60);
      setIsLoading(false);
    }, 800);
  };

  // ===== STEP 2: CODE =====
  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Solo dígitos
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (code.some((c) => !c)) return;

    // Si ya agotó intentos, mostrar error
    if (attempts >= 5) {
      setError("Intentos agotados. Solicita un nuevo código.");
      return;
    }

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const fullCode = code.join("");
      if (fullCode === "123456") {
        setStep(3);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setCode(["", "", "", "", "", ""]);

        if (newAttempts >= 5) {
          setError(`Código incorrecto. (Intento 5 de 5)`);
        } else {
          setError(`Código incorrecto. (Intento ${newAttempts} de 5)`);
        }
      }
      setIsLoading(false);
    }, 600);
  };

  const handleResend = () => {
    setError("");
    setCode(["", "", "", "", "", ""]);
    setAttempts(0);
    setResendCountdown(60);
    // TODO: Simular reenvío de código
  };

  // Resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // ===== STEP 3: PASSWORD =====
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email, password);

    if (result.success) {
      // Contraseña cambiada exitosamente - ir a login
      setTimeout(() => {
        setScreen("login");
      }, 800);
    } else {
      // Error - mostrar mensaje
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setScreen("login");
    } else if (step === 2) {
      setStep(1);
      setCode(["", "", "", "", "", ""]);
      setAttempts(0);
    } else {
      setStep(2);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      padding: "22px 26px",
      display: "flex",
      flexDirection: "column",
      background: "#000000",
      color: t.text,
      fontFamily: "Manrope, system-ui, sans-serif",
      overflow: "auto",
    }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Back Button - outside centered wrapper */}
      <button
        onClick={handleBack}
        style={{
          flexShrink: 0,
          alignSelf: "flex-start",
          background: "none",
          border: "none",
          color: "#8B87A3",
          cursor: "pointer",
          padding: "6px 0",
          display: "flex",
          alignItems: "center",
          fontSize: 13,
          fontWeight: 700,
          gap: 6,
        }}
      >
        <BackButtonSvg />
        Atrás
      </button>

      {/* Centered Content Wrapper - all content inside */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: 14,
      }}>
        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <>
            {/* Icon */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "rgba(155,109,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9B6DFF",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 7l9 6 9-6"/>
              </svg>
            </div>

            {/* Title & Subtitle */}
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: 19, fontWeight: 600, margin: 0, color: "#F5F3FF", marginTop: 4 }}>
                Recuperar contraseña
              </h1>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: "#8B87A3", lineHeight: 1.5, margin: "6px 0 0", maxWidth: 280 }}>
                Escribe el correo asociado a tu cuenta. Te enviaremos un código de verificación.
              </p>
            </div>

            {/* Email Field */}
            <div style={{ width: "100%", maxWidth: 360, marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#8B87A3", marginBottom: 0, display: "block", letterSpacing: "0.3px", textTransform: "uppercase", textAlign: "left" }}>
                CORREO ELECTRÓNICO
              </label>
              <style>{`
                #email-input::placeholder {
                  color: #5F5C74;
                }
              `}</style>
              <input
                id="email-input"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 18px",
                  margin: 0,
                  fontSize: 14,
                  fontFamily: "inherit",
                  border: `1px solid ${error ? "#FF8A8A" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 16,
                  background: "#1e1b28",
                  color: "#F5F3FF",
                  outline: "none",
                  boxShadow: "inset 0 6px 12px -8px rgba(0,0,0,0.5)",
                  transition: "all 0.3s",
                }}
              />
              {error && (
                <span
                  style={{
                    color: "#FF8A8A",
                    fontSize: 11.5,
                    fontWeight: 700,
                    textAlign: "left",
                  }}
                >
                  {error}
                </span>
              )}
              <button
                type="submit"
                onClick={handleEmailSubmit}
                disabled={!email || isLoading}
                style={{
                  ...getCTAButtonStyle(email && !isLoading),
                }}
              >
                {isLoading ? "Enviando..." : "Enviar código"}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: CODE */}
        {step === 2 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <h1 style={{ fontSize: 19, fontWeight: 600, margin: 0, color: "#F5F3FF" }}>
                Verificar Código
              </h1>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: "#8B87A3", lineHeight: 1.5, margin: "6px 0 0", maxWidth: 280 }}>
                Enviamos un código de 6 dígitos a <strong style={{ color: "#F5F3FF" }}>{email}</strong>
              </p>
            </div>

            {/* Code Inputs */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  disabled={isLoading || attempts >= 5}
                  style={{
                    width: 44,
                    height: 52,
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 800,
                    borderRadius: 14,
                    border: `1px solid ${error ? t.danger : "rgba(255,255,255,0.07)"}`,
                    background: "#1e1b28",
                    color: "white",
                    outline: "none",
                  }}
                />
              ))}
            </div>

            {/* Resend Link */}
            <div style={{ textAlign: "center", fontSize: 12, color: t.sub }}>
              ¿No recibiste el código?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCountdown > 0 || attempts >= 5}
                style={{
                  background: "none",
                  border: "none",
                  color: resendCountdown > 0 ? t.sub : t.accent,
                  fontWeight: 700,
                  cursor: resendCountdown > 0 ? "not-allowed" : "pointer",
                }}
              >
                {resendCountdown > 0 ? `Reenviar en 0:${resendCountdown.toString().padStart(2, "0")}` : "Reenviar"}
              </button>
            </div>

            {error && (
              <span
                style={{
                  color: "#FF8A8A",
                  fontSize: 11.5,
                  fontWeight: 700,
                  textAlign: "left",
                }}
              >
                {error}
              </span>
            )}

            <button
              onClick={handleCodeSubmit}
              disabled={code.some((c) => !c) || isLoading || attempts >= 5}
              style={{
                maxWidth: 360,
                ...getCTAButtonStyle(code.every((c) => c) && !isLoading && attempts < 5),
              }}
            >
              {isLoading ? "Verificando..." : "Verificar código"}
            </button>
          </>
        )}

        {/* STEP 3: PASSWORD */}
        {step === 3 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <h1 style={{ fontSize: 19, fontWeight: 600, margin: 0, color: "#F5F3FF" }}>
                Nueva Contraseña
              </h1>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: "#8B87A3", lineHeight: 1.5, margin: "6px 0 0", maxWidth: 280 }}>
                Crea una contraseña segura para tu cuenta.
              </p>
            </div>

            {/* Password Form Container */}
            <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* New Password */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8B87A3", marginBottom: 8, display: "block", letterSpacing: "0.3px", textTransform: "uppercase", textAlign: "left" }}>
                  NUEVA CONTRASEÑA
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px 18px",
                      paddingRight: 40,
                      margin: 0,
                      fontSize: 14,
                      fontFamily: "inherit",
                      border: `1px solid ${error.includes("8") ? t.danger : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 16,
                      background: "#1e1b28",
                      color: "white",
                      outline: "none",
                      boxShadow: "inset 0 6px 12px -8px rgba(0,0,0,0.5)",
                      transition: "all 0.3s",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: t.sub,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#8B87A3", marginBottom: 8, display: "block", letterSpacing: "0.3px", textTransform: "uppercase", textAlign: "left" }}>
                  CONFIRMAR CONTRASEÑA
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px 18px",
                      paddingRight: 40,
                      margin: 0,
                      fontSize: 14,
                      fontFamily: "inherit",
                      border: `1px solid ${error.includes("coinciden") ? t.danger : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 16,
                      background: "#1e1b28",
                      color: "white",
                      outline: "none",
                      boxShadow: "inset 0 6px 12px -8px rgba(0,0,0,0.5)",
                      transition: "all 0.3s",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: t.sub,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              {error && (
                <span
                  style={{
                    color: "#FF8A8A",
                    fontSize: 11.5,
                    fontWeight: 700,
                    textAlign: "left",
                  }}
                >
                  {error}
                </span>
              )}

              <button
                onClick={handlePasswordSubmit}
                disabled={!password || !confirmPassword || isLoading}
                style={{
                  ...getCTAButtonStyle(password && confirmPassword && !isLoading),
                }}
              >
                {isLoading ? "Cambiando..." : "Cambiar contraseña"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
