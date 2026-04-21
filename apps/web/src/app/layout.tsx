import type { ReactNode } from 'react'
import { Archivo, Archivo_Black, DM_Serif_Display, IBM_Plex_Mono } from 'next/font/google'

const archivoBlack = Archivo_Black({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const archivo = Archivo({ subsets: ['latin'], variable: '--font-body' })
const dmSerif = DM_Serif_Display({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-serif' })
const ibmPlexMono = IBM_Plex_Mono({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-mono' })

export default function RootLayout({ children }: { children: ReactNode }) {
  const fontVars = [archivoBlack.variable, archivo.variable, dmSerif.variable, ibmPlexMono.variable].join(' ')
  return (
    <html lang="nb" className={fontVars}>
      <body>{children}</body>
    </html>
  )
}
