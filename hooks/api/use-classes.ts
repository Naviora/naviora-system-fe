import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { ClassesListParams, ClassesListResponse, CreateClassRequest, Class, ClassDetail } from '@/types/api/class'

const CLASSES_QUERY_KEY = ['classes']

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
