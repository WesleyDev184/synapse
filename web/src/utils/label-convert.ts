import type { UserRole, UserStatus } from '@/http/auth/dto/auth.dto'

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  MEMBER: 'Membro',
}
