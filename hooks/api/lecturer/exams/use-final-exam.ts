import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { SearchRequest } from '@/types/api/common'
import { CreateFinalExamRequest, GetFinalExamsResponse } from '@/lib/validations/lecturer/exams/final-exam'

export const useGetFinalExams = (params?: SearchRequest) => {
  return useQuery({
    queryKey: ['final-exams', params],
    queryFn: () => apiClient.get<GetFinalExamsResponse>('/final-exam', { params })
  })
}

export const useCreateFinalExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFinalExamRequest) =>
      apiClient.post('/final-exam', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['final-exams'] })
    }
  })
}

export const useDeleteFinalExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/final-exam/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['final-exams'] })
    }
  })
}

