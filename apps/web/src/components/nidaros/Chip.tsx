interface ChipProps {
  label: string
  variant?: 'default' | 'accent' | 'gold' | 'silver' | 'bronze'
}

const variants = {
  default: 'bg-[var(--surface-alt)] text-[var(--ink-dim)] border-[var(--line)]',
  accent: 'bg-[var(--accent)] text-[var(--accent-ink)] border-transparent',
  gold: 'bg-[var(--gold)] text-black border-transparent',
  silver: 'bg-[var(--silver)] text-black border-transparent',
  bronze: 'bg-[var(--bronze)] text-white border-transparent',
}

export function Chip({ label, variant = 'default' }: ChipProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border font-mono-upper text-[11px] ${variants[variant]}`}>
      {label}
    </span>
  )
}
