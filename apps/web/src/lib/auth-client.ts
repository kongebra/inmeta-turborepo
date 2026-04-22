import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined'
    ? window.location.origin
    : (import.meta.env.VITE_APP_URL ?? 'http://localhost:3001'),
  plugins: [adminClient()],
})

export const { signIn, signOut, signUp, useSession } = authClient
