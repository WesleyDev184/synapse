import z from 'zod'

export enum UserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface User {
  id: string
  name: string
  email: string
  company: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshRequest {
  refreshToken: string
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>
