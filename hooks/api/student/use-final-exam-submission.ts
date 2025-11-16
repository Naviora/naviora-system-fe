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
  return finalExamSubmissionDetailSchema.parse(response.data.data)
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
