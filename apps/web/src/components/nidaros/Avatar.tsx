interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' }

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-[var(--surface-alt)] border border-[var(--line)] flex items-center justify-center shrink-0`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-display text-[var(--accent)]">{initials}</span>
      )}
    </div>
  )
}
