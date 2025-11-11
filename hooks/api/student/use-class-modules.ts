import { useQuery } from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'

export interface ClassInfo {
  class_id: string
  class_code: string
  class_name: string
  class_type: string
}

export interface ClassModule {
  module_id: string
  module_code: string
  module_name: string
  module_description: string
  progress_percent: number
  banner: string | null
  class: ClassInfo
  created_at: string
  updated_at: string
}

export interface ClassModuleResponse {
  status_code: number
  message: string
  data: {
    modules: ClassModule[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
      next_page?: number
    }
  }
}

export function useClassModules(classId: string | undefined) {
  return useQuery({
    queryKey: ['class-modules', classId],
    queryFn: async () => {
      if (!classId) return []
      const response = await axios_instance.get<ClassModuleResponse>(`/modules/in-class/${classId}`)
      return response.data.data.modules || []
    },
    enabled: !!classId,
    staleTime: 1000 * 60 * 5
  })
}
