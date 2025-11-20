import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult
} from '@tanstack/react-query'

import { axios_instance } from '@/lib/api/client'
import {
  MATERIALS_UPLOAD_ENDPOINT,
  MATERIALS_API_ENDPOINT,
  TEACHING_MATERIALS_API_ENDPOINT,
  LESSONS_API_ENDPOINT
} from '@/lib/constants/modules'
import { QUERY_KEYS } from '@/lib/constants/config'
import {
  materialResponseSchema,
  teachingMaterialResponseSchema,
  createTeachingMaterialSchema,
  updateTeachingMaterialSchema,
  lessonResponseSchema,
  type MaterialResponseDto,
  type TeachingMaterialResponseDto,
  type CreateTeachingMaterialPayload,
  type UpdateTeachingMaterialPayload,
  type LessonResponseDto
} from '@/lib/validations/modules'

// ====  API Endpoints ====
// Upload material file to cloud
const uploadMaterialRequest = async (formData: FormData): Promise<MaterialResponseDto> => {
  const response = await axios_instance.post(MATERIALS_UPLOAD_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return materialResponseSchema.parse(response.data)
}

// Create teaching material (link material to lesson)
const createTeachingMaterialRequest = async (
  payload: CreateTeachingMaterialPayload
): Promise<TeachingMaterialResponseDto> => {
  const parsedPayload = createTeachingMaterialSchema.parse(payload)
  const response = await axios_instance.post(TEACHING_MATERIALS_API_ENDPOINT, parsedPayload)

  return teachingMaterialResponseSchema.parse(response.data)
}

// Update teaching material
const updateTeachingMaterialRequest = async ({
  teachingMaterialId,
  data
}: {
  teachingMaterialId: string
  data: UpdateTeachingMaterialPayload
}): Promise<TeachingMaterialResponseDto> => {
  const parsedPayload = updateTeachingMaterialSchema.parse(data)
  const response = await axios_instance.patch(`${TEACHING_MATERIALS_API_ENDPOINT}/${teachingMaterialId}`, parsedPayload)

  // PATCH endpoint may return data as string, not object. Create a valid response object.
  return teachingMaterialResponseSchema.parse({
    status_code: response.data.status_code,
    message: response.data.message,
    data: {
      teaching_material_id: teachingMaterialId
    }
  })
}

// Delete teaching material
const deleteTeachingMaterialRequest = async (teachingMaterialId: string): Promise<TeachingMaterialResponseDto> => {
  const response = await axios_instance.delete(`${TEACHING_MATERIALS_API_ENDPOINT}/${teachingMaterialId}`)

  // DELETE endpoint returns data as string, not object. Create a valid response object.
  return teachingMaterialResponseSchema.parse({
    status_code: response.data.status_code,
    message: response.data.message,
    data: {
      teaching_material_id: teachingMaterialId
    }
  })
}

// Delete material from cloud
const deleteMaterialRequest = async (materialId: string): Promise<MaterialResponseDto> => {
  const response = await axios_instance.delete(`${MATERIALS_API_ENDPOINT}/${materialId}`)

  return materialResponseSchema.parse(response.data)
}

// Get lesson detail with materials
const getLessonDetailRequest = async (lessonId: string): Promise<LessonResponseDto> => {
  const response = await axios_instance.get(`${LESSONS_API_ENDPOINT}/${lessonId}`)

  return lessonResponseSchema.parse(response.data)
}

// Hooks
export const useUploadMaterial = (
  options?: UseMutationOptions<MaterialResponseDto, unknown, FormData>
): UseMutationResult<MaterialResponseDto, unknown, FormData> => {
  return useMutation({
    mutationFn: uploadMaterialRequest,
    ...options
  })
}

export const useCreateTeachingMaterial = (
  options?: UseMutationOptions<TeachingMaterialResponseDto, unknown, CreateTeachingMaterialPayload>
): UseMutationResult<TeachingMaterialResponseDto, unknown, CreateTeachingMaterialPayload> => {
  return useMutation({
    mutationFn: createTeachingMaterialRequest,
    ...options
  })
}

export const useUpdateTeachingMaterial = (
  options?: UseMutationOptions<
    TeachingMaterialResponseDto,
    unknown,
    { teachingMaterialId: string; data: UpdateTeachingMaterialPayload }
  >
): UseMutationResult<
  TeachingMaterialResponseDto,
  unknown,
  { teachingMaterialId: string; data: UpdateTeachingMaterialPayload }
> => {
  return useMutation({
    mutationFn: updateTeachingMaterialRequest,
    ...options
  })
}

export const useDeleteTeachingMaterial = (
  options?: UseMutationOptions<TeachingMaterialResponseDto, unknown, string>
): UseMutationResult<TeachingMaterialResponseDto, unknown, string> => {
  return useMutation({
    mutationFn: deleteTeachingMaterialRequest,
    ...options
  })
}

export const useDeleteMaterial = (
  options?: UseMutationOptions<MaterialResponseDto, unknown, string>
): UseMutationResult<MaterialResponseDto, unknown, string> => {
  return useMutation({
    mutationFn: deleteMaterialRequest,
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
    ...options
  })
}
