import './globals.css'
import type { ReactNode } from 'react'
import { Archivo, Archivo_Black, DM_Serif_Display, IBM_Plex_Mono } from 'next/font/google'
import { Nav } from '@/components/layout/Nav'
import { getPayload } from '@/lib/payload'

const archivoBlack = Archivo_Black({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const archivo = Archivo({ subsets: ['latin'], variable: '--font-body' })
const dmSerif = DM_Serif_Display({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-serif' })
const ibmPlexMono = IBM_Plex_Mono({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  title: 'Trønder Leikan',
  description: 'Internt turneringssystem for Inmeta Trondheim',
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const fontVars = [archivoBlack.variable, archivo.variable, dmSerif.variable, ibmPlexMono.variable].join(' ')

  const payload = await getPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null)
  const themeMode = typeof settings?.themeMode === 'string' ? settings.themeMode : 'dark'
  const themeClass = themeMode === 'light' ? '' : 'dark'

  return (
    <html lang="nb" className={`${themeClass} ${fontVars}`.trim()}>
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
