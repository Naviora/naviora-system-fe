import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query'

import { axios_instance } from '@/lib/api/client'
import { z } from 'zod'

const REVIEWED_EXERCISE_API = '/reviewed-exercise'

// Schemas for reviewed exercise submission
export const startReviewedExerciseRequestSchema = z.object({
  reviewedExerciseId: z.string().uuid()
})

export const answeredQuestionSchema = z.object({
  questionId: z.string(),
  answerId: z.string()
})

export const submitReviewedExerciseRequestSchema = z.object({
  answered: z.array(answeredQuestionSchema)
})

// Response schemas
export const startReviewedExerciseResponseSchema = z.object({
  reviewed_exercise_id: z.string(),
  question_set_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  question_set: z.object({
    question_set_id: z.string(),
    config: z.object({
      general: z.object({
        total_questions: z.number(),
        duration_minutes: z.number()
      }),
      scoring: z.object({
        passing_score: z.number()
      })
    }),
    questions: z.array(z.any()).optional()
  })
})

export const submitReviewedExerciseResponseSchema = z.object({
  score: z.number(),
  passed: z.boolean(),
  total_questions: z.number(),
  answered: z.array(answeredQuestionSchema),
  reviewed_exercise: z.object({
    reviewed_exercise_id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    status: z.string()
  })
})

// Types
export type StartReviewedExerciseRequest = z.infer<typeof startReviewedExerciseRequestSchema>
export type AnsweredQuestion = z.infer<typeof answeredQuestionSchema>
export type SubmitReviewedExerciseRequest = z.infer<typeof submitReviewedExerciseRequestSchema>
export type StartReviewedExerciseResponse = z.infer<typeof startReviewedExerciseResponseSchema>
export type SubmitReviewedExerciseResponse = z.infer<typeof submitReviewedExerciseResponseSchema>

// API Requests
const startReviewedExerciseRequest = async (
  payload: StartReviewedExerciseRequest
): Promise<StartReviewedExerciseResponse> => {
  const parsedPayload = startReviewedExerciseRequestSchema.parse(payload)
  const response = await axios_instance.post(`${REVIEWED_EXERCISE_API}/start`, parsedPayload)
  return startReviewedExerciseResponseSchema.parse(response.data.data)
}

const submitReviewedExerciseRequest = async (
  reviewedExerciseId: string,
  questionSetId: string,
  payload: SubmitReviewedExerciseRequest
): Promise<SubmitReviewedExerciseResponse> => {
  const parsedPayload = submitReviewedExerciseRequestSchema.parse(payload)
  const response = await axios_instance.post(
    `${REVIEWED_EXERCISE_API}/submit/${reviewedExerciseId}/${questionSetId}`,
    parsedPayload
  )
  return submitReviewedExerciseResponseSchema.parse(response.data.data)
}

// Hooks
export const useStartReviewedExercise = (
  options?: UseMutationOptions<StartReviewedExerciseResponse, unknown, StartReviewedExerciseRequest>
): UseMutationResult<StartReviewedExerciseResponse, unknown, StartReviewedExerciseRequest> => {
  return useMutation({
    mutationFn: startReviewedExerciseRequest,
    ...options
  })
}

export const useSubmitReviewedExercise = (
  options?: UseMutationOptions<
    SubmitReviewedExerciseResponse,
    unknown,
    { reviewedExerciseId: string; questionSetId: string; data: SubmitReviewedExerciseRequest }
  >
): UseMutationResult<
  SubmitReviewedExerciseResponse,
  unknown,
  { reviewedExerciseId: string; questionSetId: string; data: SubmitReviewedExerciseRequest }
> => {
  return useMutation({
    mutationFn: ({ reviewedExerciseId, questionSetId, data }) =>
      submitReviewedExerciseRequest(reviewedExerciseId, questionSetId, data),
    ...options
  })
}
