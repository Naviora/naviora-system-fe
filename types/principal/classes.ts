export type ClassType = 'school' | 'city' | 'province' | 'national' | 'international'

export interface StudentDto {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  enrolment_date: string
}

export interface LecturerInClassDto {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
}

export interface ClassDto {
  class_id: string
  class_code: string
  class_name: string
  class_type: ClassType
  start_date: string
  end_date: string
  is_active: boolean
  lecturers: LecturerInClassDto[]
  students: StudentDto[]
  created_at: string
  updated_at: string
}

export interface ClassDetailRow {
  id: string
  code: string
  name: string
  type: ClassType
  startDate: string
  endDate: string
  isActive: boolean
  students: StudentRow[]
  createdAt: string
  updatedAt: string
}

export interface StudentRow {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  enrolmentDate: string
}

export interface ModuleDto {
  module_id: string
  module_code: string
  module_name: string
  module_description: string
  banner?: string
  created_at: string
  updated_at: string
}

export interface ModuleRow {
  id: string
  code: string
  name: string
  description: string
  banner?: string
  createdAt: string
  updatedAt: string
}

export interface PrincipalClassRow {
  id: string
  code: string
  name: string
  type: ClassType
  startDate: string
  endDate: string
  isActive: boolean
  updatedAt: string
}

export interface CreateClassFormValues {
  class_code: string
  class_name: string
  class_type: ClassType
  start_date: string
  end_date: string
}

export interface UpdateClassFormValues {
  class_name?: string
  class_type?: ClassType
  start_date?: string
  end_date?: string
  is_active?: boolean
}
