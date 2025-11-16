import { getEnv } from '@/utils/env-manager'
import { io, type Socket } from 'socket.io-client'

export class NotificationSocket {
  private socket: Socket | null = null
  private userId: string | null = null
  private notificationListeners: Set<(notification: any) => void> = new Set()
  private isListeningForNotifications = false

  constructor() {}

  connect(token?: string, userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${getEnv().VITE_WEBSOCKET_URL}/notifications`

        const options: any = {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        }

        if (token) {
          options.auth = { token }
        }

        this.socket = io(wsUrl, options)
        this.userId = userId || null

        this.socket.on('connect', () => {
          console.log('✓ Socket conectado:', this.socket?.id)
          resolve()
        })

        this.socket.on('connect_error', (error: any) => {
          console.error('❌ Erro de conexão:', error)
          reject(error)
        })

        this.socket.on('disconnect', (reason: any) => {
          console.log('✗ Socket desconectado:', reason)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect()
    }
  }

  onNotification(callback: (notification: any) => void): () => void {
    if (!this.socket) {
      console.warn('Socket não está conectado')
      return () => {}
    }

    const eventName = this.userId
      ? `notification.${this.userId}`
      : 'notification'

    console.log(`📡 Escutando evento: ${eventName}`)

    this.notificationListeners.add(callback)

    if (this.isListeningForNotifications) {
      console.log(
        'ℹ️ Já está escutando notificações, adicionando novo listener',
      )
      return () => {
        this.notificationListeners.delete(callback)
      }
    }

    this.isListeningForNotifications = true
    this.socket.on(eventName, (notification: any) => {
      console.log('📬 Notificação recebida no Socket:', notification)
      this.notificationListeners.forEach(cb => {
        cb(notification)
      })
    })

    return () => {
      this.notificationListeners.delete(callback)
      if (this.notificationListeners.size === 0) {
        console.log('ℹ️ Nenhum listener ativo, removendo listener Socket.IO')
        this.socket?.off(eventName)
        this.isListeningForNotifications = false
      }
    }
  }

  on(eventName: string, callback: (data: any) => void): () => void {
    if (!this.socket) {
      console.warn('Socket não está conectado')
      return () => {}
    }

    this.socket.on(eventName, callback)

    return () => {
      this.socket?.off(eventName, callback)
    }
  }

  emit(eventName: string, data?: any): void {
    if (!this.socket?.connected) {
      console.warn('Socket não está conectado')
      return
    }

    this.socket.emit(eventName, data)
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }
}

export const notificationSocket = new NotificationSocket()
