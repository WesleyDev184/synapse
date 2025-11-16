import { useAuth } from '@/hooks/use-auth'
import { createFileRoute, Navigate, useSearch } from '@tanstack/react-router'
import { Suspense } from 'react'
import { CompleteRegistrationForm } from './-components/complete-registration-form'
import { CompleteRegistrationFormSkeleton } from './-components/complete-registration-form-skeleton'
import { InviteErrorBoundary } from './-components/invite-error-boundary'

interface InviteSearchParams {
  token?: string
}

export const Route = createFileRoute('/auth/invite')({
  component: RouteComponent,
  errorComponent: ({ error }) => <InviteErrorBoundary error={error} />,
  head: () => ({
    meta: [
      {
        name: 'description',
        content: 'Finalize seu cadastro no Synapse completando os dados.',
      },
      {
        title: 'Finalizar Cadastro - Synapse',
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): InviteSearchParams => ({
    token: search.token as string | undefined,
  }),
})

function RouteComponent() {
  const { isAuthenticated } = useAuth()
  const { token } = useSearch({ from: '/auth/invite' })

  if (isAuthenticated) {
    return <Navigate to='/' />
  }

  if (!token) {
    return <Navigate to='/auth/application' />
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-4 sm:gap-6'>
        <a
          href='#'
          className='flex items-center gap-2 self-center font-medium text-sm sm:text-base'
        >
          <div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
            <img
              src='/logo.png'
              alt='Synapse Logo'
              className='h-6 w-6 rounded-sm'
            />
          </div>
          Synapse
        </a>
        <Suspense fallback={<CompleteRegistrationFormSkeleton />}>
          <CompleteRegistrationForm token={token} />
        </Suspense>
      </div>
    </div>
  )
}
