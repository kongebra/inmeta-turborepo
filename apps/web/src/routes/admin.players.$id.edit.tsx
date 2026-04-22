// src/routes/_admin.players.$id.edit.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getPlayer } from '~/server/players'
import { getGameTypes } from '~/server/admin/game-types'
import { updatePlayer } from '~/server/admin/players'
import { PlayerForm, type PlayerFormData } from '~/components/admin/PlayerForm'

export const Route = createFileRoute('/admin/players/$id/edit')({
  ssr: false,
  loader: ({ params }) => Promise.all([getPlayer({ data: params.id }), getGameTypes()]),
  component: EditPlayerPage,
})

function EditPlayerPage() {
  const [player, gameTypes] = Route.useLoaderData()
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: PlayerFormData) {
    setLoading(true)
    setError(null)
    try {
      await updatePlayer({ data: { id, data } })
      navigate({ to: '/admin/players' })
    } catch (e: any) {
      setError(e.message ?? 'Ukjent feil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Rediger {player.firstName} {player.lastName}</h1>
      <PlayerForm
        defaultValues={player}
        gameTypes={gameTypes}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  )
}
