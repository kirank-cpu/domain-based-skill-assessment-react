// Reusable "Q+ Provio" wordmark / logo.
// The badge renders the "Q+" mark; the wordmark renders "Provio" — together
// they read as "Q+ Provio". Use `tone="onDark"` over dark backgrounds.

const SIZES = {
  sm: { badge: 'h-8 w-8 text-sm rounded-lg', word: 'text-lg', gap: 'gap-2' },
  md: { badge: 'h-10 w-10 text-base rounded-xl', word: 'text-xl', gap: 'gap-2.5' },
  lg: { badge: 'h-14 w-14 text-2xl rounded-2xl', word: 'text-3xl sm:text-4xl', gap: 'gap-3' },
}

export default function Brand({ size = 'md', tone = 'onLight', className = '' }) {
  const s = SIZES[size] ?? SIZES.md
  const onDark = tone === 'onDark'

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center font-extrabold tracking-tight shadow-sm ${s.badge} ${
          onDark
            ? 'bg-white text-brand-700'
            : 'bg-gradient-to-br from-brand-600 to-indigo-700 text-white'
        }`}
      >
        Q+
      </span>
      <span
        className={`font-extrabold tracking-tight ${s.word} ${
          onDark ? 'text-white' : 'text-slate-900'
        }`}
      >
        Provio
      </span>
    </span>
  )
}
