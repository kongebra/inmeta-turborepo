// src/routes/_admin.games.new.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getPlayers } from '~/server/players'
import { getGameTypes } from '~/server/admin/game-types'
import { getTournaments } from '~/server/tournaments'
import { createGame } from '~/server/admin/games'
import { GameForm, type GameFormData, mapGameFormData } from '~/components/admin/GameForm'

export const Route = createFileRoute('/admin/games/new')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    tournamentId: typeof search.tournamentId === 'string' ? search.tournamentId : undefined,
  }),
  loader: () => Promise.all([getPlayers(), getGameTypes(), getTournaments()]),
  component: NewGamePage,
})

function NewGamePage() {
  const [players, gameTypes, tournaments] = Route.useLoaderData()
  const { tournamentId } = Route.useSearch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: GameFormData) {
    setLoading(true)
    setError(null)
    try {
      await createGame({ data: mapGameFormData(data) })
      navigate({ to: '/admin/games' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ukjent feil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Nytt spill</h1>
      <GameForm players={players} gameTypes={gameTypes} tournaments={tournaments} defaultValues={tournamentId ? { tournamentId } : undefined} onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  )
}
