// Lightweight, security-conscious helpers for the mock auth layer.
//
// NOTE: This is a client-only demo. Passwords and security codes are salted and
// hashed with SHA-256 (via the Web Crypto API) before being written to
// localStorage — so plaintext is never persisted — but true credential security
// requires a server with a slow password hash (bcrypt/argon2/scrypt). Treat this
// module as a demonstration of the right *shape*, not production-grade security.

// Async SHA-256 hex digest, with a non-crypto fallback if SubtleCrypto is
// unavailable (e.g. insecure http context) so the app never hard-fails.
export async function hashString(input) {
  try {
    if (globalThis.crypto?.subtle) {
      const data = new TextEncoder().encode(input)
      const buf = await globalThis.crypto.subtle.digest('SHA-256', data)
      return [...new Uint8Array(buf)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    }
  } catch {
    /* fall through to non-crypto fallback */
  }
  // FNV-1a fallback (NOT cryptographically secure — last resort only).
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return 'fnv' + (h >>> 0).toString(16).padStart(8, '0')
}

// Random hex salt (16 bytes by default).
export function randomSalt(bytes = 16) {
  const arr = new Uint8Array(bytes)
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(arr)
  } else {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256)
  }
  return [...arr].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Cryptographically-random, uniform 4-digit code ("0000"–"9999").
export function generateSecurityCode() {
  if (globalThis.crypto?.getRandomValues) {
    // Rejection sampling to avoid modulo bias across the 0–9999 range.
    const max = Math.floor(0xffffffff / 10000) * 10000
    const arr = new Uint32Array(1)
    let v
    do {
      globalThis.crypto.getRandomValues(arr)
      v = arr[0]
    } while (v >= max)
    return String(v % 10000).padStart(4, '0')
  }
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0')
}

// Convenience: salted hash of a secret.
export function saltedHash(salt, secret) {
  return hashString(`${salt}:${secret}`)
}
