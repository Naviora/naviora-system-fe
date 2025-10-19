/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { GetQuestionsResponse } from '@/lib/validations/lecturer/exams/question'
import { SearchRequest } from '@/types/api/common'

export const useGetQuestions = (params?: SearchRequest) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => apiClient.get<GetQuestionsResponse>('/questions', { params }),
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    }
  })
}