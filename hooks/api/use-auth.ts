import type { LoginFormData, LoginResponse, RefreshTokenFormData, RefreshTokenResponse } from '@/lib/validations/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import {
  AUTH_STORAGE_KEYS,
  clearStoredAuthTokens,
  clearStoredUserRole,
  getStoredAccessToken,
  setStoredAuthTokens,
  setStoredUserRole
} from '@/lib/utils/auth-storage'

export { getStoredUserRole, clearStoredUserRole } from '@/lib/utils/auth-storage'

// Authentication hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => apiClient.post<LoginResponse>('/auth/login', data),
    onSuccess: (response) => {
      if (typeof window !== 'undefined') {
        setStoredAuthTokens(response.access_token, response.refresh_token)
        setStoredUserRole(response.role)
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth'] })
      if (typeof window !== 'undefined') {
        clearStoredAuthTokens()
        clearStoredUserRole()
        localStorage.removeItem(AUTH_STORAGE_KEYS.rememberMe)
      }
    }
  })
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (data: RefreshTokenFormData) => apiClient.post<RefreshTokenResponse>('/auth/refresh', data),
    onSuccess: (response) => {
      if (typeof window !== 'undefined') {
        setStoredAuthTokens(response.access_token, response.refresh_token)
      }
    },
    onError: (error) => {
      console.error('Token refresh failed:', error)
      if (typeof window !== 'undefined') {
        clearStoredAuthTokens()
        clearStoredUserRole()
      }
    }
  })
}

export const isLoggedIn = () => {
  if (typeof window !== 'undefined') {
    const token = getStoredAccessToken()
    return !!token
  }
  return false
}
