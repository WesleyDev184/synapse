import { AxiosInstance } from '@/http/axios-instance'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  ApplicationIntentionFormData,
  ApplicationIntentionResponse,
  ApplicationListParams,
  ApplicationListResponse,
} from './dto/application.dto'

export function useApplicationIntentionMutation() {
  return useMutation<
    ApplicationIntentionResponse,
    Error,
    ApplicationIntentionFormData
  >({
    mutationFn: async (data: ApplicationIntentionFormData) => {
      const response = await AxiosInstance.post<ApplicationIntentionResponse>(
        '/applications',
        data,
      )
      return response.data
    },
  })
}

export function useApplicationApproveMutation() {
  const queryClient = useQueryClient()

  return useMutation<any, Error, string>({
    mutationFn: async (id: string) => {
      const response = await AxiosInstance.patch(`applications/${id}/approve`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicationIntentions'] })
    },
  })
}

export function useApplicationRejectMutation() {
  const queryClient = useQueryClient()

  return useMutation<any, Error, string>({
    mutationFn: async (id: string) => {
      const response = await AxiosInstance.patch(`applications/${id}/reject`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicationIntentions'] })
    },
  })
}

export function ApplicationsQuery(params: ApplicationListParams = {}) {
  return queryOptions<ApplicationListResponse>({
    queryKey: ['applicationIntentions', params],
    queryFn: async () => {
      const response = await AxiosInstance.get('/applications', {
        params: {
          page: params.page ?? 1,
          size: params.size ?? 10,
          ...(params.search && { search: params.search }),
        },
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  } as const)
}
