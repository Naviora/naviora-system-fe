import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type {
  ClassesListParams,
  ClassesListResponse,
  CreateClassRequest,
  Class,
  ClassDetail,
  AssignedClassesQueryParams,
  AssignedClassesListResponse
} from '@/types/api/class'

const CLASSES_QUERY_KEY = ['classes']
const ASSIGNED_CLASSES_QUERY_KEY = ['assigned-classes']

export interface ClassModulesQueryParams {
  page?: number
  limit?: number
  q?: string
}

export interface ClassModulesResponse {
  status_code: number
  message: string
  data: {
    modules: Array<{
      module_id: string
      module_code: string
      module_name: string
      module_description?: string
      banner?: string
      created_at: string
      updated_at: string
    }>
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

export const useClasses = (params: ClassesListParams = {}) => {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, 'list', params],
    queryFn: async () => {
      // apiClient.get already extracts data.data, so we get { classes, pagination } directly
      const data = await apiClient.get<ClassesListResponse['data']>('/classes', { params })
      return data
    }
  })
}

export const useGetAssignedClasses = (params: ClassesListParams = {}) => {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, 'assigned'],
    queryFn: async () => {
      const data = await apiClient.get<ClassesListResponse['data']>('/classes/assigned-classes', {
        params
      })
      return data
    }
  })
}

export const useClassDetail = (classId: string) => {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, 'detail', classId],
    queryFn: async () => {
      const data = await apiClient.get<ClassDetail>(`/classes/${classId}`)
      return data
    },
    enabled: !!classId
  })
}

export const useClassModules = (classId: string, params: ClassModulesQueryParams = {}) => {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, classId, 'modules', params],
    queryFn: async () => {
      const data = await apiClient.get<ClassModulesResponse['data']>(`/classes/${classId}/modules`, { params })
      return data
    },
    enabled: !!classId
  })
}

export interface ClassStudentsQueryParams {
  page?: number
  limit?: number
  q?: string
}

export interface ClassStudentsResponse {
  status_code: number
  message: string
  data: {
    students: Array<{
      student_id: string
      name: string
      email: string
      avatar?: string
      phone?: string
      enrolment_date: string
    }>
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

export const useClassStudents = (classId: string, params: ClassStudentsQueryParams = {}) => {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, classId, 'students', params],
    queryFn: async () => {
      const data = await apiClient.get<ClassStudentsResponse['data']>(`/classes/${classId}/students`, { params })
      return data
    },
    enabled: !!classId
  })
}

export const useCreateClass = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateClassRequest) => {
      const response = await apiClient.post<Class>('/classes', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY })
    },
    onError: (error) => {
      console.error('Create class failed:', error)
    }
  })
}
