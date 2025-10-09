import { isUserRole, type UserRole } from '@/lib/constants/roles'

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
}

export const getStoredUserRole = (): UserRole | null => {
  if (typeof window === 'undefined') return null
  const storedRole = localStorage.getItem(AUTH_STORAGE_KEYS.userRole)
  return isUserRole(storedRole) ? storedRole : null
}

export const clearStoredUserRole = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEYS.userRole)
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
