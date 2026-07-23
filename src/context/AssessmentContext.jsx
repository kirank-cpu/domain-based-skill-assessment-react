import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { getQuestions } from '../data/questions.js'
import {
  SECONDS_PER_QUESTION,
  DYNAMIC_SECONDS_PER_QUESTION,
  DYNAMIC_QUESTION_COUNT,
  PASS_THRESHOLD,
  isDynamicDomain,
  getDomain,
  getLevel,
} from '../data/domains.js'
import { generateQuestions } from '../services/questionService.js'
import { getFallbackQuestions } from '../data/fallback/index.js'

const AssessmentContext = createContext(null)

// Flow stages the app moves through.
export const STAGES = {
  SETUP: 'setup',
  LOADING: 'loading', // fetching AI-generated questions
  QUIZ: 'quiz',
  RESULT: 'result',
}

const initialState = {
  stage: STAGES.SETUP,
  userName: '',
  domainId: null,
  levelId: null,
  questions: [],
  answers: {}, // { [questionId]: optionIndex }
  currentIndex: 0,
  startedAt: null,
  finishedAt: null,
  totalSeconds: 0, // total time budget for the assessment
  questionSource: null, // 'static' | 'ai' | 'fallback'
  loadError: null, // message shown when AI generation fell back
}

// Per-domain local fallback source (every dynamic domain has a 20/level bank).
function fallbackFor(domainId, levelId, count) {
  return getFallbackQuestions(domainId, levelId, count)
}

// Guarantees exactly `count` distinct questions with stable, unique ids.
// De-dupes the primary set (by question text), then tops up from the local
// fallback bank if the model returned fewer than `count`.
function ensureExactly(primary, count, domainId, levelId) {
  const seen = new Set()
  const out = []

  const push = (q) => {
    if (out.length >= count) return
    if (!q || typeof q.question !== 'string') return
    if (!Array.isArray(q.options) || q.options.length < 2) return
    const key = q.question.trim().toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push(q)
  }

  primary.forEach(push)
  if (out.length < count) {
    fallbackFor(domainId, levelId, count * 2).forEach(push)
  }

  // Reassign sequential, unique ids so answer keys / React keys never collide.
  return out.slice(0, count).map((q, i) => ({ ...q, id: `dq-${i + 1}` }))
}

function totalSecondsFor(domainId, levelId, questionCount) {
  const perQ = isDynamicDomain(domainId)
    ? DYNAMIC_SECONDS_PER_QUESTION[levelId] ?? 120
    : SECONDS_PER_QUESTION[levelId] ?? 60
  return questionCount * perQ
}

function reducer(state, action) {
  switch (action.type) {
    // --- Static domains: questions are available synchronously ---
    case 'START_STATIC': {
      const { userName, domainId, levelId, questions } = action.payload
      return {
        ...initialState,
        stage: STAGES.QUIZ,
        userName: userName.trim(),
        domainId,
        levelId,
        questions,
        startedAt: Date.now(),
        totalSeconds: totalSecondsFor(domainId, levelId, questions.length),
        questionSource: 'static',
      }
    }

    // --- Dynamic domains: show loader while Claude generates ---
    case 'START_LOADING': {
      const { userName, domainId, levelId } = action.payload
      return {
        ...initialState,
        stage: STAGES.LOADING,
        userName: userName.trim(),
        domainId,
        levelId,
      }
    }

    case 'QUESTIONS_READY': {
      const { questions, source, error } = action.payload
      return {
        ...state,
        stage: STAGES.QUIZ,
        questions,
        answers: {},
        currentIndex: 0,
        startedAt: Date.now(),
        finishedAt: null,
        totalSeconds: totalSecondsFor(state.domainId, state.levelId, questions.length),
        questionSource: source,
        loadError: error ?? null,
      }
    }

    case 'ANSWER': {
      const { questionId, optionIndex } = action.payload
      return {
        ...state,
        answers: { ...state.answers, [questionId]: optionIndex },
      }
    }

    case 'GOTO':
      return {
        ...state,
        currentIndex: Math.max(
          0,
          Math.min(action.payload, state.questions.length - 1),
        ),
      }

    case 'NEXT':
      return {
        ...state,
        currentIndex: Math.min(
          state.currentIndex + 1,
          state.questions.length - 1,
        ),
      }

    case 'PREV':
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      }

    case 'SUBMIT':
      return {
        ...state,
        stage: STAGES.RESULT,
        finishedAt: action.payload?.finishedAt ?? Date.now(),
      }

    case 'RETRY':
      // Reuse the same (cached) question set — seamless, no re-fetch.
      return {
        ...state,
        stage: STAGES.QUIZ,
        answers: {},
        currentIndex: 0,
        startedAt: Date.now(),
        finishedAt: null,
      }

    case 'RESTART':
      return { ...initialState }

    default:
      return state
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const lastConfigRef = useRef(null)

  // Fetch AI questions for a dynamic domain, falling back to the local bank.
  const generate = useCallback(async ({ userName, domainId, levelId }) => {
    dispatch({ type: 'START_LOADING', payload: { userName, domainId, levelId } })
    try {
      const raw = await generateQuestions({
        domainLabel: getDomain(domainId)?.name ?? domainId,
        levelLabel: getLevel(levelId)?.name ?? levelId,
        levelId,
        count: DYNAMIC_QUESTION_COUNT,
      })
      const questions = ensureExactly(raw, DYNAMIC_QUESTION_COUNT, domainId, levelId)
      dispatch({
        type: 'QUESTIONS_READY',
        payload: { questions, source: 'ai', error: null },
      })
    } catch (err) {
      // Robust fallback: local bank still yields a full 20-question assessment.
      const fallback = ensureExactly(
        fallbackFor(domainId, levelId, DYNAMIC_QUESTION_COUNT),
        DYNAMIC_QUESTION_COUNT,
        domainId,
        levelId,
      )
      dispatch({
        type: 'QUESTIONS_READY',
        payload: {
          questions: fallback,
          source: 'fallback',
          error: err?.message || 'Live generation was unavailable.',
        },
      })
    }
  }, [])

  const startAssessment = useCallback(
    ({ userName, domainId, levelId }) => {
      if (isDynamicDomain(domainId)) {
        lastConfigRef.current = { userName, domainId, levelId }
        generate({ userName, domainId, levelId })
      } else {
        const questions = getQuestions(domainId, levelId)
        dispatch({
          type: 'START_STATIC',
          payload: { userName, domainId, levelId, questions },
        })
      }
    },
    [generate],
  )

  // Re-run AI generation for the same config (used by the loading error retry).
  const regenerate = useCallback(() => {
    if (lastConfigRef.current) generate(lastConfigRef.current)
  }, [generate])

  const answerQuestion = useCallback(
    (questionId, optionIndex) =>
      dispatch({ type: 'ANSWER', payload: { questionId, optionIndex } }),
    [],
  )
  const goToQuestion = useCallback(
    (index) => dispatch({ type: 'GOTO', payload: index }),
    [],
  )
  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT' }), [])
  const prevQuestion = useCallback(() => dispatch({ type: 'PREV' }), [])
  const submitAssessment = useCallback(
    () => dispatch({ type: 'SUBMIT', payload: { finishedAt: Date.now() } }),
    [],
  )
  const retryAssessment = useCallback(() => dispatch({ type: 'RETRY' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])

  // Derived result summary — computed once per relevant change.
  const results = useMemo(() => {
    const { questions, answers, startedAt, finishedAt } = state
    const total = questions.length
    let correct = 0
    const breakdown = questions.map((q) => {
      const selected = answers[q.id]
      const answered = selected !== undefined
      const isCorrect = answered && selected === q.answer
      if (isCorrect) correct += 1
      return { question: q, selected, answered, isCorrect }
    })
    const incorrect = total - correct
    const percentage = total === 0 ? 0 : Math.round((correct / total) * 100)
    const passed = percentage >= PASS_THRESHOLD
    const timeTakenSec =
      startedAt && finishedAt
        ? Math.max(0, Math.round((finishedAt - startedAt) / 1000))
        : 0
    return {
      total,
      correct,
      incorrect,
      percentage,
      passed,
      breakdown,
      timeTakenSec,
    }
  }, [state])

  const value = useMemo(
    () => ({
      ...state,
      results,
      startAssessment,
      regenerate,
      answerQuestion,
      goToQuestion,
      nextQuestion,
      prevQuestion,
      submitAssessment,
      retryAssessment,
      restart,
    }),
    [
      state,
      results,
      startAssessment,
      regenerate,
      answerQuestion,
      goToQuestion,
      nextQuestion,
      prevQuestion,
      submitAssessment,
      retryAssessment,
      restart,
    ],
  )

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext)
  if (!ctx) {
    throw new Error('useAssessment must be used within an AssessmentProvider')
  }
  return ctx
}
