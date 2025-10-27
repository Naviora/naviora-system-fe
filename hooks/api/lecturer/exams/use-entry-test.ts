import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { GetEntryTestsResponse, CreateEntryTestRequest, StartEntryTestResponse } from '@/lib/validations/lecturer/exams/entry-test'
import type { SearchRequest } from '@/types/api/common'

export const useGetEntryTests = (params?: SearchRequest) => {
  return useQuery({
    queryKey: ['entry-tests', params],
    queryFn: () => apiClient.get<GetEntryTestsResponse>('/entry-test', { params })
  })
}

export const useCreateEntryTest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEntryTestRequest) =>
      apiClient.post('/entry-test', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry-tests'] })
    }
  })
}

export const useStartEntryTest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<StartEntryTestResponse>('/entry-test/start', { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry-tests'] })
    }
  })
}

