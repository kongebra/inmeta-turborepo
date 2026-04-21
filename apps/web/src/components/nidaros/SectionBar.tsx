interface SectionBarProps {
  label: string
  action?: React.ReactNode
}

export function SectionBar({ label, action }: SectionBarProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--line)] mb-4">
      <span className="font-mono-upper text-[var(--ink-muted)]">{label}</span>
      {action}
    </div>
  )
}
