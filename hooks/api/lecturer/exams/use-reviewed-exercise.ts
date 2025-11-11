import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { QUERY_KEYS } from '@/lib/constants/config'
import type {
  GetReviewedExercisesResponse,
  CreateReviewedExerciseRequest,
  ReviewedExercise
} from '@/lib/validations/lecturer/exams/reviewed-exercise'
import type { SearchRequest } from '@/types/api/common'

export const useGetReviewedExercises = (params?: SearchRequest) => {
  return useQuery({
    queryKey: ['reviewed-exercises', params],
    queryFn: () => apiClient.get<GetReviewedExercisesResponse>('/reviewed-exercise', { params })
  })
}

export const useGetReviewedExercisesByLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ['reviewed-exercises', 'lesson', lessonId],
    queryFn: () => apiClient.get<GetReviewedExercisesResponse>(`/reviewed-exercise/lesson/${lessonId}`),
    enabled: !!lessonId
  })
}

export const useGetReviewedExercise = (id: string) => {
  return useQuery({
    queryKey: ['reviewed-exercise', id],
    queryFn: () => apiClient.get<ReviewedExercise>(`/reviewed-exercise/${id}`),
    enabled: !!id
  })
}

export const useCreateReviewedExercise = (lessonId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReviewedExerciseRequest) => apiClient.post('/reviewed-exercise', data),
    onSuccess: () => {
      // Invalidate reviewed exercises queries
      queryClient.invalidateQueries({ queryKey: ['reviewed-exercises'] })
      // Invalidate lesson detail to refetch exercises
      if (lessonId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON_DETAIL(lessonId) })
      }
      // Invalidate all lessons queries
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    }
  })
}

export const useUpdateReviewedExercise = (lessonId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateReviewedExerciseRequest> }) =>
      apiClient.patch(`/reviewed-exercise/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewed-exercises'] })
      // Invalidate lesson detail to refetch exercises
      if (lessonId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON_DETAIL(lessonId) })
      }
      // Invalidate all lessons queries
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    }
  })
}

export const useDeleteReviewedExercise = (lessonId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/reviewed-exercise/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewed-exercises'] })
      // Invalidate lesson detail to refetch exercises
      if (lessonId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON_DETAIL(lessonId) })
      }
      // Invalidate all lessons queries
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    }
  })
}
