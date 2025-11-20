import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'
import { z } from 'zod'

const FINAL_EXAM_SUBMISSION_API = '/final-exam'

const attemptStatusEnum = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'GRADED', 'CANCELLED'])

const startFinalExamRequestSchema = z.object({
  finalExamId: z.string()
})

const finalExamSessionSchema = z.object({
  final_exam_submission_id: z.string(),
  final_exam_id: z.string(),
  question_set_id: z.string(),
  attempt_status: attemptStatusEnum,
  student_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

const answeredQuestionSchema = z.object({
  questionId: z.string(),
  answerId: z.string()
})

const submitFinalExamRequestSchema = z.object({
  answered: z.array(answeredQuestionSchema)
})

// Schema for the raw API response (snake_case)
const apiAnsweredQuestionSchema = z.object({
  question_id: z.string(),
  answer_id: z.string()
})

const apiSubmissionSchema = z
  .object({
    final_exam_submission_id: z.string(),
    student_id: z.string(),
    final_exam_id: z.string(),
    question_set_id: z.string(),
    attempt_status: attemptStatusEnum,
    score: z.number().nullable().optional(),
    answered: z.array(apiAnsweredQuestionSchema),
    question_set: z.object({
      config: z.object({
        general: z.object({
          total_questions: z.number()
        }),
        scoring: z.object({
          passing_score: z.number()
        })
      })
    })
  })
  .passthrough()

const finalExamSubmissionDetailSchema = z.object({
  score: z.number().optional(),
  passed: z.boolean().optional(),
  total_questions: z.number().optional(),
  answered: z.array(answeredQuestionSchema).optional(),
  submission: z.unknown().optional()
})

export type StartFinalExamRequest = z.infer<typeof startFinalExamRequestSchema>
export type FinalExamSession = z.infer<typeof finalExamSessionSchema>
export type StartFinalExamResponse = FinalExamSession
export type AnsweredQuestion = z.infer<typeof answeredQuestionSchema>
export type SubmitFinalExamRequest = z.infer<typeof submitFinalExamRequestSchema>
export type SubmitFinalExamResponse = z.infer<typeof finalExamSubmissionDetailSchema>

const startFinalExamRequest = async (payload: StartFinalExamRequest): Promise<StartFinalExamResponse> => {
  const parsedPayload = startFinalExamRequestSchema.parse(payload)
  const response = await axios_instance.post(`${FINAL_EXAM_SUBMISSION_API}/start`, parsedPayload)
  return finalExamSessionSchema.parse(response.data.data)
}

const submitFinalExamRequest = async (
  finalExamId: string,
  questionSetId: string,
  payload: SubmitFinalExamRequest
): Promise<SubmitFinalExamResponse> => {
  const parsedPayload = submitFinalExamRequestSchema.parse(payload)
  const response = await axios_instance.post(
    `${FINAL_EXAM_SUBMISSION_API}/submit/${finalExamId}&${questionSetId}`,
    parsedPayload
  )

  // Parse the raw API response
  const submission = apiSubmissionSchema.parse(response.data.data)

  // Transform to the expected format
  const totalQuestions = submission.question_set.config.general.total_questions ?? submission.answered.length
  const passingScore = submission.question_set.config.scoring.passing_score

  // Normalize passing score if it's on a 100-point scale (percentage) but score is on a 10-point scale
  // This assumes that if passing_score > 10, it is a percentage/100-scale value.
  const normalizedPassingScore = passingScore > 10 ? passingScore / 10 : passingScore

  const answered: AnsweredQuestion[] = submission.answered.map((answer) => ({
    questionId: answer.question_id,
    answerId: answer.answer_id
  }))

  const result = {
    score: submission.score ?? 0,
    passed: (submission.score ?? 0) >= normalizedPassingScore,
    total_questions: totalQuestions,
    answered,
    submission
  }

  return finalExamSubmissionDetailSchema.parse(result)
}

export const useStartFinalExam = (
  options?: UseMutationOptions<StartFinalExamResponse, unknown, StartFinalExamRequest>
): UseMutationResult<StartFinalExamResponse, unknown, StartFinalExamRequest> => {
  return useMutation({
    mutationFn: startFinalExamRequest,
    ...options
  })
}

export const useSubmitFinalExam = (
  options?: UseMutationOptions<
    SubmitFinalExamResponse,
    unknown,
    { finalExamId: string; questionSetId: string; data: SubmitFinalExamRequest }
  >
): UseMutationResult<
  SubmitFinalExamResponse,
  unknown,
  { finalExamId: string; questionSetId: string; data: SubmitFinalExamRequest }
> => {
  return useMutation({
    mutationFn: ({ finalExamId, questionSetId, data }) => submitFinalExamRequest(finalExamId, questionSetId, data),
    ...options
  })
}
