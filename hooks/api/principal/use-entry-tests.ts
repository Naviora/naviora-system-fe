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
  has_participated_entry_test: boolean
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

export interface EntryTestDto {
  entry_test_id: string
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

export interface EntryTestsQueryParams {
  limit?: number
  page?: number
  q?: string
  order?: 'ASC' | 'DESC'
  sort_by?: string
  status?: string
}

interface EntryTestsResponse {
  status_code: number
  message: string
  data: {
    entry_tests: EntryTestDto[]
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
    entry_test_id: string
    entry_test_title: string
    statistics: ScoreSpectrumStatistics
    score_ranges: ScoreSpectrum[]
  }
}

export interface EntryTestSubmission {
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

export interface EntryTestSubmissionsResponse {
  status_code: number
  message: string
  data: {
    submissions: EntryTestSubmission[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

const ENTRY_TEST_API_ENDPOINT = '/entry-test'

export function useEntryTests(params?: EntryTestsQueryParams, options?: UseQueryOptions<EntryTestsResponse>) {
  return useQuery<EntryTestsResponse>({
    queryKey: QUERY_KEYS.ENTRY_TEST_LIST(params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const response = await axios_instance.get<EntryTestsResponse>(ENTRY_TEST_API_ENDPOINT, {
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

export function useEntryTestScoreSpectrum(entryTestId: string, options?: UseQueryOptions<ScoreSpectrumResponse>) {
  return useQuery<ScoreSpectrumResponse>({
    queryKey: QUERY_KEYS.ENTRY_TEST_SCORE_SPECTRUM(entryTestId),
    queryFn: async () => {
      const response = await axios_instance.get<ScoreSpectrumResponse>(
        `${ENTRY_TEST_API_ENDPOINT}/${entryTestId}/score-spectrum`
      )
      return response.data
    },
    enabled: !!entryTestId,
    ...options
  })
}

export function useEntryTestSubmissions(
  entryTestId: string,
  params?: { limit?: number; page?: number; q?: string },
  options?: UseQueryOptions<EntryTestSubmissionsResponse>
) {
  return useQuery<EntryTestSubmissionsResponse>({
    queryKey: QUERY_KEYS.ENTRY_TEST_SUBMISSIONS(entryTestId, params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const response = await axios_instance.get<EntryTestSubmissionsResponse>(
        `${ENTRY_TEST_API_ENDPOINT}/${entryTestId}/submissions`,
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
    enabled: !!entryTestId,
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
    entry_test_id: string
    students: StudentGradeDto[]
    pagination: {
      limit: number
      current_page: number
      total_records: number
      total_pages: number
    }
  }
}

export function useEntryTestStudentGrades(
  entryTestId: string,
  params?: { limit?: number; page?: number; q?: string; order?: 'ASC' | 'DESC' },
  options?: UseQueryOptions<StudentGradesResponse>
) {
  return useQuery<StudentGradesResponse>({
    queryKey: QUERY_KEYS.ENTRY_TEST_STUDENT_GRADES(entryTestId, params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const response = await axios_instance.get<StudentGradesResponse>(
        `${ENTRY_TEST_API_ENDPOINT}/${entryTestId}/student-grades`,
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
    enabled: !!entryTestId,
    ...options
  })
}

export interface UpdateEntryTestPayload {
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  startTime: string
  endTime: string
}

export interface UpdateEntryTestResponse {
  status_code: number
  message: string
  data: EntryTestDto
}

export function useUpdateEntryTest(
  options?: UseMutationOptions<UpdateEntryTestResponse, Error, { id: string; payload: UpdateEntryTestPayload }>
) {
  return useMutation<UpdateEntryTestResponse, Error, { id: string; payload: UpdateEntryTestPayload }>({
    mutationFn: async ({ id, payload }) => {
      const response = await axios_instance.patch<UpdateEntryTestResponse>(`${ENTRY_TEST_API_ENDPOINT}/${id}`, payload)
      return response.data
    },
    ...options
  })
}
