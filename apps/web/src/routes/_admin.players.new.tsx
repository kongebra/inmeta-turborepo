// src/routes/_admin.players.new.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createPlayer } from '~/server/admin/players'
import { getGameTypes } from '~/server/admin/game-types'
import { PlayerForm, type PlayerFormData } from '~/components/admin/PlayerForm'

export const Route = createFileRoute('/_admin/players/new')({
  ssr: false,
  loader: () => getGameTypes(),
  component: NewPlayerPage,
})

function NewPlayerPage() {
  const gameTypes = Route.useLoaderData()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: PlayerFormData) {
    setLoading(true)
    setError(null)
    try {
      await createPlayer({ data })
      navigate({ to: '/admin/players' })
    } catch (e: any) {
      setError(e.message ?? 'Ukjent feil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Ny spiller</h1>
      <PlayerForm gameTypes={gameTypes} onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  )
}
