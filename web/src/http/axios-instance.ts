import { useAuthStore } from '@/stores/auth-store'
import { getEnv } from '@/utils/env-manager'
import axios from 'axios'
import type { AuthResponse } from './auth/dto/auth.dto'

export const AxiosInstance = axios.create({
  baseURL: getEnv().VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

AxiosInstance.interceptors.request.use(
  config => {
    const state = useAuthStore.getState()
    const accessToken = state.accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

AxiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const state = useAuthStore.getState()
        const refreshToken = state.refreshToken
        const accessToken = state.accessToken

        if (!refreshToken) {
          state.logout()
          return Promise.reject(error)
        }

        if (!accessToken) {
          state.logout()
          return Promise.reject(error)
        }

        const response = await axios.post<AuthResponse>(
          `${getEnv().VITE_API_URL}/auth/refresh-token`,
          { refreshToken },
        )

        const { accessToken: newAccessToken } = response.data
        state.setTokens(newAccessToken, refreshToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return AxiosInstance(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
