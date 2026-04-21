import './globals.css'
import type { ReactNode } from 'react'
import { Nav } from '@/components/layout/Nav'
import { getPayload } from '@/lib/payload'

export const metadata = {
  title: 'Trønder Leikan',
  description: 'Internt turneringssystem for Inmeta Trondheim',
}

async function getThemeClass(): Promise<string> {
  'use cache'
  const payload = await getPayload()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null)
  const themeMode = typeof settings?.themeMode === 'string' ? settings.themeMode : 'dark'
  return themeMode === 'light' ? '' : 'dark'
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const themeClass = await getThemeClass()

  return (
    <div className={`theme-root${themeClass ? ` ${themeClass}` : ''}`}>
      <Nav />
      <main>{children}</main>
    </div>
  )
}
