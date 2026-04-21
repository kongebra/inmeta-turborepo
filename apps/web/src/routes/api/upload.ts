import { createFileRoute } from '@tanstack/react-router'
import { uploadImage } from '~/lib/s3'
import { db } from '~/lib/db'
import { auth } from '~/lib/auth'

export const Route = createFileRoute('/api/upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session) return new Response('Unauthorized', { status: 401 })

        const formData = await request.formData()
        const file = formData.get('file') as File | null
        if (!file) return new Response('No file', { status: 400 })

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
        if (!allowedTypes.includes(file.type)) {
          return new Response('Invalid file type', { status: 400 })
        }

        if (file.size > 10 * 1024 * 1024) {
          return new Response('File too large (max 10MB)', { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const result = await uploadImage(buffer, file.type)

        const gameId = formData.get('gameId') as string | null

        if (gameId) {
          const media = await db.gameMedia.create({
            data: { gameId, url: result.url, order: 0 },
          })
          return Response.json({ ...result, id: media.id })
        }

        return Response.json(result)
      },
    },
  },
})
