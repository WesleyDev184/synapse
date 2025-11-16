import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { User, UserRole, UserStatus } from '@/http/auth/dto/auth.dto'
import { ROLE_LABELS, USER_STATUS_LABELS } from '@/utils/label-convert'
import { Eye } from 'lucide-react'
import { useState } from 'react'

interface UsersDetailsDialogProps {
  user: User
  children?: React.ReactNode
}

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
    case 'MEMBER':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'INACTIVE':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function UsersDetailsDialog({
  user,
  children,
}: UsersDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size='sm'
            variant='outline'
            className='flex items-center gap-1'
          >
            <Eye className='w-4 h-4' />
            Detalhes
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* User Status Badge */}
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-muted-foreground'>
              Status
            </span>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}
            >
              {USER_STATUS_LABELS[user.status]}
            </span>
          </div>

          <Separator />

          {/* User Details */}
          <div className='space-y-4'>
            {/* Email */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Email
              </label>
              <p className='text-base text-foreground mt-1 break-all'>
                {user.email}
              </p>
            </div>

            {/* Name */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Nome
              </label>
              <p className='text-base font-semibold text-foreground mt-1'>
                {user.name}
              </p>
            </div>

            {/* Company */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Empresa
              </label>
              <p className='text-base text-foreground mt-1'>{user.company}</p>
            </div>

            {/* Role */}
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-muted-foreground'>
                Função
              </span>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}
              >
                {ROLE_LABELS[user.role]}
              </span>
            </div>

            {/* Created At */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Data de Cadastro
              </label>
              <p className='text-base text-foreground mt-1'>
                {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Updated At */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Última Atualização
              </label>
              <p className='text-base text-foreground mt-1'>
                {new Date(user.updatedAt).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* ID */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                ID do Usuário
              </label>
              <p className='text-xs text-foreground mt-1 break-all font-mono'>
                {user.id}
              </p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className='flex justify-end gap-3'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
