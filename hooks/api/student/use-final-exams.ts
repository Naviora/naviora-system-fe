import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { axios_instance } from '@/lib/api/client'
import { QUERY_KEYS } from '@/lib/constants/config'
import type { FinalExamDto, FinalExamsQueryParams, FinalExamsResponse } from '@/hooks/api/principal/use-final-exams'

const STUDENT_FINAL_EXAM_API_ENDPOINT = '/final-exam'

export type FinalExamAttemptStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'CANCELLED'

export interface StudentFinalExamDto extends FinalExamDto {
  attempt_status?: FinalExamAttemptStatus
  total_attempts?: number
  max_attempts?: number
  joined?: boolean
  is_submitted?: boolean
}

export type StudentFinalExamsResponse = Omit<FinalExamsResponse, 'data'> & {
  data: {
    final_exams: StudentFinalExamDto[]
    pagination: FinalExamsResponse['data']['pagination']
  }
}

export interface StudentFinalExamDetailResponse {
  status_code: number
  message: string
  data: StudentFinalExamDto
}

export function useStudentFinalExams(
  params?: FinalExamsQueryParams,
  options?: UseQueryOptions<StudentFinalExamsResponse>
) {
  return useQuery<StudentFinalExamsResponse>({
    queryKey: QUERY_KEYS.FINAL_EXAM_LIST({ ...(params ?? {}), scope: 'student-final' }),
    queryFn: async () => {
      const response = await axios_instance.get<StudentFinalExamsResponse>(STUDENT_FINAL_EXAM_API_ENDPOINT, {
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

export function useStudentFinalExamDetail(
  finalExamId: string,
  options?: UseQueryOptions<StudentFinalExamDetailResponse>
) {
  return useQuery<StudentFinalExamDetailResponse>({
    queryKey: QUERY_KEYS.FINAL_EXAM_DETAIL(finalExamId),
    queryFn: async () => {
      const response = await axios_instance.get<StudentFinalExamDetailResponse>(
        `${STUDENT_FINAL_EXAM_API_ENDPOINT}/${finalExamId}`
      )
      return response.data
    },
    enabled: Boolean(finalExamId),
    ...options
  })
}
