import './globals.css'
import type { ReactNode } from 'react'
import { Nav } from '@/components/layout/Nav'

export const metadata = {
  title: 'Trønder Leikan',
  description: 'Internt turneringssystem for Inmeta Trondheim',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  )
}
