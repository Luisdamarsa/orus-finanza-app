import { useState, useEffect, useRef } from "react";
import { usePress } from "../hooks/usePress";
import { useAuth } from "../hooks/useAuth";

// Back Button SVG
const BackButtonSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B87A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

// Google Logo SVG
const GoogleLogoSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.19 3.32v2.77h3.55c2.08-1.92 3.28-4.74 3.28-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.23 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.53H2.18v2.85A10.98 10.98 0 0012 23z"/>
    <path fill="#FBBC05" d="M5.83 14.1a6.6 6.6 0 010-4.2V7.05H2.18a11 11 0 000 9.9l3.65-2.85z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.65 2.85C6.7 7.32 9.13 5.38 12 5.38z"/>
  </svg>
);

// Apple Logo SVG
const AppleLogoSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.365 1.43c.148 1.007-.229 1.985-.86 2.72-.658.766-1.708 1.32-2.73 1.245-.16-1 .27-2.03.9-2.72.66-.75 1.79-1.31 2.69-1.245zM20.42 17.29c-.51 1.14-.76 1.65-1.42 2.65-.92 1.4-2.22 3.14-3.83 3.15-1.44.02-1.8-.94-3.75-.93-1.95.01-2.35.95-3.79.94-1.61-.01-2.84-1.6-3.76-3-2.57-3.86-2.84-8.4-1.25-10.83.99-1.5 2.56-2.44 4.02-2.44 1.5 0 2.44.83 3.68.83 1.2 0 1.93-.83 3.68-.83 1.29 0 2.66.7 3.65 1.9-3.21 1.76-2.69 6.34.77 8.51z"/>
  </svg>
);

// Países disponibles
const COUNTRIES = [
  { code: "CO", name: "Colombia", phone: "+57", flag: "🇨🇴" },
  { code: "MX", name: "México", phone: "+52", flag: "🇲🇽" },
  { code: "ES", name: "España", phone: "+34", flag: "🇪🇸" },
  { code: "US", name: "Estados Unidos", phone: "+1", flag: "🇺🇸" },
  { code: "CA", name: "Canadá", phone: "+1", flag: "🇨🇦" },
  { code: "AR", name: "Argentina", phone: "+54", flag: "🇦🇷" },
  { code: "CL", name: "Chile", phone: "+56", flag: "🇨🇱" },
  { code: "PE", name: "Perú", phone: "+51", flag: "🇵🇪" },
];

export default function SignupPage({ setScreen }) {
  const { register, isLoading, error: authError } = useAuth();
  const pressBack = usePress();
  const pressSignup = usePress();
  const pressGoogle = usePress();
  const pressApple = usePress();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    }

    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCountryDropdown]);

  const validateForm = () => {
    const newErrors = {};

    if (!nombre.trim() || !apellido.trim()) {
      newErrors.nombres = "Completa tu nombre y apellido.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (phone && phone.length !== 10) {
      newErrors.phone = "El teléfono debe tener 10 números.";
    }

    if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await register({
      nombre,
      apellido,
      email,
      phone: phone ? `${selectedCountry.phone} ${phone}` : "",
      password,
      username: email,
    });

    if (result.success) {
      setScreen("dashboard");
    }
  };

  const handleBack = () => {
    setScreen("login");
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        padding: "22px 26px",
        overflow: "auto",
        fontFamily: "Manrope, system-ui, sans-serif",
        color: "#F5F3FF",
      }}
    >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Back Button */}
      <button
        onClick={handleBack}
        {...pressBack.handlers}
        style={{
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
          ...pressBack.getPressStyle({ opacity: 0.7 }),
        }}
      >
        <BackButtonSvg />
        Atrás
      </button>

      {/* Form Wrapper - Centered */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {/* Title & Subtitle */}
        <h1
          style={{
            fontSize: 19,
            fontWeight: 600,
            color: "#F5F3FF",
            textAlign: "center",
            margin: "0 0 8px 0",
          }}
        >
          Crea tu cuenta
        </h1>
        <p
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: "#8B87A3",
            textAlign: "center",
            margin: "0 0 28px 0",
          }}
        >
          Empieza a tomar el control de tus finanzas en minutos.
        </p>

        {/* Form */}
        <form
        onSubmit={handleSignup}
        style={{
          marginTop: 28,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 360,
          alignSelf: "center",
          width: "100%",
        }}
      >
        {/* Nombre / Apellido Row */}
        <div style={{ display: "flex", gap: 12 }}>
          {/* Nombre */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#8B87A3",
                marginBottom: 8,
                display: "block",
                letterSpacing: "0.3px",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              Nombre(s)
            </label>
            <input
              type="text"
              placeholder="Ej. María"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errors.nombres) setErrors({ ...errors, nombres: "" });
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px 16px",
                fontSize: 13.5,
                fontFamily: "inherit",
                border: `1px solid ${errors.nombres ? "#FF8A8A" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14,
                background: "#1e1b28",
                color: "#F5F3FF",
                outline: "none",
                transition: "all 0.3s",
              }}
            />
          </div>

          {/* Apellido */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#8B87A3",
                marginBottom: 8,
                display: "block",
                letterSpacing: "0.3px",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              Apellido(s)
            </label>
            <input
              type="text"
              placeholder="Ej. Gómez"
              value={apellido}
              onChange={(e) => {
                setApellido(e.target.value);
                if (errors.nombres) setErrors({ ...errors, nombres: "" });
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px 16px",
                fontSize: 13.5,
                fontFamily: "inherit",
                border: `1px solid ${errors.nombres ? "#FF8A8A" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14,
                background: "#1e1b28",
                color: "#F5F3FF",
                outline: "none",
                transition: "all 0.3s",
              }}
            />
          </div>
        </div>

        {/* Nombre Error */}
        {errors.nombres && (
          <span style={{ color: "#FF8A8A", fontSize: 11.5, fontWeight: 700, marginTop: -12 }}>
            {errors.nombres}
          </span>
        )}

        {/* Email */}
        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#8B87A3",
              marginBottom: 8,
              display: "block",
              letterSpacing: "0.3px",
              textTransform: "uppercase",
              textAlign: "left",
            }}
          >
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px 16px",
              fontSize: 13.5,
              fontFamily: "inherit",
              border: `1px solid ${errors.email ? "#FF8A8A" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 14,
              background: "#1e1b28",
              color: "#F5F3FF",
              outline: "none",
              transition: "all 0.3s",
            }}
          />
        </div>

        {errors.email && (
          <span style={{ color: "#FF8A8A", fontSize: 11.5, fontWeight: 700, marginTop: -12 }}>
            {errors.email}
          </span>
        )}

        {/* Phone */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#8B87A3",
                letterSpacing: "0.3px",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              Número de teléfono
            </label>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#5F5C74" }}>
              Opcional
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, position: "relative" }}>
            {/* Country Selector */}
            <div ref={countryDropdownRef} style={{ position: "relative", flex: 0.45, zIndex: 10 }}>
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "#1e1b28",
                  color: "#F5F3FF",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                  transition: "all 0.3s",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13.5, color: "#8B87A3" }}>{selectedCountry.code}</span>
                  <span style={{ fontSize: 13.5 }}>{selectedCountry.phone}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B87A3" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showCountryDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    width: 360,
                    background: "#1e1b28",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14,
                    maxHeight: 200,
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  }}
                >
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowCountryDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        border: "none",
                        background: selectedCountry.code === country.code ? "rgba(139,92,246,0.2)" : "transparent",
                        color: "#F5F3FF",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(139,92,246,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCountry.code !== country.code) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <span style={{ fontSize: 12 }}>
                        {country.code}{" "}
                        <span style={{ color: "#8B87A3" }}>{country.name}</span>
                        {" "}{country.phone}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Input */}
            <input
              type="tel"
              placeholder="300 123 4567"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(value);
                if (errors.phone) setErrors({ ...errors, phone: "" });
              }}
              style={{
                flex: 1,
                boxSizing: "border-box",
                padding: "15px 16px",
                fontSize: 13.5,
                fontFamily: "inherit",
                border: `1px solid ${errors.phone ? "#FF8A8A" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14,
                background: "#1e1b28",
                color: "#F5F3FF",
                outline: "none",
                transition: "all 0.3s",
              }}
            />
          </div>
        </div>

        {errors.phone && (
          <span style={{ color: "#FF8A8A", fontSize: 11.5, fontWeight: 700, marginTop: -12 }}>
            {errors.phone}
          </span>
        )}

        {/* Password */}
        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#8B87A3",
              marginBottom: 8,
              display: "block",
              letterSpacing: "0.3px",
              textTransform: "uppercase",
              textAlign: "left",
            }}
          >
            Contraseña
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px 16px",
                paddingRight: 40,
                fontSize: 13.5,
                fontFamily: "inherit",
                border: `1px solid ${errors.password ? "#FF8A8A" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 14,
                background: "#1e1b28",
                color: "#F5F3FF",
                outline: "none",
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
                color: "#8B87A3",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        {errors.password && (
          <span style={{ color: "#FF8A8A", fontSize: 11.5, fontWeight: 700, marginTop: -12 }}>
            {errors.password}
          </span>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          disabled={isLoading}
          {...pressSignup.handlers}
          style={{
            width: "100%",
            marginTop: 8,
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(155deg, #B18CFF 0%, #8B5CF6 100%)",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 800,
            cursor: isLoading ? "not-allowed" : "pointer",
            boxShadow: "0 14px 26px -10px rgba(139, 92, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
            opacity: isLoading ? 0.6 : 1,
            transition: "all 0.3s ease",
            ...pressSignup.getPressStyle({ opacity: 0.85, scale: 0.98 }),
          }}
        >
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
        </form>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "0 0 16px 0",
          maxWidth: 360,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#8B87A3", whiteSpace: "nowrap" }}>
          O REGÍSTRATE CON
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* Social Buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          maxWidth: 360,
          alignSelf: "center",
          width: "100%",
          marginBottom: 16,
        }}
      >
        {/* Google */}
        <button
          type="button"
          {...pressGoogle.handlers}
          disabled={isLoading}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 14,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.07)",
            background: "linear-gradient(155deg, #262231, #17151f)",
            color: "#F5F3FF",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
            transition: "all 0.3s",
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
          {...pressApple.handlers}
          disabled={isLoading}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 14,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.07)",
            background: "linear-gradient(155deg, #262231, #17151f)",
            color: "#F5F3FF",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: "0 10px 22px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
            transition: "all 0.3s",
            opacity: isLoading ? 0.6 : 1,
            ...pressApple.getPressStyle({ opacity: 0.9, scale: 0.98 }),
          }}
        >
          <AppleLogoSvg />
          <span>Apple</span>
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: 12,
          fontWeight: 600,
          color: "#8B87A3",
          marginTop: 12,
        }}
      >
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={() => setScreen("login")}
          style={{
            background: "none",
            border: "none",
            color: "#B18CFF",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#D4A5FF")}
          onMouseLeave={(e) => (e.target.style.color = "#B18CFF")}
        >
          Inicia sesión
        </button>
      </div>

    </div>
  );
}
