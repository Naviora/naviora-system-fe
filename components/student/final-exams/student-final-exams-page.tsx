'use client'

import { useEffect, useMemo, useState } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { StudentFinalExamsTable } from '@/components/student/final-exams/student-final-exams-table'
import { DayStreak } from '@/components/common/day-streak'
import {
  type StudentFinalExamDto,
  type StudentFinalExamsResponse,
  useStudentFinalExams
} from '@/hooks/api/student/use-final-exams'
import { useLiveTime } from '@/hooks/use-live-time'
import { getExamCountdownState } from '@/lib/utils'
import { useSetBreadcrumbItems } from '@/lib/context/breadcrumb-context'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorHandler } from '@/lib/utils/error-handler'

const DEFAULT_PAGE_SIZE = 8

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}

function getQuestionSetCount(questionSets: StudentFinalExamDto['question_sets']) {
  return Array.isArray(questionSets) ? questionSets.length : 0
}

function buildTableRows(exams: StudentFinalExamDto[], now: number) {
  return exams.map((exam) => {
    const countdown = getExamCountdownState(exam.start_time, exam.end_time, now)
    const start = new Date(exam.start_time).getTime()
    const end = new Date(exam.end_time).getTime()
    const durationMinutes = end > start ? Math.max(1, Math.round((end - start) / 60000)) : 0

    return {
      id: exam.final_exam_id,
      title: exam.title,
      description: exam.description,
      status: exam.status,
      startTime: exam.start_time,
      endTime: exam.end_time,
      durationMinutes,
      questionSetCount: getQuestionSetCount(exam.question_sets),
      attemptStatus: exam.attempt_status,
      countdown,
      exam
    }
  })
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className='rounded-lg border border-greyscale-100 bg-greyscale-0 px-4 py-3 shadow-xs'>
      <p className='text-sm font-medium text-greyscale-500'>{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent}`}>{value}</p>
    </div>
  )
}

export function StudentFinalExamsPageClient() {
  const router = useRouter()
  const setBreadcrumbItems = useSetBreadcrumbItems()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE })

  const debouncedSearch = useDebounce(searchTerm)
  const now = useLiveTime(1000)

  const examsQuery = useStudentFinalExams({
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    q: debouncedSearch || undefined,
    status: statusFilter || undefined
  })

  useEffect(() => {
    setBreadcrumbItems([
      {
        label: 'Bài thi cuối kỳ',
        href: '/student/final-exams'
      }
    ])
  }, [setBreadcrumbItems])

  const response: StudentFinalExamsResponse | undefined = examsQuery.data
  const paginationInfo = response?.data?.pagination

  const tableRows = useMemo(
    () => buildTableRows(response?.data?.final_exams ?? [], now),
    [response?.data?.final_exams, now]
  )

  const stats = useMemo(() => {
    return {
      total: paginationInfo?.total_records ?? 0,
      upcoming: tableRows.filter((row) => row.countdown.phase === 'UPCOMING').length,
      ongoing: tableRows.filter((row) => row.countdown.phase === 'ONGOING').length,
      completed: tableRows.filter((row) => row.countdown.phase === 'ENDED').length
    }
  }, [paginationInfo?.total_records, tableRows])

  const isLoading = examsQuery.isLoading
  const isError = examsQuery.isError
  const isFetching = examsQuery.isFetching

  return (
    <div className='flex flex-col-reverse gap-6 px-4 pb-10 pt-4 sm:px-6 lg:flex-row lg:px-8'>
      <div className='flex-1 space-y-6'>
        <header className='space-y-2'>
          <div>
            <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Danh sách bài thi cuối kỳ</h1>
            <p className='text-sm text-greyscale-500'>
              Theo dõi các bài thi sắp diễn ra, đang mở và đã kết thúc với chế độ đếm ngược giống Codeforces.
            </p>
          </div>
        </header>

        <section className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard label='Tổng bài thi' value={stats.total} accent='text-greyscale-900' />
          <StatCard label='Sắp diễn ra' value={stats.upcoming} accent='text-blue-600' />
          <StatCard label='Đang diễn ra' value={stats.ongoing} accent='text-green-600' />
          <StatCard label='Đã kết thúc' value={stats.completed} accent='text-purple-700' />
        </section>

        {isLoading ? (
          <div className='space-y-3 rounded-xl border border-dashed border-greyscale-200 bg-greyscale-0 p-6'>
            <Skeleton className='h-10 w-1/2' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-40 w-full' />
          </div>
        ) : isError ? (
          <div className='flex flex-col gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-6'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='mt-0.5 size-5 text-destructive' />
              <div>
                <p className='text-sm font-semibold text-destructive'>Không thể tải dữ liệu bài thi</p>
                <p className='text-sm text-destructive/80'>{ErrorHandler.getErrorMessage(examsQuery.error)}</p>
              </div>
            </div>
            <Button className='w-fit' variant='outline' onClick={() => examsQuery.refetch()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <StudentFinalExamsTable
            data={tableRows}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={(value) => {
              setStatusFilter(value)
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }}
            isSearchDisabled={isFetching}
            pagination={pagination}
            onPaginationChange={setPagination}
            totalPages={paginationInfo?.total_pages}
            totalItems={paginationInfo?.total_records}
            onJoinExam={(exam: StudentFinalExamDto) => {
              router.push(`/student/final-exams/${exam.final_exam_id}`)
            }}
          />
        )}
      </div>

      <aside className='lg:w-80'>
        <DayStreak />
      </aside>
    </div>
  )
}
