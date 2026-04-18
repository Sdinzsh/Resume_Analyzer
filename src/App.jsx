import { useState, useRef, useCallback, useEffect } from "react";

const COLORS = {
  bg: "#0a0b0f",
  surface: "#111318",
  card: "#16181f",
  border: "#1e2230",
  accent: "#00e5ff",
  accentDim: "#00e5ff22",
  green: "#00ff88",
  greenDim: "#00ff8818",
  yellow: "#ffd166",
  yellowDim: "#ffd16618",
  red: "#ff4d6d",
  redDim: "#ff4d6d18",
  muted: "#4a5068",
  text: "#e2e8f0",
  textDim: "#7f8ea3",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'Syne', sans-serif; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }

  @keyframes pulse-ring {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4); }
    70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(0, 229, 255, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
  }
  @keyframes scan {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(800%); opacity: 0; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scoreCount {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes dash {
    from { stroke-dashoffset: 440; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function ScoreGauge({ score, label }) {
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 75 ? COLORS.green : score >= 50 ? COLORS.yellow : COLORS.red;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: 180, height: 180 }}>
        <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={COLORS.border}
            strokeWidth="10"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 8px ${color})`,
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
            animation: "scoreCount 0.6s ease-out",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono'",
              fontSize: 42,
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: 12,
              color: COLORS.textDim,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            / 100
          </span>
        </div>
      </div>
      <div
        style={{
          background: color + "22",
          border: `1px solid ${color}44`,
          color,
          padding: "4px 16px",
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Tag({ text, color }) {
  return (
    <span
      style={{
        background: color + "18",
        border: `1px solid ${color}44`,
        color,
        padding: "3px 10px",
        borderRadius: 4,
        fontSize: 12,
        fontFamily: "'Space Mono'",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function Section({ title, icon, children, delay = 0, accent = COLORS.accent }) {
  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 24,
        animation: `fadeUp 0.5s ease-out ${delay}s both`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3
          style={{
            fontFamily: "'Syne'",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 0.5,
            color: accent,
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function LoadingAnalysis() {
  const steps = [
    "Parsing PDF structure...",
    "Scanning for ATS patterns...",
    "Checking keyword density...",
    "Analyzing bullet strength...",
    "Evaluating formatting...",
    "Computing ATS score...",
    "Generating suggestions...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, steps.length - 1)),
      900,
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
        padding: "60px 20px",
      }}
    >
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `2px solid ${COLORS.accent}33`,
            borderTop: `2px solid ${COLORS.accent}`,
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          🔍
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Analyzing Resume
        </h3>
        <p style={{ color: COLORS.textDim, fontSize: 14 }}>
          AI is scanning every detail...
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 400 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 0",
              opacity: i <= step ? 1 : 0.25,
              transition: "opacity 0.4s",
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background:
                  i < step
                    ? COLORS.green
                    : i === step
                      ? COLORS.accent
                      : COLORS.border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                flexShrink: 0,
                transition: "background 0.3s",
                boxShadow: i === step ? `0 0 8px ${COLORS.accent}` : "none",
              }}
            >
              {i < step ? (
                "✓"
              ) : i === step ? (
                <span
                  style={{
                    animation: "blink 0.8s infinite",
                    display: "block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: COLORS.bg,
                  }}
                />
              ) : (
                ""
              )}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono'",
                fontSize: 13,
                color: i <= step ? COLORS.text : COLORS.muted,
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

function ResultsDashboard({ result }) {
  const scoreLabel =
    result.atsScore >= 75
      ? "ATS Friendly"
      : result.atsScore >= 50
        ? "Needs Work"
        : "High Risk";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        animation: "fadeUp 0.5s ease-out",
      }}
    >
      {/* Score Hero */}
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 32,
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              color: COLORS.textDim,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            ATS Compatibility Score
          </p>
          <ScoreGauge score={result.atsScore} label={scoreLabel} />
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <p
            style={{
              fontFamily: "'Space Mono'",
              fontSize: 14,
              color: COLORS.textDim,
              lineHeight: 1.7,
              borderLeft: `3px solid ${COLORS.accent}`,
              paddingLeft: 16,
            }}
          >
            {result.summary}
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                label: "Keywords",
                val: result.keywordMatchScore + "%",
                color: COLORS.accent,
              },
              {
                label: "Format",
                val: result.formattingScore + "%",
                color: COLORS.yellow,
              },
              {
                label: "Impact",
                val: result.impactScore + "%",
                color: COLORS.green,
              },
            ].map(({ label, val, color }) => (
              <div
                key={label}
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  padding: "12px 20px",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Mono'",
                    fontSize: 22,
                    fontWeight: 700,
                    color,
                  }}
                >
                  {val}
                </div>
                <div
                  style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Missing Keywords */}
      {result.missingKeywords?.length > 0 && (
        <Section
          title="Missing Keywords"
          icon="🔑"
          delay={0.1}
          accent={COLORS.accent}
        >
          <p style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 16 }}>
            These high-value keywords were not found in your resume. Add them
            where relevant.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {result.missingKeywords.map((k, i) => (
              <Tag key={i} text={k} color={COLORS.accent} />
            ))}
          </div>
        </Section>
      )}

      {/* Weak Bullets */}
      {result.weakBullets?.length > 0 && (
        <Section
          title="Weak Bullet Points"
          icon="⚡"
          delay={0.15}
          accent={COLORS.yellow}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.weakBullets.map((item, i) => (
              <div
                key={i}
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: COLORS.red,
                      fontSize: 14,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✗
                  </span>
                  <p
                    style={{
                      fontFamily: "'Space Mono'",
                      fontSize: 12,
                      color: COLORS.textDim,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.original}
                  </p>
                </div>
                <div
                  style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      color: COLORS.green,
                      fontSize: 14,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✓
                  </span>
                  <p
                    style={{
                      fontFamily: "'Space Mono'",
                      fontSize: 12,
                      color: COLORS.green,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.improved}
                  </p>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    padding: "6px 12px",
                    background: COLORS.yellow + "12",
                    borderRadius: 4,
                    fontSize: 12,
                    color: COLORS.yellow,
                  }}
                >
                  💡 {item.tip}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Formatting Issues */}
      {result.formattingIssues?.length > 0 && (
        <Section
          title="Formatting Issues"
          icon="📐"
          delay={0.2}
          accent={COLORS.red}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.formattingIssues.map((issue, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: 14,
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>
                  {issue.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.text,
                      marginBottom: 4,
                    }}
                  >
                    {issue.title}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: COLORS.textDim,
                      lineHeight: 1.6,
                    }}
                  >
                    {issue.detail}
                  </p>
                </div>
                <Tag
                  text={issue.severity}
                  color={
                    issue.severity === "Critical"
                      ? COLORS.red
                      : issue.severity === "Medium"
                        ? COLORS.yellow
                        : COLORS.accent
                  }
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Action Verbs */}
      {result.actionVerbs?.length > 0 && (
        <Section
          title="Suggested Action Verbs"
          icon="💪"
          delay={0.25}
          accent={COLORS.green}
        >
          <p style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 16 }}>
            Replace weak verbs like{" "}
            <em style={{ color: COLORS.red }}>"worked on"</em>,{" "}
            <em style={{ color: COLORS.red }}>"helped"</em>,{" "}
            <em style={{ color: COLORS.red }}>"did"</em> with powerful
            alternatives:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {result.actionVerbs.map((v, i) => (
              <Tag key={i} text={v} color={COLORS.green} />
            ))}
          </div>
        </Section>
      )}

      {/* Job Match */}
      {result.jobMatch && (
        <Section
          title="Job Description Match"
          icon="🎯"
          delay={0.3}
          accent={COLORS.accent}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `conic-gradient(${COLORS.accent} ${
                  result.jobMatch.matchPercent * 3.6
                }deg, ${COLORS.border} 0)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: COLORS.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Space Mono'",
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.accent,
                }}
              >
                {result.jobMatch.matchPercent}%
              </div>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Match Score</p>
              <p style={{ fontSize: 13, color: COLORS.textDim, marginTop: 4 }}>
                {result.jobMatch.verdict}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p
                style={{
                  fontSize: 12,
                  color: COLORS.green,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                ✓ Matching Skills
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {result.jobMatch.matched?.map((k, i) => (
                  <Tag key={i} text={k} color={COLORS.green} />
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p
                style={{
                  fontSize: 12,
                  color: COLORS.red,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                ✗ Missing from JD
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {result.jobMatch.missing?.map((k, i) => (
                  <Tag key={i} text={k} color={COLORS.red} />
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Quick Wins */}
      {result.quickWins?.length > 0 && (
        <Section
          title="Quick Wins — Do These First"
          icon="🚀"
          delay={0.35}
          accent={COLORS.green}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.quickWins.map((win, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "10px 14px",
                  background: COLORS.greenDim,
                  border: `1px solid ${COLORS.green}33`,
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    background: COLORS.green,
                    color: COLORS.bg,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5 }}
                >
                  {win}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [state, setState] = useState("idle"); // idle | loading | result | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showJD, setShowJD] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const fileRef = useRef();
  const dropRef = useRef();

  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfReady(true);
      return;
    }
    const script = document.createElement("script");
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
        reject(new Error("PDF.js not loaded"));
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
            fullText += content.items.map((item) => item.str).join(" ") + "\n";
          }
          resolve(fullText.trim());
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
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
      if (selected) {
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
    }
  }

  Be specific, honest, and actionable. Score conservatively.`;

    // Updated 2026 free models (tested working)
    const MODELS = [
      "nvidia/nemotron-3-super-120b-a12b:free", // Strongest current free model
      "deepseek/deepseek-r1:free",
      "arcee-ai/trinity-large-preview:free",
      "z-ai/glm-4.5-air:free",
      "openrouter/free", // Smart fallback router
    ];

    let lastError = null;

    for (const model of MODELS) {
      try {
        console.log(`Trying model: ${model}`);

        const res = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
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
          lastError = new Error(`[${model}] ${data.error.message}`);
          console.warn("Model failed, trying next:", lastError.message);
          continue;
        }

        const text = data.choices?.[0]?.message?.content || "";

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          lastError = new Error(`[${model}] No JSON found`);
          continue;
        }

        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
        setState("result");
        console.log("✅ Analysis successful with:", model);
        return; // Success → stop here
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} failed:`, err.message);
      }
    }

    // All models failed
    setError(
      "All available free models are currently busy or unavailable. Please try again in a few minutes.",
    );
    setState("error");
  };
  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          padding: "0 0 60px",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: COLORS.surface,
            borderBottom: `1px solid ${COLORS.border}`,
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${COLORS.accent}, #0066ff)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                animation: "pulse-ring 2s infinite",
              }}
            >
              📄
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Syne'",
                  fontWeight: 800,
                  fontSize: 18,
                  background: `linear-gradient(90deg, ${COLORS.accent}, #fff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: -0.5,
                }}
              >
                ResumeATS
              </h1>
              <p
                style={{
                  fontSize: 11,
                  color: COLORS.muted,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                AI-Powered Resume Analyzer
              </p>
            </div>
          </div>
          <div
            style={{
              background: COLORS.redDim,
              border: `1px solid ${COLORS.red}44`,
              color: COLORS.red,
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            ⚠ 75% of resumes fail ATS
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>
          {/* Upload Zone */}
          {state === "idle" && (
            <div style={{ animation: "fadeUp 0.5s ease-out" }}>
              {/* Drop zone */}
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
                  borderRadius: 16,
                  padding: "56px 32px",
                  textAlign: "center",
                  cursor: file ? "default" : "pointer",
                  background: isDragging
                    ? COLORS.accentDim
                    : file
                      ? COLORS.greenDim
                      : COLORS.surface,
                  transition: "all 0.2s ease",
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
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
                      animation: "scan 1s ease-in-out infinite",
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
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: COLORS.green,
                        marginBottom: 8,
                      }}
                    >
                      {file.name}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: COLORS.textDim,
                        marginBottom: 4,
                      }}
                    >
                      {(file.size / 1024).toFixed(1)} KB · PDF
                    </p>
                    {resumeText && (
                      <p
                        style={{
                          fontSize: 12,
                          color: COLORS.accent,
                          fontFamily: "'Space Mono'",
                        }}
                      >
                        ✓ {resumeText.split(/\s+/).length} words extracted
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
                        background: "none",
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.textDim,
                        padding: "6px 16px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>📎</div>
                    <h2
                      style={{
                        fontWeight: 700,
                        fontSize: 20,
                        marginBottom: 8,
                      }}
                    >
                      Drop your resume here
                    </h2>
                    <p
                      style={{
                        color: COLORS.textDim,
                        fontSize: 14,
                        marginBottom: 16,
                      }}
                    >
                      or click to browse · PDF files only
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        "ATS Score",
                        "Keyword Gap",
                        "Bullet Analysis",
                        "Format Check",
                      ].map((f) => (
                        <Tag key={f} text={f} color={COLORS.accent} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description Toggle */}
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => setShowJD(!showJD)}
                  style={{
                    background: "none",
                    border: `1px solid ${COLORS.border}`,
                    color: showJD ? COLORS.accent : COLORS.textDim,
                    padding: "10px 20px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontFamily: "'Syne'",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  <span>{showJD ? "▼" : "▶"}</span>
                  Add Job Description (optional but recommended)
                </button>

                {showJD && (
                  <div
                    style={{
                      marginTop: 12,
                      animation: "fadeUp 0.3s ease-out",
                    }}
                  >
                    <textarea
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="Paste the job description here to get a match score and targeted keyword suggestions..."
                      style={{
                        width: "100%",
                        minHeight: 160,
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 8,
                        padding: 16,
                        color: COLORS.text,
                        fontSize: 14,
                        fontFamily: "'Space Mono'",
                        lineHeight: 1.6,
                        resize: "vertical",
                        outline: "none",
                      }}
                    />
                    <p
                      style={{
                        fontSize: 12,
                        color: COLORS.textDim,
                        marginTop: 6,
                      }}
                    >
                      Adding a JD enables job match scoring and targeted keyword
                      analysis
                    </p>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeResume}
                disabled={!file}
                style={{
                  marginTop: 24,
                  width: "100%",
                  padding: "18px 32px",
                  background: file
                    ? `linear-gradient(135deg, ${COLORS.accent}22, #0066ff22)`
                    : COLORS.surface,
                  border: `1px solid ${file ? COLORS.accent : COLORS.border}`,
                  borderRadius: 12,
                  color: file ? COLORS.accent : COLORS.muted,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "'Syne'",
                  cursor: file ? "pointer" : "not-allowed",
                  letterSpacing: 1,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  boxShadow: file ? `0 0 30px ${COLORS.accent}22` : "none",
                }}
              >
                <span style={{ fontSize: 20 }}>🔍</span>
                Analyze Resume with AI
                {file && (
                  <span
                    style={{
                      fontFamily: "'Space Mono'",
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  >
                    →
                  </span>
                )}
              </button>

              {/* Info Strip */}
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { icon: "🤖", text: "OpenRouter Free AI analysis" }, // Auto-selects best free model
                  { icon: "🔒", text: "Your resume is not stored" },
                  { icon: "⚡", text: "Results in ~15 seconds" },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    style={{
                      flex: 1,
                      minWidth: 160,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 8,
                      fontSize: 13,
                      color: COLORS.textDim,
                    }}
                  >
                    <span>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {state === "loading" && <LoadingAnalysis />}

          {/* Error */}
          {state === "error" && (
            <div
              style={{
                background: COLORS.redDim,
                border: `1px solid ${COLORS.red}44`,
                borderRadius: 12,
                padding: 32,
                textAlign: "center",
                animation: "fadeUp 0.5s ease-out",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h3
                style={{
                  color: COLORS.red,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Analysis Failed
              </h3>
              <p
                style={{
                  color: COLORS.textDim,
                  fontSize: 14,
                  marginBottom: 20,
                  fontFamily: "'Space Mono'",
                  lineHeight: 1.6,
                }}
              >
                {error}
              </p>
              <button
                onClick={() => setState("idle")}
                style={{
                  background: COLORS.red + "22",
                  border: `1px solid ${COLORS.red}`,
                  color: COLORS.red,
                  padding: "10px 24px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "'Syne'",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {state === "result" && result && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontWeight: 800,
                      fontSize: 22,
                      marginBottom: 4,
                    }}
                  >
                    Analysis Complete
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: COLORS.textDim,
                      fontFamily: "'Space Mono'",
                    }}
                  >
                    {file?.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setState("idle");
                    setResult(null);
                    setFile(null);
                    setResumeText("");
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.textDim,
                    padding: "10px 20px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "'Syne'",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  ← Analyze Another
                </button>
              </div>
              <ResultsDashboard result={result} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
