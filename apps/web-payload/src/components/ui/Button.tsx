'use client'

import type { ReactNode } from 'react'

type ButtonTone = 'accent' | 'ink' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  tone?: ButtonTone
  size?: ButtonSize
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

const TONE_STYLES: Record<ButtonTone, string> = {
  accent: 'bg-accent text-accent-ink border-accent hover:opacity-90',
  ink:    'bg-ink text-bg border-ink hover:opacity-90',
  ghost:  'bg-transparent text-ink border-line hover:border-ink',
}

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-3 text-[14px]',
  lg: 'px-6 py-3.5 text-[16px]',
}

export function Button({ children, tone = 'accent', size = 'md', onClick, type = 'button', className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 border
        font-display tracking-wider uppercase
        transition-all duration-150 cursor-pointer
        ${TONE_STYLES[tone]} ${SIZE_STYLES[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}
