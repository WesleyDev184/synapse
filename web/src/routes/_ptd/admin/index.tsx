import {
  ApplicationsQuery,
  useApplicationApproveMutation,
  useApplicationRejectMutation,
} from '@/http/application/application.query'
import type {
  Application,
  ApplicationListParams,
} from '@/http/application/dto/application.dto'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import {
  AdminHeader,
  AdminLoadingState,
  ApplicationsTableContainer,
} from './-components/admin-layout'
import { ApplicationPagination } from './-components/application-pagination'
import { ApplicationsTable } from './-components/applications-table'
import { Filters } from './-components/filters'

export const Route = createFileRoute('/_ptd/admin/')({
  component: AdminPage,
})

function AdminPage() {
  return (
    <Suspense fallback={<AdminLoadingState />}>
      <AdminContent />
    </Suspense>
  )
}

function AdminContent() {
  const [params, setParams] = useState<ApplicationListParams>({
    page: 1,
    size: 10,
    search: '',
  })

  const { data } = useSuspenseQuery(ApplicationsQuery(params))
  const approveMutation = useApplicationApproveMutation()
  const rejectMutation = useApplicationRejectMutation()

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

  const handleApprove = (application: Application) => {
    approveMutation.mutate(application.id)
  }

  const handleReject = (application: Application) => {
    rejectMutation.mutate(application.id)
  }

  return (
    <div className='min-full p-8'>
      <div className='max-w-7xl mx-auto'>
        <AdminHeader />

        <Filters
          onSearchSubmit={handleSearch}
          onSizeChange={handleSizeChange}
        />

        <ApplicationsTableContainer>
          <ApplicationsTable
            data={data?.data ?? []}
            onApprove={handleApprove}
            onReject={handleReject}
          />

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
