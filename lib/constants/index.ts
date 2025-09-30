// Re-export all constants for easy importing
export * from './codes'
export * from './messages'
export * from './config'

// Create a centralized error handler type
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp?: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: ApiError
  success: boolean
  timestamp: string
}
