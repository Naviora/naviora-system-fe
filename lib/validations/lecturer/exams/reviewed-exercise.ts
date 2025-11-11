import { z } from 'zod'
import { questionSetResponseSchema, userSchema, roleSchema } from '@/lib/validations/lecturer/exams/entry-test'

// Reviewed Exercise CRUD
export const createReviewedExerciseSchema = z.object({
  lessonId: z.string(),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT', 'ARCHIVED', 'PENDING', 'ENDED']),
  startTime: z.string(),
  endTime: z.string(),
  questionSets: z.array(z.string())
})

export const reviewedExerciseSchema = z.object({
  reviewed_exercise_id: z.string(),
  lesson_id: z.string(),
  status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT', 'ARCHIVED', 'PENDING', 'ENDED']).optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  lecturer_id: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable().optional(),
  version: z.number().optional(),
  question_sets: z.array(questionSetResponseSchema).optional(),
  created_by: userSchema.extend({ role: roleSchema }).optional(),
  updated_by: z.any().nullable().optional(),
  lesson: z.any().optional(),
  lecturer: z.any().optional()
}).passthrough()

// Simplified schema for lesson detail response
export const reviewedExerciseSummarySchema = z
  .object({
    reviewed_exercise_id: z.string(),
    lesson_id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().nullable().optional(),
    status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT', 'ARCHIVED', 'PENDING', 'ENDED', 'COMPLETED']).optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    lecturer_id: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    question_sets: z.array(questionSetResponseSchema).optional(),
    is_submitted: z.boolean().optional(),
    student_submissions: z.array(z.any()).optional()
  })
  .passthrough() // Allow additional fields from API

export const getReviewedExercisesResponseSchema = z.object({
  reviewed_exercises: z.array(reviewedExerciseSchema),
  pagination: z.object({
    limit: z.number(),
    current_page: z.number(),
    total_records: z.number(),
    total_pages: z.number()
  })
})

// Reviewed Exercise Submission schemas
export const reviewedExerciseSubmissionSchema = z.object({
  student_id: z.string(),
  reviewed_exercise_id: z.string(),
  question_set_id: z.string(),
  attempt_status: z.enum(['IN_PROGRESS', 'SUBMITTED', 'GRADED', 'CANCELLED']),
  score: z.number().nullable().optional(),
  answered: z.number().nullable().optional(),
  penalty: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
  submitted_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable().optional(),
  version: z.number(),
  reviewed_exercise_submission_id: z.string()
})

export const startReviewedExerciseResponseSchema = z.object({
  status_code: z.number().int(),
  message: z.string(),
  data: reviewedExerciseSubmissionSchema
})

// Types
export type CreateReviewedExerciseRequest = z.infer<typeof createReviewedExerciseSchema>
export type ReviewedExercise = z.infer<typeof reviewedExerciseSchema>
export type ReviewedExerciseSummary = z.infer<typeof reviewedExerciseSummarySchema>
export type GetReviewedExercisesResponse = z.infer<typeof getReviewedExercisesResponseSchema>
export type ReviewedExerciseSubmission = z.infer<typeof reviewedExerciseSubmissionSchema>
export type StartReviewedExerciseResponse = z.infer<typeof startReviewedExerciseResponseSchema>
