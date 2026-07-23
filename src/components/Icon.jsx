import {
  ShieldCheck,
  DatabaseZap,
  Bot,
  Code2,
  GitBranch,
  Sprout,
  Gauge,
  Flame,
  Circle,
} from 'lucide-react'

// Registry of icons referenced by name in the data files. Importing them
// explicitly (instead of `import * as Icons`) keeps the bundle small by
// letting the tree-shaker drop the rest of lucide-react.
const REGISTRY = {
  ShieldCheck,
  DatabaseZap,
  Bot,
  Code2,
  GitBranch,
  Sprout,
  Gauge,
  Flame,
}

// Resolves a lucide-react icon by its string name (from data files).
// Falls back to a neutral circle icon if the name is unknown.
export default function Icon({ name, ...props }) {
  const LucideIcon = REGISTRY[name] ?? Circle
  return <LucideIcon {...props} />
}
