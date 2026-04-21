import type { Player, GameType } from '../../../generated/prisma/client'
import { Button } from '~/components/nidaros/Button'

interface PlayerFormProps {
  defaultValues?: Partial<Player>
  gameTypes: GameType[]
  onSubmit: (data: PlayerFormData) => Promise<void>
  loading?: boolean
  error?: string | null
}

export interface PlayerFormData {
  firstName: string
  lastName: string
  nickname: string
  homeBase: string
  funFact: string
  imageUrl: string
  signatureGameId: string
}

export function PlayerForm({ defaultValues, gameTypes, onSubmit, loading, error }: PlayerFormProps) {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await onSubmit({
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      nickname: fd.get('nickname') as string,
      homeBase: fd.get('homeBase') as string,
      funFact: fd.get('funFact') as string,
      imageUrl: fd.get('imageUrl') as string,
      signatureGameId: fd.get('signatureGameId') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {([
        { name: 'firstName', label: 'Fornavn', required: true },
        { name: 'lastName', label: 'Etternavn', required: true },
        { name: 'nickname', label: 'Kallenavn' },
        { name: 'homeBase', label: 'Hjemsted (bydel)' },
        { name: 'funFact', label: 'Fun fact' },
        { name: 'imageUrl', label: 'Bilde-URL' },
      ] as Array<{ name: keyof PlayerFormData; label: string; required?: boolean }>).map(({ name, label, required }) => (
        <div key={name}>
          <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">{label}</label>
          <input
            name={name}
            required={required}
            defaultValue={defaultValues?.[name as keyof typeof defaultValues] as string ?? ''}
            className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:border-[var(--accent)] outline-none text-sm"
          />
        </div>
      ))}

      <div>
        <label className="font-mono-upper text-[var(--ink-muted)] text-xs block mb-1">Signaturspill</label>
        <select
          name="signatureGameId"
          defaultValue={defaultValues?.signatureGameId ?? ''}
          className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:border-[var(--accent)] outline-none text-sm"
        >
          <option value="">— Ingen —</option>
          {gameTypes.map(gt => (
            <option key={gt.id} value={gt.id}>{gt.icon} {gt.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-[var(--warn)] text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Lagrer...' : 'Lagre'}
      </Button>
    </form>
  )
}
