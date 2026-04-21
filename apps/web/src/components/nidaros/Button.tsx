import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

const variants = {
  primary: 'bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-[var(--accent-alt)]',
  ghost: 'bg-transparent text-[var(--ink-dim)] border border-[var(--line)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
  danger: 'bg-[var(--warn)] text-white hover:opacity-90',
}

const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base' }

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded font-body font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
