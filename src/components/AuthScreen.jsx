import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Brand from './Brand.jsx'
import HDBackground from './HDBackground.jsx'
import {
  Mail,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
} from 'lucide-react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 8

// ---------------------------------------------------------------------------
// Reusable accessible field
// ---------------------------------------------------------------------------
function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  icon: FieldIcon,
  autoComplete,
  placeholder,
  inputMode,
  maxLength,
  hint,
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const actualType = isPassword && show ? 'text' : type

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        {FieldIcon && (
          <FieldIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
        )}
        <input
          id={id}
          name={id}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`w-full rounded-xl border bg-white/5 py-2.5 text-white placeholder-slate-500 outline-none transition focus:bg-white/10 focus:ring-4 ${
            FieldIcon ? 'pl-10' : 'pl-3.5'
          } ${isPassword ? 'pr-11' : 'pr-3.5'} ${
            error
              ? 'border-rose-500/50 focus:border-rose-400 focus:ring-rose-500/20'
              : 'border-white/15 focus:border-brand-400 focus:ring-brand-500/20'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:text-slate-200"
          >
            {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        )}
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-300"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

function FormError({ message }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200"
    >
      <ShieldAlert className="mt-0.5 h-4.5 w-4.5 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-brand-600/40 transition-all hover:from-brand-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Please wait…
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  )
}

// Lightweight password strength meter (visual guidance only).
function strengthOf(pw) {
  let score = 0
  if (pw.length >= MIN_PASSWORD) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score // 0–4
}
const STRENGTH = [
  { label: '', color: '' },
  { label: 'Weak', color: 'bg-rose-500' },
  { label: 'Fair', color: 'bg-amber-500' },
  { label: 'Good', color: 'bg-lime-500' },
  { label: 'Strong', color: 'bg-emerald-500' },
]

function StrengthMeter({ password }) {
  if (!password) return null
  const score = strengthOf(password)
  const meta = STRENGTH[score]
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= score ? meta.color : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      {meta.label && (
        <p className="mt-1 text-xs text-slate-400">Strength: {meta.label}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
function LoginForm({ onSwitch }) {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!identifier.trim()) e.identifier = 'Enter your username or email.'
    if (!password) e.password = 'Enter your password.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setFormError('')
    if (!validate()) return
    setLoading(true)
    try {
      await login(identifier, password)
      // Success: AuthProvider sets the session and the app re-renders.
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormError message={formError} />
      <Field
        id="login-identifier"
        label="Username or Email"
        icon={User}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={errors.identifier}
        autoComplete="username"
        placeholder="you@example.com"
      />
      <Field
        id="login-password"
        label="Password"
        type="password"
        icon={Lock}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="current-password"
        placeholder="••••••••"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSwitch('forgot')}
          className="text-sm font-medium text-brand-300 transition hover:text-brand-200"
        >
          Forgot password?
        </button>
      </div>
      <SubmitButton loading={loading}>Log In</SubmitButton>
      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitch('signup')}
          className="font-semibold text-brand-300 transition hover:text-brand-200"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Signup
// ---------------------------------------------------------------------------
function SignupForm({ onSwitch }) {
  const { signup, login } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(null)
  const [ack, setAck] = useState(false)
  const [copied, setCopied] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (form.username.trim().length < 3)
      e.username = 'Username must be at least 3 characters.'
    if (!EMAIL_RE.test(form.email.trim()))
      e.email = 'Enter a valid email address.'
    if (form.password.length < MIN_PASSWORD)
      e.password = `Password must be at least ${MIN_PASSWORD} characters.`
    if (form.confirm !== form.password)
      e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setFormError('')
    if (!validate()) return
    setLoading(true)
    try {
      const { code: newCode } = await signup({
        username: form.username,
        email: form.email,
        password: form.password,
      })
      setCode(newCode)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    setLoading(true)
    try {
      await login(form.username, form.password)
    } catch (err) {
      setFormError(err.message)
      setLoading(false)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — user can read the code manually */
    }
  }

  // ---- Success: show the one-time security code ----
  if (code) {
    return (
      <div className="animate-fade-up space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Account created!</h3>
          <p className="mt-1 text-sm text-slate-400">
            Here is your security code — you&apos;ll need it to reset your password.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Your 4-digit security code
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="flex gap-2">
              {code.split('').map((digit, i) => (
                <span
                  key={i}
                  className="flex h-14 w-11 items-center justify-center rounded-xl border border-brand-400/40 bg-brand-500/10 text-3xl font-extrabold tabular-nums text-white"
                >
                  {digit}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={copyCode}
              aria-label="Copy security code"
              className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10"
            >
              {copied ? (
                <Check className="h-5 w-5 text-emerald-400" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Prominent warning */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-left">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <p className="text-sm text-amber-100">
            <strong className="font-semibold">Store this code somewhere safe.</strong>{' '}
            It is shown <strong>only once</strong> and is strictly required to reset
            your password. We cannot recover it for you if it is lost.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-left text-sm text-slate-200">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-500"
          />
          I have safely saved my 4-digit security code.
        </label>

        <FormError message={formError} />

        <button
          type="button"
          disabled={!ack || loading}
          onClick={handleContinue}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-brand-600/40 transition-all hover:from-brand-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Please wait…
            </>
          ) : (
            <>
              Continue to Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    )
  }

  // ---- Signup form ----
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormError message={formError} />
      <Field
        id="signup-username"
        label="Username"
        icon={User}
        value={form.username}
        onChange={set('username')}
        error={errors.username}
        autoComplete="username"
        placeholder="jordan_rivera"
      />
      <Field
        id="signup-email"
        label="Email"
        type="email"
        icon={Mail}
        value={form.email}
        onChange={set('email')}
        error={errors.email}
        autoComplete="email"
        placeholder="you@example.com"
      />
      <div>
        <Field
          id="signup-password"
          label="Password"
          type="password"
          icon={Lock}
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete="new-password"
          placeholder="••••••••"
          hint={`At least ${MIN_PASSWORD} characters.`}
        />
        <StrengthMeter password={form.password} />
      </div>
      <Field
        id="signup-confirm"
        label="Confirm Password"
        type="password"
        icon={Lock}
        value={form.confirm}
        onChange={set('confirm')}
        error={errors.confirm}
        autoComplete="new-password"
        placeholder="••••••••"
      />
      <SubmitButton loading={loading}>Create Account</SubmitButton>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitch('login')}
          className="font-semibold text-brand-300 transition hover:text-brand-200"
        >
          Log in
        </button>
      </p>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Forgot / Reset password (two steps: verify code → set new password)
// ---------------------------------------------------------------------------
function ForgotForm({ onSwitch }) {
  const { verifyResetCode, resetPassword } = useAuth()
  const [step, setStep] = useState('verify') // 'verify' | 'reset' | 'done'
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (ev) => {
    ev.preventDefault()
    setFormError('')
    const e = {}
    if (!identifier.trim()) e.identifier = 'Enter your username or email.'
    if (!/^\d{4}$/.test(code)) e.code = 'Enter the 4-digit code.'
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      await verifyResetCode(identifier, code)
      setStep('reset')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (ev) => {
    ev.preventDefault()
    setFormError('')
    const e = {}
    if (password.length < MIN_PASSWORD)
      e.password = `Password must be at least ${MIN_PASSWORD} characters.`
    if (confirm !== password) e.confirm = 'Passwords do not match.'
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      await resetPassword(identifier, code, password)
      setStep('done')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="animate-fade-up space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Password updated</h3>
          <p className="mt-1 text-sm text-slate-400">
            You can now log in with your new password.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSwitch('login')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-brand-600/40 transition-all hover:from-brand-400 hover:to-indigo-400"
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={step === 'verify' ? handleVerify : handleReset}
      noValidate
      className="space-y-4"
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
            step === 'verify'
              ? 'bg-brand-500/20 text-brand-200'
              : 'bg-emerald-500/15 text-emerald-300'
          }`}
        >
          {step === 'verify' ? (
            <KeyRound className="h-3.5 w-3.5" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          Verify code
        </span>
        <span className="h-px w-4 bg-white/15" />
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
            step === 'reset' ? 'bg-brand-500/20 text-brand-200' : 'bg-white/5'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          New password
        </span>
      </div>

      <FormError message={formError} />

      {step === 'verify' ? (
        <>
          <p className="text-sm text-slate-400">
            Enter your account details and the 4-digit security code you saved when
            you signed up.
          </p>
          <Field
            id="forgot-identifier"
            label="Username or Email"
            icon={User}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier}
            autoComplete="username"
            placeholder="you@example.com"
          />
          <Field
            id="forgot-code"
            label="4-Digit Security Code"
            icon={KeyRound}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 4))
            }
            error={errors.code}
            inputMode="numeric"
            maxLength={4}
            placeholder="1234"
          />
          <SubmitButton loading={loading}>Verify Code</SubmitButton>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-200">
            <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
            Code verified. Choose a new password.
          </div>
          <div>
            <Field
              id="reset-password"
              label="New Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
              placeholder="••••••••"
              hint={`At least ${MIN_PASSWORD} characters.`}
            />
            <StrengthMeter password={password} />
          </div>
          <Field
            id="reset-confirm"
            label="Confirm New Password"
            type="password"
            icon={Lock}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <SubmitButton loading={loading}>Update Password</SubmitButton>
        </>
      )}

      <button
        type="button"
        onClick={() => onSwitch('login')}
        className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Shell: brand, tab toggle, active view
// ---------------------------------------------------------------------------
export default function AuthScreen() {
  const [view, setView] = useState('login') // 'login' | 'signup' | 'forgot'

  const titles = {
    login: { title: 'Welcome back', sub: 'Log in to continue your assessments.' },
    signup: { title: 'Create your account', sub: 'Start earning skill certificates.' },
    forgot: { title: 'Reset password', sub: 'Recover access with your security code.' },
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#080c1c] text-white">
      <HDBackground />

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <Brand size="lg" tone="onDark" />
            <p className="text-sm text-slate-400">
              Multi-domain skill assessment &amp; certification
            </p>
          </div>

          {/* Card */}
          <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            {/* Tab toggle (hidden on the forgot flow) */}
            {view !== 'forgot' && (
              <div
                role="tablist"
                aria-label="Authentication mode"
                className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1"
              >
                {[
                  { id: 'login', label: 'Log In' },
                  { id: 'signup', label: 'Sign Up' },
                ].map((t) => {
                  const active = view === t.id
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setView(t.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                        active
                          ? 'bg-gradient-to-r from-brand-500 to-indigo-500 text-white shadow-md shadow-brand-600/30'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Heading */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">{titles[view].title}</h2>
              <p className="text-sm text-slate-400">{titles[view].sub}</p>
            </div>

            {/* Active view (keyed so local state resets on switch + animates) */}
            <div key={view} className="animate-fade-up">
              {view === 'login' && <LoginForm onSwitch={setView} />}
              {view === 'signup' && <SignupForm onSwitch={setView} />}
              {view === 'forgot' && <ForgotForm onSwitch={setView} />}
            </div>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Demo auth — credentials are salted, hashed &amp; stored only in your
            browser.
          </p>
        </div>
      </div>
    </div>
  )
}
