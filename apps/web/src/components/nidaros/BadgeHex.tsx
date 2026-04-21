const rarityColors = {
  COMMON: 'text-[var(--ink-muted)]',
  UNCOMMON: 'text-[var(--accent)]',
  RARE: 'text-[var(--gold)]',
  LEGENDARY: 'text-[var(--warn)]',
}

interface BadgeHexProps {
  icon?: string | null
  name: string
  rarity: keyof typeof rarityColors
  locked?: boolean
}

export function BadgeHex({ icon, name, rarity, locked = false }: BadgeHexProps) {
  return (
    <div className={`flex flex-col items-center gap-1 ${locked ? 'opacity-30' : ''}`} title={name}>
      <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-lg border border-[var(--line)] bg-[var(--surface)] ${rarityColors[rarity]}`}>
        {icon ?? '🏅'}
      </div>
      <span className="font-mono-upper text-[10px] text-[var(--ink-muted)] text-center max-w-[56px] truncate">{name}</span>
    </div>
  )
}
