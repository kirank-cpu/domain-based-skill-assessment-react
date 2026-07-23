import { useState } from 'react'
import { useAssessment } from '../context/AssessmentContext.jsx'
import { getDomain, getLevel, PASS_THRESHOLD } from '../data/domains.js'
import CertificateModal from './CertificateModal.jsx'
import AppFooter from './AppFooter.jsx'
import Icon from './Icon.jsx'
import { formatDuration, optionLabel } from '../utils/helpers.js'
import {
  Award,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  Target,
  TrendingUp,
  ChevronDown,
  Lightbulb,
} from 'lucide-react'

export default function ResultDashboard() {
  const { userName, domainId, levelId, results, retryAssessment, restart } =
    useAssessment()
  const domain = getDomain(domainId)
  const level = getLevel(levelId)
  const { correct, incorrect, total, percentage, passed, timeTakenSec, breakdown } =
    results

  const [showCertificate, setShowCertificate] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Result banner */}
      <div
        className={`relative overflow-hidden ${
          passed
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
            : 'bg-gradient-to-br from-slate-700 to-slate-900'
        }`}
      >
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 py-12 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            {passed ? (
              <Award className="h-9 w-9" />
            ) : (
              <TrendingUp className="h-9 w-9" />
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            {passed ? 'Congratulations!' : 'Keep Going!'}
          </h1>
          <p className="mt-2 text-white/80">
            {passed
              ? `You passed the ${domain.name} (${level.name}) assessment.`
              : `You scored below the ${PASS_THRESHOLD}% pass mark — you're close!`}
          </p>

          {/* Score ring */}
          <div className="mx-auto mt-8 flex max-w-xs items-center justify-center">
            <ScoreRing percentage={percentage} passed={passed} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-5 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 -mt-16 relative z-10">
          <StatCard
            icon={CheckCircle2}
            label="Correct"
            value={correct}
            tone="emerald"
          />
          <StatCard icon={XCircle} label="Incorrect" value={incorrect} tone="rose" />
          <StatCard icon={Target} label="Score" value={`${percentage}%`} tone="brand" />
          <StatCard
            icon={Clock}
            label="Time Taken"
            value={formatDuration(timeTakenSec)}
            tone="slate"
          />
        </div>

        {/* Pass/Fail action panel */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {passed ? (
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Award className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Your certificate is ready
                </h3>
                <p className="text-sm text-slate-500">
                  Download or print your official completion certificate.
                </p>
              </div>
              <button
                onClick={() => setShowCertificate(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
              >
                <Award className="h-5 w-5" />
                View Certificate
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Lightbulb className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  You need {PASS_THRESHOLD}% to pass — you reached {percentage}%
                </h3>
                <p className="text-sm text-slate-500">
                  Review the explanations below, then retry to earn your certificate.
                </p>
              </div>
              <button
                onClick={retryAssessment}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
              >
                <RotateCcw className="h-5 w-5" />
                Retry Assessment
              </button>
            </div>
          )}
        </div>

        {/* Feedback for near-miss */}
        {!passed && (
          <FeedbackBlock percentage={percentage} breakdown={breakdown} />
        )}

        {/* Answer review (collapsible) */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            onClick={() => setReviewOpen((o) => !o)}
            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50"
          >
            <span className="font-semibold text-slate-900">
              Detailed Answer Review
            </span>
            <ChevronDown
              className={`h-5 w-5 text-slate-400 transition-transform ${
                reviewOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {reviewOpen && (
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {breakdown.map((item, i) => (
                <ReviewItem key={item.question.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={retryAssessment}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Retake This Assessment
          </button>
          <button
            onClick={restart}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Home className="h-4 w-4" />
            Choose Another Domain
          </button>
        </div>
      </main>

      <AppFooter />

      {showCertificate && (
        <CertificateModal onClose={() => setShowCertificate(false)} />
      )}
    </div>
  )
}

function ScoreRing({ percentage, passed }) {
  const radius = 68
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  return (
    <div className="relative h-44 w-44">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="12"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white">{percentage}%</span>
        <span className="mt-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
          {passed ? 'Passed' : 'Not passed'}
        </span>
      </div>
    </div>
  )
}

const TONES = {
  emerald: 'text-emerald-600 bg-emerald-50',
  rose: 'text-rose-600 bg-rose-50',
  brand: 'text-brand-600 bg-brand-50',
  slate: 'text-slate-600 bg-slate-100',
}

function StatCard({ icon: IconCmp, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${TONES[tone]}`}
      >
        <IconCmp className="h-5 w-5" />
      </span>
      <p className="mt-3 text-xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  )
}

function FeedbackBlock({ percentage, breakdown }) {
  const missed = breakdown.filter((b) => !b.isCorrect)
  const scenarioMissed = missed.filter((b) => b.question.type === 'scenario').length
  const gap = PASS_THRESHOLD - percentage

  let message
  if (percentage >= 60) {
    message =
      "You're on the cusp of passing. A focused review of the questions you missed should get you over the line."
  } else if (percentage >= 40) {
    message =
      'Solid foundation, but several core concepts need reinforcement. Revisit the explanations and try again.'
  } else {
    message =
      'Consider studying the fundamentals of this domain and level before retrying. Every expert started here.'
  }

  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <h3 className="flex items-center gap-2 font-bold text-amber-900">
        <Lightbulb className="h-5 w-5" />
        Constructive Feedback
      </h3>
      <p className="mt-2 text-sm text-amber-800">{message}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-amber-800">
        <li>
          • You're <span className="font-semibold">{gap}%</span> away from the pass
          mark.
        </li>
        <li>
          • You missed{' '}
          <span className="font-semibold">{missed.length}</span> question
          {missed.length === 1 ? '' : 's'} in total
          {scenarioMissed > 0 && (
            <>
              , including{' '}
              <span className="font-semibold">{scenarioMissed}</span> scenario-based
            </>
          )}
          .
        </li>
        <li>• Expand the detailed review below to see explanations for each answer.</li>
      </ul>
    </div>
  )
}

function ReviewItem({ item, index }) {
  const { question, selected, answered, isCorrect } = item
  const StatusIcon = !answered ? MinusCircle : isCorrect ? CheckCircle2 : XCircle
  const statusColor = !answered
    ? 'text-slate-400'
    : isCorrect
      ? 'text-emerald-600'
      : 'text-rose-600'

  return (
    <div className="px-6 py-5">
      <div className="flex items-start gap-3">
        <StatusIcon className={`mt-0.5 h-5 w-5 shrink-0 ${statusColor}`} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900">
            <span className="text-slate-400">Q{index + 1}.</span> {question.question}
          </p>

          <div className="mt-3 space-y-2">
            {question.options.map((opt, i) => {
              const isAnswer = i === question.answer
              const isSelected = i === selected
              let cls = 'border-slate-200 bg-white text-slate-600'
              if (isAnswer) cls = 'border-emerald-300 bg-emerald-50 text-emerald-800'
              else if (isSelected && !isCorrect)
                cls = 'border-rose-300 bg-rose-50 text-rose-800'
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${cls}`}
                >
                  <span className="font-bold">{optionLabel(i)}.</span>
                  <span className="flex-1">{opt}</span>
                  {isAnswer && (
                    <span className="text-xs font-semibold text-emerald-600">
                      Correct
                    </span>
                  )}
                  {isSelected && !isAnswer && (
                    <span className="text-xs font-semibold text-rose-600">
                      Your answer
                    </span>
                  )}
                </div>
              )
            })}
            {!answered && (
              <p className="text-xs font-medium text-slate-400">
                You did not answer this question.
              </p>
            )}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-sm text-slate-600">{question.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
