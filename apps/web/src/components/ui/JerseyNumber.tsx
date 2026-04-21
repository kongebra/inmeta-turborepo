type JerseyNumberProps = {
  n: number | string
  size?: number
  highlight?: boolean
}

export function JerseyNumber({ n, size = 40, highlight }: JerseyNumberProps) {
  return (
    <div
      style={{ minWidth: size, height: size, padding: '0 8px', fontSize: Math.max(13, size * 0.5) }}
      className={`
        grid place-items-center border-2 font-display font-num
        ${highlight
          ? 'bg-accent text-accent-ink border-accent'
          : 'bg-transparent text-ink border-line'
        }
      `}
    >
      {n}
    </div>
  )
}
