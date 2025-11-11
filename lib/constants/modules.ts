export const MODULE_API_ENDPOINT = '/modules'
export const CLASSES_API_ENDPOINT = '/classes'
export const LESSONS_API_ENDPOINT = '/lessons'
export const MATERIALS_API_ENDPOINT = '/materials'
export const MATERIALS_UPLOAD_ENDPOINT = '/materials/upload'
export const TEACHING_MATERIALS_API_ENDPOINT = '/teaching-material'
export const REVIEWED_EXERCISES_API_ENDPOINT = '/reviewed-exercises'

export const MODULE_QUERY_DEFAULTS = {
  limit: 12,
  page: 1
} as const

export const CLASS_QUERY_DEFAULTS = {
  limit: 50,
  page: 1
} as const
