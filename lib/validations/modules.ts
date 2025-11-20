import { z } from 'zod'

import { API_CONFIG } from '@/lib/constants/config'
import { reviewedExerciseSummarySchema } from '@/lib/validations/lecturer/exams/reviewed-exercise'

const BANNER_URL_BASES = (() => {
  const bases = new Set<string>()

  try {
    const baseFromConfig = new URL(API_CONFIG.BASE_URL)
    bases.add(baseFromConfig.toString())
    bases.add(`${baseFromConfig.origin}/`)
  } catch {
    // Ignore invalid config base URLs
  }

  if (typeof window !== 'undefined') {
    bases.add(`${window.location.origin}/`)
  }

  return Array.from(bases).filter(Boolean)
})()

const isAllowedProtocol = (url: URL) => url.protocol === 'http:' || url.protocol === 'https:'

const normalizeBannerValue = (value: unknown): string | null | undefined => {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  try {
    const absoluteUrl = new URL(trimmed)

    return isAllowedProtocol(absoluteUrl) ? absoluteUrl.toString() : null
  } catch {
    for (const base of BANNER_URL_BASES) {
      try {
        const resolvedUrl = new URL(trimmed, base)

        if (isAllowedProtocol(resolvedUrl)) {
          return resolvedUrl.toString()
        }
      } catch {
        continue
      }
    }

    return null
  }
}

const bannerSchema = z.preprocess(normalizeBannerValue, z.string().url().nullable().optional())

export const paginationSchema = z.object({
  limit: z.number().int().nonnegative(),
  current_page: z.number().int().nonnegative(),
  total_records: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative()
})

export const moduleSchema = z.object({
  module_id: z.string().min(1),
  module_code: z.string().min(1),
  module_name: z.string().min(1),
  module_description: z.string().nullable().optional(),
  banner: bannerSchema,
  class_id: z.string().nullable().optional(),
  created_at: z.string().min(1),
  updated_at: z.string().min(1)
})

const modulesResponseDataSchema = z.object({
  modules: z.array(moduleSchema),
  pagination: paginationSchema
})

export const modulesResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: modulesResponseDataSchema
})

export const moduleResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: moduleSchema
})

export const moduleClassSchema = z.object({
  class_id: z.string().min(1),
  class_code: z.string().min(1),
  class_name: z.string().min(1),
  class_type: z.string().nullable().optional()
})

export const moduleDetailSchema = moduleSchema.extend({
  class: moduleClassSchema.nullable().optional()
})

// Material Schemas
export const materialSchema = z.object({
  material_id: z.string().min(1),
  lecturer_id: z.string().min(1),
  material_name: z.string().min(1),
  material_type: z.enum(['image', 'video', 'pdf', 'document', 'audio', 'other']),
  material_path: z.string().min(1), // Accept both URLs and relative paths
  created_at: z.string().min(1).optional().nullable(),
  updated_at: z.string().min(1).optional().nullable(),
  deleted_at: z.string().nullable().optional(),
  version: z.number().int().optional()
})

export const teachingMaterialSchema = z.object({
  teaching_material_id: z.string().min(1),
  lesson_id: z.string().min(1).optional(),
  material_id: z.string().min(1).optional(),
  content: z.string().nullable().optional(),
  created_at: z.string().min(1).optional().nullable(),
  updated_at: z.string().min(1).optional().nullable(),
  deleted_at: z.string().nullable().optional(),
  version: z.number().int().optional(),
  material: materialSchema.optional(),
  lesson: z
    .object({
      lesson_id: z.string().min(1),
      lesson_name: z.string().min(1),
      lesson_description: z.string().nullable().optional(),
      lesson_content: z.string().nullable().optional(),
      module_id: z.string().min(1).optional(),
      created_at: z.string().min(1).optional().nullable(),
      updated_at: z.string().min(1).optional().nullable(),
      deleted_at: z.string().nullable().optional(),
      version: z.number().int().optional(),
      materials: z.array(materialSchema).optional()
    })
    .optional()
})

export const createTeachingMaterialSchema = z.object({
  lesson_id: z.string().min(1),
  material_id: z.string().min(1),
  content: z.string().optional()
})

export const updateTeachingMaterialSchema = createTeachingMaterialSchema.partial()

export const materialResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: materialSchema
})

export const teachingMaterialResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: teachingMaterialSchema
})

export const lessonSchema = z.object({
  lesson_id: z.string().min(1),
  lesson_name: z.string().min(1),
  lesson_description: z.string().nullable().optional(),
  lesson_content: z.string().nullable().optional(),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
  materials: z.array(materialSchema).optional(),
  is_completed: z.preprocess((val) => (val === null ? false : val), z.boolean().optional()),
  reviewed_exercises: z
    .preprocess((val) => val, z.array(reviewedExerciseSummarySchema))
    .catch(() => [])
    .default([])
})

export const lessonResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: lessonSchema
})

export const createLessonSchema = z.object({
  module_id: z.string().min(1),
  lesson_name: z.string().min(1),
  lesson_description: z.string().optional(),
  lesson_content: z.string().optional()
})

export const updateLessonSchema = createLessonSchema

// Lesson completion schema
export const lessonCompletionResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: z.object({
    lesson_id: z.string().min(1),
    completed: z.boolean(),
    completed_at: z.string().nullable().optional()
  })
})

export const moduleLessonsSchema = moduleSchema.extend({
  lessons: z.array(lessonSchema),
  progress_percent: z.preprocess((val) => (val === null ? 0 : val), z.number().optional())
})

export const moduleDetailResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: moduleDetailSchema
})

export const moduleLessonsResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: moduleLessonsSchema
})

export const classSchema = z.object({
  class_id: z.string().min(1),
  class_code: z.string().min(1),
  class_name: z.string().min(1),
  class_type: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  created_at: z.string().min(1),
  updated_at: z.string().min(1)
})

const classesResponseDataSchema = z.object({
  classes: z.array(classSchema),
  pagination: paginationSchema
})

export const classesResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: classesResponseDataSchema
})

export const createModuleFormSchema = z.object({
  module_code: z.string().min(1, 'Mã chuyên đề là bắt buộc').max(120, 'Mã chuyên đề không được dài quá 120 ký tự'),
  module_name: z.string().min(1, 'Tên chuyên đề là bắt buộc').max(255, 'Tên chuyên đề không được dài quá 255 ký tự'),
  module_description: z
    .string()
    .min(1, 'Mô tả chuyên đề là bắt buộc')
    .max(2000, 'Mô tả chuyên đề không được dài quá 2000 ký tự'),
  class_id: z.string().min(1, 'Vui lòng chọn lớp'),
  banner: z
    .any()
    .refine(
      (value) => value == null || (typeof File !== 'undefined' && value instanceof File),
      'Vui lòng chọn tệp ảnh hợp lệ'
    )
    .transform((value) => {
      if (typeof File === 'undefined') {
        return null
      }

      return value instanceof File ? value : null
    })
    .optional()
})

export type PaginationDto = z.infer<typeof paginationSchema>
export type ModuleDto = z.infer<typeof moduleSchema>
export type ModulesResponseDataDto = z.infer<typeof modulesResponseDataSchema>
export type ModulesResponseDto = z.infer<typeof modulesResponseSchema>
export type ModuleResponseDto = z.infer<typeof moduleResponseSchema>
export type ClassDto = z.infer<typeof classSchema>
export type ClassesResponseDataDto = z.infer<typeof classesResponseDataSchema>
export type ClassesResponseDto = z.infer<typeof classesResponseSchema>
export type CreateModuleFormValues = z.infer<typeof createModuleFormSchema>
export type ModuleClassDto = z.infer<typeof moduleClassSchema>
export type ModuleDetailDto = z.infer<typeof moduleDetailSchema>
export type LessonDto = z.infer<typeof lessonSchema>
export type LessonResponseDto = z.infer<typeof lessonResponseSchema>
export type ModuleLessonsDto = z.infer<typeof moduleLessonsSchema>
export type ModuleDetailResponseDto = z.infer<typeof moduleDetailResponseSchema>
export type ModuleLessonsResponseDto = z.infer<typeof moduleLessonsResponseSchema>
export type CreateLessonPayload = z.infer<typeof createLessonSchema>
export type UpdateLessonPayload = z.infer<typeof updateLessonSchema>
export type MaterialDto = z.infer<typeof materialSchema>
export type TeachingMaterialDto = z.infer<typeof teachingMaterialSchema>
export type CreateTeachingMaterialPayload = z.infer<typeof createTeachingMaterialSchema>
export type UpdateTeachingMaterialPayload = z.infer<typeof updateTeachingMaterialSchema>
export type MaterialResponseDto = z.infer<typeof materialResponseSchema>
export type TeachingMaterialResponseDto = z.infer<typeof teachingMaterialResponseSchema>
export type LessonCompletionResponseDto = z.infer<typeof lessonCompletionResponseSchema>

export interface UpdateModuleFormValues {
  moduleId: string
  data: CreateModuleFormValues
}

export interface CreateLessonFormValues {
  data: CreateLessonPayload
}

export interface UpdateLessonFormValues {
  lessonId: string
  data: UpdateLessonPayload
}
