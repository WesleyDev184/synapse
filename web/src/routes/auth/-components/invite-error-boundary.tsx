import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

interface InviteErrorBoundaryProps {
  error: Error
}

export function InviteErrorBoundary({ error }: InviteErrorBoundaryProps) {
  const navigate = useNavigate()

  useEffect(() => {
    // Se for erro de token inválido, redireciona para application
    if (error.message.includes('401') || error.message.includes('404')) {
      navigate({ to: '/auth/application' })
    }
  }, [error, navigate])

  return (
    <div className='flex h-screen flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-4 sm:gap-6'>
        <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center'>
          <h3 className='font-semibold text-destructive mb-2'>
            Erro ao carregar convite
          </h3>
          <p className='text-sm text-destructive/80 mb-4'>
            O convite pode ter expirado ou não ser válido.
          </p>
          <button
            onClick={() => navigate({ to: '/auth/application' })}
            className='text-sm text-primary hover:underline'
          >
            Voltar para solicitação de acesso
          </button>
        </div>
      </div>
    </div>
  )
}
