import type { User } from '@/http/auth/dto/auth.dto'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  user: User | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User | null) => void
  logout: () => void
}

function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    )
    return decoded
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      user: null,
      setTokens: (accessToken: string, refreshToken: string) => {
        const decoded = decodeJWT(accessToken)
        const userId = decoded?.sub || decoded?.userId || null

        set({
          accessToken,
          refreshToken,
          userId,
        })
      },
      setUser: (user: User | null) => {
        set({ user })
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          user: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
      }),
    },
  ),
)
