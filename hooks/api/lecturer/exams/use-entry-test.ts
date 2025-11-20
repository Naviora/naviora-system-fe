import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { GetEntryTestsResponse, CreateEntryTestRequest, StartEntryTestResponse, EntryTest, SubmitEntryTestRequest, SubmitEntryTestResponse } from '@/lib/validations/lecturer/exams/entry-test'
import type { SearchRequest } from '@/types/api/common'

export const useGetEntryTests = (params?: SearchRequest) => {
  return useQuery({
    queryKey: ['entry-tests', params],
    queryFn: () => apiClient.get<GetEntryTestsResponse>('/entry-test', { params })
  })
}

export const useGetLatestEntryTests = () => {
  return useQuery({
    queryKey: ['entry-tests'],
    queryFn: () => apiClient.get<EntryTest>('/entry-test/latest/active')
  })
}

export const useSubmitEntryTest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      entryTestId,
      questionSetId,
      data
    }: {
      entryTestId: string
      questionSetId: string
      data: SubmitEntryTestRequest
    }) =>
      apiClient.post<SubmitEntryTestResponse>(`/entry-test/submit/${entryTestId}&${questionSetId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry-tests'] })
    }
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
    mutationFn: (entryTestId: string) =>
      apiClient.post<StartEntryTestResponse>('/entry-test/start', { entryTestId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry-tests'] })
    }
  })
}

export const useUpdateEntryTest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ entryTestId, data }: { entryTestId: string; data: Partial<CreateEntryTestRequest> }) =>
      apiClient.patch(`/entry-test/${entryTestId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry-tests'] })
    }
  })
}

export const useDeleteEntryTest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/entry-test/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry-tests'] })
    }
  })
}

