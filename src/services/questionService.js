// Frontend service: requests a dynamically-generated assessment from the secure
// backend endpoint (POST /api/generate-questions). The Claude API key lives only
// on the server — this module never sees it.
//
// Throws on any failure so the caller (AssessmentContext) can fall back to the
// local question bank.

function normalizeQuestion(q, index) {
  if (!q || typeof q.question !== 'string') return null
  const options = Array.isArray(q.options)
    ? q.options.map((o) => String(o)).filter(Boolean)
    : []
  if (options.length < 4) return null

  const answer = Number(q.answer)
  if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
    return null
  }

  const type = q.type === 'scenario' ? 'scenario' : 'mcq'

  return {
    id: `ai-${index}`,
    type,
    question: q.question.trim(),
    options: options.slice(0, 4),
    answer,
    explanation:
      typeof q.explanation === 'string' && q.explanation.trim()
        ? q.explanation.trim()
        : 'No explanation provided.',
  }
}

export async function generateQuestions({ domainLabel, levelLabel, levelId, count }) {
  const res = await fetch('/api/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domainLabel, levelLabel, levelId, count }),
  })

  if (!res.ok) {
    let message = `Generation request failed (${res.status})`
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message)
  }

  const data = await res.json()
  const raw = Array.isArray(data?.questions) ? data.questions : []
  const normalized = raw.map(normalizeQuestion).filter(Boolean)

  if (normalized.length === 0) {
    throw new Error('No valid questions were returned.')
  }
  return normalized
}
