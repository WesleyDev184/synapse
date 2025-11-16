import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Application } from '@/http/application/dto/application.dto'
import { AlertCircle, CheckCircle, Eye, XCircle } from 'lucide-react'
import { useState } from 'react'

interface ApplicationDetailsDialogProps {
  application: Application
  onApprove?: (application: Application) => void
  onReject?: (application: Application) => void
  children?: React.ReactNode
}

const getStatusColor = (status: string) => {
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

const getStatusIcon = (status: string) => {
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

const getStatusLabel = (status: string) => {
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

export function ApplicationDetailsDialog({
  application,
  onApprove,
  onReject,
  children,
}: ApplicationDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const status = application.status
  const isApprovedOrRejected = status !== 'PENDING'

  const handleApprove = () => {
    if (onApprove) {
      onApprove(application)
      setIsOpen(false)
    }
  }

  const handleReject = () => {
    if (onReject) {
      onReject(application)
      setIsOpen(false)
    }
  }

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
          <DialogTitle>Detalhes da Aplicação</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Status Badge */}
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-muted-foreground'>
              Status
            </span>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(status)}`}
            >
              {getStatusIcon(status)}
              {getStatusLabel(status)}
            </span>
          </div>

          <Separator />

          {/* Application Details */}
          <div className='space-y-4'>
            {/* Name */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Nome
              </label>
              <p className='text-base font-semibold text-foreground mt-1'>
                {application.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Email
              </label>
              <p className='text-base text-foreground mt-1 break-all'>
                {application.email}
              </p>
            </div>

            {/* Company */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Empresa
              </label>
              <p className='text-base text-foreground mt-1'>
                {application.company}
              </p>
            </div>

            {/* Reason */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Motivo
              </label>
              <p className='text-base text-foreground mt-1 leading-relaxed whitespace-pre-wrap'>
                {application.reason}
              </p>
            </div>

            {/* Created Date */}
            <div>
              <label className='text-sm font-medium text-muted-foreground'>
                Data de Criação
              </label>
              <p className='text-base text-foreground mt-1'>
                {new Date(application.createdAt).toLocaleDateString('pt-BR', {
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

          {/* Action Buttons */}
          {!isApprovedOrRejected && (onApprove || onReject) && (
            <div className='flex gap-3 justify-end'>
              {onReject && (
                <Button variant='destructive' onClick={handleReject}>
                  Rejeitar
                </Button>
              )}
              {onApprove && (
                <Button
                  className='bg-green-600 hover:bg-green-700 text-white'
                  onClick={handleApprove}
                >
                  Aprovar
                </Button>
              )}
            </div>
          )}

          {isApprovedOrRejected && (
            <div className='flex justify-end'>
              <Button variant='outline' onClick={() => setIsOpen(false)}>
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
