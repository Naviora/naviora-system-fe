import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions
} from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'
import { QUERY_KEYS } from '@/lib/constants/config'
import type {
  ClassDto,
  CreateClassFormValues,
  UpdateClassFormValues,
  StudentDto,
  ModuleDto
} from '@/types/principal/classes'

const CLASSES_API_ENDPOINT = '/classes'
const USERS_API_ENDPOINT = '/users'
const MODULES_API_ENDPOINT = '/modules'

export interface LecturerDto {
  account_id: string
  name: string
  email: string
  staff_id: string
  avatar?: string
  phone?: string
  address?: string
  gender?: string
  date_of_birth?: string
  status: string
  department?: string
  rank?: string
  role: string
  salary?: number
}

export interface ClassesQueryParams {
  limit?: number
  page?: number
  q?: string
  order?: 'ASC' | 'DESC'
  sort_by?: string
  class_type?: string
}

interface ClassesResponse {
  status_code: number
  message: string
  data: {
    classes: ClassDto[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

interface ClassResponse {
  status_code: number
  message: string
  data: ClassDto
}

export interface StudentsQueryParams {
  limit?: number
  page?: number
  q?: string
  order?: 'ASC' | 'DESC'
  sort_by?: string
}

interface StudentsResponse {
  status_code: number
  message: string
  data: {
    class_id: string
    students: StudentDto[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

export interface ModulesQueryParams {
  limit?: number
  page?: number
  q?: string
  order?: 'ASC' | 'DESC'
  sort_by?: string
}

interface ModulesResponse {
  status_code: number
  message: string
  data: {
    modules: ModuleDto[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
      next_page?: number
    }
  }
}

const fetchClasses = async (params?: ClassesQueryParams): Promise<ClassesResponse> => {
  const response = await axios_instance.get(CLASSES_API_ENDPOINT, { params })
  return response.data
}

const fetchClassDetail = async (classId: string): Promise<ClassResponse> => {
  const response = await axios_instance.get(`${CLASSES_API_ENDPOINT}/${classId}`)
  return response.data
}

const createClass = async (payload: CreateClassFormValues): Promise<ClassResponse> => {
  const response = await axios_instance.post(CLASSES_API_ENDPOINT, payload)
  return response.data
}

const updateClass = async (classId: string, payload: UpdateClassFormValues): Promise<ClassResponse> => {
  const response = await axios_instance.patch(`${CLASSES_API_ENDPOINT}/${classId}`, payload)
  return response.data
}

const deleteClass = async (classId: string): Promise<ClassResponse> => {
  const response = await axios_instance.delete(`${CLASSES_API_ENDPOINT}/${classId}`)
  return response.data
}

export const useClasses = (
  params?: ClassesQueryParams,
  options?: UseQueryOptions<ClassesResponse, unknown, ClassesResponse>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CLASS_LIST(params as Record<string, unknown> | undefined),
    queryFn: () => fetchClasses(params),
    staleTime: 60_000,
    ...options
  })
}

export const useClassDetail = (classId: string, options?: UseQueryOptions<ClassResponse, unknown, ClassResponse>) => {
  return useQuery({
    queryKey: ['class', 'detail', classId],
    queryFn: () => fetchClassDetail(classId),
    staleTime: 60_000,
    ...options
  })
}

export const useCreateClass = (
  options?: UseMutationOptions<ClassResponse, unknown, CreateClassFormValues>
): UseMutationResult<ClassResponse, unknown, CreateClassFormValues> => {
  return useMutation({
    mutationFn: createClass,
    ...options
  })
}

export const useUpdateClass = (
  options?: UseMutationOptions<ClassResponse, unknown, { classId: string; data: UpdateClassFormValues }>
): UseMutationResult<ClassResponse, unknown, { classId: string; data: UpdateClassFormValues }> => {
  return useMutation({
    mutationFn: ({ classId, data }) => updateClass(classId, data),
    ...options
  })
}

export const useDeleteClass = (
  options?: UseMutationOptions<ClassResponse, unknown, string>
): UseMutationResult<ClassResponse, unknown, string> => {
  return useMutation({
    mutationFn: deleteClass,
    ...options
  })
}

const fetchClassStudents = async (classId: string, params?: StudentsQueryParams): Promise<StudentsResponse> => {
  const response = await axios_instance.get(`${CLASSES_API_ENDPOINT}/${classId}/students`, { params })
  return response.data
}

const fetchClassModules = async (classId: string, params?: ModulesQueryParams): Promise<ModulesResponse> => {
  const response = await axios_instance.get(`${CLASSES_API_ENDPOINT}/${classId}/modules`, { params })
  return response.data
}

export const useClassStudents = (
  classId: string,
  params?: StudentsQueryParams,
  options?: UseQueryOptions<StudentsResponse, unknown, StudentsResponse>
) => {
  return useQuery({
    queryKey: ['class', classId, 'students', params],
    queryFn: () => fetchClassStudents(classId, params),
    staleTime: 60_000,
    ...options
  })
}

export const useClassModules = (
  classId: string,
  params?: ModulesQueryParams,
  options?: UseQueryOptions<ModulesResponse, unknown, ModulesResponse>
) => {
  return useQuery({
    queryKey: ['class', classId, 'modules', params],
    queryFn: () => fetchClassModules(classId, params),
    staleTime: 60_000,
    ...options
  })
}

// Lecturer related APIs
interface LecturersResponse {
  status_code: number
  message: string
  data: LecturerDto[]
  pagination: {
    limit: number
    current_page: number
    total_records: number
    total_pages: number
  }
}

interface AssignLecturersToClassResponse {
  status_code: number
  message: string
  data: {
    class_id: string
    class_code: string
    class_name: string
    assigned_lecturers: Array<{
      id: string
      name: string
      email: string
    }>
  }
}

interface AssignLecturersToModuleResponse {
  status_code: number
  message: string
  data: {
    module_id: string
    module_code: string
    module_name: string
    assigned_lecturers: Array<{
      lecturer_id: string
      lecturer_name: string
      lecturer_email: string
      is_active: boolean
      end_date: string
    }>
  }
}

export interface AssignLecturersToModulePayload {
  classId: string
  moduleId: string
  lecturerIds: string[]
  endDate: string
}

const fetchLecturers = async (params?: Record<string, unknown>): Promise<LecturersResponse> => {
  const response = await axios_instance.get(`${USERS_API_ENDPOINT}/lecturers`, { params })
  return response.data
}

const assignLecturersToClass = async (
  classId: string,
  lecturerIds: string[]
): Promise<AssignLecturersToClassResponse> => {
  const response = await axios_instance.post(`${CLASSES_API_ENDPOINT}/${classId}/assign-lecturers`, {
    lecturer_ids: lecturerIds
  })
  return response.data
}

const assignLecturersToModule = async (
  moduleId: string,
  lecturerIds: string[],
  endDate: string
): Promise<AssignLecturersToModuleResponse> => {
  const response = await axios_instance.post(`${MODULES_API_ENDPOINT}/${moduleId}/assign-lecturers`, {
    lecturer_ids: lecturerIds,
    end_date: endDate
  })
  return response.data
}

export const useLecturers = (
  params?: Record<string, unknown>,
  options?: UseQueryOptions<LecturersResponse, unknown, LecturersResponse>
) => {
  return useQuery({
    queryKey: ['lecturers', params],
    queryFn: () => fetchLecturers(params),
    staleTime: 60_000,
    ...options
  })
}

export const useAssignLecturersToClass = (
  options?: UseMutationOptions<AssignLecturersToClassResponse, unknown, { classId: string; lecturerIds: string[] }>
): UseMutationResult<AssignLecturersToClassResponse, unknown, { classId: string; lecturerIds: string[] }> => {
  return useMutation({
    mutationFn: ({ classId, lecturerIds }) => assignLecturersToClass(classId, lecturerIds),
    ...options
  })
}

export const useAssignLecturersToModule = (
  options?: UseMutationOptions<
    AssignLecturersToModuleResponse,
    unknown,
    { moduleId: string; lecturerIds: string[]; endDate: string }
  >
): UseMutationResult<
  AssignLecturersToModuleResponse,
  unknown,
  { moduleId: string; lecturerIds: string[]; endDate: string }
> => {
  return useMutation({
    mutationFn: ({ moduleId, lecturerIds, endDate }) => assignLecturersToModule(moduleId, lecturerIds, endDate),
    ...options
  })
}
