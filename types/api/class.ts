export type ClassType = 'school' | 'city' | 'province' | 'national' | 'international'

export interface Class {
  class_id: string
  class_code: string
  class_name: string
  class_type: ClassType
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClassDetail extends Class {
  lecturers: Array<{
    lecturer_id: string
    name: string
    email: string
  }>
}

export interface ClassesListParams {
  limit?: number
  page?: number
  q?: string
  order?: 'ASC' | 'DESC'
  class_type?: ClassType
  sort_by?: string
}

export interface ClassesListResponse {
  status_code: number
  message: string
  data: {
    classes: Class[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

export interface ClassDetailResponse {
  status_code: number
  message: string
  data: ClassDetail
}

export interface CreateClassRequest {
  class_code: string
  class_name: string
  class_type: ClassType
  start_date: string
  end_date: string
}

export interface CreateClassResponse {
  status_code: number
  message: string
  data: Class
}

export const CLASS_TYPE_LABELS: Record<ClassType, string> = {
  school: 'Cấp trường',
  city: 'Cấp thành phố',
  province: 'Cấp tỉnh',
  national: 'Cấp quốc gia',
  international: 'Cấp quốc tế'
}
