export const USER_ROLE_VALUES = ['Admin', 'Student', 'User', 'Lecturer', 'Principal'] as const

export type UserRole = (typeof USER_ROLE_VALUES)[number]

export const ROLE_API_ENDPOINT = '/roles'

export const DEFAULT_USER_ROLE: UserRole = 'User'

const ROLE_NAME_MAP: Record<string, UserRole> = {
  admin: 'Admin',
  student: 'Student',
  user: 'User',
  lecturer: 'Lecturer',
  principal: 'Principal'
}

export const normalizeRoleName = (name: string) => name.trim().toLowerCase()

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && USER_ROLE_VALUES.includes(value as UserRole)

export const mapRoleNameToUserRole = (name: string): UserRole | null => {
  const normalized = normalizeRoleName(name)
  return ROLE_NAME_MAP[normalized] ?? null
}

export const formatRoleLabel = (role: UserRole) => {
  switch (role) {
    case 'Admin':
      return 'Admin'
    case 'Student':
      return 'Student'
    case 'User':
      return 'User'
    case 'Lecturer':
      return 'Lecturer'
    case 'Principal':
      return 'Principal'
    default:
      return role
  }
}
