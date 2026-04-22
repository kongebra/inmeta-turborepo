import { createFileRoute } from '@tanstack/react-router'
import { getObjectStream } from '~/lib/s3'

export const Route = createFileRoute('/api/media')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const key = url.searchParams.get('key')
        if (!key) return new Response('Missing key', { status: 400 })

        try {
          const { body, contentType } = await getObjectStream(key)
          if (!body) return new Response('Not found', { status: 404 })
          return new Response(body as ReadableStream, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        } catch {
          return new Response('Not found', { status: 404 })
        }
      },
    },
  },
})
