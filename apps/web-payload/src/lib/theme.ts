export type AccentId = 'neon' | 'signal' | 'forest' | 'red' | 'blue'
export type ThemeMode = 'light' | 'dark'

type AccentPalette = { base: string; alt: string; ink: string }
type AccentDef = { id: AccentId; name: string; light: AccentPalette; dark: AccentPalette }

export const V4_ACCENTS: Record<AccentId, AccentDef> = {
  neon:   { id: 'neon',   name: 'Neon-grøn',      light: { base: '#058a4a', alt: '#44f291', ink: '#ffffff' }, dark: { base: '#44f291', alt: '#44f291', ink: '#00231a' } },
  signal: { id: 'signal', name: 'Signal-grøn',    light: { base: '#0a7a3c', alt: '#1fa85c', ink: '#ffffff' }, dark: { base: '#4cc97c', alt: '#6fd894', ink: '#002418' } },
  forest: { id: 'forest', name: 'Skog-grøn',      light: { base: '#2c5a3a', alt: '#3d7a50', ink: '#ffffff' }, dark: { base: '#6aa87c', alt: '#7db890', ink: '#0c2418' } },
  red:    { id: 'red',    name: 'Rosenborg-raud',  light: { base: '#c00020', alt: '#e01830', ink: '#ffffff' }, dark: { base: '#ff5668', alt: '#ff7080', ink: '#2a0008' } },
  blue:   { id: 'blue',  name: 'Nidaros-blå',     light: { base: '#1a52b0', alt: '#2f6fd4', ink: '#ffffff' }, dark: { base: '#6fa6f5', alt: '#88b8f8', ink: '#02142a' } },
}

export type Theme = {
  mode: ThemeMode
  bg: string; surface: string; surfaceAlt: string
  ink: string; inkDim: string; inkMuted: string
  line: string; lineSoft: string
  accent: string; accentAlt: string; accentInk: string
  warn: string; gold: string; silver: string; bronze: string
}

export function makeTheme(mode: ThemeMode, accentId: AccentId = 'neon'): Theme {
  const a = V4_ACCENTS[accentId]
  const acc = mode === 'light' ? a.light : a.dark
  return mode === 'light' ? {
    mode,
    bg: '#f4f4f2', surface: '#ffffff', surfaceAlt: '#e8e8e2',
    ink: '#0a0a08', inkDim: '#3a3a34', inkMuted: '#666660',
    line: '#cecec6', lineSoft: '#e0e0da',
    accent: acc.base, accentAlt: acc.alt, accentInk: acc.ink,
    warn: '#b02818', gold: '#a67820', silver: '#6a6a62', bronze: '#8a5828',
  } : {
    mode,
    bg: '#0a0a08', surface: '#141412', surfaceAlt: '#1e1e1a',
    ink: '#f4f4f0', inkDim: '#c0c0b6', inkMuted: '#8a8a80',
    line: '#2e2e28', lineSoft: '#1e1e1a',
    accent: acc.base, accentAlt: acc.alt, accentInk: acc.ink,
    warn: '#f06850', gold: '#e8b840', silver: '#c0c0b8', bronze: '#d8944a',
  }
}
