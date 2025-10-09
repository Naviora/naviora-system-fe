/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { API_CONFIG, HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES, type ApiResponse, type ApiError } from '@/lib/constants'
import { log } from '@/lib/utils/logger'

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: any) => void
  }> = []

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token!)
      }
    })

    this.failedQueue = []
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh-token')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken
      })

      const { access_token, refresh_token: newRefreshToken } = response.data.data

      localStorage.setItem('auth-token', access_token)
      localStorage.setItem('refresh-token', newRefreshToken)

      return access_token
    } catch (error) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('refresh-token')
      localStorage.removeItem('user-role')
      throw error
    }
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth-token')
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        // Log API request
        log.api.request(config.method?.toUpperCase() || 'REQUEST', config.url || '', {
          data: config.data,
          params: config.params
        })

        return config
      },
      (error) => {
        log.error('Request interceptor error', error, {
          function: 'API Request Interceptor'
        })
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log API response
        log.api.response(
          response.config.method?.toUpperCase() || 'RESPONSE',
          response.config.url || '',
          response.status,
          response.data
        )

        return response
      },
      async (error) => {
        const originalRequest = error.config

        // Log API error
        log.api.response(
          error.config?.method?.toUpperCase() || 'ERROR',
          error.config?.url || '',
          error.response?.status || 500,
          error.response?.data
        )

        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && 
            !originalRequest._retry && 
            originalRequest.url !== '/auth/refresh' &&
            originalRequest.url !== '/auth/login') {
          
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return this.client(originalRequest)
            }).catch((err) => {
              return Promise.reject(err)
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const newToken = await this.refreshToken()
            this.processQueue(null, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError, null)
            
            // Redirect to login if refresh fails
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('refresh-token')
            localStorage.removeItem('user-role')
            window.location.href = '/auth/login'
          }
        }

        // Transform error to standardized format
        const apiError: ApiError = {
          code: error.response?.data?.code || ERROR_CODES.INTERNAL_ERROR,
          message:
            error.response?.data?.message ||
            ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR] ||
            error.message ||
            'An unexpected error occurred',
          details: error.response?.data?.errors,
          timestamp: new Date().toISOString()
        }

        return Promise.reject(apiError)
      }
    )
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config)
    return response.data?.data as T
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    return response.data?.data as T
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    return response.data?.data as T
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    return response.data?.data as T
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    return response.data?.data as T
  }

  // Direct access to axios instance if needed
  getInstance(): AxiosInstance {
    return this.client
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient()

// Export axios instance for direct use if needed
export const axios_instance = apiClient.getInstance()
