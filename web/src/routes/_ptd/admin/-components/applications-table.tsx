import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Application } from '@/http/application/dto/application.dto'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AlertCircle, CheckCircle, Eye, XCircle } from 'lucide-react'
import { ApplicationDetailsDialog } from './application-details-dialog'

interface ApplicationsTableProps {
  data: Application[]
  onApprove: (application: Application) => void
  onReject: (application: Application) => void
}

const columnHelper = createColumnHelper<Application>()

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
      return <CheckCircle className='w-4 h-4' />
    case 'REJECTED':
      return <XCircle className='w-4 h-4' />
    case 'PENDING':
      return <AlertCircle className='w-4 h-4' />
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

const columns = (
  onApprove: (application: Application) => void,
  onReject: (application: Application) => void,
) => [
  columnHelper.accessor('name', {
    cell: info => (
      <span className='font-medium text-foreground'>{info.getValue()}</span>
    ),
    header: 'Nome',
  }),
  columnHelper.accessor('email', {
    cell: info => <span className='text-foreground'>{info.getValue()}</span>,
    header: 'Email',
  }),
  columnHelper.accessor('company', {
    cell: info => <span className='text-foreground'>{info.getValue()}</span>,
    header: 'Empresa',
  }),
  columnHelper.accessor('status', {
    cell: info => {
      const status = info.getValue()
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
        >
          {getStatusIcon(status)}
          {getStatusLabel(status)}
        </span>
      )
    },
    header: 'Status',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => new Date(info.getValue()).toLocaleDateString('pt-BR'),
    header: 'Data de Criação',
  }),
  columnHelper.display({
    id: 'actions',
    cell: info => {
      const application = info.row.original
      return (
        <div className='flex gap-2'>
          <ApplicationDetailsDialog
            application={application}
            onApprove={onApprove}
            onReject={onReject}
          >
            <Button
              size='sm'
              variant='outline'
              className='flex items-center gap-1'
            >
              <Eye className='w-4 h-4' />
              Detalhes
            </Button>
          </ApplicationDetailsDialog>

          {application.status === 'PENDING' && (
            <>
              <Button
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white'
                onClick={() => onApprove(application)}
              >
                Aprovar
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => onReject(application)}
              >
                Rejeitar
              </Button>
            </>
          )}
        </div>
      )
    },
    header: 'Ações',
  }),
]

export function ApplicationsTable({
  data,
  onApprove,
  onReject,
}: ApplicationsTableProps) {
  const table = useReactTable({
    columns: columns(onApprove, onReject),
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id} className='whitespace-nowrap'>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className='text-center py-8 text-muted-foreground'
            >
              Nenhuma aplicação encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
