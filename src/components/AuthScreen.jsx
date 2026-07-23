import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Brand from './Brand.jsx'
import HDBackground from './HDBackground.jsx'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Gauge,
  KeyRound,
  Layers3,
  Loader2,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'

const MIN_PASSWORD = 8

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
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-100">
        {label}
      </label>
      <div className="relative">
        {FieldIcon && (
          <FieldIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-cyan-200/70" />
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
          className={`h-12 w-full rounded-lg border bg-slate-950/50 py-3 text-white placeholder-slate-500 outline-none transition focus:bg-slate-950/70 focus:ring-4 ${
            FieldIcon ? 'pl-11' : 'pl-3.5'
          } ${isPassword ? 'pr-11' : 'pr-3.5'} ${
            error
              ? 'border-rose-400/60 focus:border-rose-300 focus:ring-rose-500/20'
              : 'border-white/15 focus:border-cyan-300/80 focus:ring-cyan-400/15'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        )}
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-300"
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
      className="flex items-start gap-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100"
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
      className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-500 px-6 text-base font-bold text-white shadow-xl shadow-brand-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Please wait...
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

function strengthOf(pw) {
  let score = 0
  if (pw.length >= MIN_PASSWORD) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
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
      {meta.label && <p className="mt-1 text-xs text-slate-400">Strength: {meta.label}</p>}
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!username.trim()) e.username = 'Enter your username.'
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
      await login(username, password)
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
        id="login-username"
        label="Username"
        icon={User}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        autoComplete="username"
        placeholder="jordan_rivera"
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
        placeholder="Enter your password"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSwitch('forgot')}
          className="text-sm font-semibold text-cyan-200 transition hover:text-white"
        >
          Forgot password?
        </button>
      </div>
      <SubmitButton loading={loading}>Log In</SubmitButton>
      <p className="text-center text-sm text-slate-400">
        New to Q+ Provio?{' '}
        <button
          type="button"
          onClick={() => onSwitch('signup')}
          className="font-semibold text-cyan-200 transition hover:text-white"
        >
          Create account
        </button>
      </p>
    </form>
  )
}

function SignupForm({ onSwitch }) {
  const { signup, login } = useAuth()
  const [form, setForm] = useState({
    username: '',
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
    if (form.username.trim().length < 3) {
      e.username = 'Username must be at least 3 characters.'
    }
    if (form.password.length < MIN_PASSWORD) {
      e.password = `Password must be at least ${MIN_PASSWORD} characters.`
    }
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.'
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
      /* clipboard unavailable - user can read the code manually */
    }
  }

  if (code) {
    return (
      <div className="animate-fade-up space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/15 text-emerald-200">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Account created</h3>
          <p className="mt-1 text-sm text-slate-400">
            Save this security code before continuing.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/45 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-100/70">
            4-digit recovery code
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="flex gap-2">
              {code.split('').map((digit, i) => (
                <span
                  key={i}
                  className="flex h-14 w-11 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10 text-3xl font-extrabold tabular-nums text-white"
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
              {copied ? <Check className="h-5 w-5 text-emerald-300" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 text-left">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
          <p className="text-sm text-amber-50">
            <strong className="font-semibold">Store this code safely.</strong> It is
            shown only once and is required to reset your password.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-sm text-slate-200">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-cyan-400"
          />
          I have safely saved my security code.
        </label>

        <FormError message={formError} />

        <button
          type="button"
          disabled={!ack || loading}
          onClick={handleContinue}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-500 px-6 text-base font-bold text-white shadow-xl shadow-brand-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Please wait...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    )
  }

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
          placeholder="Create a strong password"
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
        placeholder="Re-enter your password"
      />
      <SubmitButton loading={loading}>Create Account</SubmitButton>
      <p className="text-center text-sm text-slate-400">
        Already registered?{' '}
        <button
          type="button"
          onClick={() => onSwitch('login')}
          className="font-semibold text-cyan-200 transition hover:text-white"
        >
          Log in
        </button>
      </p>
    </form>
  )
}

function ForgotForm({ onSwitch }) {
  const { verifyResetCode, resetPassword } = useAuth()
  const [step, setStep] = useState('verify')
  const [username, setUsername] = useState('')
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
    if (!username.trim()) e.username = 'Enter your username.'
    if (!/^\d{4}$/.test(code)) e.code = 'Enter the 4-digit code.'
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      await verifyResetCode(username, code)
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
    if (password.length < MIN_PASSWORD) {
      e.password = `Password must be at least ${MIN_PASSWORD} characters.`
    }
    if (confirm !== password) e.confirm = 'Passwords do not match.'
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      await resetPassword(username, code, password)
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/15 text-emerald-200">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Password updated</h3>
          <p className="mt-1 text-sm text-slate-400">
            You can now log in with your username and new password.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSwitch('login')}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-500 px-6 text-base font-bold text-white shadow-xl shadow-brand-600/30 transition hover:brightness-110"
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
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
            step === 'verify'
              ? 'bg-cyan-300/15 text-cyan-100'
              : 'bg-emerald-400/15 text-emerald-200'
          }`}
        >
          {step === 'verify' ? <KeyRound className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          Verify code
        </span>
        <span className="h-px w-4 bg-white/15" />
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
            step === 'reset' ? 'bg-cyan-300/15 text-cyan-100' : 'bg-white/5'
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
            Use your username and the 4-digit security code saved during signup.
          </p>
          <Field
            id="forgot-username"
            label="Username"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            autoComplete="username"
            placeholder="jordan_rivera"
          />
          <Field
            id="forgot-code"
            label="4-Digit Security Code"
            icon={KeyRound}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
            error={errors.code}
            inputMode="numeric"
            maxLength={4}
            placeholder="1234"
          />
          <SubmitButton loading={loading}>Verify Code</SubmitButton>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-4 py-2.5 text-sm text-emerald-100">
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
              placeholder="Create a strong password"
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
            placeholder="Re-enter your password"
          />
          <SubmitButton loading={loading}>Update Password</SubmitButton>
        </>
      )}

      <button
        type="button"
        onClick={() => onSwitch('login')}
        className="flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>
    </form>
  )
}

function ExperiencePanel() {
  const items = [
    { icon: Gauge, label: 'Adaptive assessments', value: 'Timed domain tracks' },
    { icon: BadgeCheck, label: 'Certificate ready', value: 'Pass mark: 80%' },
    { icon: Layers3, label: 'Multi-domain', value: 'QA, Azure, CI/CD and more' },
  ]

  return (
    <section className="relative hidden min-h-[620px] overflow-hidden border-r border-white/10 bg-slate-950/35 p-8 lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_78%_12%,rgba(99,102,241,0.22),transparent_35%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <Brand size="lg" tone="onDark" />
          <p className="mt-5 max-w-sm text-lg leading-8 text-slate-300">
            Practice under realistic time pressure, review every answer, and earn a
            polished certificate when you clear the benchmark.
          </p>
        </div>

        <div className="space-y-3">
          {items.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-300/12 text-cyan-100">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white">{label}</span>
                <span className="text-sm text-slate-400">{value}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-100">
            <Sparkles className="h-4.5 w-4.5" />
            Every domain includes AI-generated question sets.
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AuthScreen() {
  const [view, setView] = useState('login')

  const titles = {
    login: {
      title: 'Welcome back',
      sub: 'Pick up your assessment progress with your username.',
    },
    signup: {
      title: 'Create your account',
      sub: 'No email needed. Choose a username and secure password.',
    },
    forgot: {
      title: 'Reset password',
      sub: 'Recover access with your username and security code.',
    },
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <HDBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/45 backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <ExperiencePanel />

            <main className="flex min-h-[620px] flex-col justify-center p-5 sm:p-8">
              <div className="mb-7 lg:hidden">
                <Brand size="md" tone="onDark" />
                <p className="mt-2 text-sm text-slate-400">
                  Multi-domain skill assessment and certification
                </p>
              </div>

              {view !== 'forgot' && (
                <div
                  role="tablist"
                  aria-label="Authentication mode"
                  className="mb-7 grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-slate-950/45 p-1"
                >
                  {[
                    { id: 'login', label: 'Log In' },
                    { id: 'signup', label: 'Sign Up' },
                  ].map((tab) => {
                    const active = view === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setView(tab.id)}
                        className={`h-10 rounded-md px-4 text-sm font-bold transition ${
                          active
                            ? 'bg-white text-brand-700 shadow-sm'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="mb-6">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100/70">
                  <ShieldCheck className="h-4 w-4" />
                  Secure demo access
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  {titles[view].title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">{titles[view].sub}</p>
              </div>

              <div key={view} className="animate-fade-up">
                {view === 'login' && <LoginForm onSwitch={setView} />}
                {view === 'signup' && <SignupForm onSwitch={setView} />}
                {view === 'forgot' && <ForgotForm onSwitch={setView} />}
              </div>

              <p className="mt-7 flex items-start justify-center gap-1.5 text-center text-xs leading-5 text-slate-500">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Credentials are salted, hashed and stored only in your browser.
              </p>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
