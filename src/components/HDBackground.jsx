import { Cog, RefreshCw, Server, Database, Workflow } from 'lucide-react'

// Fully self-contained (no external assets, CSP-safe) motion-graphics background:
// deep navy/charcoal gradients, aurora glow, and translucent floating engineering
// motifs (gears, testing loops, server arrays, data pipelines) with depth-of-field.
// Loops seamlessly; purely decorative. Shared by the landing, auth, and
// generation screens.

export default function HDBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#05070f]">
      {/* Base navy → charcoal gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1130] via-[#0b1022] to-[#06080f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(37,99,235,0.22),transparent_60%)]" />

      {/* Aurora / gradient orbs (cinematic glow, shallow depth) */}
      <div className="animate-float-a absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-cyan-500/25 blur-[130px]" />
      <div className="animate-float-b absolute -top-24 right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-indigo-600/30 blur-[130px]" />
      <div className="animate-float-c absolute bottom-[-14rem] left-1/3 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/22 blur-[140px]" />
      <div className="animate-float-a absolute bottom-[-10rem] right-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[130px]" />

      {/* Translucent floating engineering motifs (depth of field) */}
      <div className="absolute left-[6%] top-[14%] text-cyan-300/[0.07] blur-[1px] animate-drift-a">
        <Cog className="animate-spin-cw h-40 w-40" strokeWidth={1} />
      </div>
      <div className="absolute left-[15%] top-[26%] text-violet-300/[0.06] blur-[1px] animate-drift-b">
        <Cog className="animate-spin-ccw h-24 w-24" strokeWidth={1} />
      </div>
      <div className="absolute bottom-[12%] left-[9%] text-fuchsia-300/[0.06] blur-[1px] animate-drift-b">
        <RefreshCw className="animate-spin-ccw h-32 w-32" strokeWidth={1} />
      </div>
      <div className="absolute bottom-[10%] right-[8%] text-cyan-300/[0.06] blur-[1.5px] animate-drift-a">
        <Server className="h-36 w-36" strokeWidth={1} />
      </div>
      <div className="absolute right-[12%] top-[16%] text-indigo-300/[0.06] blur-[1.5px] animate-drift-b">
        <Database className="h-28 w-28" strokeWidth={1} />
      </div>
      <div className="absolute right-[30%] top-[8%] text-violet-300/[0.05] blur-[2px] animate-drift-a">
        <Workflow className="h-24 w-24" strokeWidth={1} />
      </div>

      {/* Blueprint grid + film grain + vignette */}
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="hero-noise absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,6,15,0.9)_100%)]" />
    </div>
  )
}
