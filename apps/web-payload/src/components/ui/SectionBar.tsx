import type { ReactNode } from 'react'

type SectionBarProps = {
  num?: number | string
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionBar({ num, title, subtitle, action }: SectionBarProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-ink text-bg border-b-2 border-accent">
      {num != null && (
        <div className="min-w-8 h-8 px-2.5 bg-accent text-accent-ink grid place-items-center font-display text-base">
          {num}
        </div>
      )}
      <div className="flex-1">
        {subtitle && <div className="font-mono text-[13px] text-accent">{subtitle}</div>}
        <div className="font-display text-xl mt-0.5">{title}</div>
      </div>
      {action}
    </div>
  )
}
