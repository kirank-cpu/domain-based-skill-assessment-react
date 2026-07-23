import { useState } from 'react'
import {
  DOMAINS,
  LEVELS,
  PASS_THRESHOLD,
  isDynamicDomain,
  plannedQuestionCount,
  perQuestionSeconds,
} from '../data/domains.js'
import { getQuestions } from '../data/questions.js'
import { useAssessment } from '../context/AssessmentContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Icon from './Icon.jsx'
import Brand from './Brand.jsx'
import AppFooter from './AppFooter.jsx'
import HDBackground from './HDBackground.jsx'
import { formatDuration } from '../utils/helpers.js'
import {
  ArrowRight,
  Award,
  Sparkles,
  Timer,
  ListChecks,
  Target,
  Layers,
  BarChart3,
  ShieldCheck,
  LogOut,
  UserRound,
  Wand2,
} from 'lucide-react'

// Brighter, dark-theme accents for the difficulty cards (data stays UI-agnostic).
const LEVEL_DARK = {
  beginner: { text: 'text-emerald-300', ring: 'ring-emerald-400/60', glow: 'shadow-emerald-500/20' },
  intermediate: { text: 'text-amber-300', ring: 'ring-amber-400/60', glow: 'shadow-amber-500/20' },
  complex: { text: 'text-rose-300', ring: 'ring-rose-400/60', glow: 'shadow-rose-500/20' },
}

export default function DomainSelector() {
  const { startAssessment } = useAssessment()
  const { currentUser, logout } = useAuth()
  const [name, setName] = useState(currentUser?.username ?? '')
  const [domainId, setDomainId] = useState(null)
  const [levelId, setLevelId] = useState(null)
  const [error, setError] = useState('')

  const dynamic = isDynamicDomain(domainId)
  const staticLen =
    domainId && levelId && !dynamic ? getQuestions(domainId, levelId).length : 0
  const questionCount =
    domainId && levelId ? plannedQuestionCount(domainId, staticLen) : 0
  const totalSeconds =
    domainId && levelId ? questionCount * perQuestionSeconds(domainId, levelId) : 0

  const canStart = name.trim().length >= 2 && domainId && levelId && questionCount > 0

  const handleStart = () => {
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).')
      return
    }
    if (!domainId) {
      setError('Please select a domain.')
      return
    }
    if (!levelId) {
      setError('Please select a difficulty level.')
      return
    }
    if (questionCount === 0) {
      setError('No questions available for this selection yet.')
      return
    }
    setError('')
    startAssessment({ userName: name, domainId, levelId })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080c1c] text-white">
      {/* ---------- HD graphic background ---------- */}
      <HDBackground />

      {/* ---------- Foreground content ---------- */}
      <div className="relative z-10">
        {/* Top nav */}
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-6">
          <Brand size="md" tone="onDark" />
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200 backdrop-blur md:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-300" />
              Verifiable Skill Certification
            </span>
            {currentUser && (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur">
                  <UserRound className="h-3.5 w-3.5 text-brand-300" />
                  <span className="max-w-[7rem] truncate">{currentUser.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur transition hover:border-white/25 hover:bg-white/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        <header className="mx-auto max-w-4xl px-5 pt-10 pb-8 text-center sm:pt-16">
          <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-brand-100 backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-300" />
            Multi-Domain Skill Assessment Platform
          </div>

          <h1 className="animate-fade-up text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="headline-gradient">Prove Your Skills.</span>
            <br />
            <span className="text-white">Earn Your </span>
            <span className="bg-gradient-to-r from-brand-300 to-indigo-300 bg-clip-text text-transparent">
              Certificate.
            </span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Assess your expertise across QA, Azure Data Engineering, Automation, and
            Software Engineering. Score{' '}
            <span className="font-semibold text-white">{PASS_THRESHOLD}% or higher</span>{' '}
            to unlock a professional, downloadable certificate.
          </p>

          {/* Feature strip */}
          <div className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Layers, label: `${DOMAINS.length} Domains` },
              { icon: BarChart3, label: `${LEVELS.length} Difficulty Levels` },
              { icon: Target, label: `${PASS_THRESHOLD}% to Pass` },
              { icon: Award, label: 'Instant Certificate' },
            ].map(({ icon: FeatureIcon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur"
              >
                <FeatureIcon className="h-4 w-4 text-brand-300" />
                {label}
              </span>
            ))}
          </div>
        </header>

        {/* Glass configuration card */}
        <main className="mx-auto max-w-4xl px-5 pb-16">
          <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
            {/* Step 1: Name */}
            <section className="mb-9">
              <StepHeader n={1} title="Enter your full name" hint="Appears on your certificate" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Rivera"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:bg-white/10 focus:ring-4 focus:ring-brand-500/20"
              />
            </section>

            {/* Step 2: Domain */}
            <section className="mb-9">
              <StepHeader n={2} title="Choose your domain" />
              <div className="grid gap-4 sm:grid-cols-2">
                {DOMAINS.map((d) => {
                  const active = domainId === d.id
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        setDomainId(d.id)
                        setError('')
                      }}
                      className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? 'border-brand-400/60 bg-white/[0.12] shadow-lg shadow-brand-500/20 ring-2 ring-brand-400/40'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-105 ${d.accent}`}
                      >
                        <Icon name={d.icon} className="h-6 w-6" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 font-semibold text-white">
                          {d.name}
                          {d.dynamic && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500/20 to-rose-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-200 ring-1 ring-orange-400/30">
                              <Wand2 className="h-3 w-3" />
                              AI
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-sm text-slate-400">
                          {d.tagline}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 3: Level */}
            <section className="mb-8">
              <StepHeader n={3} title="Select difficulty level" />
              <div className="grid gap-4 sm:grid-cols-3">
                {LEVELS.map((l) => {
                  const active = levelId === l.id
                  const count =
                    domainId != null
                      ? plannedQuestionCount(
                          domainId,
                          dynamic ? 0 : getQuestions(domainId, l.id).length,
                        )
                      : null
                  const dark = LEVEL_DARK[l.id] ?? LEVEL_DARK.beginner
                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        setLevelId(l.id)
                        setError('')
                      }}
                      className={`relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? `border-white/20 bg-white/[0.12] shadow-lg ${dark.glow} ring-2 ${dark.ring}`
                          : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span className={`inline-flex items-center gap-2 font-semibold ${dark.text}`}>
                        <Icon name={l.icon} className="h-5 w-5" />
                        {l.name}
                      </span>
                      <span className="text-sm text-slate-400">{l.desc}</span>
                      {domainId != null && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                          <ListChecks className="h-3.5 w-3.5" />
                          {count} question{count === 1 ? '' : 's'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Summary */}
            {canStart && (
              <div className="animate-fade-up mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-brand-300" />
                  {questionCount} questions
                </span>
                <span className="inline-flex items-center gap-2">
                  <Timer className="h-4 w-4 text-brand-300" />
                  ~{formatDuration(totalSeconds)} total
                </span>
                <span className="inline-flex items-center gap-2">
                  <Target className="h-4 w-4 text-brand-300" />
                  Pass mark: {PASS_THRESHOLD}%
                </span>
                <span className="inline-flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand-300" />
                  Certificate on pass
                </span>
                {dynamic && (
                  <span className="inline-flex items-center gap-2 text-orange-200">
                    <Wand2 className="h-4 w-4" />
                    Unique questions generated by Claude AI
                  </span>
                )}
              </div>
            )}

            {error && (
              <p className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-300">
                {error}
              </p>
            )}

            <button
              onClick={handleStart}
              disabled={!canStart}
              className={`group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-200 ${
                canStart
                  ? 'bg-gradient-to-r from-brand-500 to-indigo-500 text-white shadow-xl shadow-brand-600/40 hover:from-brand-400 hover:to-indigo-400 hover:shadow-brand-500/50'
                  : 'cursor-not-allowed border border-white/10 bg-white/5 text-slate-500'
              }`}
            >
              Start Assessment
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </main>

        <AppFooter variant="dark" />
      </div>
    </div>
  )
}

function StepHeader({ n, title, hint }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-sm font-bold text-white shadow-md shadow-brand-600/30">
        {n}
      </span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {hint && <span className="text-xs text-slate-400">· {hint}</span>}
    </div>
  )
}
