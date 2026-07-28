import { useState, useRef, useCallback, useEffect } from "react";

const COLORS = {
  bg: "#070b14",
  surface: "#0f172a",
  surfaceHover: "#1e293b",
  card: "#131c2e",
  cardHover: "#18243b",
  border: "#1e2d42",
  borderGlow: "rgba(99, 102, 241, 0.35)",
  accent: "#6366f1",
  accentHover: "#4f46e5",
  accentLight: "#818cf8",
  accentDim: "rgba(99, 102, 241, 0.12)",
  cyan: "#06b6d4",
  cyanDim: "rgba(6, 182, 212, 0.12)",
  purple: "#8b5cf6",
  green: "#10b981",
  greenDim: "rgba(16, 185, 129, 0.12)",
  greenBorder: "rgba(16, 185, 129, 0.3)",
  yellow: "#f59e0b",
  yellowDim: "rgba(245, 158, 11, 0.12)",
  yellowBorder: "rgba(245, 158, 11, 0.3)",
  red: "#ef4444",
  redDim: "rgba(239, 68, 68, 0.12)",
  redBorder: "rgba(239, 68, 68, 0.3)",
  muted: "#64748b",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  textDim: "#64748b",
};

const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.2); }
    50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.5); }
  }

  @keyframes scanLine {
    0% { top: 0%; opacity: 0; }
    30% { opacity: 1; }
    70% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }

  @keyframes spinSlow {
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .btn-hover {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .btn-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
  }
  .btn-hover:active {
    transform: translateY(0);
  }

  .card-glass {
    background: rgba(19, 28, 46, 0.75);
    backdrop-filter: blur(16px);
    border: 1px solid ${COLORS.border};
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  }
`;

// ── SVG Icon Helper Components ─────────────────────────────────────
const Icons = {
  Sparkles: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
    </svg>
  ),
  Upload: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
      <path d="M12 12v9"/>
      <path d="m16 16-4-4-4 4"/>
    </svg>
  ),
  Document: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    </svg>
  ),
  Briefcase: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  Gear: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Copy: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  External: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Target: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
};

// ── Score Gauge Component ──────────────────────────────────────────
function ScoreGauge({ score, label, subtext }) {
  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 75 ? COLORS.green : score >= 50 ? COLORS.yellow : COLORS.red;
  const bgDim =
    score >= 75 ? COLORS.greenDim : score >= 50 ? COLORS.yellowDim : COLORS.redDim;
  const borderDim =
    score >= 75 ? COLORS.greenBorder : score >= 50 ? COLORS.yellowBorder : COLORS.redBorder;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 16px",
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ position: "relative", width: 150, height: 150 }}>
        <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke={COLORS.border}
            strokeWidth="10"
          />
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 6px ${color}88)`,
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: 38,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: 11,
              color: COLORS.textDim,
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            SCORE / 100
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          background: bgDim,
          border: `1px solid ${borderDim}`,
          color: color,
          padding: "4px 14px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      {subtext && (
        <span style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
          {subtext}
        </span>
      )}
    </div>
  );
}

function Tag({ text, color = COLORS.accent, isCopyable = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!isCopyable) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span
      onClick={handleCopy}
      style={{
        background: color + "14",
        border: `1px solid ${color}33`,
        color: color,
        padding: "4px 10px",
        borderRadius: 6,
        fontSize: 12,
        fontFamily: "'JetBrains Mono'",
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: isCopyable ? "pointer" : "default",
        transition: "all 0.15s ease",
      }}
    >
      {text}
      {isCopyable && (
        <span style={{ opacity: 0.6, fontSize: 10 }}>
          {copied ? "✓" : <Icons.Copy />}
        </span>
      )}
    </span>
  );
}

function SectionCard({ title, icon: IconComponent, children, delay = 0, badge, headerAction }) {
  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        animation: `fadeUp 0.4s ease-out ${delay}s both`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          borderBottom: `1px solid ${COLORS.border}88`,
          paddingBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {IconComponent && (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: COLORS.accentDim,
                border: `1px solid ${COLORS.borderGlow}`,
                color: COLORS.accentLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconComponent />
            </div>
          )}
          <h3
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#ffffff",
              letterSpacing: -0.2,
            }}
          >
            {title}
          </h3>
          {badge && (
            <span
              style={{
                background: COLORS.accentDim,
                color: COLORS.accentLight,
                padding: "2px 8px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {headerAction}
      </div>
      {children}
    </div>
  );
}

function LoadingAnalysis() {
  const steps = [
    "Extracting text from PDF layout...",
    "Scanning for ATS parsing keywords & structure...",
    "Calculating keyword density and position weights...",
    "Evaluating bullet point action verbs and metrics...",
    "Checking formatting risk factors...",
    "Synthesizing final ATS alignment report...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, steps.length - 1)),
      1100,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        padding: "64px 24px",
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ position: "relative", width: 90, height: 90 }}>
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: `3px solid ${COLORS.accentDim}`,
            borderTop: `3px solid ${COLORS.accent}`,
            animation: "spinSlow 1.2s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.accent,
          }}
        >
          <Icons.Sparkles />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
          Analyzing Resume Quality
        </h3>
        <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
          Our AI engine is checking every ATS parser variable...
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: i === step ? COLORS.surfaceHover : "transparent",
              opacity: i <= step ? 1 : 0.3,
              transition: "all 0.3s ease",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background:
                  i < step
                    ? COLORS.green
                    : i === step
                      ? COLORS.accent
                      : COLORS.border,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                flexShrink: 0,
                transition: "all 0.3s",
                boxShadow: i === step ? `0 0 10px ${COLORS.accent}` : "none",
              }}
            >
              {i < step ? (
                <Icons.Check />
              ) : i === step ? (
                <span
                  style={{
                    display: "block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#ffffff",
                  }}
                />
              ) : (
                ""
              )}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: 13,
                color: i <= step ? COLORS.text : COLORS.muted,
                fontWeight: i === step ? 600 : 400,
              }}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Provider Layer ─────────────────────────────────────────────
// Priority: Gemini (free tier) → OpenRouter (free models)
const GEMINI_MODELS = [
  "gemini-3.6-flash",      // Best free-tier quality/speed tradeoff
  "gemini-3.5-flash-lite", // Backup Gemini model if 3.6 is rate-limited
];

const OPENROUTER_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openrouter/free",
];

async function callGemini(prompt, apiKey) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 4000, temperature: 0.7 },
          }),
        },
      );

      const data = await res.json();

      if (data.error) {
        lastError = new Error(
          `[gemini:${model}] ${data.error.message || data.error.status}`,
        );
        console.warn("Gemini model failed:", lastError.message);
        continue;
      }

      const text =
        data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
        "";

      if (!text) {
        lastError = new Error(`[gemini:${model}] Empty response`);
        continue;
      }

      return { text, provider: `Gemini (${model})` };
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error("Gemini failed for an unknown reason");
}

async function callOpenRouter(prompt, apiKey) {
  let lastError = null;

  for (const model of OPENROUTER_MODELS) {
    try {
      console.log(`Trying OpenRouter model: ${model}`);

      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "ResumeATS",
          },
          body: JSON.stringify({
            model,
            max_tokens: 4000,
            messages: [{ role: "user", content: prompt }],
          }),
        },
      );

      const data = await res.json();

      if (data.error) {
        lastError = new Error(`[${model}] ${data.error.message || data.error}`);
        console.warn("OpenRouter model failed, trying next:", lastError.message);
        continue;
      }

      const text = data.choices?.[0]?.message?.content || "";

      if (!text) {
        lastError = new Error(`[${model}] Empty response`);
        continue;
      }

      return { text, provider: `OpenRouter (${model})` };
    } catch (err) {
      lastError = err;
      console.warn(`OpenRouter model ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error("All OpenRouter models failed");
}

async function getAIAnalysis(prompt) {
  const customGeminiKey = localStorage.getItem("resumeats_gemini_key")?.trim();
  const customOpenRouterKey = localStorage.getItem("resumeats_openrouter_key")?.trim();

  const geminiKey = customGeminiKey || import.meta.env.VITE_GEMINI_API_KEY;
  const openrouterKey = customOpenRouterKey || import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!geminiKey && !openrouterKey) {
    throw new Error(
      "No AI API key found. Please add a VITE_GEMINI_API_KEY or VITE_OPENROUTER_API_KEY in your .env file, or click 'API Key Settings' in the top bar to set your key.",
    );
  }

  if (geminiKey) {
    try {
      return await callGemini(prompt, geminiKey);
    } catch (err) {
      console.warn("Gemini failed entirely, falling back to OpenRouter:", err.message);
    }
  }

  if (openrouterKey) {
    return await callOpenRouter(prompt, openrouterKey);
  }

  throw new Error(
    "Gemini failed and no OpenRouter API key is available for fallback.",
  );
}

// ── Results Dashboard Component ─────────────────────────────────────
function ResultsDashboard({ result, onReset, resumeText }) {
  if (!result) return null;

  const [copiedSummary, setCopiedSummary] = useState(false);

  const scoreLabel =
    result.atsScore >= 75
      ? "ATS Friendly"
      : result.atsScore >= 50
        ? "Needs Work"
        : "High Risk";

  const scoreBadgeBg =
    result.atsScore >= 75 ? COLORS.greenDim : result.atsScore >= 50 ? COLORS.yellowDim : COLORS.redDim;
  const scoreBadgeColor =
    result.atsScore >= 75 ? COLORS.green : result.atsScore >= 50 ? COLORS.yellow : COLORS.red;

  const handleCopyReport = () => {
    const reportText = `RESUME ATS ANALYSIS REPORT
Overall ATS Score: ${result.atsScore}/100 (${scoreLabel})
Keyword Match Score: ${result.keywordMatchScore}/100
Formatting Score: ${result.formattingScore}/100
Impact Score: ${result.impactScore}/100

SUMMARY:
${result.summary}

MISSING KEYWORDS:
${(result.missingKeywords || []).join(", ")}

QUICK WINS:
${(result.quickWins || []).map((w) => `- ${w}`).join("\n")}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "resume_ats_analysis.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeUp 0.5s ease-out" }}>
      {/* Top Banner Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.surface} 100%)`,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              background: scoreBadgeBg,
              border: `1px solid ${scoreBadgeColor}44`,
              color: scoreBadgeColor,
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>
              {result.atsScore >= 75 ? "🎉" : result.atsScore >= 50 ? "⚠️" : "🚨"}
            </span>
            {scoreLabel}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
              ATS Compatibility Assessment
            </h2>
            <p style={{ fontSize: 13, color: COLORS.textMuted }}>
              Analyzed against standard resume parsing rules and keywords
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={handleCopyReport}
            style={{
              background: COLORS.surfaceHover,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
              padding: "9px 16px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <Icons.Copy /> {copiedSummary ? "Copied!" : "Copy Report"}
          </button>

          <button
            onClick={handleDownloadJSON}
            style={{
              background: COLORS.surfaceHover,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
              padding: "9px 16px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <Icons.Document /> Export JSON
          </button>

          <button
            onClick={onReset}
            className="btn-hover"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
              border: "none",
              color: "#ffffff",
              padding: "9px 18px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Analyze Another
          </button>
        </div>
      </div>

      {/* 4 Core Score Gauges Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <ScoreGauge score={result.atsScore} label="Overall ATS" subtext="Parser match likelihood" />
        <ScoreGauge score={result.keywordMatchScore} label="Keyword Density" subtext="Job title alignment" />
        <ScoreGauge score={result.formattingScore} label="Format Quality" subtext="Layout & readability" />
        <ScoreGauge score={result.impactScore} label="Bullet Impact" subtext="Action verbs & metrics" />
      </div>

      {/* Executive Summary */}
      <SectionCard title="Executive Assessment Summary" icon={Icons.Sparkles} delay={0.08}>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: COLORS.text,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            padding: 18,
            borderRadius: 12,
          }}
        >
          {result.summary}
        </p>

        {result.jobMatch && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              background: COLORS.accentDim,
              border: `1px solid ${COLORS.borderGlow}`,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <span style={{ fontSize: 12, color: COLORS.accentLight, fontWeight: 700, textTransform: "uppercase" }}>
                Target Job Fit Match
              </span>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", marginTop: 2 }}>
                {result.jobMatch.verdict}
              </p>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: COLORS.accentLight,
                fontFamily: "'JetBrains Mono'",
              }}
            >
              {result.jobMatch.matchPercent}%
            </div>
          </div>
        )}
      </SectionCard>

      {/* Missing Keywords Section */}
      <SectionCard
        title="Missing Critical Keywords"
        icon={Icons.Target}
        delay={0.16}
        badge={result.missingKeywords?.length ? `${result.missingKeywords.length} Missing` : null}
      >
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 14 }}>
          ATS scanners search for specific industry skills. Add these missing keywords to your resume to increase keyword match percentage:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {result.missingKeywords && result.missingKeywords.length > 0 ? (
            result.missingKeywords.map((kw, i) => (
              <Tag key={i} text={kw} color={COLORS.cyan} isCopyable={true} />
            ))
          ) : (
            <p style={{ fontSize: 13, color: COLORS.green }}>✓ Excellent keyword coverage detected!</p>
          )}
        </div>
      </SectionCard>

      {/* Bullet Points Improvement */}
      <SectionCard
        title="Bullet Point Enhancements"
        icon={Icons.Sparkles}
        delay={0.24}
        badge={result.weakBullets?.length ? `${result.weakBullets.length} Recommendations` : null}
      >
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>
          Transform weak resume statements into high-impact accomplishment bullets with action verbs and quantifiable metrics:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {result.weakBullets && result.weakBullets.length > 0 ? (
            result.weakBullets.map((bullet, i) => (
              <div
                key={i}
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: COLORS.red, fontWeight: 700, textTransform: "uppercase" }}>
                    Original Version
                  </span>
                  <p
                    style={{
                      fontSize: 14,
                      color: COLORS.textMuted,
                      background: COLORS.redDim,
                      border: `1px solid ${COLORS.redBorder}`,
                      padding: "8px 12px",
                      borderRadius: 8,
                      marginTop: 4,
                      textDecoration: "line-through",
                    }}
                  >
                    "{bullet.original}"
                  </p>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 700, textTransform: "uppercase" }}>
                    Recommended High-Impact Rewrite
                  </span>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#ffffff",
                      fontWeight: 600,
                      background: COLORS.greenDim,
                      border: `1px solid ${COLORS.greenBorder}`,
                      padding: "8px 12px",
                      borderRadius: 8,
                      marginTop: 4,
                    }}
                  >
                    "{bullet.improved}"
                  </p>
                </div>

                {bullet.tip && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: COLORS.yellow }}>
                    <span>💡</span>
                    <span>{bullet.tip}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: COLORS.green }}>✓ Your resume bullet points are strong and metric-driven!</p>
          )}
        </div>
      </SectionCard>

      {/* Formatting Audit */}
      <SectionCard
        title="Formatting & Structural Audit"
        icon={Icons.AlertTriangle}
        delay={0.3}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {result.formattingIssues && result.formattingIssues.length > 0 ? (
            result.formattingIssues.map((issue, i) => {
              const isCritical = issue.severity === "Critical";
              const border = isCritical ? COLORS.redBorder : COLORS.yellowBorder;
              const bg = isCritical ? COLORS.redDim : COLORS.yellowDim;
              const color = isCritical ? COLORS.red : COLORS.yellow;

              return (
                <div
                  key={i}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{issue.icon || (isCritical ? "🚨" : "⚠️")}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>{issue.title}</h4>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 10,
                          background: color + "33",
                          color: color,
                        }}
                      >
                        {issue.severity || "Warning"}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: COLORS.textMuted }}>{issue.detail}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ fontSize: 13, color: COLORS.green }}>✓ No ATS formatting red flags detected!</p>
          )}
        </div>
      </SectionCard>

      {/* Recommended Roles */}
      <SectionCard
        title="Recommended Job Roles & Alignment"
        icon={Icons.Briefcase}
        delay={0.36}
      >
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>
          Roles that best match your experience and skills, ranked by fit score:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {result.recommendedRoles && result.recommendedRoles.length > 0 ? (
            result.recommendedRoles.map((role, i) => {
              const q = encodeURIComponent(role.title);
              const naukriQuery = role.title.toLowerCase().replace(/\s+/g, "-");
              const searchLinks = [
                { label: "LinkedIn", url: `https://www.linkedin.com/jobs/search/?keywords=${q}` },
                { label: "Indeed", url: `https://www.indeed.com/jobs?q=${q}` },
                { label: "Naukri", url: `https://www.naukri.com/${naukriQuery}-jobs` },
              ];

              return (
                <div
                  key={i}
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 14,
                    padding: 18,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff" }}>{role.title}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accentLight }}>
                        {role.matchPercent}% Match
                      </span>
                      <div style={{ width: 80, height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${role.matchPercent}%`, height: "100%", background: COLORS.accent }} />
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12 }}>{role.reason}</p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(role.matchedSkills || []).slice(0, 3).map((s, idx) => (
                        <Tag key={idx} text={s} color={COLORS.green} />
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      {searchLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: COLORS.accentLight,
                            background: COLORS.accentDim,
                            border: `1px solid ${COLORS.borderGlow}`,
                            padding: "4px 10px",
                            borderRadius: 6,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {link.label} <Icons.External />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : null}
        </div>
      </SectionCard>

      {/* Quick Wins */}
      {result.quickWins && result.quickWins.length > 0 && (
        <SectionCard title="Actionable Quick Wins" icon={Icons.Check} delay={0.42}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.quickWins.map((win, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  padding: "12px 16px",
                  borderRadius: 10,
                }}
              >
                <span style={{ color: COLORS.green }}>✓</span>
                <span style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{win}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ── API Key Configuration Modal ─────────────────────────────────────
function ApiKeyModal({ isOpen, onClose }) {
  const [geminiKey, setGeminiKey] = useState("");
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(localStorage.getItem("resumeats_gemini_key") || "");
      setOpenrouterKey(localStorage.getItem("resumeats_openrouter_key") || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem("resumeats_gemini_key", geminiKey.trim());
    localStorage.setItem("resumeats_openrouter_key", openrouterKey.trim());
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    localStorage.removeItem("resumeats_gemini_key");
    localStorage.removeItem("resumeats_openrouter_key");
    setGeminiKey("");
    setOpenrouterKey("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          animation: "fadeUp 0.25s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: COLORS.accent }}>
              <Icons.Gear />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff" }}>API Key Settings</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: COLORS.textMuted,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>
          The app works automatically out of the box using default environment keys. You can also provide custom API keys below:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6 }}>
              Gemini API Key (Primary)
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                width: "100%",
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                color: "#ffffff",
                fontSize: 13,
                fontFamily: "'JetBrains Mono'",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6 }}>
              OpenRouter API Key (Fallback)
            </label>
            <input
              type="password"
              value={openrouterKey}
              onChange={(e) => setOpenrouterKey(e.target.value)}
              placeholder="sk-or-v1-..."
              style={{
                width: "100%",
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                color: "#ffffff",
                fontSize: 13,
                fontFamily: "'JetBrains Mono'",
                outline: "none",
              }}
            />
          </div>
        </div>

        {savedMessage && (
          <p style={{ color: COLORS.green, fontSize: 13, marginTop: 14, textAlign: "center" }}>
            ✓ Keys saved successfully!
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button
            onClick={handleClear}
            style={{
              background: "none",
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textMuted,
              padding: "10px 16px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Clear Keys
          </button>
          <button
            onClick={handleSave}
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
              border: "none",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Application Component ──────────────────────────────────────
export default function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [state, setState] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showJD, setShowJD] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileRef = useRef();
  const dropRef = useRef();

  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfReady(true);
      return;
    }
    if (document.getElementById("pdfjs-script")) return;
    const script = document.createElement("script");
    script.id = "pdfjs-script";
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfReady(true);
    };
    document.head.appendChild(script);
  }, []);

  const extractTextFromPDF = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      if (!window.pdfjsLib) {
        reject(new Error("PDF.js library is loading, please try again in a few seconds"));
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await window.pdfjsLib.getDocument({ data: typedArray })
            .promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";
          }
          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped?.type === "application/pdf") {
        setFile(dropped);
        try {
          const text = await extractTextFromPDF(dropped);
          setResumeText(text);
        } catch {
          setResumeText("");
        }
      }
    },
    [extractTextFromPDF],
  );

  const handleFileInput = useCallback(
    async (e) => {
      const selected = e.target.files[0];
      if (selected && selected.type === "application/pdf") {
        setFile(selected);
        try {
          const text = await extractTextFromPDF(selected);
          setResumeText(text);
        } catch {
          setResumeText("");
        }
      }
    },
    [extractTextFromPDF],
  );

  const analyzeResume = async () => {
    if (!file) return;
    setState("loading");
    setResult(null);
    setError("");

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer and career coach.

  Analyze the following resume and provide a comprehensive, detailed, actionable analysis.

  RESUME TEXT:
  ${resumeText || "(Could not extract text — analyze structure only)"}

  ${jobDesc ? `JOB DESCRIPTION TO MATCH AGAINST:\n${jobDesc}` : ""}

  Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
  {
    "atsScore": <number 0-100>,
    "keywordMatchScore": <number 0-100>,
    "formattingScore": <number 0-100>,
    "impactScore": <number 0-100>,
    "summary": "<2-3 sentence overall assessment>",
    "missingKeywords": ["keyword1", "keyword2"],
    "weakBullets": [
      {
        "original": "<exact weak bullet from resume>",
        "improved": "<rewritten with action verb + metric + impact>",
        "tip": "<specific advice>"
      }
    ],
    "formattingIssues": [
      {
        "icon": "<relevant emoji>",
        "title": "<issue name>",
        "detail": "<specific detail>",
        "severity": "Critical"
      }
    ],
    "actionVerbs": ["verb1", "verb2"],
    "quickWins": ["actionable tip 1", "actionable tip 2"],
    ${
      jobDesc
        ? `"jobMatch": {
      "matchPercent": <number 0-100>,
      "verdict": "<one sentence>",
      "matched": ["skill1"],
      "missing": ["skill1"]
    }`
        : '"jobMatch": null'
    },
    "recommendedRoles": [
      {
        "title": "<specific job title, e.g. 'Backend Developer'>",
        "matchPercent": <number 0-100>,
        "reason": "<1-2 sentence explanation of why this role fits the candidate>",
        "matchedSkills": ["skill1", "skill2"],
        "skillsToLearn": ["skill1"]
      }
    ]
  }

  For "recommendedRoles": suggest 3-5 job roles ranked by best fit, based on the candidate's actual skills, projects, and experience in the resume${jobDesc ? " and how well they align with the provided job description's role" : ""}. Be realistic about seniority level.

  Be specific, honest, and actionable. Score conservatively.`;

    try {
      const { text, provider } = await getAIAnalysis(prompt);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`[${provider}] No JSON found in response`);
      }

      const parsed = JSON.parse(jsonMatch[0]);
      setResult(parsed);
      setState("result");
      console.log(`✅ Analysis successful via ${provider}`);
    } catch (err) {
      console.error("Analysis failed:", err?.message || err);
      setError(
        err?.message?.startsWith("No AI API key")
          ? err.message
          : "All available AI providers (Gemini + OpenRouter) are currently busy or rate-limited. Please try again in a few moments.",
      );
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError("");
    setFile(null);
    setResumeText("");
    setJobDesc("");
  };

  return (
    <>
      <style>{globalStyles}</style>

      {/* API Key Modal */}
      <ApiKeyModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Navigation Header */}
        <header
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${COLORS.border}`,
            padding: "16px 32px",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.cyan})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: `0 0 16px ${COLORS.accent}66`,
                }}
              >
                <Icons.Document />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      background: `linear-gradient(90deg, #ffffff, ${COLORS.accentLight})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: -0.4,
                    }}
                  >
                    ResumeATS
                  </h1>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: COLORS.accentDim,
                      border: `1px solid ${COLORS.borderGlow}`,
                      color: COLORS.accentLight,
                      padding: "2px 8px",
                      borderRadius: 10,
                      textTransform: "uppercase",
                    }}
                  >
                    PRO 2026
                  </span>
                </div>
                <p style={{ fontSize: 11, color: COLORS.textDim }}>
                  Enterprise AI Resume & ATS Optimization System
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: COLORS.green,
                  background: COLORS.greenDim,
                  border: `1px solid ${COLORS.greenBorder}`,
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: COLORS.green,
                    boxShadow: `0 0 6px ${COLORS.green}`,
                  }}
                />
                Dual AI Engine Ready
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                style={{
                  background: COLORS.surfaceHover,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textMuted,
                  padding: "8px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <Icons.Gear /> API Keys
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: 1, maxWidth: 1000, width: "100%", margin: "0 auto", padding: "40px 20px 80px" }}>
          {state === "idle" && (
            <div style={{ animation: "fadeUp 0.4s ease-out" }}>
              {/* Hero Banner */}
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: COLORS.accentDim,
                    border: `1px solid ${COLORS.borderGlow}`,
                    color: COLORS.accentLight,
                    padding: "6px 16px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  <Icons.Sparkles /> Maximize Interview Callback Rates
                </div>
                <h2
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    letterSpacing: -1,
                    color: "#ffffff",
                    marginBottom: 12,
                    lineHeight: 1.25,
                  }}
                >
                  Beat the ATS. Land Your Next Role.
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    color: COLORS.textMuted,
                    maxWidth: 620,
                    margin: "0 auto",
                    lineHeight: 1.6,
                  }}
                >
                  Over 75% of job applications are filtered out by Applicant Tracking Systems. Get instant AI feedback, keyword match analysis, and formatting suggestions.
                </p>
              </div>

              {/* Upload Drop Zone Card */}
              <div
                ref={dropRef}
                onClick={() => !file && fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${
                    isDragging
                      ? COLORS.accent
                      : file
                        ? COLORS.green
                        : COLORS.border
                  }`,
                  borderRadius: 20,
                  padding: "50px 32px",
                  textAlign: "center",
                  cursor: file ? "default" : "pointer",
                  background: isDragging
                    ? COLORS.accentDim
                    : file
                      ? COLORS.greenDim
                      : COLORS.card,
                  boxShadow: isDragging
                    ? `0 0 30px ${COLORS.accentDim}`
                    : "0 10px 40px rgba(0,0,0,0.4)",
                  transition: "all 0.25s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isDragging && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
                      animation: "scanLine 1.5s ease-in-out infinite",
                    }}
                  />
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={handleFileInput}
                />

                {file ? (
                  <div>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: COLORS.greenDim,
                        border: `1px solid ${COLORS.greenBorder}`,
                        color: COLORS.green,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <Icons.Check />
                    </div>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      {file.name}
                    </p>
                    <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>
                      {(file.size / 1024).toFixed(1)} KB · PDF Document
                    </p>
                    {resumeText && (
                      <p style={{ fontSize: 12, color: COLORS.accentLight, fontFamily: "'JetBrains Mono'" }}>
                        ✓ {resumeText.split(/\s+/).length} words extracted cleanly
                      </p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setResumeText("");
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      style={{
                        marginTop: 16,
                        background: COLORS.surfaceHover,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.red,
                        padding: "6px 16px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Icons.Trash /> Remove File
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        background: COLORS.accentDim,
                        border: `1px solid ${COLORS.borderGlow}`,
                        color: COLORS.accentLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 18px",
                      }}
                    >
                      <Icons.Upload />
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: 20, color: "#ffffff", marginBottom: 6 }}>
                      Drag & Drop your resume here
                    </h3>
                    <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 20 }}>
                      or click to browse files from your computer (.PDF format)
                    </p>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                      {["ATS Compatibility", "Keyword Gap Audit", "Bullet Impact Scoring", "Role Fit Check"].map((f) => (
                        <Tag key={f} text={f} color={COLORS.accentLight} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description Accordion Box */}
              <div style={{ marginTop: 24 }}>
                <button
                  onClick={() => setShowJD(!showJD)}
                  style={{
                    background: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    color: showJD ? COLORS.accentLight : COLORS.textMuted,
                    padding: "12px 20px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    justifyContent: "space-between",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icons.Briefcase />
                    <span>Target Job Description (Optional for Keyword Matching)</span>
                  </div>
                  <span>{showJD ? "▲" : "▼"}</span>
                </button>

                {showJD && (
                  <div
                    style={{
                      marginTop: 12,
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 14,
                      padding: 16,
                      animation: "fadeUp 0.3s ease-out",
                    }}
                  >
                    <textarea
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="Paste the target job description here to evaluate exact keyword alignment, missing skills, and role match percentage..."
                      rows={5}
                      style={{
                        width: "100%",
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 10,
                        padding: 14,
                        color: "#ffffff",
                        fontSize: 14,
                        resize: "vertical",
                        outline: "none",
                        lineHeight: 1.5,
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: COLORS.textDim }}>
                      <span>Tip: Including a JD unlocks job-specific match scoring.</span>
                      <span>{jobDesc.length} characters</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeResume}
                disabled={!file}
                className="btn-hover"
                style={{
                  width: "100%",
                  marginTop: 28,
                  background: file
                    ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`
                    : COLORS.surfaceHover,
                  border: "none",
                  color: file ? "#ffffff" : COLORS.textDim,
                  padding: "16px 28px",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: file ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: file ? `0 10px 30px ${COLORS.accentDim}` : "none",
                  transition: "all 0.25s ease",
                }}
              >
                <Icons.Sparkles /> Analyze Resume Now
              </button>

              {/* Security & Guarantee Trust Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 28,
                  marginTop: 32,
                  fontSize: 13,
                  color: COLORS.textDim,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.Shield /> 100% Client-Side Privacy
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.Sparkles /> Gemini 3.6 Flash & OpenRouter AI
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.Check /> Zero Data Logging
                </span>
              </div>
            </div>
          )}

          {/* Loading Screen */}
          {state === "loading" && <LoadingAnalysis />}

          {/* Results Screen */}
          {state === "result" && (
            <ResultsDashboard
              result={result}
              onReset={handleReset}
              resumeText={resumeText}
            />
          )}

          {/* Error Screen */}
          {state === "error" && (
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.redBorder}`,
                borderRadius: 20,
                padding: 36,
                textAlign: "center",
                animation: "fadeUp 0.4s ease-out",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  background: COLORS.redDim,
                  color: COLORS.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Icons.AlertTriangle />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", marginBottom: 10 }}>
                Analysis Encountered an Issue
              </h3>
              <p style={{ color: COLORS.textMuted, fontSize: 14, maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.6 }}>
                {error}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  style={{
                    background: COLORS.surfaceHover,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                    padding: "10px 20px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Configure API Keys
                </button>
                <button
                  onClick={analyzeResume}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
                    border: "none",
                    color: "#ffffff",
                    padding: "10px 24px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
