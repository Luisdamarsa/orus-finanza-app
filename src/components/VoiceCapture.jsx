import { useEffect, useRef, useState } from "react";
import { parseVoiceTransaction } from "../utils/voiceParser";

/**
 * VoiceCapture.jsx — Captura una transacción por voz SIN IA.
 * Usa la Web Speech API del navegador (SpeechRecognition) para transcribir,
 * y voiceParser para sacar monto/descripción/ingreso. El usuario confirma antes de guardar.
 *
 * Props:
 *   isDark
 *   onClose()
 *   onSave({ desc, rawAmount, isIncome, method })  — normalmente txnActions.createTransaction
 */
export default function VoiceCapture({ isDark, onClose, onSave }) {
  const t = isDark
    ? { bg: "#1A1A2B", card: "#252535", border: "#2D2D3A", text: "#F0EEFF", sub: "#7B7A99" }
    : { bg: "#FFFFFF", card: "#F8F7FF", border: "#E5E3F5", text: "#1A1830", sub: "#7B7A99" };

  const [phase, setPhase] = useState("idle"); // idle | listening | review | error
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState(null); // { amount, desc, isIncome }
  const [errorMsg, setErrorMsg] = useState("");
  const recognitionRef = useRef(null);

  const supported = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const start = () => {
    if (!supported) {
      setErrorMsg("Tu navegador no soporta reconocimiento de voz. Prueba en Chrome o escribe la transacción a mano.");
      setPhase("error");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "es-CO";
    rec.interimResults = true;
    rec.continuous = false;
    recognitionRef.current = rec;
    setTranscript("");
    setPhase("listening");

    rec.onresult = (e) => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setTranscript(txt);
      if (e.results[e.results.length - 1].isFinal) {
        const p = parseVoiceTransaction(txt);
        setParsed(p);
        setPhase("review");
      }
    };
    rec.onerror = (e) => {
      setErrorMsg(e.error === "not-allowed"
        ? "No diste permiso al micrófono. Actívalo en Permisos o en los ajustes del navegador."
        : "No te escuché bien. Inténtalo de nuevo.");
      setPhase("error");
    };
    rec.onend = () => {
      // Si terminó sin resultado final, volver a idle
      setPhase((cur) => (cur === "listening" ? "idle" : cur));
    };
    rec.start();
  };

  const stop = () => {
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
  };

  // Auto-arranca al abrir
  useEffect(() => {
    start();
    return () => { try { recognitionRef.current?.abort(); } catch { /* noop */ } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmtCop = (n) => "$" + (n || 0).toLocaleString("es-CO");

  const save = () => {
    if (!parsed) return;
    onSave({
      desc: parsed.desc,
      rawAmount: String(parsed.amount),
      isIncome: parsed.isIncome,
      method: "Voz",
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 70, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px", animation: "fadeIn 0.2s ease" }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn { from { transform:scale(0.92);opacity:0 } to { transform:scale(1);opacity:1 } }
        @keyframes micPulse { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(155,109,255,0.5) } 50% { transform:scale(1.06); box-shadow:0 0 0 14px rgba(155,109,255,0) } }
      `}</style>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: t.bg, borderRadius: 24, border: `1px solid ${t.border}`, padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.4)", animation: "popIn 0.22s cubic-bezier(.34,1.56,.64,1)" }}>

        {/* Encabezado */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <b style={{ fontSize: 15, color: t.text }}>🎤 Registrar por voz</b>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: t.card, border: "none", fontSize: 13, cursor: "pointer", color: t.sub }}>✕</button>
        </div>

        {/* Micrófono grande */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0 6px" }}>
          <div
            onClick={phase === "listening" ? stop : start}
            style={{
              width: 76, height: 76, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
              background: "linear-gradient(135deg, #9B6DFF, #4F8EF7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: phase === "listening" ? "micPulse 1.4s ease-in-out infinite" : "none",
            }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none" />
              <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="8" y1="21" x2="16" y2="21" />
            </svg>
          </div>
          <div style={{ fontSize: 12, color: t.sub, marginTop: 12, textAlign: "center", lineHeight: 1.5 }}>
            {phase === "idle" && "Toca el micrófono y di, por ejemplo: “gasté 20 mil en el súper”."}
            {phase === "listening" && "Escuchando… habla ahora."}
            {phase === "review" && "Revisa lo que entendí:"}
            {phase === "error" && errorMsg}
          </div>
        </div>

        {/* Transcripción en vivo */}
        {(phase === "listening" || phase === "review") && transcript && (
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 12, marginTop: 10, fontSize: 13, color: t.text, fontStyle: "italic" }}>
            “{transcript}”
          </div>
        )}

        {/* Revisión de lo parseado */}
        {phase === "review" && parsed && (
          <div style={{ marginTop: 12 }}>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: t.sub }}>Tipo</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: parsed.isIncome ? "#22C55E" : "#FCA5A5" }}>{parsed.isIncome ? "Ingreso" : "Gasto"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: t.sub }}>Descripción</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text, textAlign: "right", maxWidth: "65%" }}>{parsed.desc}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: t.sub }}>Monto</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: parsed.amount ? t.text : "#FCA5A5" }}>{parsed.amount ? fmtCop(parsed.amount) : "No entendí el monto"}</span>
              </div>
            </div>
            {!parsed.amount && (
              <div style={{ fontSize: 10.5, color: t.sub, marginTop: 6, textAlign: "center" }}>Repite el monto o guárdalo y edítalo luego.</div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={start} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1.5px solid ${t.border}`, background: "transparent", color: t.sub, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Repetir</button>
              <button onClick={save} style={{ flex: 2, padding: "11px 0", borderRadius: 12, border: "none", background: "#9B6DFF", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Guardar</button>
            </div>
          </div>
        )}

        {/* Reintentar tras error */}
        {phase === "error" && (
          <button onClick={start} style={{ width: "100%", marginTop: 14, padding: "11px 0", borderRadius: 12, border: "none", background: "#9B6DFF", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Intentar de nuevo</button>
        )}
      </div>
    </div>
  );
}
