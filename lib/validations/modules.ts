import { z } from 'zod'

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
  banner: z.string().url().nullable().optional(),
  class_id: z.string().nullable().optional(),
  created_at: z.string().min(1),
  updated_at: z.string().min(1)
})

export const modulesResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: z.array(moduleSchema),
  pagination: paginationSchema
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

export const lessonSchema = z.object({
  lesson_id: z.string().min(1),
  lesson_name: z.string().min(1),
  lesson_description: z.string().nullable().optional(),
  created_at: z.string().min(1),
  updated_at: z.string().min(1)
})

export const lessonResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: lessonSchema
})

export const createLessonSchema = z.object({
  module_id: z.string().min(1),
  lesson_name: z.string().min(1),
  lesson_description: z.string().optional()
})

export const updateLessonSchema = createLessonSchema

export const moduleLessonsSchema = moduleSchema.extend({
  lessons: z.array(lessonSchema)
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

export const classesResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: z.array(classSchema),
  pagination: paginationSchema
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
export type ModulesResponseDto = z.infer<typeof modulesResponseSchema>
export type ModuleResponseDto = z.infer<typeof moduleResponseSchema>
export type ClassDto = z.infer<typeof classSchema>
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
