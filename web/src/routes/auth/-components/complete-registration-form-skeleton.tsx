import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CompleteRegistrationFormSkeleton() {
  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardHeader className='text-center'>
          <Skeleton className='h-8 w-48 mx-auto mb-2' />
          <Skeleton className='h-4 w-72 mx-auto' />
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            {/* Name Field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Email Field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-3 w-full' />
            </div>

            {/* Company Field */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Submit Button */}
            <Skeleton className='h-10 w-full' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
