// src/routes/_admin.game-types.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { getGameTypes, createGameType, deleteGameType } from '~/server/admin/game-types'
import { Button } from '~/components/nidaros/Button'

export const Route = createFileRoute('/_admin/game-types')({
  ssr: false,
  loader: () => getGameTypes(),
  component: AdminGameTypesPage,
})

function AdminGameTypesPage() {
  const gameTypes = Route.useLoaderData()
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [icon, setIcon] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createGameType({ data: { name, slug, icon: icon || undefined } })
      setName(''); setSlug(''); setIcon('')
      router.invalidate()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Slett spilltype "${name}"?`)) return
    try {
      await deleteGameType({ data: id })
      router.invalidate()
    } catch {
      alert('Kunne ikke slette spilltypen. Prøv igjen.')
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-3xl mb-8">Spilltyper</h1>

      {/* Opprett */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-8 flex-wrap">
        <input placeholder="Navn" value={name} onChange={e => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')) }} required
          className="flex-1 min-w-32 px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none focus:border-[var(--accent)]" />
        <input placeholder="slug" value={slug} onChange={e => setSlug(e.target.value)} required
          className="flex-1 min-w-24 px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none focus:border-[var(--accent)] font-mono" />
        <input placeholder="Ikon (emoji)" value={icon} onChange={e => setIcon(e.target.value)} maxLength={2}
          className="w-20 px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-sm outline-none focus:border-[var(--accent)] text-center" />
        <Button type="submit" disabled={loading} size="sm">Legg til</Button>
      </form>
      {error && <p className="text-[var(--warn)] text-sm mb-4">{error}</p>}

      {/* Liste */}
      <div className="space-y-2">
        {gameTypes.map(gt => (
          <div key={gt.id} className="flex items-center justify-between p-3 rounded border border-[var(--line)] bg-[var(--surface)]">
            <div className="flex items-center gap-3">
              <span className="text-xl">{gt.icon}</span>
              <div>
                <p className="font-medium text-sm">{gt.name}</p>
                <p className="font-mono text-xs text-[var(--ink-muted)]">{gt.slug}</p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={() => handleDelete(gt.id, gt.name)}>Slett</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
