import Header from '@/components/Header'
import { ProtectedRoutes } from '@/components/protected-routes'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_ptd')({
  component: PtdLayout,
})

function PtdLayout() {
  return (
    <>
      <Header />
      <ProtectedRoutes>
        <Outlet />
      </ProtectedRoutes>
    </>
  )
}
