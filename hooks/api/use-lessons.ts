import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult
} from '@tanstack/react-query'

import { axios_instance } from '@/lib/api/client'
import { LESSONS_API_ENDPOINT } from '@/lib/constants/modules'
import { QUERY_KEYS } from '@/lib/constants/config'
import {
  createLessonSchema,
  lessonResponseSchema,
  updateLessonSchema,
  type CreateLessonPayload,
  type LessonResponseDto,
  type UpdateLessonFormValues
} from '@/lib/validations/modules'

const createLessonRequest = async (payload: CreateLessonPayload): Promise<LessonResponseDto> => {
  const parsedPayload = createLessonSchema.parse(payload)
  const response = await axios_instance.post(LESSONS_API_ENDPOINT, parsedPayload)

  return lessonResponseSchema.parse(response.data)
}

const updateLessonRequest = async ({ lessonId, data }: UpdateLessonFormValues): Promise<LessonResponseDto> => {
  const parsedPayload = updateLessonSchema.parse(data)
  const response = await axios_instance.patch(`${LESSONS_API_ENDPOINT}/${lessonId}`, parsedPayload)

  return lessonResponseSchema.parse(response.data)
}

const deleteLessonRequest = async (lessonId: string): Promise<LessonResponseDto> => {
  const response = await axios_instance.delete(`${LESSONS_API_ENDPOINT}/${lessonId}`)

  return lessonResponseSchema.parse(response.data)
}

const getLessonDetailRequest = async (lessonId: string): Promise<LessonResponseDto> => {
  const response = await axios_instance.get(`${LESSONS_API_ENDPOINT}/${lessonId}`)
  try {
    const parsed = lessonResponseSchema.parse(response.data)
    console.log('Parsed lesson response:', parsed)
    return parsed
  } catch (error) {
    console.error('Lesson schema parsing error:', error)
    console.error('Raw response data:', response.data)
    throw error
  }
}

export const useCreateLesson = (
  options?: UseMutationOptions<LessonResponseDto, unknown, CreateLessonPayload>
): UseMutationResult<LessonResponseDto, unknown, CreateLessonPayload> => {
  return useMutation({
    mutationFn: createLessonRequest,
    ...options
  })
}

export const useUpdateLesson = (
  options?: UseMutationOptions<LessonResponseDto, unknown, UpdateLessonFormValues>
): UseMutationResult<LessonResponseDto, unknown, UpdateLessonFormValues> => {
  return useMutation({
    mutationFn: updateLessonRequest,
    ...options
  })
}

export const useDeleteLesson = (
  options?: UseMutationOptions<LessonResponseDto, unknown, string>
): UseMutationResult<LessonResponseDto, unknown, string> => {
  return useMutation({
    mutationFn: deleteLessonRequest,
    ...options
  })
}

export const useLessonDetail = (
  lessonId: string | null,
  options?: UseQueryOptions<LessonResponseDto, unknown, LessonResponseDto>
): UseQueryResult<LessonResponseDto, unknown> => {
  return useQuery({
    queryKey: QUERY_KEYS.LESSON_DETAIL(lessonId || 'unknown'),
    queryFn: () => getLessonDetailRequest(lessonId || ''),
    enabled: !!lessonId,
    staleTime: 0, // Always consider data as stale to force fresh data
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    ...options
  })
}
