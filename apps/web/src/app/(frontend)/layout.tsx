import './globals.css'
import type { ReactNode } from 'react'
import { Nav } from '@/components/layout/Nav'
import { getPayload } from '@/lib/payload'

export const metadata = {
  title: 'Trønder Leikan',
  description: 'Internt turneringssystem for Inmeta Trondheim',
}

export const dynamic = 'force-dynamic'

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const payload = await getPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null)

  const themeMode = typeof settings?.themeMode === 'string' ? settings.themeMode : 'dark'
  const htmlClass = themeMode === 'system' ? 'dark' : themeMode === 'light' ? '' : 'dark'

  return (
    <html lang="nb" className={htmlClass}>
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
