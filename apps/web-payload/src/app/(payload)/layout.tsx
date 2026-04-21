import type { ServerFunctionClientArgs } from 'payload'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './importMap'

const config = import('../../../payload.config').then((mod) => mod.default)

async function serverFunction(args: ServerFunctionClientArgs) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
