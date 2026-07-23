import Brand from './Brand.jsx'

// Shared app footer with the Q+ Provio wordmark.
// `variant="dark"` matches the immersive landing background.
export default function AppFooter({ variant = 'light' }) {
  const year = new Date().getFullYear()
  const dark = variant === 'dark'

  return (
    <footer
      className={
        dark
          ? 'border-t border-white/10 bg-transparent'
          : 'border-t border-slate-200 bg-white'
      }
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:text-left">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Brand size="sm" tone={dark ? 'onDark' : 'onLight'} />
          <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Multi-domain skill assessments &amp; certification.
          </p>
        </div>
        <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          © {year} Q+ Provio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
