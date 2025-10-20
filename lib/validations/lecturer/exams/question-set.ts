import { questionSchema } from '@/lib/validations/lecturer/exams/question'
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

export const createQuestionSetSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema),
  config: z.object({
    general: z.object({
      duration_minutes: z.number(),
      total_questions: z.number(),
      allow_review: z.boolean(),
      shuffle_questions: z.boolean(),
      shuffle_answers: z.boolean()
    }),
    scoring: z.object({
      per_question: z.boolean(),
      passing_score: z.number()
    }),
    behavior: z.object({
      show_correct_after_submit: z.boolean(),
      max_attempts: z.number()
    }),
    composition: z.object({
      question_sources: z.array(z.string()).nullable,
      topics: z.array(z.any()).nullable
    }),
    proctoring: z.object({
      enable_tab_tracking: z.boolean(),
      enable_copy_paste_restriction: z.boolean()
    })
  })
})


export type Lecturer = z.infer<typeof lecturerSchema>
export type QuestionSet = z.infer<typeof questionSetSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type GetQuestionSetsResponse = z.infer<typeof getQuestionSetsResponseSchema>
export type CreateQuestionSetRequest = z.infer<typeof createQuestionSetSchema>