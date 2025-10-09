import type { UserRole } from '@/lib/constants/roles'

export interface RoleDto {
  id: number
  name: string
  description: string
  isActive: boolean
  permissions: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  version: number
}

export interface RolesPayload {
  statusCode: number
  message: string
  data: RoleDto[]
}

export interface RoleOption {
  id: number
  value: UserRole
  label: string
  description?: string
  isActive: boolean
  permissions: string[]
  raw: RoleDto
}
