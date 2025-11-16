import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Invite } from '@/http/invites/dto/invites.dto'
import { AlertCircle, CheckCircle, Copy, Eye, XCircle } from 'lucide-react'
import { useState } from 'react'

interface InvitesDetailsDialogProps {
  invite: Invite
  children?: React.ReactNode
}

const getInviteStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'EXPIRED':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    case 'PENDING':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getInviteStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle className='w-5 h-5' />
    case 'EXPIRED':
      return <XCircle className='w-5 h-5' />
    case 'PENDING':
      return <AlertCircle className='w-5 h-5' />
    default:
      return null
  }
}

const getInviteStatusLabel = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'Completo'
    case 'EXPIRED':
      return 'Expirado'
    case 'PENDING':
      return 'Pendente'
    default:
      return status
  }
}

const getApplicationStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'REJECTED':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    case 'PENDING':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getApplicationStatusIcon = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return <CheckCircle className='w-5 h-5' />
    case 'REJECTED':
      return <XCircle className='w-5 h-5' />
    case 'PENDING':
      return <AlertCircle className='w-5 h-5' />
    default:
      return null
  }
}

const getApplicationStatusLabel = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'Aprovado'
    case 'REJECTED':
      return 'Rejeitado'
    case 'PENDING':
      return 'Pendente'
    default:
      return status
  }
}

export function InvitesDetailsDialog({
  invite,
  children,
}: InvitesDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCopyToken = () => {
    navigator.clipboard.writeText(invite.token)
  }

  const isExpired = new Date(invite.expiresAt) < new Date()

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
          <DialogTitle>Detalhes do Convite</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Invite Status Badge */}
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-muted-foreground'>
              Status do Convite
            </span>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getInviteStatusColor(invite.status)}`}
            >
              {getInviteStatusIcon(invite.status)}
              {getInviteStatusLabel(invite.status)}
            </span>
          </div>

          <Separator />

          {/* Invite Details */}
          <div className='space-y-4'>
            {/* Email */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Email
              </label>
              <p className='text-base text-foreground mt-1 break-all'>
                {invite.email}
              </p>
            </div>

            {/* Token */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Token
              </label>
              <div className='flex items-center gap-2 mt-1'>
                <p className='text-xs text-foreground break-all font-mono'>
                  {invite.token}
                </p>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={handleCopyToken}
                  title='Copiar token'
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {/* Expires At */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Expira em
              </label>
              <p className='text-base text-foreground mt-1'>
                {new Date(invite.expiresAt).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {isExpired && (
                  <span className='text-red-600 dark:text-red-400 ml-2'>
                    (Expirado)
                  </span>
                )}
              </p>
            </div>

            {/* Created At */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Data de Criação
              </label>
              <p className='text-base text-foreground mt-1'>
                {new Date(invite.createdAt).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Application Details Section */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-foreground'>
              Detalhes da Aplicação
            </h3>

            {/* Application Status */}
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-muted-foreground'>
                Status da Aplicação
              </span>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getApplicationStatusColor(invite.application.status)}`}
              >
                {getApplicationStatusIcon(invite.application.status)}
                {getApplicationStatusLabel(invite.application.status)}
              </span>
            </div>

            {/* Name */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Nome
              </label>
              <p className='text-base font-semibold text-foreground mt-1'>
                {invite.application.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Email
              </label>
              <p className='text-base text-foreground mt-1 break-all'>
                {invite.application.email}
              </p>
            </div>

            {/* Company */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Empresa
              </label>
              <p className='text-base text-foreground mt-1'>
                {invite.application.company}
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Motivo
              </label>
              <p className='text-base text-foreground mt-1 leading-relaxed whitespace-pre-wrap'>
                {invite.application.reason}
              </p>
            </div>

            {/* Application Created Date */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Data de Criação da Aplicação
              </label>
              <p className='text-base text-foreground mt-1'>
                {new Date(invite.application.createdAt).toLocaleDateString(
                  'pt-BR',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )}
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
