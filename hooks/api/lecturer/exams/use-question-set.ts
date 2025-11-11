import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import {
  type CreateQuestionSetRequest,
  type GetQuestionSetsResponse,
  type QuestionSetDetail
} from '@/lib/validations/lecturer/exams/question-set'
import { SearchRequest } from '@/types/api/common'

export const useGetQuestionSets = (params?: SearchRequest) => {
  return useQuery({
    queryKey: ['question-sets', params],
    queryFn: () => apiClient.get<GetQuestionSetsResponse>('/question-set', { params })
  })
}

export const useGetQuestionSetDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['question-set-detail', id],
    queryFn: () => apiClient.get<QuestionSetDetail>(`/question-set/${id}`),
    enabled: options?.enabled ?? Boolean(id)
  })
}

// Gọi nhiều chi tiết bộ câu hỏi cùng lúc
const fetchQuestionSetDetail = (id: string) => apiClient.get<QuestionSetDetail>(`/question-set/${id}`)

export function useGetMultipleQuestionSetDetail(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ['question-set-detail', id],
      queryFn: () => fetchQuestionSetDetail(id),
      enabled: !!id
    }))
  })
}

export const useCreateQuestionSet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateQuestionSetRequest) => apiClient.post('/question-set', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-sets'] })
    }
  })
}

export const useUpdateQuestionSet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateQuestionSetRequest }) =>
      apiClient.patch(`/question-set/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-sets'] })
    }
  })
}

export const useDeleteQuestionSet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/question-set/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-sets'] })
    }
  })
}
