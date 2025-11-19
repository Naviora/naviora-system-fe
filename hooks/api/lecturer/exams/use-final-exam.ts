import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { SearchRequest } from '@/types/api/common'
import { CreateFinalExamRequest, GetFinalExamsResponse } from '@/lib/validations/lecturer/exams/final-exam'
import { camelToSnakeCase } from '@/lib/utils'

export const useGetFinalExams = (params?: SearchRequest) => {
  return useQuery({
    queryKey: ['final-exams', params],
    queryFn: () => apiClient.get<GetFinalExamsResponse>('/final-exam', { params })
  })
}

export const useCreateFinalExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFinalExamRequest) => {
      const snakeCaseData = camelToSnakeCase(data as unknown as Record<string, unknown>)
      return apiClient.post('/final-exam', snakeCaseData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['final-exams'] })
    }
  })
}

export const useUpdateFinalExam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ finalExamId, data }: { finalExamId: string; data: Partial<CreateFinalExamRequest> }) => {
      const snakeCaseData = camelToSnakeCase(data as unknown as Record<string, unknown>)
      return apiClient.patch(`/final-exam/${finalExamId}`, snakeCaseData)
    },
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
