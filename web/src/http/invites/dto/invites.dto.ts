import type { Application } from '@/http/application/dto/application.dto'
import type { PaginatedResponseDto } from '@/http/generics'
import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  .max(255, { message: 'Senha deve ter no máximo 255 caracteres' })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
    },
  )

export const completeRegistrationSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    .max(255, { message: 'Nome deve ter no máximo 255 caracteres' }),
  email: z.string().email({ message: 'Email deve ser válido' }),
  password: passwordSchema,
  company: z
    .string()
    .max(255, { message: 'Empresa deve ter no máximo 255 caracteres' })
    .optional()
    .or(z.literal('')),
})

export type CompleteRegistrationFormData = z.infer<
  typeof completeRegistrationSchema
>

export interface InviteData {
  id: string
  email: string
  token: string
  expiresAt: string
  status: string
  applicationId: string
  application: {
    id: string
    name: string
    email: string
    company: string
    reason: string
    status: string
    reviewedById: string
    createdAt: string
  }
  createdAt: string
}

export interface Invite {
  id: string
  email: string
  token: string
  expiresAt: string
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED'
  applicationId: string
  application: Application
  createdAt: string
}

export interface InviteListParams {
  page?: number
  size?: number
  search?: string
}

export type InviteListResponse = PaginatedResponseDto<Invite>

export interface CompleteRegistrationResponse {
  id: string
  email: string
  name: string
  status: string
  createdAt: string
}
