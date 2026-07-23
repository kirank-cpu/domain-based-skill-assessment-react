// Server-side Claude call that generates a unique assessment.
// Runs only in the Node process (Vite dev/preview middleware) — the API key is
// read from the environment here and NEVER reaches the browser bundle.
//
// Uses the official Anthropic SDK with structured outputs (output_config.format)
// so the model returns a strictly-shaped JSON object, plus adaptive thinking for
// higher-quality, non-repetitive questions. Streams to avoid HTTP timeouts.

import Anthropic from '@anthropic-ai/sdk'

// Defaults to Claude Opus 4.8; override with ASSESSMENT_MODEL (e.g. claude-sonnet-5
// for faster/cheaper generation).
const MODEL = process.env.ASSESSMENT_MODEL || 'claude-opus-4-8'

// JSON schema for structured output. (Structured-output schemas don't support
// array length/`minItems` constraints, so the exact count of 20 is requested in
// the prompt and enforced in application code.)
const QUESTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          question: { type: 'string' },
          type: { type: 'string', enum: ['mcq', 'scenario'] },
          options: { type: 'array', items: { type: 'string' } },
          answer: { type: 'integer', enum: [0, 1, 2, 3] },
          explanation: { type: 'string' },
        },
        required: ['question', 'type', 'options', 'answer', 'explanation'],
      },
    },
  },
  required: ['questions'],
}

const SYSTEM_PROMPT = `You are an expert technical assessment author who writes high-quality skill-certification questions. You produce precise, unambiguous, industry-accurate multiple-choice and scenario-based questions, each with exactly four options, one correct answer, and a concise explanation of why it is correct.`

function buildUserPrompt({ domainLabel, levelLabel, count }) {
  return `Generate exactly ${count} unique, non-repetitive assessment questions for a "${domainLabel}" skills assessment at the "${levelLabel}" difficulty level.

Requirements:
- Exactly ${count} questions. No duplicates or near-duplicates — vary the subtopics broadly.
- Mix multiple-choice ("mcq") and applied "scenario" questions (roughly 60% mcq, 40% scenario).
- Each question must have exactly 4 answer options that are plausible and distinct.
- Exactly one option is correct; "answer" is its 0-based index (0-3).
- Calibrate difficulty to "${levelLabel}": Beginner = core concepts/commands; Intermediate = applied workflows and real usage; Complex/Expert = architecture, security, trade-offs, and troubleshooting.
- Keep each question self-contained; put any code inside the question text.
- "explanation" briefly states why the correct option is right (1-2 sentences).

Return only the structured object with the "questions" array.`
}

export async function generateQuestions({ domainLabel, levelLabel, count = 20 }) {
  // Zero-arg client resolves credentials from the environment
  // (ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, or an `ant auth login` profile).
  const client = new Anthropic()

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', schema: QUESTION_SCHEMA },
    },
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: buildUserPrompt({ domainLabel, levelLabel, count }) },
    ],
  })

  const message = await stream.finalMessage()

  if (message.stop_reason === 'refusal') {
    throw new Error('The model declined to generate this assessment.')
  }

  const textBlock = message.content.find((b) => b.type === 'text')
  if (!textBlock || !textBlock.text) {
    throw new Error('No content returned from the model.')
  }

  let parsed
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    throw new Error('Model returned malformed JSON.')
  }

  const questions = Array.isArray(parsed?.questions) ? parsed.questions : []

  // Basic server-side validation; the client normalizes and enforces the count.
  const valid = questions.filter(
    (q) =>
      q &&
      typeof q.question === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      Number.isInteger(q.answer) &&
      q.answer >= 0 &&
      q.answer < 4 &&
      typeof q.explanation === 'string',
  )

  if (valid.length === 0) {
    throw new Error('Model returned no valid questions.')
  }

  return valid
}
