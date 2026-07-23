import { useEffect, useRef, useState } from 'react'
import { useAssessment } from '../context/AssessmentContext.jsx'
import { getDomain, getLevel } from '../data/domains.js'
import Icon from './Icon.jsx'
import Brand from './Brand.jsx'
import { formatTime, optionLabel } from '../utils/helpers.js'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Wand2,
  Info,
  X,
} from 'lucide-react'

export default function QuizScreen() {
  const {
    userName,
    domainId,
    levelId,
    questions,
    answers,
    currentIndex,
    totalSeconds,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitAssessment,
    restart,
    questionSource,
    loadError,
  } = useAssessment()

  const domain = getDomain(domainId)
  const level = getLevel(levelId)
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const submittedRef = useRef(false)

  const q = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const isLast = currentIndex === questions.length - 1

  // Overall countdown timer — auto-submits when it hits zero.
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!submittedRef.current) {
            submittedRef.current = true
            submitAssessment()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [submitAssessment])

  const handleSubmit = () => {
    if (submittedRef.current) return
    submittedRef.current = true
    submitAssessment()
  }

  const handleCancel = () => {
    submittedRef.current = true
    restart()
  }

  const timeProgress = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0
  const questionProgress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0
  const lowTime = secondsLeft <= 30

  if (!q) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky header: identity, timer, progress */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-4xl px-5 py-3">
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
            <Brand size="sm" tone="onLight" />
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 sm:inline-flex">
                Assessment in progress
              </span>
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${domain.accent}`}
              >
                <Icon name={domain.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {domain.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {level.name} · {userName}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-sm font-semibold tabular-nums transition-colors ${
                lowTime
                  ? 'animate-pulse bg-rose-50 text-rose-600'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Clock className="h-4 w-4" />
              {formatTime(secondsLeft)}
            </div>
          </div>

          {/* Time progress bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                lowTime ? 'bg-rose-500' : 'bg-brand-600'
              }`}
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-5 py-6">
        {/* Question source banner (dynamic domains) */}
        {questionSource === 'ai' && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700">
            <Wand2 className="h-4 w-4 shrink-0" />
            These questions were freshly generated for you by Claude AI.
          </div>
        )}
        {questionSource === 'fallback' && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Live AI generation was unavailable, so this assessment uses a curated
              fallback question set.
              {loadError ? (
                <span className="block text-xs text-amber-600">({loadError})</span>
              ) : null}
            </span>
          </div>
        )}

        {/* Question progress meta */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            Question{' '}
            <span className="font-bold text-slate-900">{currentIndex + 1}</span> of{' '}
            {questions.length}
          </span>
          <span className="text-slate-500">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${questionProgress}%` }}
          />
        </div>

        {/* Question card */}
        <div
          key={q.id}
          className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                q.type === 'scenario'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-sky-100 text-sky-700'
              }`}
            >
              {q.type === 'scenario' ? 'Scenario' : 'Multiple Choice'}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${level.chip}`}>
              {level.name}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold leading-relaxed text-slate-900">
            {q.question}
          </h2>

          {q.code && (
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
              <code>{q.code}</code>
            </pre>
          )}

          {/* Options */}
          <div className="mt-6 space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === i
              return (
                <button
                  key={i}
                  onClick={() => answerQuestion(q.id, i)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    selected
                      ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/30'
                      : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition ${
                      selected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {optionLabel(i)}
                  </span>
                  <span
                    className={`text-sm sm:text-base ${
                      selected ? 'font-medium text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {opt}
                  </span>
                  {selected ? (
                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-brand-600" />
                  ) : (
                    <Circle className="ml-auto h-5 w-5 shrink-0 text-slate-200" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {isLast ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
            >
              <Flag className="h-4 w-4" />
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Question navigator grid */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Question Navigator
          </p>
          <div className="flex flex-wrap gap-2">
            {questions.map((question, i) => {
              const isAnswered = answers[question.id] !== undefined
              const isCurrent = i === currentIndex
              return (
                <button
                  key={question.id}
                  onClick={() => goToQuestion(i)}
                  aria-label={`Go to question ${i + 1}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    isCurrent
                      ? 'bg-brand-600 text-white ring-2 ring-brand-500/40 ring-offset-1'
                      : isAnswered
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Submit confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-pop-in rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">Submit your answers?</h3>
            </div>
            <p className="text-sm text-slate-600">
              You have answered{' '}
              <span className="font-semibold text-slate-900">
                {answeredCount} of {questions.length}
              </span>{' '}
              questions.
              {answeredCount < questions.length && (
                <span className="mt-1 block text-amber-600">
                  Unanswered questions will be marked incorrect.
                </span>
              )}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Keep Reviewing
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-pop-in rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Cancel this assessment?
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Your current answers and timer progress will be discarded, and you will
              return to the home page.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Continue Assessment
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Cancel Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
