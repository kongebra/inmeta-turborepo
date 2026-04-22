import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { signIn } from '~/lib/auth-client'
import { Button } from '~/components/nidaros/Button'

export const Route = createFileRoute('/admin/login')({
  ssr: false,
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await signIn.email({ email, password })

    if (result.error) {
      setError(result.error.message ?? 'Feil e-post eller passord')
      setLoading(false)
      return
    }

    navigate({ to: '/admin' })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-[var(--accent)] mb-8 text-center">Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono-upper text-[var(--ink-muted)] block mb-1">E-post</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:border-[var(--accent)] outline-none"
            />
          </div>
          <div>
            <label className="font-mono-upper text-[var(--ink-muted)] block mb-1">Passord</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:border-[var(--accent)] outline-none"
            />
          </div>
          {error && <p className="text-[var(--warn)] text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logger inn...' : 'Logg inn'}
          </Button>
        </form>
      </div>
    </main>
  )
}
