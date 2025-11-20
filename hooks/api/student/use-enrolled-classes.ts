import { useQuery } from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'

export interface EnrolledClass {
  class_id: string
  class_code: string
  class_name: string
  class_type: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface EnrolledClassesResponse {
  status_code: number
  message: string
  data: {
    classes: EnrolledClass[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

export function useEnrolledClasses() {
  return useQuery({
    queryKey: ['enrolled-classes'],
    queryFn: async () => {
      const response = await axios_instance.get<EnrolledClassesResponse>('/classes/enrolled-classes')
      return response.data.data.classes
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}
