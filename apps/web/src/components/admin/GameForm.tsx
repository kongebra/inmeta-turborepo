// src/components/admin/GameForm.tsx
import type { Player, GameType, Tournament } from '../../../generated/prisma/client'
import { Button } from '~/components/nidaros/Button'
import { ImageUpload } from '~/components/admin/ImageUpload'
import { useState } from 'react'

export interface GameFormData {
  name: string; tournamentId: string; gameTypeId: string
  date: string; status: 'PLANNED' | 'SCHEDULED' | 'LIVE' | 'DONE' | 'CANCELLED'
  location: string; duration: string
  format: 'PLACEMENT' | 'SCORE' | 'TIME' | 'BRACKET'
  heroImageUrl: string; story: string
  organizerIds: string[]; participantIds: string[]
  spectatorIds: string[]; firstPlaceIds: string[]
  secondPlaceIds: string[]; thirdPlaceIds: string[]
}

export function mapGameFormData(data: GameFormData) {
  return {
    ...data,
    duration: data.duration ? parseInt(data.duration) || undefined : undefined,
    gameTypeId: data.gameTypeId || undefined,
    heroImageUrl: data.heroImageUrl || undefined,
    story: data.story || undefined,
    date: data.date || undefined,
    location: data.location || undefined,
  }
}

interface GameFormProps {
  players: Player[]; gameTypes: GameType[]; tournaments: Tournament[]
  defaultValues?: Partial<GameFormData>
  gameId?: string
  onSubmit: (data: GameFormData) => Promise<void>
  loading?: boolean; error?: string | null
}

function MultiPlayerSelect({ name, label, players, defaultIds = [] }: {
  name: string; label: string; players: Player[]; defaultIds?: string[]
}) {
  const [selected, setSelected] = useState<string[]>(defaultIds)

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div>
      <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">{label}</label>
      <div className="flex flex-wrap gap-1 p-2 rounded border border-[var(--line)] bg-[var(--surface)] min-h-[40px]">
        {players.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${selected.includes(p.id) ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-[var(--surface-alt)] text-[var(--ink-dim)]'}`}
          >
            {p.firstName}
          </button>
        ))}
      </div>
      {selected.map(id => <input key={id} type="hidden" name={name} value={id} />)}
    </div>
  )
}

export function GameForm({ players, gameTypes, tournaments, defaultValues, gameId, onSubmit, loading, error }: GameFormProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const getAll = (key: string) => fd.getAll(key) as string[]

    await onSubmit({
      name: fd.get('name') as string,
      tournamentId: fd.get('tournamentId') as string,
      gameTypeId: fd.get('gameTypeId') as string,
      date: fd.get('date') as string,
      status: fd.get('status') as GameFormData['status'],
      location: fd.get('location') as string,
      duration: fd.get('duration') as string,
      format: fd.get('format') as GameFormData['format'],
      heroImageUrl: fd.get('heroImageUrl') as string,
      story: fd.get('story') as string,
      organizerIds: getAll('organizerIds'),
      participantIds: getAll('participantIds'),
      spectatorIds: getAll('spectatorIds'),
      firstPlaceIds: getAll('firstPlaceIds'),
      secondPlaceIds: getAll('secondPlaceIds'),
      thirdPlaceIds: getAll('thirdPlaceIds'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Navn</label>
          <input name="name" required defaultValue={defaultValues?.name ?? ''}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none focus:border-[var(--accent)]" />
        </div>
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Turnering</label>
          <select name="tournamentId" required defaultValue={defaultValues?.tournamentId ?? ''}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none">
            <option value="">— Velg turnering —</option>
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Spilltype</label>
          <select name="gameTypeId" defaultValue={defaultValues?.gameTypeId ?? ''}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none">
            <option value="">— Ingen —</option>
            {gameTypes.map(gt => <option key={gt.id} value={gt.id}>{gt.icon} {gt.name}</option>)}
          </select>
        </div>
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Status</label>
          <select name="status" defaultValue={defaultValues?.status ?? 'PLANNED'}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none">
            {['PLANNED','SCHEDULED','LIVE','DONE','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Dato</label>
          <input name="date" type="datetime-local" defaultValue={defaultValues?.date ?? ''}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none" />
        </div>
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Sted</label>
          <input name="location" defaultValue={defaultValues?.location ?? ''}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none" />
        </div>
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Format</label>
          <select name="format" defaultValue={defaultValues?.format ?? 'PLACEMENT'}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none">
            {['PLACEMENT','SCORE','TIME','BRACKET'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Varighet (min)</label>
          <input name="duration" type="number" min="0" defaultValue={defaultValues?.duration ?? ''}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none" />
        </div>
      </div>

      <div>
        <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Hero-bilde URL</label>
        <input name="heroImageUrl" defaultValue={defaultValues?.heroImageUrl ?? ''}
          className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none" />
      </div>

      <div>
        <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Slik gikk det (story)</label>
        <textarea name="story" rows={4} defaultValue={defaultValues?.story ?? ''}
          className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none resize-y" />
      </div>

      {gameId && (
        <div>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-2">Legg til bilder i galleri</label>
          <ImageUpload
            gameId={gameId}
            onUploaded={(url) => console.log('Uploaded:', url)}
          />
          <p className="text-xs text-[var(--ink-muted)] mt-1">Bilder vises i galleriet på spill-siden etter refresh.</p>
        </div>
      )}

      <MultiPlayerSelect name="organizerIds" label="Arrangører" players={players} defaultIds={defaultValues?.organizerIds} />
      <MultiPlayerSelect name="participantIds" label="Deltakere" players={players} defaultIds={defaultValues?.participantIds} />
      <MultiPlayerSelect name="spectatorIds" label="Tilskuere" players={players} defaultIds={defaultValues?.spectatorIds} />
      <MultiPlayerSelect name="firstPlaceIds" label="1. plass" players={players} defaultIds={defaultValues?.firstPlaceIds} />
      <MultiPlayerSelect name="secondPlaceIds" label="2. plass" players={players} defaultIds={defaultValues?.secondPlaceIds} />
      <MultiPlayerSelect name="thirdPlaceIds" label="3. plass" players={players} defaultIds={defaultValues?.thirdPlaceIds} />

      {error && <p className="text-[var(--warn)] text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Lagrer...' : 'Lagre'}</Button>
    </form>
  )
}
