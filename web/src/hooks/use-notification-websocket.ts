import type { NotificationDTO } from '@/http/notification/dto/notification.dto'
import { notificationSocket } from '@/http/notification/notification-ws'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from './use-auth'

export function useNotificationWebSocket() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const { userId } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    const setupConnection = async () => {
      try {
        await notificationSocket.connect('', userId)
        setIsConnected(true)
        setError(null)

        unsubscribeRef.current = notificationSocket.onNotification(
          (notification: NotificationDTO) => {
            setNotifications(prev => {
              const exists = prev.some(n => n.id === notification.id)
              if (exists) {
                return prev
              }
              return [notification, ...prev]
            })

            // Invalida as queries de tasks para buscar dados atualizados
            queryClient.invalidateQueries({
              queryKey: ['tasks'],
            })

            // Se a notificação está relacionada a uma task específica, invalida também
            if (notification.taskId) {
              queryClient.invalidateQueries({
                queryKey: ['task', notification.taskId],
              })
            }
          },
        )
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao conectar ao Socket.IO'
        console.error('❌ Erro de conexão:', errorMessage)
        setError(errorMessage)
        setIsConnected(false)
      }
    }

    setupConnection()

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
      notificationSocket.disconnect()
      setIsConnected(false)
    }
  }, [userId])

  return {
    notifications,
    isConnected,
    error,
    clearNotifications: () => setNotifications([]),
    removeNotification: (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    },
  }
}
