import { parseAnalysis } from "./analysis.js";

// ── AI Provider Layer ─────────────────────────────────────────────
// Priority: Gemini (free tier) → OpenRouter (free models)
// Model IDs verified against provider catalogs on 2026-09-17; see README sources.
const GEMINI_MODELS = [
  "gemini-3.8-flash", // Primary stable Flash model
  "gemini-3.7-flash", // Previous-generation fallback
  "gemini-3.6-flash", // Additional stable fallback
];

const OPENROUTER_MODELS = [
  "nvidia/nemotron-3.5-lightning:free",
  "thinkingmachines/inkling-small:free",
  "poolside/laguna-s-2.1:free",
  "openrouter/free", // Routes to an available free model
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
          signal: AbortSignal.timeout(30000),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 4000, temperature: 0.7 },
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        lastError = new Error(
          `[gemini:${model}] ${data.error?.message || data.error?.status || `HTTP ${res.status}`}`,
        );
        console.warn("Gemini model failed:", lastError.message);
        continue;
      }

      const text =
        data.candidates?.[0]?.content?.parts?.filter((p) => !p.thought).map((p) => p.text || "").join("") ||
        "";

      if (!text) {
        lastError = new Error(`[gemini:${model}] Empty response`);
        continue;
      }

      return { result: parseAnalysis(text), provider: `Gemini (${model})` };
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
          signal: AbortSignal.timeout(30000),
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

      if (!res.ok || data.error) {
        lastError = new Error(`[${model}] ${data.error?.message || data.error || `HTTP ${res.status}`}`);
        console.warn("OpenRouter model failed, trying next:", lastError.message);
        continue;
      }

      const text = data.choices?.[0]?.message?.content || "";

      if (!text) {
        lastError = new Error(`[${model}] Empty response`);
        continue;
      }

      return { result: parseAnalysis(text), provider: `OpenRouter (${model})` };
    } catch (err) {
      lastError = err;
      console.warn(`OpenRouter model ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error("All OpenRouter models failed");
}

export async function getAIAnalysis(prompt, { geminiKey, openrouterKey }) {
  if (!geminiKey && !openrouterKey) {
    throw new Error(
      "No AI API key found. Please add a VITE_GEMINI_API_KEY or VITE_OPENROUTER_API_KEY in your .env file, or click 'API Key Settings' in the top bar to set your key.",
    );
  }

  if (geminiKey) {
    try {
      return await callGemini(prompt, geminiKey);
    } catch (err) {
      if (!openrouterKey) throw err;
      console.warn("Gemini failed entirely, falling back to OpenRouter:", err.message);
    }
  }

  return await callOpenRouter(prompt, openrouterKey);
}
