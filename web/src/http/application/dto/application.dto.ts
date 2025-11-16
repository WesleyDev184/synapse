import type { PaginatedResponseDto } from '@/http/generics'
import { z } from 'zod'

export const applicationIntentionSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  company: z.string().min(1, { message: 'Empresa é obrigatória' }),
  reason: z
    .string()
    .min(10, { message: 'Motivo deve ter pelo menos 10 caracteres' }),
})

export type ApplicationIntentionFormData = z.infer<
  typeof applicationIntentionSchema
>

export interface ApplicationIntentionResponse {
  id: string
  name: string
  email: string
  company: string
  reason: string
  createdAt: string
}

export interface Application {
  id: string
  name: string
  email: string
  company: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewedById?: string
  createdAt: string
}

export interface ApplicationListParams {
  page?: number
  size?: number
  search?: string
}

export type ApplicationListResponse = PaginatedResponseDto<Application>
