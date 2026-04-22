import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/games')({
  ssr: false,
  component: () => <Outlet />,
})
