type AvatarProps = {
  initials: string
  size?: number
  tone?: number
  rank?: 1 | 2 | 3
  accentBorder?: boolean
}

const TONES_DARK  = ['#2a2a26','#2e2a24','#26302a','#2a2832','#302a28','#282e30']
const TONES_LIGHT = ['#d8d8d0','#ddd8ce','#cad8d0','#d2cedc','#dcd0cc','#d0d8dc']

export function Avatar({ initials, size = 40, tone = 0, rank, accentBorder }: AvatarProps) {
  const badgeSize = Math.max(18, size * 0.5)
  const badgeColors = ['var(--gold)', 'var(--silver)', 'var(--bronze)']
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: TONES_DARK[tone % TONES_DARK.length],
        border: `2px solid ${accentBorder ? 'var(--accent)' : 'var(--line)'}`,
        display: 'grid', placeItems: 'center',
        fontFamily: '"Archivo Black", sans-serif',
        fontSize: Math.max(11, size * 0.38),
        color: 'var(--ink)',
      }}>
        {initials}
      </div>
      {rank && (
        <div style={{
          position: 'absolute', bottom: -4, right: -4,
          width: badgeSize, height: badgeSize, borderRadius: '50%',
          background: badgeColors[rank - 1],
          color: '#fff',
          border: '2px solid var(--bg)',
          display: 'grid', placeItems: 'center',
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: Math.max(11, badgeSize * 0.5),
        }}>
          {rank}
        </div>
      )}
    </div>
  )
}
