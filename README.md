# 📄 ResumeATS — AI-Powered Resume Analyzer

<div align="center">

![ResumeATS Banner](https://img.shields.io/badge/ResumeATS-AI%20Powered-00e5ff?style=for-the-badge&logo=readthedocs&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Free%20AI-00ff88?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Instantly analyze your resume against ATS systems using free AI models.**  
Get a score, fix weak bullets, identify missing keywords, and match job descriptions — all in ~15 seconds.

[🚀 Live Demo](https://resume-analyzer01.vercel.app/) · [🐛 Report Bug](https://github.com/Sdinzsh/Resume_analyser/issues) · [✨ Request Feature](https://github.com/Sdinzsh/Resume_analyser/issues)

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
| 🚀 **Quick Wins** | Prioritized, actionable list of the most impactful fixes |
| 🤖 **Multi-Model Fallback** | Tries multiple free AI models automatically if one fails |
| 🔒 **Privacy First** | Your resume is never stored — all processing is client-side |

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) with Hooks
- **Build Tool:** [Vite](https://vitejs.dev/)
- **PDF Parsing:** [PDF.js v3.11](https://mozilla.github.io/pdf.js/) (loaded via CDN)
- **AI Backend:** [OpenRouter API](https://openrouter.ai/) (free-tier models)
- **Fonts:** [Space Mono](https://fonts.google.com/specimen/Space+Mono) + [Syne](https://fonts.google.com/specimen/Syne) via Google Fonts
- **Styling:** Pure inline CSS with CSS animations (no external UI library)

### 🤖 AI Models Used (with automatic fallback)

```
nvidia/nemotron-3-super-120b-a12b:free  ← Primary (strongest)
deepseek/deepseek-r1:free
arcee-ai/trinity-large-preview:free
z-ai/glm-4.5-air:free
openrouter/free                         ← Smart fallback router
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A free [OpenRouter](https://openrouter.ai/) API key

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Sdinzsh/Resume_analyser.git
cd Resume_analyser
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> 🔑 Get your free API key at [openrouter.ai/keys](https://openrouter.ai/keys)  
> The free tier is sufficient — no credit card required.

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
Resume_analyser/
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
┌──────────┐    ┌───────────┐    ┌──────────────────┐    ┌──────────────┐
│  Upload  │───▶│  PDF.js   │───▶│  OpenRouter API  │───▶│   Results    │
│  PDF     │    │  Extract  │    │  (Free AI Model) │    │  Dashboard   │
│  Resume  │    │  Text     │    │  JSON Analysis   │    │              │
└──────────┘    └───────────┘    └──────────────────┘    └──────────────┘
```

1. **Upload** — User drags & drops or selects a PDF resume
2. **Extract** — PDF.js extracts raw text client-side (no server upload)
3. **Prompt** — A detailed prompt is sent to OpenRouter's free AI API
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
  }
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
- **Free AI rate limits** — Free OpenRouter models may occasionally be busy; the app retries automatically across 5 models
- **No persistent storage** — Analysis results are lost on page refresh (by design, for privacy)

---

## 🔒 Privacy & Security

- ✅ Your resume text is never stored on any server
- ✅ PDF parsing happens entirely in your browser via PDF.js
- ✅ Only the extracted text is sent to the AI API (not the file itself)
- ✅ The OpenRouter API key is kept in `.env` and never exposed in the UI
- ⚠️ Be mindful that resume text is sent to third-party AI model providers via OpenRouter

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [OpenRouter](https://openrouter.ai/) — Free AI model routing
- [PDF.js](https://mozilla.github.io/pdf.js/) — In-browser PDF parsing by Mozilla
- [Google Fonts](https://fonts.google.com/) — Space Mono & Syne typefaces
- [NVIDIA Nemotron](https://build.nvidia.com/nvidia/nemotron-3-super-120b-a12b) — Primary AI backbone

---

## 📌 Quick Setup TL;DR

```bash
git clone https://github.com/Sdinzsh/Resume_analyser.git
cd Resume_analyser
npm install
echo "VITE_OPENROUTER_API_KEY=your_key_here" > .env
npm run dev
```

> 🔑 Get your free key → [openrouter.ai/keys](https://openrouter.ai/keys)

---

<div align="center">

**Made with ❤️ by [Sdinzsh](https://github.com/Sdinzsh)**

⭐ Star this repo if it helped you land an interview! ⭐

</div>
