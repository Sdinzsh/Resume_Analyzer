# 📄 ResumeATS — AI-Powered Resume Analyzer

<div align="center">

![ResumeATS Banner](https://img.shields.io/badge/ResumeATS-AI%20Powered-00e5ff?style=for-the-badge&logo=readthedocs&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-Free%20AI-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Fallback%20AI-00ff88?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Instantly analyze your resume against ATS systems using free AI models.**  
Get a score, fix weak bullets, identify missing keywords, and match job descriptions — all in ~15 seconds.

[🚀 Live Demo](https://resume-analyzer-01.vercel.app) · [🐛 Report Bug](https://github.com/Sdinzsh/Resume_Analyzer/issues) · [✨ Request Feature](https://github.com/Sdinzsh/Resume_Analyzer/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🏗️ Project Structure](#️-project-structure)
- [📖 How It Works](#-how-it-works)
- [📊 Analysis Output Schema](#-analysis-output-schema)
- [⚙️ Available Scripts](#️-available-scripts)
- [🎨 Design System](#-design-system)
- [🤝 Contributing](#-contributing)
- [⚠️ Limitations](#️-limitations)
- [🔒 Privacy & Security](#-privacy--security)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **ATS Score** | Overall 0–100 compatibility score with visual gauge |
| 🔑 **Keyword Analysis** | Identifies missing high-value keywords from your resume |
| ⚡ **Bullet Point Rewriter** | Detects weak bullets and suggests improved, metric-driven versions |
| 📐 **Formatting Checker** | Flags ATS-breaking formatting issues with severity levels |
| 💪 **Action Verb Suggestions** | Replaces weak verbs like *"helped"* or *"worked on"* |
| 🎯 **Job Description Match** | Paste a JD to get a match % with matched/missing skills |
| 💼 **Job Role Recommendations** | AI suggests 3-5 job titles that fit your skills, with matched skills, skill gaps, and one-click search links |
| 🚀 **Quick Wins** | Prioritized, actionable list of the most impactful fixes |
| 🤖 **Gemini + OpenRouter Fallback** | Tries Gemini first; if it's rate-limited or unavailable, automatically falls back to multiple free OpenRouter models |
| 🔒 **Privacy First** | Your resume is never stored — all processing is client-side |

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) with Hooks
- **Build Tool:** [Vite](https://vitejs.dev/)
- **PDF Parsing:** [PDF.js v3.11](https://mozilla.github.io/pdf.js/) (loaded via CDN)
- **AI Backend:** [Google Gemini](https://ai.google.dev/) (primary, free tier) with automatic fallback to [OpenRouter](https://openrouter.ai/) (free-tier models)
- **Fonts:** [Space Mono](https://fonts.google.com/specimen/Space+Mono) + [Syne](https://fonts.google.com/specimen/Syne) via Google Fonts
- **Styling:** Pure inline CSS with CSS animations (no external UI library)

### 🤖 AI Providers Used (with automatic fallback)

Gemini is tried first. If it's missing a key, rate-limited, or errors out, the app transparently falls back to OpenRouter's model chain — no user action needed.

```
1️⃣ Gemini (primary)
   gemini-3.6-flash                        ← Primary
   gemini-3.5-flash-lite                   ← Backup Gemini model

2️⃣ OpenRouter (fallback, only if Gemini is unavailable)
   nvidia/nemotron-3-ultra-550b-a55b:free  ← Primary
   nousresearch/hermes-3-llama-3.1-405b:free
   nvidia/nemotron-3-super-120b-a12b:free
   qwen/qwen3-next-80b-a3b-instruct:free
   meta-llama/llama-3.3-70b-instruct:free
   openrouter/free                         ← Smart fallback router
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A free [Gemini](https://aistudio.google.com/apikey) API key (recommended, primary provider) and/or a free [OpenRouter](https://openrouter.ai/) API key (fallback provider)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Sdinzsh/Resume_Analyzer.git
cd Resume_Analyzer
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root:

```env
# Gemini is tried first; OpenRouter is the automatic fallback if Gemini
# is missing, rate-limited, or unavailable. Set either one, or both.
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> 🔑 Get a free Gemini key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)  
> 🔑 Get a free OpenRouter key at [openrouter.ai/keys](https://openrouter.ai/keys)  
> Both free tiers are sufficient — no credit card required. You only need one key to run the app, but setting both gives you automatic failover if Gemini's daily free-tier limit is reached.

**4. Start the development server**
```bash
npm run dev
```

**5. Open your browser**
```
http://localhost:5173
```

---

## 🏗️ Project Structure

```
Resume_Analyzer/
├── src/
│   └── App.jsx              # Main application (single-file architecture)
│       ├── ScoreGauge       # Animated circular ATS score gauge
│       ├── Tag              # Reusable keyword/label tag component
│       ├── Section          # Animated card section wrapper
│       ├── LoadingAnalysis  # Step-by-step loading animation
│       ├── ResultsDashboard # Full results layout
│       └── ResumeAnalyzer   # Root component with all logic
├── public/
├── .env                     # Environment variables (create this)
├── .env.example             # Example env file
├── index.html
├── package.json
├── eslint.config.js
└── vite.config.js
```

---

## 📖 How It Works

```
┌──────────┐    ┌───────────┐    ┌───────────────────────┐    ┌──────────────┐
│  Upload  │───▶│  PDF.js   │───▶│  Gemini → OpenRouter   │───▶│   Results    │
│  PDF     │    │  Extract  │    │  (auto fallback chain) │    │  Dashboard   │
│  Resume  │    │  Text     │    │  JSON Analysis         │    │              │
└──────────┘    └───────────┘    └───────────────────────┘    └──────────────┘
```

1. **Upload** — User drags & drops or selects a PDF resume
2. **Extract** — PDF.js extracts raw text client-side (no server upload)
3. **Prompt** — A detailed prompt is sent to Gemini first; if it's unavailable, the app automatically retries with OpenRouter's free models
4. **Parse** — The JSON response is validated and parsed
5. **Display** — Results are rendered in the animated dashboard

---

## 📊 Analysis Output Schema

The AI returns a structured JSON object:

```json
{
  "atsScore": 72,
  "keywordMatchScore": 65,
  "formattingScore": 80,
  "impactScore": 60,
  "summary": "Overall assessment of the resume in 2-3 sentences.",
  "missingKeywords": ["Docker", "Kubernetes", "CI/CD"],
  "weakBullets": [
    {
      "original": "Worked on backend APIs",
      "improved": "Architected 12 RESTful APIs reducing latency by 40%",
      "tip": "Lead with an action verb and quantify the impact."
    }
  ],
  "formattingIssues": [
    {
      "icon": "📏",
      "title": "Resume exceeds one page",
      "detail": "ATS systems and recruiters prefer concise single-page resumes for <10 years experience.",
      "severity": "Critical"
    }
  ],
  "actionVerbs": ["Architected", "Spearheaded", "Optimized", "Delivered"],
  "quickWins": [
    "Add quantified metrics to at least 3 bullet points",
    "Include 'Python' and 'REST API' in your skills section"
  ],
  "jobMatch": {
    "matchPercent": 68,
    "verdict": "Good match but missing key cloud skills.",
    "matched": ["React", "Node.js", "SQL"],
    "missing": ["AWS", "Terraform"]
  },
  "recommendedRoles": [
    {
      "title": "Backend Developer",
      "matchPercent": 82,
      "reason": "Strong REST API and database experience align well with this role.",
      "matchedSkills": ["Node.js", "REST API", "SQL"],
      "skillsToLearn": ["Docker", "AWS"]
    }
  ]
}
```

---

## ⚙️ Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally
```

---

## 🎨 Design System

The UI uses a custom dark-mode color palette with no external UI library:

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0a0b0f` | Page background |
| `surface` | `#111318` | Cards & inputs |
| `accent` | `#00e5ff` | Primary highlights, keywords |
| `green` | `#00ff88` | Success, good scores, matched |
| `yellow` | `#ffd166` | Warnings, formatting issues |
| `red` | `#ff4d6d` | Errors, critical issues, missing |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

### 💡 Ideas for Contribution

- Support `.docx` file format in addition to PDF
- Add export/download of analysis as PDF report
- Multi-language resume support
- Resume comparison (before vs. after)
- Local LLM support via Ollama
- Dark/light theme toggle

---

## ⚠️ Limitations

- **PDF only** — `.docx` and other formats are not currently supported
- **Text-based PDFs only** — Scanned/image-based PDFs cannot be parsed by PDF.js
- **Free AI rate limits** — Gemini's free tier has a daily quota; once reached, the app automatically falls back to OpenRouter's free models
- **No persistent storage** — Analysis results are lost on page refresh (by design, for privacy)

---

## 🔒 Privacy & Security

- ✅ Your resume text is never stored on any server
- ✅ PDF parsing happens entirely in your browser via PDF.js
- ✅ Only the extracted text is sent to the AI API (not the file itself)
- ✅ API keys are kept in `.env` (gitignored) and never exposed in the UI
- ⚠️ Be mindful that resume text is sent to third-party AI providers (Google Gemini and/or OpenRouter)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev/) — Primary free AI backend
- [OpenRouter](https://openrouter.ai/) — Fallback free AI model routing
- [PDF.js](https://mozilla.github.io/pdf.js/) — In-browser PDF parsing by Mozilla
- [Google Fonts](https://fonts.google.com/) — Space Mono & Syne typefaces

---

## 📌 Quick Setup TL;DR

```bash
git clone https://github.com/Sdinzsh/Resume_Analyzer.git
cd Resume_Analyzer
npm install
echo "VITE_GEMINI_API_KEY=your_key_here" > .env
echo "VITE_OPENROUTER_API_KEY=your_key_here" >> .env
npm run dev
```

> 🔑 Get your free Gemini key → [aistudio.google.com/apikey](https://aistudio.google.com/apikey)  
> 🔑 Get your free OpenRouter key → [openrouter.ai/keys](https://openrouter.ai/keys)

---

<div align="center">

**Made with ❤️ by [Sdinzsh](https://github.com/Sdinzsh)**

⭐ Star this repo if it helped you land an interview! ⭐

</div>
