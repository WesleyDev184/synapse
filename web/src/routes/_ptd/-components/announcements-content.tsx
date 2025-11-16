'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { announcementsQueryOptions } from '@/http/announcements/announcements.query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AnnouncementsContentProps {
  page: number
  setPage: (page: number) => void
}

export function AnnouncementsContent({
  page,
  setPage,
}: AnnouncementsContentProps) {
  const { data } = useSuspenseQuery(
    announcementsQueryOptions({ page, size: 5 }),
  )

  if (data.data.length === 0) {
    return (
      <div className='flex justify-center items-center h-32'>
        <p className='text-gray-500 dark:text-gray-400'>
          Nenhum anúncio disponível
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-2 bg-secondary py-2 rounded-lg border shadow-md'>
      <div className='flex items-center justify-start gap-2 px-4'>
        <div className='rounded-full h-5 w-5 bg-primary'></div>
        <h1 className='text-xl font-bold'>Anúncios</h1>
      </div>
      <div className='flex gap-3 w-full justify-center items-center'>
        {data.data.map(announcement => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle>{announcement.title}</CardTitle>
                  <CardDescription>{announcement.content}</CardDescription>
                </div>
                <span className='text-sm text-muted-foreground'>
                  {formatDistanceToNow(new Date(announcement.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex items-center text-sm'>
                <span className='font-medium'>{announcement.author.name}</span>
                <span className='mx-2'>•</span>
                <span>{announcement.author.email}</span>
                <span className='mx-2'>•</span>
                <span className='bg-secondary px-2 py-1 rounded text-xs'>
                  {announcement.author.role}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {data.totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 mt-6'>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800'
          >
            Anterior
          </button>

          <div className='flex items-center gap-1'>
            {Array.from({ length: data.totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-2 rounded-lg ${
                  page === i + 1
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800'
          >
            Próximo
          </button>
        </div>
      )}

      {/* Info de paginação */}
      <div className='text-center text-sm text-muted-foreground mt-4'>
        Página {data.page} de {data.totalPages} • Total de {data.total}{' '}
        anúncio(s)
      </div>
    </div>
  )
}
