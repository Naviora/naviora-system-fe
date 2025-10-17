import { useMemo } from 'react'
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions
} from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'
import {
  MODULE_API_ENDPOINT,
  CLASSES_API_ENDPOINT,
  MODULE_QUERY_DEFAULTS,
  CLASS_QUERY_DEFAULTS
} from '@/lib/constants/modules'
import { QUERY_KEYS } from '@/lib/constants/config'
import {
  classesResponseSchema,
  moduleResponseSchema,
  modulesResponseSchema,
  moduleDetailResponseSchema,
  moduleLessonsResponseSchema,
  type ClassDto,
  type ClassesResponseDto,
  type CreateModuleFormValues,
  type ModuleDto,
  type ModuleResponseDto,
  type ModulesResponseDto,
  type ModuleDetailDto,
  type ModuleLessonsDto,
  type UpdateModuleFormValues
} from '@/lib/validations/modules'

export interface ModulesQueryParams {
  limit?: number
  page?: number
  q?: string
  order?: 'ASC' | 'DESC'
  sort_by?: string
  class_type?: string
}

export interface ClassesQueryParams {
  limit?: number
  page?: number
  q?: string
  order?: 'ASC' | 'DESC'
  sort_by?: string
  class_type?: string
}

const fetchModules = async (params?: ModulesQueryParams): Promise<ModulesResponseDto> => {
  const response = await axios_instance.get(MODULE_API_ENDPOINT, {
    params: {
      ...MODULE_QUERY_DEFAULTS,
      ...params
    }
  })

  return modulesResponseSchema.parse(response.data)
}

const fetchClasses = async (params?: ClassesQueryParams): Promise<ClassesResponseDto> => {
  const response = await axios_instance.get(CLASSES_API_ENDPOINT, {
    params: {
      ...CLASS_QUERY_DEFAULTS,
      ...params
    }
  })

  return classesResponseSchema.parse(response.data)
}

const fetchModuleDetail = async (moduleId: string): Promise<ModuleDetailDto> => {
  const response = await axios_instance.get(`${MODULE_API_ENDPOINT}/${moduleId}`)
  const parsed = moduleDetailResponseSchema.parse(response.data)
  return parsed.data
}

const fetchModuleLessons = async (moduleId: string): Promise<ModuleLessonsDto> => {
  const response = await axios_instance.get(`${MODULE_API_ENDPOINT}/${moduleId}/lessons`)
  const parsed = moduleLessonsResponseSchema.parse(response.data)
  return parsed.data
}

export const useModuleDetail = <TData = ModuleDetailDto>(
  moduleId: string,
  options?: Omit<UseQueryOptions<ModuleDetailDto, unknown, TData>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MODULE_DETAIL(moduleId),
    queryFn: () => fetchModuleDetail(moduleId),
    enabled: Boolean(moduleId),
    staleTime: 60_000,
    ...options
  })
}

export const useModuleLessons = <TData = ModuleLessonsDto>(
  moduleId: string,
  options?: Omit<UseQueryOptions<ModuleLessonsDto, unknown, TData>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MODULE_LESSONS(moduleId),
    queryFn: () => fetchModuleLessons(moduleId),
    enabled: Boolean(moduleId),
    staleTime: 60_000,
    ...options
  })
}

const createModuleRequest = async (payload: CreateModuleFormValues): Promise<ModuleResponseDto> => {
  const formData = new FormData()
  formData.append('module_code', payload.module_code)
  formData.append('module_name', payload.module_name)
  formData.append('module_description', payload.module_description)
  formData.append('class_id', payload.class_id)

  if (payload.banner) {
    formData.append('banner', payload.banner)
  }

  const response = await axios_instance.post(MODULE_API_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return moduleResponseSchema.parse(response.data)
}

const deleteModuleRequest = async (moduleId: string): Promise<ModuleResponseDto> => {
  const response = await axios_instance.delete(`${MODULE_API_ENDPOINT}/${moduleId}`)

  return moduleResponseSchema.parse(response.data)
}

const updateModuleRequest = async ({ moduleId, data }: UpdateModuleFormValues): Promise<ModuleResponseDto> => {
  const formData = new FormData()
  formData.append('module_code', data.module_code)
  formData.append('module_name', data.module_name)
  formData.append('module_description', data.module_description)
  formData.append('class_id', data.class_id)

  if (data.banner) {
    formData.append('banner', data.banner)
  }

  const response = await axios_instance.patch(`${MODULE_API_ENDPOINT}/${moduleId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return moduleResponseSchema.parse(response.data)
}

export const useModules = <TData = ModulesResponseDto>(
  params?: ModulesQueryParams,
  options?: UseQueryOptions<ModulesResponseDto, unknown, TData>
) => {
  const queryParams = useMemo(() => ({ ...params }), [params])

  return useQuery({
    queryKey: QUERY_KEYS.MODULE_LIST(queryParams),
    queryFn: () => fetchModules(queryParams),
    placeholderData: (previousData) => previousData,
    ...options
  })
}

export const useClasses = <TData = ClassesResponseDto>(
  params?: ClassesQueryParams,
  options?: UseQueryOptions<ClassesResponseDto, unknown, TData>
) => {
  const queryParams = useMemo(() => ({ ...params }), [params])

  return useQuery({
    queryKey: QUERY_KEYS.CLASS_LIST(queryParams),
    queryFn: () => fetchClasses(queryParams),
    placeholderData: (previousData) => previousData,
    ...options
  })
}

export const useCreateModule = (
  options?: UseMutationOptions<ModuleResponseDto, unknown, CreateModuleFormValues>
): UseMutationResult<ModuleResponseDto, unknown, CreateModuleFormValues> => {
  return useMutation({
    mutationFn: createModuleRequest,
    ...options
  })
}

export const useDeleteModule = (
  options?: UseMutationOptions<ModuleResponseDto, unknown, string>
): UseMutationResult<ModuleResponseDto, unknown, string> => {
  return useMutation({
    mutationFn: deleteModuleRequest,
    ...options
  })
}

export const useUpdateModule = (
  options?: UseMutationOptions<ModuleResponseDto, unknown, UpdateModuleFormValues>
): UseMutationResult<ModuleResponseDto, unknown, UpdateModuleFormValues> => {
  return useMutation({
    mutationFn: updateModuleRequest,
    ...options
  })
}

export type { ModuleDto, ModulesResponseDto, ClassDto, ModuleDetailDto, ModuleLessonsDto }
