import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="p-8">
      <h1 className="font-display text-4xl" style={{ color: 'var(--accent)' }}>
        Trønder Leikan
      </h1>
    </main>
  )
}
