export const MODULE_API_ENDPOINT = '/modules'
export const CLASSES_API_ENDPOINT = '/classes'
export const LESSONS_API_ENDPOINT = '/lessons'

export const MODULE_QUERY_DEFAULTS = {
  limit: 12,
  page: 1
} as const

export const CLASS_QUERY_DEFAULTS = {
  limit: 50,
  page: 1
} as const
