import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query'

import { axios_instance } from '@/lib/api/client'
import { REVIEWED_EXERCISES_API_ENDPOINT } from '@/lib/constants/modules'
import {
  startReviewedExerciseResponseSchema,
  type StartReviewedExerciseResponse
} from '@/lib/validations/lecturer/exams/reviewed-exercise'

const startReviewedExerciseRequest = async (reviewedExerciseId: string): Promise<StartReviewedExerciseResponse> => {
  const response = await axios_instance.post(`${REVIEWED_EXERCISES_API_ENDPOINT}/start`, {
    reviewedExerciseId
  })
  return startReviewedExerciseResponseSchema.parse(response.data)
}

export const useStartReviewedExercise = (
  options?: UseMutationOptions<StartReviewedExerciseResponse, unknown, string>
): UseMutationResult<StartReviewedExerciseResponse, unknown, string> => {
  return useMutation({
    mutationFn: startReviewedExerciseRequest,
    ...options
  })
}
