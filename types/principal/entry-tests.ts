export interface UserDto {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  status: 'Active' | 'Inactive'
}

export interface EntryTestDto {
  entry_test_id: string
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  version: number
  question_sets: string[]
  created_by: UserDto
  updated_by: UserDto | null
}

export interface EntryTestsResponse {
  entry_tests: EntryTestDto[]
  pagination: {
    limit: number
    current_page: number
    total_records: number
    total_pages: number
  }
}

export interface ScoreRangeDto {
  score: string
  count: number
  percentage: number
}

export interface ScoreSpectrumStatistics {
  total_submissions: number
  average_score: number
  highest_score: number
  lowest_score: number
  median_score: number
  standard_deviation: number
}

export interface ScoreSpectrumDto {
  entry_test_id: string
  entry_test_title: string
  statistics: ScoreSpectrumStatistics
  score_ranges: ScoreRangeDto[]
}

export interface StudentGradeDto {
  student_id: string
  student_name: string
  student_email: string
  student_avatar: string
  submission_id: string
  score: number
  attempt_status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'CANCELLED'
  submitted_at: string
  note: string | null
  penalty: number | null
}

export interface StudentGradesResponse {
  entry_test_id: string
  students: StudentGradeDto[]
  pagination: {
    limit: number
    current_page: number
    total_records: number
    total_pages: number
  }
}
