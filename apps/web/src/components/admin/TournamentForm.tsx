// src/components/admin/TournamentForm.tsx
import { Button } from '~/components/nidaros/Button'
import type { Tournament } from '../../../generated/prisma/client'

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

export function TournamentForm({ defaultValues, onSubmit, loading, error }: TournamentFormProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await onSubmit(Object.fromEntries(fd.entries()) as TournamentFormData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {[
        { name: 'name', label: 'Navn', required: true },
        { name: 'slug', label: 'Slug', required: true },
        { name: 'startDate', label: 'Startdato', type: 'date' },
        { name: 'year', label: 'År', type: 'number' },
        { name: 'coverImageUrl', label: 'Forsidebilde-URL' },
        { name: 'posterImageUrl', label: 'Plakat-URL' },
      ].map(({ name, label, required, type = 'text' }) => (
        <div key={name}>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">{label}</label>
          <input name={name} type={type} required={required}
            defaultValue={(defaultValues as any)?.[name] ?? ''}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:border-[var(--accent)] outline-none text-sm" />
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
