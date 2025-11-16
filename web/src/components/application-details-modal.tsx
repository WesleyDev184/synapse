import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Application } from '@/http/application/dto/application.dto'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface ApplicationDetailsModalProps {
  application: Application | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (application: Application) => void
  onReject?: (application: Application) => void
  isLoading?: boolean
}

export function ApplicationDetailsModal({
  application,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isLoading = false,
}: ApplicationDetailsModalProps) {
  if (!application) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Detalhes da Aplicação</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Status Badge */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Status
            </label>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}
            >
              {getStatusIcon(application.status)}
              {getStatusLabel(application.status)}
            </span>
          </div>

          {/* Basic Information */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nome
              </label>
              <p className='text-gray-900'>{application.name}</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <p className='text-gray-900'>{application.email}</p>
            </div>
            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Empresa
              </label>
              <p className='text-gray-900'>{application.company}</p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Motivo da Candidatura
            </label>
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
              <p className='text-gray-700 whitespace-pre-wrap'>
                {application.reason}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
            <div>
              <label className='block font-medium text-gray-700 mb-1'>
                Data de Criação
              </label>
              <p>
                {new Date(application.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {application.reviewedById && (
              <div>
                <label className='block font-medium text-gray-700 mb-1'>
                  ID do Revisor
                </label>
                <p className='font-mono text-xs truncate'>
                  {application.reviewedById}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Fechar
          </Button>

          {application.status === 'PENDING' && (
            <>
              <Button
                variant='destructive'
                onClick={() => {
                  if (
                    confirm('Tem certeza que deseja rejeitar esta aplicação?')
                  ) {
                    onReject?.(application)
                    onOpenChange(false)
                  }
                }}
                disabled={isLoading}
              >
                Rejeitar
              </Button>
              <Button
                className='bg-green-600 hover:bg-green-700 text-white'
                onClick={() => {
                  if (
                    confirm('Tem certeza que deseja aprovar esta aplicação?')
                  ) {
                    onApprove?.(application)
                    onOpenChange(false)
                  }
                }}
                disabled={isLoading}
              >
                Aprovar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
