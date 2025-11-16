import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function AdminLoadingState() {
  return (
    <div className='min-h-screen bg-background p-8 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='w-12 h-12 animate-spin text-primary mx-auto mb-4' />
        <p className='text-muted-foreground'>Carregando aplicações...</p>
      </div>
    </div>
  )
}

export function AdminHeader() {
  return (
    <div className='mb-8'>
      <h1 className='text-4xl font-bold text-foreground'>
        Gerenciamento de Aplicações
      </h1>
      <p className='text-muted-foreground mt-2'>
        Revise e gerencie as candidaturas de novos usuários
      </p>
    </div>
  )
}

export function ApplicationsTableContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return <Card className='overflow-hidden shadow-md'>{children}</Card>
}
