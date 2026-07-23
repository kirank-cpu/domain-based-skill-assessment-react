// Immersive, fully self-contained (no external assets) background used by the
// landing and auth screens: animated aurora orbs + blueprint grid + grain +
// vignette over a deep navy gradient. Purely decorative.
export default function HDBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1130] via-[#0b1024] to-[#070a18]" />
      {/* Aurora / gradient orbs */}
      <div className="animate-float-a absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-brand-600/40 blur-[120px]" />
      <div className="animate-float-b absolute -top-24 right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-indigo-600/40 blur-[120px]" />
      <div className="animate-float-c absolute bottom-[-14rem] left-1/3 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/25 blur-[130px]" />
      <div className="animate-float-a absolute bottom-[-10rem] right-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px]" />
      {/* Blueprint grid + grain + vignette */}
      <div className="hero-grid absolute inset-0" />
      <div className="hero-noise absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,6,15,0.85)_100%)]" />
    </div>
  )
}
