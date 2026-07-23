import { useEffect, useState } from 'react'
import { useAssessment } from '../context/AssessmentContext.jsx'
import { getDomain, getLevel, DYNAMIC_QUESTION_COUNT } from '../data/domains.js'
import Brand from './Brand.jsx'
import HDBackground from './HDBackground.jsx'
import Icon from './Icon.jsx'
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react'

const STATUS_MESSAGES = [
  'Connecting to Claude AI…',
  'Designing unique questions…',
  'Calibrating difficulty…',
  'Writing answer explanations…',
  'Finalizing your assessment…',
]

export default function GeneratingScreen() {
  const { domainId, levelId, userName } = useAssessment()
  const domain = getDomain(domainId)
  const level = getLevel(levelId)
  const [step, setStep] = useState(0)

  // Cycle through status messages while the request is in flight.
  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => (s < STATUS_MESSAGES.length - 1 ? s + 1 : s))
    }, 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#080c1c] text-white">
      <HDBackground />

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="mb-6 flex justify-center">
            <Brand size="md" tone="onDark" />
          </div>

          <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-2xl bg-brand-500/30" />
                <span
                  className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${
                    domain?.accent ?? 'from-brand-500 to-indigo-600'
                  }`}
                >
                  <Icon name={domain?.icon ?? 'Sparkles'} className="h-8 w-8" />
                </span>
              </div>

              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200">
                <Sparkles className="h-3.5 w-3.5" />
                Powered by Claude AI
              </div>

              <h1 className="text-2xl font-bold">
                Generating unique assessment via Claude AI…
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Creating {DYNAMIC_QUESTION_COUNT} fresh {domain?.name} questions at{' '}
                <span className="font-medium text-slate-200">{level?.name}</span> level
                {userName ? ` for ${userName}` : ''}.
              </p>

              {/* Live status */}
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200">
                <Loader2 className="h-4 w-4 animate-spin text-brand-300" />
                {STATUS_MESSAGES[step]}
              </div>
            </div>

            {/* Indeterminate progress bar */}
            <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-brand-400 to-indigo-400" />
            </div>

            {/* Skeleton question preview */}
            <div className="mt-7 space-y-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 h-3.5 w-3/4 animate-pulse rounded bg-white/10" />
                  <div className="space-y-2.5">
                    {[0, 1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-white/10" />
                        <div
                          className="h-3 animate-pulse rounded bg-white/10"
                          style={{ width: `${70 - j * 8}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Each session is freshly generated — no two assessments are the same.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
