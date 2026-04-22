import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/tournaments')({
  ssr: false,
  component: () => <Outlet />,
})
