import { formatRoleLabel, mapRoleNameToUserRole } from '@/lib/constants/roles'
import type { RoleDto, RoleOption } from '@/types/api/roles'

export const parseRolePermissions = (permissions: string): string[] =>
  permissions
    .split(',')
    .map((permission) => permission.trim())
    .filter(Boolean)

export const toRoleOption = (role: RoleDto): RoleOption | null => {
  const value = mapRoleNameToUserRole(role.name)

  if (!value) {
    return null
  }

  return {
    id: role.id,
    value,
    label: formatRoleLabel(value) ?? role.name,
    description: role.description,
    isActive: role.isActive,
    permissions: parseRolePermissions(role.permissions),
    raw: role
  }
}
