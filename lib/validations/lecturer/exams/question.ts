import { z } from 'zod'
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/lib/constants/exams'

const QUESTION_TYPE_VALUES = QUESTION_TYPES.filter((t) => t.value !== 'ALL').map((t) => t.value)
const DIFFICULTY_LEVEL_VALUES = DIFFICULTY_LEVELS.filter((d) => d.value !== 'ALL').map((d) => d.value)

export const answerSchema = z.object({
  answer_id: z.string(),
  content: z.string(),
  is_correct: z.boolean(),
  additional_image: z.string().url().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number()
})

export const questionSchema = z.object({
  question_id: z.string(),
  lesson_id: z.string(),
  content: z.string(),
  type: z.enum(QUESTION_TYPE_VALUES as [string, ...string[]]),
  difficulty: z.enum(DIFFICULTY_LEVEL_VALUES as [string, ...string[]]),
  additional_image: z.string().url().nullable(),
  correct_answer_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  version: z.number(),
  answers: z.array(answerSchema)
})

export const paginationSchema = z.object({
  limit: z.number(),
  current_page: z.number(),
  total_records: z.number(),
  total_pages: z.number()
})

export const getQuestionsResponseSchema = z.object({
  questions: z.array(questionSchema),
  pagination: paginationSchema
})


export const createAnswerSchema = z.object({
  content: z.string(),
  isCorrect: z.boolean()
})

export const createQuestionSchema = z.object({
  lesson_id: z.string().nullable,
  content: z.string(),
  type: z.enum(QUESTION_TYPE_VALUES as [string, ...string[]]),
  difficulty: z.enum(DIFFICULTY_LEVEL_VALUES as [string, ...string[]]),
  additional_image: z.string().nullable(),
  answers: z.array(createAnswerSchema).min(1)
})

export const updateAnswerSchema = z.object({
  answer_id: z.string(),
  content: z.string(),
  is_correct: z.boolean(),
})

export const updateQuestionSchema = z.object({
  content: z.string(),
  type: z.enum(QUESTION_TYPE_VALUES as [string, ...string[]]),
  difficulty: z.enum(DIFFICULTY_LEVEL_VALUES as [string, ...string[]]),
  lesson_id: z.string(),
  additional_image: z.string().nullable(),
  answers: z.array(updateAnswerSchema).min(1)
})

export type Answer = z.infer<typeof answerSchema>
export type Question = z.infer<typeof questionSchema>
export type Pagination = z.infer<typeof paginationSchema>
export type GetQuestionsResponse = z.infer<typeof getQuestionsResponseSchema>
export type CreateQuestionRequest = z.infer<typeof createQuestionSchema>
export type UpdateQuestionRequest = z.infer<typeof updateQuestionSchema>