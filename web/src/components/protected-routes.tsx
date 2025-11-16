import { useAuth } from '@/hooks/use-auth'
import { Navigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface ProtectedRoutesProps {
  children: ReactNode
}

export function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login page')
    return <Navigate to='/auth/login' />
  }

  return (
    <div className='h-[calc(100vh-6vh)] max-h-[calc(100vh-6vh)] flex flex-col'>
      {children}
    </div>
  )
}
