'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Suspense, useState } from 'react'
import { AnnouncementsContent } from './announcements-content'

export function AnnouncementsArea() {
  const [page, setPage] = useState(1)

  return (
    <div className='w-full'>
      <Suspense fallback={<AnnouncementsLoading />}>
        <AnnouncementsContent page={page} setPage={setPage} />
      </Suspense>
    </div>
  )
}

function AnnouncementsLoading() {
  return (
    <div className='space-y-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className='h-32 rounded-lg' />
      ))}
    </div>
  )
}
