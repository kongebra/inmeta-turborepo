import type { ReactNode } from 'react'

type ChipTone = 'default' | 'accent' | 'outline' | 'ink' | 'ghost'

type ChipProps = {
  children: ReactNode
  tone?: ChipTone
  className?: string
}

const STYLES: Record<ChipTone, string> = {
  default: 'bg-surface-alt text-ink border-line',
  accent:  'bg-accent text-accent-ink border-accent',
  outline: 'bg-transparent text-accent border-accent',
  ink:     'bg-ink text-bg border-ink',
  ghost:   'bg-transparent text-ink-dim border-line',
}

export function Chip({ children, tone = 'default', className = '' }: ChipProps) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 border
      font-mono text-[13px] font-semibold
      ${STYLES[tone]} ${className}
    `}>
      {children}
    </span>
  )
}
