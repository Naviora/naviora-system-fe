import { isUserRole, type UserRole } from '@/lib/constants/roles'

export const ROLE_CHANGE_EVENT = 'auth:role-change' as const

export interface RoleChangeEventDetail {
  role: UserRole | null
}

const dispatchRoleChangeEvent = (role: UserRole | null) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<RoleChangeEventDetail>(ROLE_CHANGE_EVENT, { detail: { role } }))
}

export const AUTH_STORAGE_KEYS = {
  accessToken: 'auth-token',
  refreshToken: 'refresh-token',
  userRole: 'user-role',
  rememberMe: 'remember-me'
} as const

export const setStoredAuthTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken)
  localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken)
}

export const clearStoredAuthTokens = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken)
}

export const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
}

export const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)
}

export const setStoredUserRole = (role: UserRole) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_STORAGE_KEYS.userRole, role)
  dispatchRoleChangeEvent(role)
}

export const getStoredUserRole = (): UserRole | null => {
  if (typeof window === 'undefined') return null
  const storedRole = localStorage.getItem(AUTH_STORAGE_KEYS.userRole)
  return isUserRole(storedRole) ? storedRole : null
}

export const clearStoredUserRole = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEYS.userRole)
  dispatchRoleChangeEvent(null)
}

export const clearAuthStorage = (options?: { clearRememberMe?: boolean; clearRole?: boolean }) => {
  clearStoredAuthTokens()
  if (options?.clearRole ?? true) {
    clearStoredUserRole()
  }
  if (options?.clearRememberMe) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEYS.rememberMe)
    }
  }
}
