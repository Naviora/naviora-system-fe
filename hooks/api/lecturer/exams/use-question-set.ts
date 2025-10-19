import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { GetQuestionSetsResponse } from '@/lib/validations/lecturer/exams/question-set'
import { SearchRequest } from '@/types/api/common'

export const useGetQuestionSets = (params?: SearchRequest) => {
  return useQuery({
    queryKey: ['question-sets', params],
    queryFn: () => apiClient.get<GetQuestionSetsResponse>('/question-set', { params }),
  })
}