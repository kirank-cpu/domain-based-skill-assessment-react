// Unified fallback registry — one 20-per-level mock bank per domain, used when
// the Claude API is unavailable so every domain can still serve a strict
// 20-question assessment offline.

import { GITHUB_FALLBACK } from '../githubFallback.js'
import { QA_FALLBACK } from './qaFallback.js'
import { AZURE_FALLBACK } from './azureFallback.js'
import { AUTOMATION_FALLBACK } from './automationFallback.js'
import { PLAYWRIGHT_FALLBACK } from './playwrightFallback.js'
import { SWE_FALLBACK } from './sweFallback.js'

// Keyed by domain id (see src/data/domains.js).
export const FALLBACK_BANKS = {
  qa: QA_FALLBACK,
  'azure-data': AZURE_FALLBACK,
  'automation-qa': AUTOMATION_FALLBACK,
  'playwright-automation': PLAYWRIGHT_FALLBACK,
  'general-swe': SWE_FALLBACK,
  'github-cicd': GITHUB_FALLBACK,
}

// Returns up to `count` distinct fallback questions for a domain/level, shuffled.
export function getFallbackQuestions(domainId, levelId, count = 20) {
  const pool = FALLBACK_BANKS[domainId]?.[levelId] ?? []
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}
