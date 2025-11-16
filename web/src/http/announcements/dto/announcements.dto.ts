import type { PaginatedResponseDto } from '@/http/generics'

export interface User {
  id: string
  name: string
  email: string
  company: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface Announcement {
  id: string
  title: string
  content: string
  authorId: string
  author: User
  createdAt: string
}

export interface AnnouncementListParams {
  page?: number
  size?: number
}

export type AnnouncementListResponse = PaginatedResponseDto<Announcement>
