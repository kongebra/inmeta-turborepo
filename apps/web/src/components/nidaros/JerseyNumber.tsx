interface JerseyNumberProps { place: number }

const placeStyles: Record<number, string> = {
  1: 'bg-[var(--gold)] text-black',
  2: 'bg-[var(--silver)] text-black',
  3: 'bg-[var(--bronze)] text-white',
}

export function JerseyNumber({ place }: JerseyNumberProps) {
  const style = placeStyles[place] ?? 'bg-[var(--surface-alt)] border border-[var(--line)] text-[var(--ink-muted)]'
  return (
    <div className={`w-7 h-7 rounded flex items-center justify-center tnum text-sm font-bold ${style}`}>
      {place}
    </div>
  )
}
