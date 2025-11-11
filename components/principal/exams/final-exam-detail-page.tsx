'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { AlertCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useFinalExams,
  useFinalExamScoreSpectrum,
  useFinalExamStudentGrades
} from '@/hooks/api/principal/use-final-exams'
import { ScoreSpectrumChart } from './score-spectrum-chart'
import { StudentGradesTable } from './student-grades-table'
import { ArrangeStudentsDrawer } from './arrange-students-drawer'
import { ErrorHandler } from '@/lib/utils/error-handler'
import { format } from 'date-fns'
import type { ScoreSpectrumStatistics } from '@/hooks/api/principal/use-final-exams'

const STUDENT_GRADES_DEFAULTS = { limit: 10 }

function StatCard({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <div className='rounded-lg border border-greyscale-100 bg-greyscale-0 p-4 shadow-xs'>
      <div className='text-xs font-medium uppercase tracking-wide text-greyscale-600'>{label}</div>
      <div className='mt-2 text-2xl font-bold text-greyscale-900'>{value}</div>
      {subtext && <div className='mt-1 text-xs text-greyscale-500'>{subtext}</div>}
    </div>
  )
}

function getStatusBadge(status: string) {
  const statusMap = {
    DRAFT: { label: 'Nháp', className: 'bg-greyscale-100 text-greyscale-700' },
    PUBLISHED: { label: 'Đã xuất bản', className: 'bg-blue-100 text-blue-700' },
    ACTIVE: { label: 'Đang hoạt động', className: 'bg-green-100 text-green-700' },
    COMPLETED: { label: 'Đã hoàn thành', className: 'bg-purple-100 text-purple-700' },
    CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' }
  }
  const config = statusMap[status as keyof typeof statusMap] || statusMap.DRAFT
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

interface FinalExamDetailPageClientProps {
  finalExamId: string
}

export function FinalExamDetailPageClient({ finalExamId }: FinalExamDetailPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isArrangeModalOpen, setIsArrangeModalOpen] = useState(false)
  const [studentPagination, setStudentPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: STUDENT_GRADES_DEFAULTS.limit
  }))

  // Fetch final exams list to find current exam
  const allExamsQuery = useFinalExams({ limit: 100 })
  const currentExam = useMemo(
    () => allExamsQuery.data?.data?.final_exams?.find((t) => t.final_exam_id === finalExamId),
    [allExamsQuery.data?.data?.final_exams, finalExamId]
  )

  // Fetch score spectrum
  const scoreSpectrumQuery = useFinalExamScoreSpectrum(finalExamId)

  // Fetch student grades with debounced search
  const studentGradesQuery = useFinalExamStudentGrades(finalExamId, {
    limit: studentPagination.pageSize,
    page: studentPagination.pageIndex + 1,
    q: searchQuery || undefined
  })

  const studentGradesData = studentGradesQuery.data?.data?.students ?? []
  const totalStudentPages = studentGradesQuery.data?.data?.pagination.total_pages ?? 1

  const isLoading = allExamsQuery.isLoading || scoreSpectrumQuery.isLoading
  const hasError = allExamsQuery.isError || scoreSpectrumQuery.isError

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className='h-24 w-full' />
          ))}
        </div>
        <Skeleton className='h-80 w-full' />
      </div>
    )
  }

  if (hasError || !currentExam) {
    return (
      <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center'>
          <AlertCircle className='size-5 text-destructive' />
          <div className='text-left'>
            <p className='text-sm font-medium text-destructive'>Lỗi tải dữ liệu</p>
            <p className='text-sm text-destructive/80'>
              {allExamsQuery.isError ? ErrorHandler.getErrorMessage(allExamsQuery.error) : 'Không tìm thấy bài thi'}
            </p>
          </div>
        </div>
        <Button onClick={() => allExamsQuery.refetch()} variant='outline' className='w-fit'>
          Thử lại
        </Button>
      </div>
    )
  }

  const statistics = scoreSpectrumQuery.data?.data?.statistics as ScoreSpectrumStatistics | undefined
  const scoreRanges = scoreSpectrumQuery.data?.data?.score_ranges ?? []
  const hasNoSubmissions = scoreSpectrumQuery.isError || (scoreRanges.length === 0 && !scoreSpectrumQuery.isLoading)

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <header className='space-y-2'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1 space-y-1'>
            <h1 className='text-2xl font-semibold text-greyscale-900'>{currentExam.title}</h1>
            <p className='text-sm text-greyscale-500'>{currentExam.description}</p>
          </div>
          {getStatusBadge(currentExam.status)}
        </div>
      </header>

      {/* Test Info */}
      <section className='rounded-lg border border-greyscale-100 bg-greyscale-0 p-4 shadow-xs'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <div className='text-xs font-medium uppercase tracking-wide text-greyscale-600'>Bắt đầu</div>
            <div className='mt-1 text-sm font-medium text-greyscale-900'>
              {format(new Date(currentExam.start_time), 'dd/MM/yyyy HH:mm')}
            </div>
          </div>
          <div>
            <div className='text-xs font-medium uppercase tracking-wide text-greyscale-600'>Kết thúc</div>
            <div className='mt-1 text-sm font-medium text-greyscale-900'>
              {format(new Date(currentExam.end_time), 'dd/MM/yyyy HH:mm')}
            </div>
          </div>
          <div>
            <div className='text-xs font-medium uppercase tracking-wide text-greyscale-600'>Người tạo</div>
            <div className='mt-1 text-sm font-medium text-greyscale-900'>{currentExam.created_by.name}</div>
          </div>
          <div>
            <div className='text-xs font-medium uppercase tracking-wide text-greyscale-600'>Số bộ câu hỏi</div>
            <div className='mt-1 text-sm font-medium text-greyscale-900'>{currentExam.question_sets.length}</div>
          </div>
        </div>
      </section>

      {/* No Submissions State */}
      {hasNoSubmissions ? (
        <div className='rounded-lg border border-amber-200 bg-amber-50 p-6'>
          <p className='text-sm text-amber-900'>
            Chưa có bài nộp nào cho bài thi này. Thống kê và biểu đồ sẽ hiển thị khi có học sinh nộp bài.
          </p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          {statistics && (
            <section>
              <div className='mb-3'>
                <h2 className='text-lg font-semibold text-greyscale-900'>Thống kê tổng quan</h2>
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
                <StatCard label='Tổng bài nộp' value={statistics.total_submissions} />
                <StatCard label='Điểm trung bình' value={statistics.average_score.toFixed(2)} subtext='/10' />
                <StatCard label='Điểm cao nhất' value={statistics.highest_score} />
                <StatCard label='Điểm thấp nhất' value={statistics.lowest_score} />
                <StatCard label='Trung vị' value={statistics.median_score} />
                <StatCard label='Độ lệch chuẩn' value={statistics.standard_deviation.toFixed(2)} />
              </div>
            </section>
          )}

          {/* Score Spectrum Chart */}
          <section>
            {scoreSpectrumQuery.isLoading ? (
              <Skeleton className='h-96 w-full rounded-lg' />
            ) : (
              <ScoreSpectrumChart data={scoreRanges} />
            )}
          </section>
        </>
      )}

      {/* Student Grades Section */}
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-semibold text-greyscale-900'>Kết quả học sinh</h2>
            <p className='mt-1 text-sm text-greyscale-500'>Danh sách điểm của các học sinh</p>
          </div>
          <Button
            onClick={() => setIsArrangeModalOpen(true)}
            className='flex items-center gap-2'
            disabled={studentGradesData.length === 0}
          >
            <Users className='size-4' />
            Xếp học sinh vào lớp
          </Button>
        </div>

        {studentGradesQuery.isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className='h-12 w-full rounded-md bg-greyscale-50' />
            ))}
          </div>
        ) : (
          <StudentGradesTable
            data={studentGradesData}
            searchQuery={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value)
              setStudentPagination({ pageIndex: 0, pageSize: STUDENT_GRADES_DEFAULTS.limit })
            }}
            pagination={studentPagination}
            onPaginationChange={setStudentPagination}
            totalPages={totalStudentPages}
            isLoading={studentGradesQuery.isFetching}
          />
        )}
      </section>

      {/* Arrange Students Drawer */}
      <ArrangeStudentsDrawer
        open={isArrangeModalOpen}
        onOpenChange={setIsArrangeModalOpen}
        entryTestId={finalExamId}
        entryTestTitle={currentExam.title}
        students={studentGradesData}
        onSuccess={() => {
          // Refetch student grades to show updated data
          studentGradesQuery.refetch()
        }}
      />
    </div>
  )
}
