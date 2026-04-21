// src/routes/_admin.games.new.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getPlayers } from '~/server/players'
import { getGameTypes } from '~/server/admin/game-types'
import { getTournaments } from '~/server/tournaments'
import { createGame } from '~/server/admin/games'
import { GameForm, type GameFormData } from '~/components/admin/GameForm'

export const Route = createFileRoute('/_admin/games/new')({
  ssr: false,
  loader: () => Promise.all([getPlayers(), getGameTypes(), getTournaments()]),
  component: NewGamePage,
})

function mapFormData(data: GameFormData) {
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

function NewGamePage() {
  const [players, gameTypes, tournaments] = Route.useLoaderData()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: GameFormData) {
    setLoading(true)
    setError(null)
    try {
      await createGame({ data: mapFormData(data) })
      navigate({ to: '/admin/games' })
    } catch (e: any) {
      setError(e.message ?? 'Ukjent feil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Nytt spill</h1>
      <GameForm players={players} gameTypes={gameTypes} tournaments={tournaments} onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  )
}
