import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query'

import { axios_instance } from '@/lib/api/client'
import { z } from 'zod'
import {
  reviewedExerciseSubmissionSchema,
  reviewedExerciseSubmissionDetailSchema,
  type ReviewedExerciseSubmission,
  type ReviewedExerciseSubmissionDetail
} from '@/lib/validations/lecturer/exams/reviewed-exercise'

const REVIEWED_EXERCISE_API = '/reviewed-exercise'

// Schemas for reviewed exercise submission
export const startReviewedExerciseRequestSchema = z.object({
  reviewedExerciseId: z.string()
})

export const answeredQuestionSchema = z.object({
  questionId: z.string(),
  answerId: z.string()
})

export const submitReviewedExerciseRequestSchema = z.object({
  answered: z.array(answeredQuestionSchema)
})

// Types
export type StartReviewedExerciseRequest = z.infer<typeof startReviewedExerciseRequestSchema>
export type AnsweredQuestion = z.infer<typeof answeredQuestionSchema>
export type SubmitReviewedExerciseRequest = z.infer<typeof submitReviewedExerciseRequestSchema>
export type StartReviewedExerciseResponse = ReviewedExerciseSubmission
export type SubmitReviewedExerciseResponse = {
  score: number
  passed: boolean
  total_questions: number
  answered: AnsweredQuestion[]
  submission: ReviewedExerciseSubmissionDetail
}

// API Requests
const startReviewedExerciseRequest = async (
  payload: StartReviewedExerciseRequest
): Promise<StartReviewedExerciseResponse> => {
  const parsedPayload = startReviewedExerciseRequestSchema.parse(payload)
  const response = await axios_instance.post(`${REVIEWED_EXERCISE_API}/start`, parsedPayload)
  return reviewedExerciseSubmissionSchema.parse(response.data.data)
}

const submitReviewedExerciseRequest = async (
  reviewedExerciseId: string,
  questionSetId: string,
  payload: SubmitReviewedExerciseRequest
): Promise<SubmitReviewedExerciseResponse> => {
  const parsedPayload = submitReviewedExerciseRequestSchema.parse(payload)
  const response = await axios_instance.post(
    `${REVIEWED_EXERCISE_API}/submit/${reviewedExerciseId}&${questionSetId}`,
    parsedPayload
  )
  const submission = reviewedExerciseSubmissionDetailSchema.parse(response.data.data)

  const totalQuestions = submission.question_set.config.general.total_questions ?? submission.answered.length
  const passingScore = submission.question_set.config.scoring.passing_score
  const answered: AnsweredQuestion[] = submission.answered.map((answer) => ({
    questionId: answer.question_id,
    answerId: answer.answer_id
  }))

  return {
    score: submission.score ?? 0,
    passed: (submission.score ?? 0) >= passingScore,
    total_questions: totalQuestions,
    answered,
    submission
  }
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
