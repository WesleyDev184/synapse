import {
  useLoginMutation,
  useRefreshTokenMutation,
  UserQuery,
} from '@/http/auth/auth.query'
import type { LoginFormData } from '@/http/auth/dto/auth.dto'
import { useAuthStore } from '@/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useAuth = () => {
  const accessToken = useAuthStore(state => state.accessToken)
  const refreshToken = useAuthStore(state => state.refreshToken)
  const userId = useAuthStore(state => state.userId)
  const user = useAuthStore(state => state.user)
  const setTokens = useAuthStore(state => state.setTokens)
  const setUser = useAuthStore(state => state.setUser)
  const logoutStore = useAuthStore(state => state.logout)

  const loginMutation = useLoginMutation()
  const refreshMutation = useRefreshTokenMutation()

  const { data: fetchedUser, refetch: refetchUser } = useQuery({
    ...UserQuery(userId),
    enabled: !!userId && !!accessToken,
  })

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser)
    }
  }, [fetchedUser])

  const login = async (credentials: LoginFormData) => {
    const data = await loginMutation.mutateAsync(credentials)
    setTokens(data.accessToken, data.refreshToken)

    return data
  }

  const logout = () => {
    toast.warning('Logout successful')
    logoutStore()
  }

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const data = await refreshMutation.mutateAsync({ refreshToken })
    setTokens(data.accessToken, refreshToken)
    return data
  }

  const fetchUser = async () => {
    if (userId && !user) {
      const result = await refetchUser()
      return result.data || null
    }
    return user
  }

  const isAuthenticated = !!accessToken && !!userId

  return {
    user,
    userId,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    refreshAccessToken,
  }
}
