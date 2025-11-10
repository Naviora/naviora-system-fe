import { questionSetResponseSchema, roleSchema, userSchema } from '@/lib/validations/lecturer/exams/entry-test'
import { z } from 'zod'
// Final Exam CRUD
export const createFinalExamSchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  questionSets: z.array(z.string())
})

export const finalExamSchema = z.object({
  final_exam_id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT', 'ARCHIVED', 'PENDING', 'ENDED']),
  start_time: z.string(),
  end_time: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number(),
  question_sets: z.array(questionSetResponseSchema),
  created_by: userSchema.extend({ role: roleSchema }),
  updated_by: z.any().nullable()
})

export const getFinalExamsResponseSchema = z.object({
  final_exams: z.array(finalExamSchema),
  pagination: z.object({
    limit: z.number(),
    current_page: z.number(),
    total_records: z.number(),
    total_pages: z.number()
  })
})

// Types
export type CreateFinalExamRequest = z.infer<typeof createFinalExamSchema>
export type FinalExam = z.infer<typeof finalExamSchema>
export type GetFinalExamsResponse = z.infer<typeof getFinalExamsResponseSchema>