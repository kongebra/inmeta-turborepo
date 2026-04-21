// src/routes/_admin.tournaments.new.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createTournament } from '~/server/admin/tournaments'
import { TournamentForm, type TournamentFormData } from '~/components/admin/TournamentForm'

export const Route = createFileRoute('/_admin/tournaments/new')({
  ssr: false,
  component: NewTournamentPage,
})

function NewTournamentPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: TournamentFormData) {
    setLoading(true)
    setError(null)
    try {
      await createTournament({
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
      <h1 className="font-display text-3xl mb-8">Ny turnering</h1>
      <TournamentForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  )
}
