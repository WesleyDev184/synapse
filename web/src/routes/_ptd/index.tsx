import { createFileRoute, Link } from '@tanstack/react-router'
import { AnnouncementsArea } from './-components/announcements-area'

export const Route = createFileRoute('/_ptd/')({
  component: index,
})

function index() {
  return (
    <div className='flex flex-col justify-start items-center w-full h-full p-2 sm:p-4'>
      <AnnouncementsArea />
      <Link to='/admin'>Go to /_ptd/admin/</Link>
    </div>
  )
}
