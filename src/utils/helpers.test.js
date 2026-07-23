import { describe, expect, it } from 'vitest'
import {
  formatDuration,
  formatTime,
  formatTimestamp,
  optionLabel,
} from './helpers.js'

describe('formatTime', () => {
  it('formats minutes and seconds', () => {
    expect(formatTime(65)).toBe('1:05')
  })

  it('formats hours when the value is at least one hour', () => {
    expect(formatTime(3661)).toBe('1:01:01')
  })

  it('floors decimals and clamps negative values', () => {
    expect(formatTime(9.9)).toBe('0:09')
    expect(formatTime(-12)).toBe('0:00')
  })
})

describe('formatDuration', () => {
  it('uses seconds-only text for durations under one minute', () => {
    expect(formatDuration(42)).toBe('42 sec')
  })

  it('uses minute and second text for longer durations', () => {
    expect(formatDuration(125)).toBe('2 min 5 sec')
  })
})

describe('optionLabel', () => {
  it('returns alphabetical labels for answer indexes', () => {
    expect(optionLabel(0)).toBe('A')
    expect(optionLabel(3)).toBe('D')
  })
})

describe('formatTimestamp', () => {
  it('formats date values with calendar and time parts', () => {
    const timestamp = formatTimestamp(new Date('2026-07-24T09:30:00Z'))

    expect(timestamp).toContain('2026')
    expect(timestamp).toMatch(/July|Jul/)
    expect(timestamp).toMatch(/24/)
  })
})
