// Unified export for all utility functions
export * from './error-handler'
export * from './logger'

// Re-export commonly used utilities with cleaner names for convenience
export { ErrorHandler as errorHandler } from './error-handler'
export { SuccessHandler as successHandler } from './error-handler'
export { ValidationHelper as validation } from './error-handler'
export { RetryHelper as retry } from './error-handler'
export { logger, log } from './logger'
