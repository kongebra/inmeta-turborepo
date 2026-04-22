import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { Nav } from '~/components/layout/Nav'
import '../styles/globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Trønder Leikan' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=DM+Serif+Display&display=swap',
      },
    ],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="no">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[var(--bg)] text-[var(--ink)] antialiased">
        <Nav />
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
