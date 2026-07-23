// Domain + difficulty metadata used by the landing page and throughout the app.
// Icons are referenced by name and resolved via lucide-react in the components.

export const DOMAINS = [
  {
    id: 'qa',
    name: 'Quality Assurance',
    short: 'QA',
    icon: 'ShieldCheck',
    tagline: 'Manual testing, SDLC, defect lifecycle & test design.',
    accent: 'from-sky-500 to-cyan-500',
    accentText: 'text-sky-600',
    accentBg: 'bg-sky-50',
  },
  {
    id: 'azure-data',
    name: 'Azure Data Engineer',
    short: 'Azure Data',
    icon: 'DatabaseZap',
    tagline: 'ADF, Synapse, Databricks, Data Lake & pipeline design.',
    accent: 'from-blue-600 to-indigo-600',
    accentText: 'text-blue-600',
    accentBg: 'bg-blue-50',
  },
  {
    id: 'automation-qa',
    name: 'Automation QA',
    short: 'Automation',
    icon: 'Bot',
    tagline: 'Selenium, frameworks, CI/CD & API automation.',
    accent: 'from-violet-500 to-fuchsia-500',
    accentText: 'text-violet-600',
    accentBg: 'bg-violet-50',
  },
  {
    id: 'general-swe',
    name: 'General Software Engineering',
    short: 'Software Eng',
    icon: 'Code2',
    tagline: 'Data structures, algorithms, OOP & system design.',
    accent: 'from-emerald-500 to-teal-500',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
  },
  {
    id: 'github-cicd',
    name: 'GitHub & CI/CD',
    short: 'GitHub CI/CD',
    icon: 'GitBranch',
    tagline: 'Git workflows, GitHub Actions, pipelines & DevOps.',
    accent: 'from-orange-500 to-rose-500',
    accentText: 'text-orange-600',
    accentBg: 'bg-orange-50',
    // Dynamic domains fetch a fresh, unique question set from Claude AI on start.
    dynamic: true,
  },
]

export const LEVELS = [
  {
    id: 'beginner',
    name: 'Beginner',
    icon: 'Sprout',
    desc: 'Fundamentals & core concepts.',
    color: 'text-emerald-600',
    ring: 'ring-emerald-500',
    chip: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    icon: 'Gauge',
    desc: 'Applied knowledge & real workflows.',
    color: 'text-amber-600',
    ring: 'ring-amber-500',
    chip: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'complex',
    name: 'Complex / Expert',
    icon: 'Flame',
    desc: 'Scenario-based & architectural depth.',
    color: 'text-rose-600',
    ring: 'ring-rose-500',
    chip: 'bg-rose-100 text-rose-700',
  },
]

// Seconds allotted per question, scaled by difficulty (static domains).
export const SECONDS_PER_QUESTION = {
  beginner: 45,
  intermediate: 60,
  complex: 90,
}

// --- Dynamic (Claude-generated) assessments ---
// Exactly 20 questions per session, with strict per-level timers:
//   Beginner 20 min (1 min/q) · Intermediate 40 min (2 min/q) · Complex 60 min (3 min/q)
export const DYNAMIC_QUESTION_COUNT = 20
export const DYNAMIC_SECONDS_PER_QUESTION = {
  beginner: 60,
  intermediate: 120,
  complex: 180,
}

export const PASS_THRESHOLD = 80 // percent, strictly >= to pass

export const getDomain = (id) => DOMAINS.find((d) => d.id === id)
export const getLevel = (id) => LEVELS.find((l) => l.id === id)
export const isDynamicDomain = (id) => !!getDomain(id)?.dynamic

// Planned question count shown on the landing page before starting.
export const plannedQuestionCount = (domainId, staticLen) =>
  isDynamicDomain(domainId) ? DYNAMIC_QUESTION_COUNT : staticLen

// Seconds allotted per question for a given domain/level.
export const perQuestionSeconds = (domainId, levelId) =>
  isDynamicDomain(domainId)
    ? DYNAMIC_SECONDS_PER_QUESTION[levelId] ?? 120
    : SECONDS_PER_QUESTION[levelId] ?? 60
