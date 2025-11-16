import { AxiosInstance } from '@/http/axios-instance'
import { queryOptions, useMutation } from '@tanstack/react-query'
import type {
  CompleteRegistrationFormData,
  CompleteRegistrationResponse,
  InviteData,
  InviteListParams,
  InviteListResponse,
} from './dto/invites.dto'

export const inviteDataQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ['invite', token],
    queryFn: async () => {
      const response = await AxiosInstance.get<InviteData>(
        `/invites/token/${token}`,
      )
      return response.data
    },
  })

export function InvitesListQuery(params: InviteListParams = {}) {
  return queryOptions<InviteListResponse>({
    queryKey: ['invites', params],
    queryFn: async () => {
      const response = await AxiosInstance.get('/invites', {
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

export function useCompleteRegistrationMutation() {
  return useMutation<
    CompleteRegistrationResponse,
    Error,
    { token: string; data: CompleteRegistrationFormData }
  >({
    mutationFn: async ({ token, data }) => {
      const response = await AxiosInstance.post<CompleteRegistrationResponse>(
        `/invites/${token}/complete`,
        data,
      )
      return response.data
    },
  })
}
