// src/routes/_admin.tournaments.$id.edit.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getTournamentById, updateTournament } from '~/server/admin/tournaments'
import { TournamentForm, type TournamentFormData } from '~/components/admin/TournamentForm'

export const Route = createFileRoute('/_admin/tournaments/$id/edit')({
  ssr: false,
  loader: ({ params }) => getTournamentById({ data: params.id }),
  component: EditTournamentPage,
})

function EditTournamentPage() {
  const tournament = Route.useLoaderData()
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: TournamentFormData) {
    setLoading(true)
    setError(null)
    try {
      await updateTournament({
        data: {
          id,
          data: {
            ...data,
            year: data.year ? parseInt(data.year) : undefined,
            pointParticipation: parseInt(data.pointParticipation),
            pointFirstPlace: parseInt(data.pointFirstPlace),
            pointSecondPlace: parseInt(data.pointSecondPlace),
            pointThirdPlace: parseInt(data.pointThirdPlace),
            pointOrganizedWithParticipation: parseInt(data.pointOrganizedWithParticipation),
            pointOrganizedWithoutParticipation: parseInt(data.pointOrganizedWithoutParticipation),
            pointSpectator: parseInt(data.pointSpectator),
          },
        },
      })
      navigate({ to: '/admin/tournaments' })
    } catch (e: any) {
      setError(e.message ?? 'Ukjent feil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Rediger {tournament.name}</h1>
      <TournamentForm defaultValues={tournament} onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  )
}
