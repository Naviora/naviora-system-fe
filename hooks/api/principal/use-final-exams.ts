import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'
import { QUERY_KEYS } from '@/lib/constants/config'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'

export interface CreatedByUser {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  address?: string
  gender?: string
  date_of_birth?: string
  status: string
  office_phone_number?: string
  point?: number | null
  username?: string | null
  has_participated_final_exam: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
  version: number
  role: {
    id: number
    name: string
    description: string
    is_active: boolean
    permissions: string
    created_at: string
    updated_at: string
    deleted_at?: string | null
    version: number
  }
}

export interface FinalExamDto {
  final_exam_id: string
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  version: number
  question_sets:
    | string[]
    | Array<{
        question_set_id: string
        title: string
        description: string
        total_questions: number
        duration_minutes: number
      }>
  created_by: CreatedByUser
  updated_by?: CreatedByUser | null
}

export interface FinalExamsQueryParams {
  limit?: number
  page?: number
  q?: string
  order?: 'ASC' | 'DESC'
  sort_by?: string
  status?: string
}

export interface FinalExamsResponse {
  status_code: number
  message: string
  data: {
    final_exams: FinalExamDto[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

export interface ScoreSpectrum {
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

export interface ScoreSpectrumResponse {
  status_code: number
  message: string
  data: {
    final_exam_id: string
    final_exam_title: string
    statistics: ScoreSpectrumStatistics
    score_ranges: ScoreSpectrum[]
  }
}

export interface FinalExamSubmission {
  submission_id: string
  student_id: string
  student_name: string
  student_email: string
  score: number
  percentage: number
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED'
  submitted_at: string
  created_at: string
}

export interface FinalExamSubmissionsResponse {
  status_code: number
  message: string
  data: {
    submissions: FinalExamSubmission[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

const FINAL_EXAM_API_ENDPOINT = '/final-exam'

export function useFinalExams(params?: FinalExamsQueryParams, options?: UseQueryOptions<FinalExamsResponse>) {
  return useQuery<FinalExamsResponse>({
    queryKey: QUERY_KEYS.FINAL_EXAM_LIST(params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const response = await axios_instance.get<FinalExamsResponse>(FINAL_EXAM_API_ENDPOINT, {
        params: {
          limit: params?.limit ?? 10,
          page: params?.page ?? 1,
          q: params?.q,
          order: params?.order,
          sort_by: params?.sort_by,
          status: params?.status
        }
      })
      return response.data
    },
    ...options
  })
}

export function useFinalExamScoreSpectrum(finalExamId: string, options?: UseQueryOptions<ScoreSpectrumResponse>) {
  return useQuery<ScoreSpectrumResponse>({
    queryKey: QUERY_KEYS.FINAL_EXAM_SCORE_SPECTRUM(finalExamId),
    queryFn: async () => {
      const response = await axios_instance.get<ScoreSpectrumResponse>(
        `${FINAL_EXAM_API_ENDPOINT}/${finalExamId}/score-spectrum`
      )
      return response.data
    },
    enabled: !!finalExamId,
    ...options
  })
}

export function useFinalExamSubmissions(
  finalExamId: string,
  params?: { limit?: number; page?: number; q?: string },
  options?: UseQueryOptions<FinalExamSubmissionsResponse>
) {
  return useQuery<FinalExamSubmissionsResponse>({
    queryKey: QUERY_KEYS.FINAL_EXAM_SUBMISSIONS(finalExamId, params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const response = await axios_instance.get<FinalExamSubmissionsResponse>(
        `${FINAL_EXAM_API_ENDPOINT}/${finalExamId}/submissions`,
        {
          params: {
            limit: params?.limit ?? 10,
            page: params?.page ?? 1,
            q: params?.q
          }
        }
      )
      return response.data
    },
    enabled: !!finalExamId,
    ...options
  })
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
  status_code: number
  message: string
  data: {
    final_exam_id: string
    students: StudentGradeDto[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

export function useFinalExamStudentGrades(
  finalExamId: string,
  params?: { limit?: number; page?: number; q?: string; order?: 'ASC' | 'DESC' },
  options?: UseQueryOptions<StudentGradesResponse>
) {
  return useQuery<StudentGradesResponse>({
    queryKey: QUERY_KEYS.FINAL_EXAM_STUDENT_GRADES(finalExamId, params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const response = await axios_instance.get<StudentGradesResponse>(
        `${FINAL_EXAM_API_ENDPOINT}/${finalExamId}/student-grades`,
        {
          params: {
            limit: params?.limit ?? 10,
            page: params?.page ?? 1,
            q: params?.q,
            order: params?.order ?? 'ASC'
          }
        }
      )
      return response.data
    },
    enabled: !!finalExamId,
    ...options
  })
}

export interface UpdateFinalExamPayload {
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  start_time: string
  end_time: string
}

export interface UpdateFinalExamResponse {
  status_code: number
  message: string
  data: FinalExamDto
}

export function useUpdateFinalExam(
  options?: UseMutationOptions<UpdateFinalExamResponse, Error, { id: string; payload: UpdateFinalExamPayload }>
) {
  return useMutation<UpdateFinalExamResponse, Error, { id: string; payload: UpdateFinalExamPayload }>({
    mutationFn: async ({ id, payload }) => {
      const response = await axios_instance.patch<UpdateFinalExamResponse>(`${FINAL_EXAM_API_ENDPOINT}/${id}`, payload)
      return response.data
    },
    ...options
  })
}
