// src/routes/_admin.games.$id.edit.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getGame } from '~/server/games'
import { getPlayers } from '~/server/players'
import { getGameTypes } from '~/server/admin/game-types'
import { getTournaments } from '~/server/tournaments'
import { updateGame } from '~/server/admin/games'
import { GameForm, type GameFormData } from '~/components/admin/GameForm'

export const Route = createFileRoute('/_admin/games/$id/edit')({
  ssr: false,
  loader: ({ params }) => Promise.all([
    getGame({ data: params.id }),
    getPlayers(),
    getGameTypes(),
    getTournaments(),
  ]),
  component: EditGamePage,
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
    organizerIds: game.organizers?.map((p: any) => p.id) ?? [],
    participantIds: game.participants?.map((p: any) => p.id) ?? [],
    spectatorIds: game.spectators?.map((p: any) => p.id) ?? [],
    firstPlaceIds: game.firstPlace?.map((p: any) => p.id) ?? [],
    secondPlaceIds: game.secondPlace?.map((p: any) => p.id) ?? [],
    thirdPlaceIds: game.thirdPlace?.map((p: any) => p.id) ?? [],
  }

  async function handleSubmit(data: GameFormData) {
    setLoading(true)
    setError(null)
    try {
      await updateGame({ data: { id, data: mapFormData(data) } })
      navigate({ to: '/admin/games' })
    } catch (e: any) {
      setError(e.message ?? 'Ukjent feil')
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
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  )
}
