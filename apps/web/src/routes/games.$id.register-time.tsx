import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/$id/register-time')({
  ssr: false,
  component: RegisterTimePage,
})

function RegisterTimePage() {
  const { id } = Route.useParams()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl mb-6">Registrer tider</h1>
      <p className="text-[var(--ink-muted)] mb-8">
        Spill ID: <code className="font-mono text-[var(--accent)]">{id}</code>
      </p>
      <p className="text-[var(--ink-dim)]">Tidregistrering implementeres i P3 admin CMS.</p>
    </main>
  )
}
