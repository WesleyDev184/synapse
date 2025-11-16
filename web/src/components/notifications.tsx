'use client'

import { useNotificationWebSocket } from '@/hooks/use-notification-websocket'
import {
  NotificationCategoryEnum,
  type NotificationDTO,
} from '@/http/notification/dto/notification.dto'
import { CATEGORY_COLORS } from '@/utils/color-state'
import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, CheckCircle2, MessageSquare, UserPlus, X } from 'lucide-react'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ScrollArea } from './ui/scroll-area'

function getCategoryIcon(category: NotificationCategoryEnum) {
  switch (category) {
    case NotificationCategoryEnum.ASSIGNMENT:
      return <UserPlus className='w-4 h-4' />
    case NotificationCategoryEnum.CHANGE_STATUS:
      return <CheckCircle2 className='w-4 h-4' />
    case NotificationCategoryEnum.NEW_COMMENT:
      return <MessageSquare className='w-4 h-4' />
    default:
      return <Bell className='w-4 h-4' />
  }
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: NotificationDTO
  onRead: (id: string) => void
}) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <div className='p-3 sm:p-4 border-b last:border-b-0 rounded-md bg-card hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors relative'>
      <Link
        to='/task/$taskId'
        params={{ taskId: notification.taskId }}
        className='flex items-start gap-2 sm:gap-3'
      >
        <div
          className={`inline-flex items-center justify-center rounded-md p-1.5 sm:p-2 shrink-0 ${CATEGORY_COLORS[notification.category]}`}
          title={notification.category}
        >
          {getCategoryIcon(notification.category)}
        </div>
        <div className='flex-1 min-w-0 pr-6'>
          <h4 className='font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-50 truncate'>
            {notification.title}
          </h4>
          <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1'>
            {notification.content}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-500 mt-1 sm:mt-2'>
            {timeAgo}
          </p>
        </div>
      </Link>
      <div>
        <Button
          variant='ghost'
          size={'icon'}
          className='absolute top-1 right-1 sm:top-2 sm:right-2 text-xs text-gray-500 dark:text-gray-400 h-6 w-6 sm:h-8 sm:w-8'
          onClick={() => onRead(notification.id)}
        >
          <X className='w-3 h-3 sm:w-4 sm:h-4' />
        </Button>
      </div>
    </div>
  )
}

export function Notifications() {
  const [open, setOpen] = useQueryState(
    'notifications',
    parseAsBoolean.withDefault(false),
  )

  // Hook para receber notificações via Socket.IO
  const {
    notifications: wsNotifications,
    isConnected,
    error,
    removeNotification,
  } = useNotificationWebSocket()

  const unreadCount = wsNotifications.length

  function handleReadNotification(notificationId: string) {
    removeNotification(notificationId)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='relative h-8 w-8 sm:h-10 sm:w-10'
        >
          <Bell className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
          {unreadCount > 0 && (
            <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[calc(100vw-2rem)] sm:w-80 border border-input rounded-md p-2 sm:p-3'
        align='end'
      >
        <div className='border-b px-3 sm:px-4 py-2 sm:py-3'>
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold text-xs sm:text-sm'>Notificações</h2>
            {isConnected && (
              <span className='text-xs text-green-600 dark:text-green-400'>
                ✓ Conectado
              </span>
            )}
            {error && (
              <span className='text-xs text-red-600 dark:text-red-400'>
                ✗ Erro
              </span>
            )}
          </div>
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            {unreadCount} {unreadCount === 1 ? 'notificação' : 'notificações'}
          </p>
        </div>
        <ScrollArea className='max-h-[60vh] sm:max-h-96 overflow-auto'>
          {wsNotifications.length > 0 ? (
            <div className='flex flex-col gap-1 sm:gap-2'>
              {wsNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleReadNotification}
                />
              ))}
            </div>
          ) : (
            <div className='p-6 sm:p-8 text-center'>
              <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                Nenhuma notificação no momento
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
