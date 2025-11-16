import { Button } from '@/components/ui/button'

interface ApplicationPaginationProps {
  page: number
  size: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ApplicationPagination({
  page,
  size,
  total,
  totalPages,
  onPageChange,
}: ApplicationPaginationProps) {
  const startIndex = (page - 1) * size + 1
  const endIndex = Math.min(page * size, total)

  return (
    <div className='bg-card px-6 py-4 border-t border-border flex items-center justify-between gap-4 flex-wrap'>
      <div className='text-sm text-muted-foreground'>
        Mostrando{' '}
        <span className='font-medium text-foreground'>{startIndex}</span> até{' '}
        <span className='font-medium text-foreground'>{endIndex}</span> de{' '}
        <span className='font-medium text-foreground'>{total}</span> aplicações
      </div>

      <div className='flex gap-2 flex-wrap'>
        <Button
          variant='outline'
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>

        <div className='flex items-center gap-1'>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index + 1}
              variant={page === index + 1 ? 'default' : 'outline'}
              size='sm'
              onClick={() => onPageChange(index + 1)}
              className='w-10'
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <Button
          variant='outline'
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
