import { useState } from 'react'
import { Button } from '~/components/nidaros/Button'
import type { Tournament } from '../../generated/prisma/client'

export interface TournamentFormData {
  name: string; slug: string; status: 'PLANNED' | 'ACTIVE' | 'FINISHED'
  startDate: string; year: string; coverImageUrl: string; posterImageUrl: string
  pointParticipation: string; pointFirstPlace: string; pointSecondPlace: string
  pointThirdPlace: string; pointOrganizedWithParticipation: string
  pointOrganizedWithoutParticipation: string; pointSpectator: string
}

interface TournamentFormProps {
  defaultValues?: Partial<Tournament>
  onSubmit: (data: TournamentFormData) => Promise<void>
  loading?: boolean; error?: string | null
}

function toSlug(name: string) {
  return name.toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export function TournamentForm({ defaultValues, onSubmit, loading, error }: TournamentFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [slug, setSlug] = useState(defaultValues?.slug ?? '')
  const [slugManual, setSlugManual] = useState(!!defaultValues?.slug)

  function handleNameChange(val: string) {
    setName(val)
    if (!slugManual) setSlug(toSlug(val))
  }

  function handleSlugChange(val: string) {
    setSlug(val)
    setSlugManual(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await onSubmit(Object.fromEntries(fd.entries()) as unknown as TournamentFormData)
  }

  const inputCls = 'w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:border-[var(--accent)] outline-none text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Navn</label>
        <input name="name" required value={name} onChange={e => handleNameChange(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Slug</label>
        <input name="slug" required value={slug} onChange={e => handleSlugChange(e.target.value)}
          className={`${inputCls} font-mono`} />
      </div>
      {[
        { name: 'startDate', label: 'Startdato', type: 'date' },
        { name: 'year', label: 'År', type: 'number' },
        { name: 'coverImageUrl', label: 'Forsidebilde-URL' },
        { name: 'posterImageUrl', label: 'Plakat-URL' },
      ].map(({ name, label, type = 'text' }) => (
        <div key={name}>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">{label}</label>
          <input name={name} type={type}
            defaultValue={(() => {
              const raw = (defaultValues as any)?.[name]
              if (name === 'startDate' && raw)
                return raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw).slice(0, 10)
              return raw ?? ''
            })()}
            className={inputCls} />
        </div>
      ))}
      <div>
        <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Status</label>
        <select name="status" defaultValue={defaultValues?.status ?? 'PLANNED'}
          className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] outline-none text-sm">
          <option value="PLANNED">Planlagt</option>
          <option value="ACTIVE">Aktiv</option>
          <option value="FINISHED">Ferdig</option>
        </select>
      </div>
      <details className="border border-[var(--line)] rounded p-3">
        <summary className="font-mono-upper text-[var(--ink-muted)] text-xs cursor-pointer">Poengreglar</summary>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            { name: 'pointParticipation', label: 'Deltakelse', def: 3 },
            { name: 'pointFirstPlace', label: '1. plass', def: 3 },
            { name: 'pointSecondPlace', label: '2. plass', def: 2 },
            { name: 'pointThirdPlace', label: '3. plass', def: 1 },
            { name: 'pointOrganizedWithParticipation', label: 'Arrangør m/del.', def: 1 },
            { name: 'pointOrganizedWithoutParticipation', label: 'Arrangør u/del.', def: 3 },
            { name: 'pointSpectator', label: 'Tilskuer', def: 1 },
          ].map(({ name, label, def }) => (
            <div key={name}>
              <label className="text-[10px] text-[var(--ink-muted)] block">{label}</label>
              <input name={name} type="number" min="0" defaultValue={(defaultValues as any)?.[name] ?? def}
                className="w-full px-2 py-1 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none" />
            </div>
          ))}
        </div>
      </details>
      {error && <p className="text-[var(--warn)] text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Lagrer...' : 'Lagre'}</Button>
    </form>
  )
}
