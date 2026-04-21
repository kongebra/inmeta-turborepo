type FormCellProps = {
  placement?: number | null
  size?: number
}

export function FormCell({ placement, size = 22 }: FormCellProps) {
  if (!placement || placement > 3) {
    return (
      <div
        style={{ width: size, height: size * 1.4 }}
        className="border border-line bg-transparent"
      />
    )
  }
  const bg = placement === 1 ? 'var(--gold)' : placement === 2 ? 'var(--silver)' : 'var(--bronze)'
  return (
    <div
      style={{ width: size, height: size * 1.4, background: bg, fontSize: Math.max(11, size * 0.55) }}
      className="grid place-items-center text-white font-display border border-line"
    >
      {placement}
    </div>
  )
}
