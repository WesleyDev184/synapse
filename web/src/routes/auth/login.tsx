import { useAuth } from '@/hooks/use-auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { LoginForm } from './-components/login-form'

export const Route = createFileRoute('/auth/login')({
  component: Login,
  head: () => ({
    meta: [
      {
        name: 'description',
        content:
          'Login to your TaskDeck account to manage your tasks efficiently.',
      },
      {
        title: 'Login - Synapse',
      },
    ],
  }),
})

function Login() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to='/' />
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
              alt='TaskDeck Logo'
              className='h-6 w-6 rounded-sm'
            />
          </div>
          TaskDeck
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
