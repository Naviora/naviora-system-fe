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

export interface PaginationInfo {
  limit: number
  current_page: number
  total_records: number
  total_pages: number
  next_page?: number
}

export interface ClassModuleResponse {
  status_code: number
  message: string
  data: {
    modules: ClassModule[]
    pagination: PaginationInfo
  }
}

export interface ClassModulesData {
  modules: ClassModule[]
  pagination: PaginationInfo
}

export function useClassModules(classId: string | undefined, page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: ['class-modules', classId, page, limit],
    queryFn: async (): Promise<ClassModulesData | undefined> => {
      if (!classId) return undefined
      const response = await axios_instance.get<ClassModuleResponse>(
        `/modules/in-class/${classId}?page=${page}&limit=${limit}`
      )
      return {
        modules: response.data.data.modules || [],
        pagination: response.data.data.pagination
      }
    },
    enabled: !!classId,
    staleTime: 1000 * 60 * 5
  })
}
