type IconName =
  | 'trophy' | 'medal' | 'target' | 'crown' | 'flame' | 'bolt' | 'star'
  | 'flag' | 'arrowUp' | 'arrowDown' | 'check' | 'dice' | 'sparkle'

type IconProps = {
  name: IconName
  size?: number
  stroke?: string
  strokeWidth?: number
  className?: string
}

const PATHS: Record<IconName, string> = {
  trophy:    'M7 4h10v4a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M9 13h6l-1 4h-4l-1-4zM8 21h8',
  medal:     'M8 3l2 6m4-6l2 6m-10 0h12M12 15m-6 0a6 6 0 1 0 12 0a6 6 0 0 0-12 0',
  target:    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  crown:     'M3 17h18l-2-10-4 4-3-6-3 6-4-4-2 10zM3 20h18',
  flame:     'M12 3s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C9 10 10 11 10 12c0-3 2-5 2-9z',
  bolt:      'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  star:      'M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z',
  flag:      'M4 21V4h12l-2 4 2 4H4M4 21v-8',
  arrowUp:   'M12 20V5M5 11l7-7 7 7',
  arrowDown: 'M12 4v15M5 13l7 7 7-7',
  check:     'M5 12l5 5 9-11',
  dice:      'M5 5m-1 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0M5 19m-1 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0M19 5m-1 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0M19 19m-1 0a1 1 0 1 0 2 0a1 1 0 0 0-2 0M4 4h16v16H4z',
  sparkle:   'M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3',
}

export function Icon({ name, size = 24, stroke = 'currentColor', strokeWidth = 2, className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block align-middle ${className}`}
    >
      <path d={PATHS[name] ?? PATHS.sparkle} />
    </svg>
  )
}
