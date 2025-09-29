import { ERROR_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES, type ApiError } from '@/lib/constants'

/**
 * Error handler utility functions
 */
export class ErrorHandler {
  /**
   * Get user-friendly error message
   */
  static getErrorMessage(error: unknown): string {
    if (this.isApiError(error)) {
      // Check if we have a custom message for this error code
      const customMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
      if (customMessage) {
        return customMessage
      }

      // Fallback to error message from API
      return error.message || 'An unexpected error occurred'
    }

    if (error instanceof Error) {
      return error.message
    }

    if (typeof error === 'string') {
      return error
    }

    return 'An unexpected error occurred'
  }

  /**
   * Check if error is an API error
   */
  static isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error
  }

  /**
   * Check if error is a specific error code
   */
  static isErrorCode(error: unknown, code: keyof typeof ERROR_CODES): boolean {
    return this.isApiError(error) && error.code === ERROR_CODES[code]
  }

  /**
   * Check if error is authentication related
   */
  static isAuthError(error: unknown): boolean {
    const authErrorCodes: string[] = [
      ERROR_CODES.INVALID_CREDENTIALS,
      ERROR_CODES.TOKEN_EXPIRED,
      ERROR_CODES.TOKEN_INVALID,
      ERROR_CODES.UNAUTHORIZED_ACCESS,
      ERROR_CODES.INSUFFICIENT_PERMISSIONS,
      ERROR_CODES.EMAIL_NOT_VERIFIED,
      ERROR_CODES.ACCOUNT_LOCKED
    ]

    return this.isApiError(error) && authErrorCodes.includes(error.code)
  }

  /**
   * Check if error is validation related
   */
  static isValidationError(error: unknown): boolean {
    const validationErrorCodes: string[] = [
      ERROR_CODES.VALIDATION_ERROR,
      ERROR_CODES.REQUIRED_FIELD_MISSING,
      ERROR_CODES.INVALID_EMAIL_FORMAT,
      ERROR_CODES.INVALID_PASSWORD_FORMAT,
      ERROR_CODES.PASSWORD_TOO_WEAK,
      ERROR_CODES.PASSWORDS_DO_NOT_MATCH,
      ERROR_CODES.INVALID_INPUT_FORMAT,
      ERROR_CODES.VALUE_OUT_OF_RANGE
    ]

    return this.isApiError(error) && validationErrorCodes.includes(error.code)
  }

  /**
   * Check if error is network related
   */
  static isNetworkError(error: unknown): boolean {
    const networkErrorCodes: string[] = [
      ERROR_CODES.NETWORK_ERROR,
      ERROR_CODES.SERVICE_UNAVAILABLE,
      ERROR_CODES.EXTERNAL_API_ERROR,
      ERROR_CODES.TIMEOUT_ERROR,
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    ]

    return this.isApiError(error) && networkErrorCodes.includes(error.code)
  }

  /**
   * Log error for debugging (in development)
   */
  static logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error ${context ? `in ${context}` : ''}`)
      console.error('Error details:', error)

      if (this.isApiError(error)) {
        console.table({
          Code: error.code,
          Message: error.message,
          Timestamp: error.timestamp
        })

        if (error.details) {
          console.log('Additional details:', error.details)
        }
      }

      console.groupEnd()
    }
  }

  /**
   * Create standardized error response
   */
  static createError(
    code: keyof typeof ERROR_CODES,
    customMessage?: string,
    details?: Record<string, unknown>
  ): ApiError {
    return {
      code: ERROR_CODES[code],
      message: customMessage || ERROR_MESSAGES[ERROR_CODES[code]] || 'An error occurred',
      details,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Success handler utility functions
 */
export class SuccessHandler {
  /**
   * Get success message
   */
  static getSuccessMessage(code: keyof typeof SUCCESS_MESSAGES): string {
    return SUCCESS_MESSAGES[code] || 'Operation completed successfully'
  }

  /**
   * Log success for debugging (in development)
   */
  static logSuccess(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${message}`, data)
    }
  }
}

/**
 * Validation helper functions
 */
export class ValidationHelper {
  /**
   * Check if email is valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Check if password meets requirements
   */
  static isValidPassword(password: string): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Sanitize input string
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '')
  }
}

/**
 * Retry utility for failed operations
 */
export class RetryHelper {
  /**
   * Retry an async operation with exponential backoff
   */
  static async retry<T>(operation: () => Promise<T>, maxAttempts: number = 3, baseDelay: number = 1000): Promise<T> {
    let lastError: unknown

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error

        if (attempt === maxAttempts) {
          break
        }

        // Exponential backoff: 1s, 2s, 4s, ...
        const delay = baseDelay * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }
}
