import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'

export interface ClassDistributionItem {
  range: string
  classId: string
}

export interface ArrangeStudentsRequest {
  entryTestId: string
  classDistribution: ClassDistributionItem[]
}

export interface ArrangeStudentsResponse {
  status_code: number
  message: string
  data: {
    entry_test_id: string
    entry_test_title: string
    total_students: number
    enrolled_students: number
    unenrolled_count: number
    class_distribution_summary: Record<
      string,
      {
        count: number
        class_id: string
        class_name: string
      }
    >
    summary: {
      success: boolean
      message: string
      enrolment_date: string
    }
  }
}

export interface ClassDto {
  class_id: string
  class_code: string
  class_name: string
  class_type: 'school' | 'city' | 'province' | 'national' | 'international'
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GetClassesResponse {
  status_code: number
  message: string
  data: {
    classes: ClassDto[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
      next_page?: number
    }
  }
}

export interface GetClassesParams {
  limit?: number
  page?: number
  q?: string
  class_type?: string
  order?: string
  sort_by?: string
}

const arrangeStudents = async (data: ArrangeStudentsRequest): Promise<ArrangeStudentsResponse> => {
  const response = await axios_instance.post('/classes/arrange-students', data)
  return response.data
}

const fetchClassesForArrangement = async (params?: GetClassesParams): Promise<GetClassesResponse> => {
  const response = await axios_instance.get('/classes', { params })
  return response.data
}

export function useArrangeStudents(options?: { 
  onSuccess?: (data: ArrangeStudentsResponse) => void
  onError?: (error: unknown) => void
}) {
  return useMutation({
    mutationFn: arrangeStudents,
    onSuccess: options?.onSuccess,
    onError: options?.onError
  })
}

export function useGetClasses(
  params?: GetClassesParams,
  options?: Omit<UseQueryOptions<GetClassesResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['classes', 'list-for-arrangement', params],
    queryFn: () => fetchClassesForArrangement(params),
    ...options
  })
}
