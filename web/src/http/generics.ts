export interface PaginationDto {
  page?: number
  size?: number
  search?: string
}

export interface PaginatedResponseDto<T> {
  page: number
  size: number
  total: number
  totalPages: number
  data: T[]
}

export interface GetCommentsPayload {
  taskId: string
  page?: number
  size?: number
}
