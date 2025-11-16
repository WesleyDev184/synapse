import { useAuth } from '@/hooks/use-auth'
import { UserRole } from '@/http/auth/dto/auth.dto'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_ptd/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()

  if (user?.role !== UserRole.ADMIN) {
    return Navigate({ to: '/' })
  }

  return (
    <>
      <Outlet />
    </>
  )
}
