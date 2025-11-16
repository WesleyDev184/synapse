import { AxiosInstance } from '@/http/axios-instance'
import { queryOptions } from '@tanstack/react-query'
import type {
  AnnouncementListParams,
  AnnouncementListResponse,
} from './dto/announcements.dto'

export function announcementsQueryOptions(params: AnnouncementListParams = {}) {
  return queryOptions<AnnouncementListResponse>({
    queryKey: ['announcements', params],
    queryFn: async () => {
      const response = await AxiosInstance.get('/announcements', {
        params: {
          page: params.page ?? 1,
          size: params.size ?? 10,
        },
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  } as const)
}
