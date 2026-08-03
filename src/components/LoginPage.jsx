import { useState } from "react";
import { usePress } from "../hooks/usePress";
import { useTheme } from "../hooks/useTheme";
import DonutChart from "./DonutChart";
import { DARK, LIGHT, RADIUS } from "../constants/tokens";
import { inputStyles, buttonStyles, fabStyles } from "../utils/clayStyles";
import { getClayShadow } from "../utils/clayStyles";

export default function LoginPage({ setScreen }) {
  // 🆕 Tema desde ThemeContext
  const { isDark } = useTheme();

  const pressLogin = usePress();
  const pressSignup = usePress();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🆕 Tokens del design (Spatial UI + Claymorfismo)
  const tokens = isDark ? DARK : LIGHT;
  const t = {
    bg: tokens.bg,
    card: tokens.surfaceFlat,
    border: tokens.border,
    text: tokens.text,
    sub: tokens.sub,
    accent: tokens.accent,
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulación de login - en prod sería una llamada a API
    setTimeout(() => {
      if (email && password) {
        // TODO: Validar credenciales contra backend
        // Por ahora, rechazar siempre para mostrar error
        setError("Las credenciales son incorrectas");
      } else {
        setError("Por favor completa todos los campos");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleSignup = () => {
    // TODO: Navegar a página de registro
    console.log("Ir a registro");
  };

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: t.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px",
      boxSizing: "border-box",
      overflow: "auto",
    }}>
      {/* Top Spacer */}
      <div style={{ flex: "0 0 auto", height: "5vh" }} />

      {/* Main Content - Centered Vertically */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: "1 1 auto",
        justifyContent: "center",
        width: "100%",
      }}>
        {/* Donut + Tagline Container */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          marginBottom: 100,
        }}>
          {/* Donut Logo - Real DonutChart */}
          <div style={{ pointerEvents: "none", position: "relative", width: 140, height: 140 }}>
            <DonutChart
              segments={[
                { id: "fijos", label: "Fijos", color: "#93C5FD", pct: 35 },
                { id: "deuda", label: "Deuda", color: "#FCA5A5", pct: 15 },
                { id: "ahorro", label: "Ahorro", color: "#86EFAC", pct: 20 },
                { id: "ocio", label: "Ocio", color: "#C4B5FD", pct: 15 },
                { id: "varios", label: "Varios", color: "#FDE68A", pct: 15 },
              ]}
              cx={70}
              cy={70}
              outerR={55}
              innerR={28}
              activeId={null}
              onSelect={() => {}}
              isDark={true}
              total={0}
              totalSpent={0}
              pillarSpends={{}}
              hasSaldoAsignado={false}
              saldoValue={0}
              selectedPeriod={null}
              showCenterText={false}
            />
            {/* ORUS Text Overlay - Replace Gastado $0 */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#F0EEFF",
                letterSpacing: 1,
              }}>
                ORUS
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: t.text,
            textAlign: "center",
            maxWidth: 300,
          }}>
            Toma el control de tus finanzas
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleLogin} style={{
          width: "100%",
          maxWidth: 320,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
        {/* Email Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{
            fontSize: 13,
            fontWeight: 600,
            color: t.text,
            textAlign: "left",
          }}>
            Usuario
          </label>
          <input
            type="text"
            placeholder="Nombre de usuario o correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "inherit",
              outline: "none",
              ...inputStyles(tokens, isDark),
            }}
            onFocus={(e) => e.target.style.borderColor = t.accent}
            onBlur={(e) => e.target.style.borderColor = t.border}
            disabled={isLoading}
          />
        </div>

        {/* Password Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{
            fontSize: 13,
            fontWeight: 600,
            color: t.text,
            textAlign: "left",
          }}>
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "inherit",
              outline: "none",
              ...inputStyles(tokens, isDark),
            }}
            onFocus={(e) => e.target.style.borderColor = t.accent}
            onBlur={(e) => e.target.style.borderColor = t.border}
            disabled={isLoading}
          />
        </div>

        {/* Forgot Password Link */}
        <button
          type="button"
          onClick={() => setScreen("forgot-password")}
          style={{
            background: "none",
            border: "none",
            color: t.accent,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
            padding: 0,
            textDecoration: "underline",
          }}
          disabled={isLoading}
        >
          ¿Olvidé mi contraseña?
        </button>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(252, 165, 165, 0.15)",
            border: `1px solid #FCA5A5`,
            color: "#FCA5A5",
            fontSize: 12,
            fontWeight: 500,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Buttons Container */}
        <div style={{
          display: "flex",
          gap: 12,
          marginTop: 8,
        }}>
          {/* Login Button */}
          <button
            type="submit"
            {...pressLogin.handlers}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: RADIUS.md,
              border: "none",
              background: t.accent,
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 700,
              cursor: isLoading ? "wait" : "pointer",
              boxShadow: getClayShadow("sm", isDark),
              ...pressLogin.getPressStyle({ opacity: 0.85, scale: 0.98 }),
            }}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </button>

          {/* Signup Button */}
          <button
            type="button"
            onClick={handleSignup}
            {...pressSignup.handlers}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: `1.5px solid ${t.border}`,
              background: "transparent",
              color: t.text,
              fontSize: 13,
              fontWeight: 700,
              cursor: isLoading ? "wait" : "pointer",
              ...pressSignup.getPressStyle({ opacity: 0.8, scale: 0.98 }),
            }}
            disabled={isLoading}
          >
            Registrarse
          </button>
        </div>
        </form>
      </div>

      {/* Footer Links */}
      <div style={{
        flex: "0 0 auto",
        display: "flex",
        gap: 20,
        justifyContent: "center",
        fontSize: 11,
        color: t.sub,
        marginBottom: 20,
      }}>
        <button
          onClick={() => setScreen("legal")}
          style={{
            background: "none",
            border: "none",
            color: t.sub,
            cursor: "pointer",
            fontSize: 11,
            textDecoration: "underline",
          }}
        >
          Términos y Condiciones
        </button>
        <button
          onClick={() => setScreen("about-login")}
          style={{
            background: "none",
            border: "none",
            color: t.sub,
            cursor: "pointer",
            fontSize: 11,
            textDecoration: "underline",
          }}
        >
          Acerca de ORUS
        </button>
      </div>
    </div>
  );
}
