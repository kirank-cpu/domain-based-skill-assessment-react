import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { saltedHash, randomSalt, generateSecurityCode } from '../utils/crypto.js'

const AuthContext = createContext(null)

const USERS_KEY = 'qplus_provio_users'
const SESSION_KEY = 'qplus_provio_session'

// ---- localStorage helpers (defensive against corrupt/blocked storage) ----
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    /* storage full or blocked — non-fatal for the demo */
  }
}

function loadSession() {
  try {
    return localStorage.getItem(SESSION_KEY) || null
  } catch {
    return null
  }
}

const norm = (s = '') => s.trim().toLowerCase()

// Public-safe view of a user record (never expose salt/hashes to the UI).
function publicUser(u) {
  if (!u) return null
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    createdAt: u.createdAt,
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers())
  const [currentUser, setCurrentUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // Restore session on mount.
  useEffect(() => {
    const sessionId = loadSession()
    if (sessionId) {
      const found = loadUsers().find((u) => u.id === sessionId)
      if (found) setCurrentUser(publicUser(found))
    }
    setInitializing(false)
  }, [])

  const persistUsers = useCallback((next) => {
    setUsers(next)
    saveUsers(next)
  }, [])

  const findByIdentifier = useCallback(
    (identifier) => {
      const id = norm(identifier)
      return users.find(
        (u) => norm(u.username) === id || norm(u.email) === id,
      )
    },
    [users],
  )

  // ---- Sign up: creates a user, returns the one-time 4-digit code ----
  const signup = useCallback(
    async ({ username, password }) => {
      const uname = username.trim()

      if (users.some((u) => norm(u.username) === norm(uname))) {
        throw new Error('That username is already taken.')
      }

      const salt = randomSalt()
      const code = generateSecurityCode()
      const [passwordHash, codeHash] = await Promise.all([
        saltedHash(salt, password),
        saltedHash(salt, code),
      ])

      const user = {
        id:
          'usr_' +
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 8),
        username: uname,
        email: '',
        salt,
        passwordHash,
        codeHash,
        createdAt: new Date().toISOString(),
      }

      persistUsers([...users, user])
      // Return the plaintext code exactly once — it is never stored in plaintext.
      return { user: publicUser(user), code }
    },
    [users, persistUsers],
  )

  // ---- Log in ----
  const login = useCallback(
    async (identifier, password) => {
      const user = findByIdentifier(identifier)
      if (!user) {
        throw new Error('No account found with those details.')
      }
      const hash = await saltedHash(user.salt, password)
      if (hash !== user.passwordHash) {
        throw new Error('Incorrect password. Please try again.')
      }
      setCurrentUser(publicUser(user))
      try {
        localStorage.setItem(SESSION_KEY, user.id)
      } catch {
        /* non-fatal */
      }
      return publicUser(user)
    },
    [findByIdentifier],
  )

  const logout = useCallback(() => {
    setCurrentUser(null)
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch {
      /* non-fatal */
    }
  }, [])

  // ---- Verify a reset code (step 1 of password recovery) ----
  const verifyResetCode = useCallback(
    async (identifier, code) => {
      const user = findByIdentifier(identifier)
      if (!user) {
        throw new Error('No account found with those details.')
      }
      const hash = await saltedHash(user.salt, code)
      if (hash !== user.codeHash) {
        throw new Error('That security code is incorrect.')
      }
      return true
    },
    [findByIdentifier],
  )

  // ---- Reset password (step 2 — re-verifies the code before writing) ----
  const resetPassword = useCallback(
    async (identifier, code, newPassword) => {
      const user = findByIdentifier(identifier)
      if (!user) {
        throw new Error('No account found with those details.')
      }
      const codeHash = await saltedHash(user.salt, code)
      if (codeHash !== user.codeHash) {
        throw new Error('That security code is incorrect.')
      }
      // Rotate the salt on password change for good measure.
      const salt = randomSalt()
      const passwordHash = await saltedHash(salt, newPassword)
      const nextCodeHash = await saltedHash(salt, code)
      const next = users.map((u) =>
        u.id === user.id ? { ...u, salt, passwordHash, codeHash: nextCodeHash } : u,
      )
      persistUsers(next)
      return true
    },
    [findByIdentifier, users, persistUsers],
  )

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      initializing,
      userCount: users.length,
      signup,
      login,
      logout,
      verifyResetCode,
      resetPassword,
    }),
    [
      currentUser,
      initializing,
      users.length,
      signup,
      login,
      logout,
      verifyResetCode,
      resetPassword,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
