import { createFileRoute } from '@tanstack/react-router'
import { getGame } from '~/server/games'

export const Route = createFileRoute('/games/$id/bracket')({
  loader: ({ params }) => getGame({ data: params.id }),
  component: BracketPage,
})

function BracketPage() {
  const game = Route.useLoaderData()

  if (!game.bracketData) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-[var(--ink-muted)]">Ingen bracket-data for dette spillet.</p>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl mb-4">{game.name} — Bracket</h1>
      <p className="font-mono-upper text-[var(--ink-muted)] text-xs mb-6">{game.bracketType}</p>
      <pre className="text-xs text-[var(--ink-muted)] bg-[var(--surface)] p-4 rounded overflow-auto">
        {JSON.stringify(game.bracketData, null, 2)}
      </pre>
    </main>
  )
}
