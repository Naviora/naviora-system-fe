'use client'
import type { LoginFormData, LoginResponse, RefreshTokenFormData, RefreshTokenResponse } from '@/lib/validations/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import {
  AUTH_STORAGE_KEYS,
  clearStoredAuthTokens,
  clearStoredUserRole,
  getStoredAccessToken,
  setStoredAuthTokens,
  setStoredUserRole,
  setStoredHasParticipatedEntryTest,
  clearStoredHasParticipatedEntryTest
} from '@/lib/utils/auth-storage'
import { useRouter } from 'next/navigation'

export { getStoredUserRole, clearStoredUserRole } from '@/lib/utils/auth-storage'

// Authentication hooks
export const useLogin = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: (data: LoginFormData) => apiClient.post<LoginResponse>('/auth/login', data),
    onSuccess: async (response) => {
      if (typeof window !== 'undefined') {
        setStoredAuthTokens(response.access_token, response.refresh_token)
        setStoredUserRole(response.role)
        if (response.role === 'Student') {
          setStoredHasParticipatedEntryTest(!!response.has_participated_entry_test)
        } else {
          clearStoredHasParticipatedEntryTest()
        }
        // Also set secure HttpOnly cookies via Next.js route handler
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: response.access_token, role: response.role })
        }).catch(() => {})
        router.push(`/${response.role.toLowerCase()}/dashboard`)
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['auth'] })
      if (typeof window !== 'undefined') {
        clearStoredAuthTokens()
        clearStoredUserRole()
        clearStoredHasParticipatedEntryTest()
        localStorage.removeItem(AUTH_STORAGE_KEYS.rememberMe)
        // Clear HttpOnly cookies on logout
        await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {})
        router.push('/login')
      }
    }
  })
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (data: RefreshTokenFormData) => apiClient.post<RefreshTokenResponse>('/auth/refresh', data),
    onSuccess: async (response) => {
      if (typeof window !== 'undefined') {
        setStoredAuthTokens(response.access_token, response.refresh_token)
        // Refresh HttpOnly cookie with new access token
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: response.access_token })
        }).catch(() => {})
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
