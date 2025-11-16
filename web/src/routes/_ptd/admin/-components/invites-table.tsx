import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Invite } from '@/http/invites/dto/invites.dto'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AlertCircle, CheckCircle, Copy, Eye } from 'lucide-react'
import { InvitesDetailsDialog } from './invites-details-dialog'

interface InvitesTableProps {
  data: Invite[]
}

const columnHelper = createColumnHelper<Invite>()

const getStatusColor = (status: string) => {
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle className='w-4 h-4' />
    case 'EXPIRED':
      return <AlertCircle className='w-4 h-4' />
    case 'PENDING':
      return <AlertCircle className='w-4 h-4' />
    default:
      return null
  }
}

const getStatusLabel = (status: string) => {
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

const columns = [
  columnHelper.accessor('email', {
    cell: info => (
      <span className='font-medium text-foreground'>{info.getValue()}</span>
    ),
    header: 'Email',
  }),
  columnHelper.accessor('application.name', {
    cell: info => <span className='text-foreground'>{info.getValue()}</span>,
    header: 'Nome da Aplicação',
  }),
  columnHelper.accessor('application.company', {
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
    header: 'Status do Convite',
  }),
  columnHelper.accessor('application.status', {
    cell: info => {
      const status = info.getValue()
      const statusColor =
        status === 'APPROVED'
          ? 'text-green-600 dark:text-green-400'
          : status === 'REJECTED'
            ? 'text-red-600 dark:text-red-400'
            : 'text-yellow-600 dark:text-yellow-400'
      return <span className={statusColor}>{status}</span>
    },
    header: 'Status da Aplicação',
  }),
  columnHelper.accessor('expiresAt', {
    cell: info => new Date(info.getValue()).toLocaleDateString('pt-BR'),
    header: 'Expira em',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => new Date(info.getValue()).toLocaleDateString('pt-BR'),
    header: 'Data de Criação',
  }),
  columnHelper.display({
    id: 'actions',
    cell: info => {
      const invite = info.row.original
      const handleCopyToken = () => {
        navigator.clipboard.writeText(invite.token)
      }

      return (
        <div className='flex gap-2'>
          <InvitesDetailsDialog invite={invite}>
            <Button
              size='sm'
              variant='outline'
              className='flex items-center gap-1'
            >
              <Eye className='w-4 h-4' />
              Detalhes
            </Button>
          </InvitesDetailsDialog>
          {invite.status === 'PENDING' && (
            <Button
              size='sm'
              variant='ghost'
              className='flex items-center gap-1'
              onClick={handleCopyToken}
              title={invite.token}
            >
              <Copy className='w-4 h-4' />
              Token
            </Button>
          )}
        </div>
      )
    },
    header: 'Ações',
  }),
]

export function InvitesTable({ data }: InvitesTableProps) {
  const table = useReactTable({
    columns,
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
              colSpan={8}
              className='text-center py-8 text-muted-foreground'
            >
              Nenhum convite encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
