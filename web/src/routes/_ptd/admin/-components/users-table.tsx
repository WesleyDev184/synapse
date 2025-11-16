import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { User, UserRole, UserStatus } from '@/http/auth/dto/auth.dto'
import { ROLE_LABELS, USER_STATUS_LABELS } from '@/utils/label-convert'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { UsersDetailsDialog } from './users-details-dialog'

interface UsersTableProps {
  data: User[]
  onViewDetails?: (user: User) => void
}

const columnHelper = createColumnHelper<User>()

const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'INACTIVE':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
    default:
      return 'bg-muted text-muted-foreground'
  }
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

const columns = [
  columnHelper.accessor('email', {
    cell: info => (
      <span className='font-medium text-foreground'>{info.getValue()}</span>
    ),
    header: 'Email',
  }),
  columnHelper.accessor('name', {
    cell: info => <span className='text-foreground'>{info.getValue()}</span>,
    header: 'Nome',
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
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
        >
          {USER_STATUS_LABELS[status]}
        </span>
      )
    },
    header: 'Status',
  }),
  columnHelper.accessor('role', {
    cell: info => {
      const role = info.getValue()
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
        >
          {ROLE_LABELS[role]}
        </span>
      )
    },
    header: 'Função',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => {
      const date = new Date(info.getValue() as Date)
      return (
        <span className='text-muted-foreground'>
          {date.toLocaleDateString('pt-BR')}
        </span>
      )
    },
    header: 'Data de Cadastro',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <UsersDetailsDialog user={row.original}>
        <Button size='sm' variant='outline' className='flex items-center gap-1'>
          <Eye className='w-4 h-4' />
          Detalhes
        </Button>
      </UsersDetailsDialog>
    ),
  }),
]

export function UsersTable({ data }: UsersTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
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
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='text-center py-8 text-muted-foreground'
              >
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}
