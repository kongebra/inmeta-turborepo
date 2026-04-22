// src/routes/_admin.games.$id.edit.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getGame } from '~/server/games'
import { getPlayers } from '~/server/players'
import { getGameTypes } from '~/server/admin/game-types'
import { getTournaments } from '~/server/tournaments'
import { updateGame } from '~/server/admin/games'
import { GameForm, type GameFormData, mapGameFormData } from '~/components/admin/GameForm'

export const Route = createFileRoute('/admin/games/$id/edit')({
  ssr: false,
  loader: ({ params }) => Promise.all([
    getGame({ data: params.id }),
    getPlayers(),
    getGameTypes(),
    getTournaments(),
  ]),
  component: EditGamePage,
})

function EditGamePage() {
  const [game, players, gameTypes, tournaments] = Route.useLoaderData()
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultValues: Partial<GameFormData> = {
    name: game.name,
    tournamentId: game.tournamentId,
    gameTypeId: game.gameTypeId ?? '',
    date: game.date ? new Date(game.date).toISOString().slice(0, 16) : '',
    status: game.status,
    location: game.location ?? '',
    duration: game.duration ? String(game.duration) : '',
    format: game.format,
    heroImageUrl: game.heroImageUrl ?? '',
    story: game.story ?? '',
    organizerIds: game.organizers.map(p => p.id),
    participantIds: game.participants.map(p => p.id),
    spectatorIds: game.spectators.map(p => p.id),
    firstPlaceIds: game.firstPlace.map(p => p.id),
    secondPlaceIds: game.secondPlace.map(p => p.id),
    thirdPlaceIds: game.thirdPlace.map(p => p.id),
  }

  async function handleSubmit(data: GameFormData) {
    setLoading(true)
    setError(null)
    try {
      await updateGame({ data: { id, data: mapGameFormData(data) } })
      navigate({ to: '/admin/games' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ukjent feil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Rediger {game.name}</h1>
      <GameForm
        players={players}
        gameTypes={gameTypes}
        tournaments={tournaments}
        defaultValues={defaultValues}
        gameId={id}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  )
}
