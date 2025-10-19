import { z } from 'zod'

export const lecturerSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().nullable()
})

export const questionSetSchema = z.object({
  question_set_id: z.string(),
  title: z.string(),
  description: z.string(),
  total_questions: z.number(),
  duration_minutes: z.number(),
  lecturer: lecturerSchema,
  created_at: z.string(),
  updated_at: z.string()
})

export const paginationSchema = z.object({
  limit: z.number(),
  current_page: z.number(),
  total_records: z.number(),
  total_pages: z.number()
})

export const getQuestionSetsResponseSchema = z.object({
  question_sets: z.array(questionSetSchema),
  pagiantion: paginationSchema
})

export type Lecturer = z.infer<typeof lecturerSchema>
export type QuestionSet = z.infer<typeof questionSetSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type GetQuestionSetsResponse = z.infer<typeof getQuestionSetsResponseSchema>
