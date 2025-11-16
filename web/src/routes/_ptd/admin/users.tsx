import { UsersQuery } from '@/http/auth/auth.query'
import type { PaginationDto } from '@/http/generics'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import {
  AdminLoadingState,
  ApplicationsTableContainer,
} from './-components/admin-layout'
import { ApplicationPagination } from './-components/application-pagination'
import { Filters } from './-components/filters'
import { UsersTable } from './-components/users-table'

export const Route = createFileRoute('/_ptd/admin/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <Suspense fallback={<AdminLoadingState />}>
      <UsersContent />
    </Suspense>
  )
}

function UsersContent() {
  const [params, setParams] = useState<PaginationDto>({
    page: 1,
    size: 10,
    search: '',
  })

  const { data } = useSuspenseQuery(UsersQuery(params))

  const handleSearch = (value: string) => {
    setParams(prev => ({
      ...prev,
      search: value,
      page: 1,
    }))
  }

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({
      ...prev,
      page: newPage,
    }))
  }

  const handleSizeChange = (newSize: number) => {
    setParams(prev => ({
      ...prev,
      size: newSize,
      page: 1,
    }))
  }

  return (
    <div className='min-full p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-foreground'>
            Gerenciamento de Usuários
          </h1>
          <p className='text-muted-foreground mt-2'>
            Visualize e gerencie todos os usuários registrados
          </p>
        </div>

        <Filters
          onSearchSubmit={handleSearch}
          onSizeChange={handleSizeChange}
        />

        <ApplicationsTableContainer>
          <UsersTable data={data?.data ?? []} />

          <ApplicationPagination
            page={params.page ?? 1}
            size={params.size ?? 10}
            total={data?.total ?? 0}
            totalPages={data?.totalPages ?? 0}
            onPageChange={handlePageChange}
          />
        </ApplicationsTableContainer>
      </div>
    </div>
  )
}
