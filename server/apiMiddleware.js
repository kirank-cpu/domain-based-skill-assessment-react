// Connect-style middleware that exposes POST /api/generate-questions.
// Reused by both the Vite dev server and the Vite preview server (see
// vite.config.js), so a single `npm run dev` / `npm run preview` serves the
// frontend AND the secure Claude endpoint from the same Node process.

import { generateQuestions } from './generateQuestions.js'

const ENDPOINT = '/api/generate-questions'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 1e6) reject(new Error('Payload too large')) // ~1MB guard
    })
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(body)
}

export function createApiMiddleware() {
  return async function claudeApiMiddleware(req, res, next) {
    // Only handle our POST endpoint; let Vite handle everything else.
    const url = (req.url || '').split('?')[0]
    if (url !== ENDPOINT) return next()
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' })
    }

    try {
      const body = await readJsonBody(req)
      const domainLabel = String(body.domainLabel || '').slice(0, 120)
      const levelLabel = String(body.levelLabel || '').slice(0, 60)
      const count = Math.min(Math.max(parseInt(body.count, 10) || 20, 1), 20)

      if (!domainLabel || !levelLabel) {
        return sendJson(res, 400, { error: 'Missing domainLabel or levelLabel' })
      }

      const questions = await generateQuestions({ domainLabel, levelLabel, count })
      sendJson(res, 200, { questions, source: 'ai' })
    } catch (err) {
      // Log server-side; return a generic message. The client falls back to a
      // local question bank so the assessment still runs.
      console.error('[generate-questions] failed:', err?.message || err)
      const status = err?.status && Number.isInteger(err.status) ? err.status : 502
      sendJson(res, status, {
        error: err?.message || 'Failed to generate questions',
      })
    }
  }
}
