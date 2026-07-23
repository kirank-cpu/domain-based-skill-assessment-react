import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  generateSecurityCode,
  hashString,
  randomSalt,
  saltedHash,
} from './crypto.js'

const originalCrypto = globalThis.crypto

afterEach(() => {
  vi.restoreAllMocks()
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: originalCrypto,
  })
})

describe('hashString', () => {
  it('returns a SHA-256 hex digest when SubtleCrypto is available', async () => {
    await expect(hashString('assessment')).resolves.toBe(
      '89c08f7a02989db85066486407e81228ddadae03a30b293e5298cd050bd92db7',
    )
  })

  it('falls back to an FNV-style digest when SubtleCrypto is unavailable', async () => {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: undefined,
    })

    await expect(hashString('assessment')).resolves.toMatch(/^fnv[0-9a-f]{8}$/)
  })
})

describe('randomSalt', () => {
  it('returns two hex characters for each requested byte', () => {
    expect(randomSalt(8)).toMatch(/^[0-9a-f]{16}$/)
  })
})

describe('generateSecurityCode', () => {
  it('returns a zero-padded four digit code', () => {
    vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation((arr) => {
      arr[0] = 7
      return arr
    })

    expect(generateSecurityCode()).toBe('0007')
  })
})

describe('saltedHash', () => {
  it('hashes the salt and secret together', async () => {
    await expect(saltedHash('salt', 'secret')).resolves.toBe(
      await hashString('salt:secret'),
    )
  })
})
