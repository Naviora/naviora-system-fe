import type { 
  LoginFormData, 
  LoginResponse, 
  RefreshTokenFormData, 
  RefreshTokenResponse 
} from '@/lib/validations/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

// Authentication hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => 
      apiClient.post<LoginResponse>('/auth/login', data),
    onSuccess: (response) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', response.access_token)
        localStorage.setItem('refresh-token', response.refresh_token)
        localStorage.setItem('user-role', response.role)
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
        localStorage.removeItem('auth-token')
        localStorage.removeItem('refresh-token')
        localStorage.removeItem('user-role')
        localStorage.removeItem('remember-me')
      }
    }
  })
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (data: RefreshTokenFormData) => 
      apiClient.post<RefreshTokenResponse>('/auth/refresh', data),
    onSuccess: (response) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', response.access_token)
        localStorage.setItem('refresh-token', response.refresh_token)
      }
    },
    onError: (error) => {
      console.error('Token refresh failed:', error)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('refresh-token')
        localStorage.removeItem('user-role')
      }
    }
  })
}

export const isLoggedIn = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    return !!token
  }
  return false
}