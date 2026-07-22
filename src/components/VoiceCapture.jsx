import { useEffect, useRef, useState } from "react";
import { parseVoiceTransaction } from "../utils/voiceParser";

/**
 * VoiceCapture.jsx — Dictado por voz (overlay), SIN IA.
 * Al abrir, opaca la pantalla y muestra en vivo (abajo, centrado, sobre el micrófono) lo que capta
 * la Web Speech API. Al terminar la frase, parsea y llama onResult con los datos para PRE-LLENAR la
 * pantalla de nueva transacción — el usuario confirma y guarda ahí (no se guarda solo).
 *
 * Props:
 *   isDark
 *   onClose()                 — cancelar
 *   onResult(prefill)         — { desc, rawAmount, isIncome, method, concept, pillarId }
 */
export default function VoiceCapture({ isDark, onClose, onResult }) {
  const [phase, setPhase] = useState("listening"); // listening | error
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const recognitionRef = useRef(null);
  const doneRef = useRef(false);
  const finalRef = useRef("");       // texto final acumulado
  const silenceRef = useRef(null);   // temporizador de silencio

  const supported = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const finish = (text) => {
    if (doneRef.current) return;
    doneRef.current = true;
    const p = parseVoiceTransaction(text);
    onResult({
      desc: p.desc,
      rawAmount: String(p.amount || ""),
      isIncome: p.isIncome,
      method: p.method || null,
      concept: p.concept || null,
      pillarId: p.pillarId || null,
    });
  };

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
    rec.continuous = true; // sigue escuchando; procesamos al detectar silencio
    recognitionRef.current = rec;
    doneRef.current = false;
    finalRef.current = "";
    setTranscript("");
    setErrorMsg("");
    setPhase("listening");

    // Reinicia el temporizador de silencio; al vencer, corta y procesa lo dicho hasta ahí.
    const armSilence = (ms) => {
      if (silenceRef.current) clearTimeout(silenceRef.current);
      silenceRef.current = setTimeout(() => { try { rec.stop(); } catch { /* noop */ } }, ms);
    };

    rec.onresult = (e) => {
      let finalTxt = "", interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalTxt += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      finalRef.current = finalTxt;
      setTranscript((finalTxt + " " + interim).trim());
      armSilence(1500); // 1.5s sin hablar → procesar
    };
    rec.onerror = (e) => {
      setErrorMsg(e.error === "not-allowed"
        ? "No diste permiso al micrófono. Actívalo en Permisos o en los ajustes del navegador."
        : "No te escuché bien. Inténtalo de nuevo.");
      setPhase("error");
    };
    rec.onend = () => {
      if (silenceRef.current) clearTimeout(silenceRef.current);
      const full = (finalRef.current || transcript).trim();
      if (!doneRef.current && full) finish(full);
    };
    rec.start();
    armSilence(6000); // si no hablas en 6s, corta
  };

  const stop = () => { try { recognitionRef.current?.stop(); } catch { /* noop */ } };

  useEffect(() => {
    start();
    return () => {
      if (silenceRef.current) clearTimeout(silenceRef.current);
      try { recognitionRef.current?.abort(); } catch { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accent = "#9B6DFF";

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 70,
        background: "rgba(3,3,10,0.72)",
        backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
        padding: "0 26px 30px", boxSizing: "border-box",
        animation: "fadeIn 0.2s ease",
      }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes micPulse { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(155,109,255,0.5) } 50% { transform:scale(1.06); box-shadow:0 0 0 16px rgba(155,109,255,0) } }
      `}</style>

      {/* Texto en vivo — centrado, sobre el micrófono */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
        {phase === "error" ? (
          <div style={{ color: "#FCA5A5", fontSize: 14, textAlign: "center", lineHeight: 1.6, maxWidth: 320 }}>{errorMsg}</div>
        ) : transcript ? (
          <div style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, textAlign: "center", lineHeight: 1.4, maxWidth: 340 }}>
            “{transcript}”
          </div>
        ) : (
          <div style={{ color: "#B9B7D6", fontSize: 15, textAlign: "center", lineHeight: 1.6, maxWidth: 300 }}>
            Escuchando… di, por ejemplo:<br />
            <span style={{ color: "#7B7A99", fontSize: 13, fontStyle: "italic" }}>“20 mil en cine con tarjeta”</span>
          </div>
        )}
      </div>

      {/* Micrófono abajo */}
      <div
        onClick={(e) => { e.stopPropagation(); phase === "error" ? start() : stop(); }}
        style={{
          width: 72, height: 72, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
          background: `linear-gradient(135deg, ${accent}, #4F8EF7)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: phase === "listening" ? "micPulse 1.4s ease-in-out infinite" : "none",
        }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none" />
          <path d="M5 10a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      </div>
      <div style={{ color: "#7B7A99", fontSize: 11, marginTop: 12, textAlign: "center", lineHeight: 1.5 }}>
        Toca el <b style={{ color: "#B9B7D6" }}>micrófono</b> para terminar · la <b style={{ color: "#B9B7D6" }}>pantalla</b> para cancelar
      </div>
    </div>
  );
}
