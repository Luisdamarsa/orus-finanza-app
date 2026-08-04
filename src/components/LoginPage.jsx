import { useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import { DARK, LIGHT } from "../constants/tokens";
import { getClayShadow } from "../utils/clayStyles";

// Google Logo SVG - official 4-color
const GoogleLogoSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.19 3.32v2.77h3.55c2.08-1.92 3.28-4.74 3.28-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.23 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.53H2.18v2.85A10.98 10.98 0 0012 23z"/>
    <path fill="#FBBC05" d="M5.83 14.1a6.6 6.6 0 010-4.2V7.05H2.18a11 11 0 000 9.9l3.65-2.85z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.65 2.85C6.7 7.32 9.13 5.38 12 5.38z"/>
  </svg>
);

// Apple Logo SVG - silhouette, inherits color
const AppleLogoSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.365 1.43c.148 1.007-.229 1.985-.86 2.72-.658.766-1.708 1.32-2.73 1.245-.16-1 .27-2.03.9-2.72.66-.75 1.79-1.31 2.69-1.245zM20.42 17.29c-.51 1.14-.76 1.65-1.42 2.65-.92 1.4-2.22 3.14-3.83 3.15-1.44.02-1.8-.94-3.75-.93-1.95.01-2.35.95-3.79.94-1.61-.01-2.84-1.6-3.76-3-2.57-3.86-2.84-8.4-1.25-10.83.99-1.5 2.56-2.44 4.02-2.44 1.5 0 2.44.83 3.68.83 1.2 0 1.93-.83 3.68-.83 1.29 0 2.66.7 3.65 1.9-3.21 1.76-2.69 6.34.77 8.51z"/>
  </svg>
);

export default function LoginPage({ setScreen }) {
  const { isDark } = useTheme();
  const pressLogin = usePress();
  const pressSignup = usePress();
  const pressGoogle = usePress();
  const pressApple = usePress();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = email.length > 0 && password.length > 0 && !isLoading;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        setError("Usuario o contraseña incorrectos");
      }
      setIsLoading(false);
    }, 800);
  };

  const handleSignup = () => {
    setScreen("signup");
  };

  const handleOAuth = (provider) => {
    console.log(`OAuth: ${provider}`);
  };

  const handleForgotPassword = () => {
    setScreen("forgot-password");
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "auto",
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
    >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Glow behind logo - enters from top, partially hidden, 30% larger */}
      <div
        style={{
          position: "absolute",
          top: "-156px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 442,
          height: 442,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)",
          filter: "blur(10px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        {/* Logo Container */}
        <div style={{ marginTop: 20, marginBottom: 60 }}>
          {/* Donut Logo with 5 pillars - 56% larger (30% + 20%) */}
          <svg
            width="187"
            height="187"
            viewBox="0 0 120 120"
            style={{
              display: "block",
              filter: "drop-shadow(0 20px 40px rgba(155,109,255,0.4))",
            }}
          >
            {/* Segment 1: Fijos (Azul) - 35% = 126° */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray="104.72 299.77"
              strokeDashoffset="0"
              transform="rotate(-90 60 60)"
            />
            {/* Segment 2: Deuda (Rojo) - 15% = 54° */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#FCA5A5"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray="44.88 299.77"
              strokeDashoffset="-104.72"
              transform="rotate(-90 60 60)"
            />
            {/* Segment 3: Ahorro (Verde) - 20% = 72° */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#86EFAC"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray="59.95 299.77"
              strokeDashoffset="-149.6"
              transform="rotate(-90 60 60)"
            />
            {/* Segment 4: Ocio (Morado) - 15% = 54° */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#C4B5FD"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray="44.88 299.77"
              strokeDashoffset="-209.55"
              transform="rotate(-90 60 60)"
            />
            {/* Segment 5: Varios (Ámbar) - 15% = 54° */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#FDE68A"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray="44.88 299.77"
              strokeDashoffset="-254.43"
              transform="rotate(-90 60 60)"
            />
            {/* Center Text - transparent background for blending with glow */}
            <text
              x="60"
              y="66"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="22"
              fontWeight="800"
              fill="white"
              letterSpacing="1"
              fontFamily="Manrope"
            >
              ORUS
            </text>
          </svg>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            marginBottom: 48,
            maxWidth: 300,
          }}
        >
          Toma el control de tus finanzas
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Email Field */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#8B87A3",
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              USUARIO
            </label>
            <input
              type="text"
              placeholder="Nombre de usuario o correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                padding: "16px 18px",
                fontSize: 13,
                fontFamily: "inherit",
                border: `1px solid ${error ? "#FF8A8A" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 16,
                background: "#1e1b28",
                color: "white",
                outline: "none",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
                transition: "all 0.3s",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.4), 0 0 0 2px rgba(139,92,246,0.2)")}
              onBlur={(e) => (e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.4)")}
            />
          </div>

          {/* Password Field */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#8B87A3",
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              CONTRASEÑA
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{
                padding: "16px 18px",
                fontSize: 13,
                fontFamily: "inherit",
                border: `1px solid ${error ? "#FF8A8A" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 16,
                background: "#1e1b28",
                color: "white",
                outline: "none",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
                transition: "all 0.3s",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.4), 0 0 0 2px rgba(139,92,246,0.2)")}
              onBlur={(e) => (e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.4)")}
            />
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: "right" }}>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              style={{
                background: "none",
                border: "none",
                color: "#9B6DFF",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              ¿Olvidé mi contraseña?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(255,138,138,0.14)",
                color: "#FF8A8A",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {/* Login Button - exact spec: vivid purple gradient with clay effect */}
            <button
              type="submit"
              {...pressLogin.handlers}
              disabled={!canSubmit}
              style={{
                flex: "1.3",
                padding: "16px",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(155deg, #B18CFF 0%, #8B5CF6 100%)",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 800,
                cursor: canSubmit ? "pointer" : "not-allowed",
                boxShadow: canSubmit
                  ? "0 14px 26px -10px rgba(139, 92, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
                  : "0 2px 8px rgba(0, 0, 0, 0.3)",
                opacity: canSubmit ? 1 : 0.5,
                transition: "all 0.3s ease",
                ...pressLogin.getPressStyle({ opacity: 0.85, scale: 0.98 }),
              }}
            >
              {isLoading ? "Iniciando..." : "Iniciar sesión"}
            </button>

            {/* Signup Button */}
            <button
              type="button"
              onClick={handleSignup}
              {...pressSignup.handlers}
              disabled={isLoading}
              style={{
                flex: "1",
                padding: "14px 16px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "#2a2733",
                color: "white",
                fontSize: 14,
                fontWeight: 800,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: isLoading ? 0.6 : 1,
                ...pressSignup.getPressStyle({ opacity: 0.9, scale: 0.98 }),
              }}
            >
              Registrarse
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8B87A3" }}>
              O CONTINÚA CON
            </div>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Social Buttons - exact spec */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              {...pressGoogle.handlers}
              disabled={isLoading}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(155deg, #262231, #17151f)",
                boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                color: "#F5F3FF",
                fontWeight: 700,
                fontSize: 13,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: isLoading ? 0.6 : 1,
                ...pressGoogle.getPressStyle({ opacity: 0.9, scale: 0.98 }),
              }}
            >
              <GoogleLogoSvg />
              <span>Google</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              {...pressApple.handlers}
              disabled={isLoading}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(155deg, #262231, #17151f)",
                boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                color: "#F5F3FF",
                fontWeight: 700,
                fontSize: 13,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: isLoading ? 0.6 : 1,
                ...pressApple.getPressStyle({ opacity: 0.9, scale: 0.98 }),
              }}
            >
              <AppleLogoSvg />
              <span>Apple</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer - links in accent purple */}
      <div
        style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          color: "#9B6DFF",
          marginBottom: 16,
          zIndex: 1,
        }}
      >
        <button
          onClick={() => setScreen("legal")}
          style={{
            background: "none",
            border: "none",
            color: "#9B6DFF",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#B18CFF")}
          onMouseLeave={(e) => (e.target.style.color = "#9B6DFF")}
        >
          Términos y Condiciones
        </button>
        <button
          onClick={() => setScreen("about-login")}
          style={{
            background: "none",
            border: "none",
            color: "#9B6DFF",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#B18CFF")}
          onMouseLeave={(e) => (e.target.style.color = "#9B6DFF")}
        >
          Acerca de ORUS
        </button>
      </div>
    </div>
  );
}
