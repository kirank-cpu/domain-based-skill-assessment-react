# Q+ Provio — Multi-Domain Skill Assessment

A responsive, modern web app for skill assessments across multiple domains, built with **React** (functional components, hooks, Context API) and **Tailwind CSS v4**. Score **≥ 80%** to earn a printable/downloadable certificate.

## Features

- **Authentication** — Login / Signup / Forgot-Password flows in a centered glass card. Signup issues a one-time **4-digit security code** (required for password recovery); credentials are **salted + SHA-256 hashed** before being stored in `localStorage` — plaintext passwords and codes are never persisted. The app is gated behind auth.
- **Landing / Domain selection** — pick a domain (QA, Azure Data Engineer, QA - Selenium automation, General Software Engineering, **GitHub & CI/CD**) and difficulty (Beginner, Intermediate, Complex/Expert), plus your name.
- **AI-generated assessments (GitHub & CI/CD)** — this domain generates a fresh set of **exactly 20 unique questions** per session via the **Anthropic Claude API** (structured outputs + adaptive thinking). Strict per-level timers (Beginner 20 min · Intermediate 40 min · Complex 60 min) auto-submit at zero. A loading screen ("Generating unique assessment via Claude AI…") covers the request, and if the API is unavailable it **falls back to a local 20-question bank** so the assessment always runs. The API key stays server-side (see below).
- **Assessment interface** — dynamic MCQ + scenario-based questions, an overall countdown timer with a live progress bar, a question navigator, and real-time answer tracking.
- **Instant evaluation** — automated grading with a score breakdown (correct/incorrect, percentage, time taken) and a collapsible per-question review with explanations.
- **Pass/Fail** — passing is strictly `>= 80%`.
- **Certificate generator** — on pass, a professional certificate (name, domain, level, score, timestamp, certificate ID) that can be **printed / saved as PDF** or **downloaded** as a self-contained HTML file.
- **Constructive feedback + retry** — on a near-miss, targeted feedback and one-click retry.

## Getting started

```bash
npm install
npm run dev      # start the dev server (also serves the secure Claude endpoint)
npm run build    # production build
npm run preview  # preview the production build (also serves the endpoint)
```

### Enabling AI-generated questions

The **GitHub & CI/CD** domain calls the Claude API. Provide a key so the server-side
endpoint can reach Anthropic:

```bash
cp .env.example .env        # then edit .env and set ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

- The key is read **only by the Node process** running Vite (via a server middleware in
  [vite.config.js](vite.config.js)) — it is **never** bundled into the client. The browser
  calls `POST /api/generate-questions`; the server holds the credential.
- Without a key (or on any API error/rate-limit), the app logs the reason server-side and
  transparently falls back to a local 20-question bank — the assessment still runs.
- Model defaults to `claude-opus-4-8`; override with `ASSESSMENT_MODEL` (e.g.
  `claude-sonnet-5` for faster/cheaper generation).
- For production, host the built app behind a server that mounts the same middleware
  (`server/apiMiddleware.js`) so the key remains server-side.

## Project structure

```
src/
├─ App.jsx                     # stage router (setup → quiz → result)
├─ main.jsx                    # entry, wraps app in AssessmentProvider
├─ index.css                   # Tailwind + theme tokens + print styles
├─ context/
│  ├─ AuthContext.jsx          # AuthProvider: signup/login/logout/reset
│  └─ AssessmentContext.jsx    # Context API + reducer, grading logic
├─ data/
│  ├─ domains.js               # domains, levels, timing, pass threshold, dynamic config
│  ├─ questions.js             # static question bank (domain → level → questions)
│  └─ githubFallback.js        # offline fallback bank for GitHub & CI/CD (20/level)
├─ services/
│  └─ questionService.js       # POST /api/generate-questions + normalize (client)
├─ components/
│  ├─ AuthScreen.jsx           # login / signup / reset views
│  ├─ HDBackground.jsx         # shared immersive background
│  ├─ DomainSelector.jsx       # landing page
│  ├─ GeneratingScreen.jsx     # "Generating via Claude AI…" loader + skeleton
│  ├─ QuizScreen.jsx           # timed quiz + navigator
│  ├─ ResultDashboard.jsx      # score breakdown + review
│  ├─ CertificateModal.jsx     # printable/downloadable certificate
│  └─ Icon.jsx                 # name → lucide-react icon resolver
└─ utils/
   ├─ crypto.js                # SHA-256 hashing, salt, secure code generation
   └─ helpers.js               # time/format helpers

server/                        # server-side only (API key never reaches the client)
├─ generateQuestions.js        # Anthropic SDK call (structured output, streaming)
└─ apiMiddleware.js            # /api/generate-questions handler (Vite dev + preview)
```

> **Security note:** the auth layer is a **client-only demo**. Salting + SHA-256 hashing means plaintext is never written to `localStorage`, but real credential security requires a server with a slow password hash (bcrypt/argon2/scrypt). Treat it as the correct *shape*, not production-grade security. Stored under `localStorage` keys `qplus_provio_users` and `qplus_provio_session`.

## Extending the question bank

Everything is data-driven. To add questions, edit [src/data/questions.js](src/data/questions.js):

```js
QUESTIONS['my-domain']['beginner'] = [
  {
    id: 'unique-id',
    type: 'mcq', // or 'scenario'
    question: 'Your question text',
    code: 'optional code block',
    options: ['A', 'B', 'C', 'D'],
    answer: 1,           // index of the correct option
    explanation: 'Why this answer is correct.',
  },
]
```

To add a new domain or level, extend `DOMAINS` / `LEVELS` in [src/data/domains.js](src/data/domains.js) — the UI adapts automatically. Difficulty timing lives in `SECONDS_PER_QUESTION`, and the pass mark in `PASS_THRESHOLD`.
```

## Tech

React 18 · Vite 6 · Tailwind CSS v4 · lucide-react icons.
