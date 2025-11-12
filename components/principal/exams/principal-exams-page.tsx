'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEntryTests } from '@/hooks/api/principal/use-entry-tests'
import { useFinalExams } from '@/hooks/api/principal/use-final-exams'
import { PrincipalExamsTable } from './principal-exams-table'
import { EditEntryTestModal } from './edit-entry-test-modal'
import { EditFinalExamModal } from './edit-final-exam-modal'
import { ErrorHandler } from '@/lib/utils/error-handler'
import type { EntryTestDto } from '@/hooks/api/principal/use-entry-tests'
import type { FinalExamDto } from '@/hooks/api/principal/use-final-exams'

const EXAMS_QUERY_DEFAULTS = { limit: 10 }

interface ExamsRow {
  id: string
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  startTime: string
  endTime: string
  createdAt: string
  createdBy: string
  questionSets: number
}

function mapEntryTestsToRows(tests: EntryTestDto[]): ExamsRow[] {
  return tests.map((test) => ({
    id: test.entry_test_id,
    title: test.title,
    description: test.description,
    status: test.status,
    startTime: test.start_time,
    endTime: test.end_time,
    createdAt: test.created_at,
    createdBy: test.created_by.name,
    questionSets: test.question_sets.length
  }))
}

function mapFinalExamsToRows(exams: FinalExamDto[]): ExamsRow[] {
  return exams.map((exam) => ({
    id: exam.final_exam_id,
    title: exam.title,
    description: exam.description,
    status: exam.status,
    startTime: exam.start_time,
    endTime: exam.end_time,
    createdAt: exam.created_at,
    createdBy: exam.created_by.name,
    questionSets: exam.question_sets.length
  }))
}

function useDebounce<T>(value: T, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}

export function PrincipalExamsPageClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('entry-test')

  // Entry Test State
  const [entryTestSearchTerm, setEntryTestSearchTerm] = useState('')
  const [entryTestStatusFilter, setEntryTestStatusFilter] = useState<string | null>(null)
  const [entryTestPagination, setEntryTestPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: EXAMS_QUERY_DEFAULTS.limit
  }))
  const [isEditEntryTestModalOpen, setIsEditEntryTestModalOpen] = useState(false)
  const [selectedEntryTest, setSelectedEntryTest] = useState<EntryTestDto | null>(null)

  // Final Exam State
  const [finalExamSearchTerm, setFinalExamSearchTerm] = useState('')
  const [finalExamStatusFilter, setFinalExamStatusFilter] = useState<string | null>(null)
  const [finalExamPagination, setFinalExamPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: EXAMS_QUERY_DEFAULTS.limit
  }))
  const [isEditFinalExamModalOpen, setIsEditFinalExamModalOpen] = useState(false)
  const [selectedFinalExam, setSelectedFinalExam] = useState<FinalExamDto | null>(null)

  const debouncedEntryTestSearch = useDebounce(entryTestSearchTerm)
  const debouncedFinalExamSearch = useDebounce(finalExamSearchTerm)

  // Entry Tests Query
  const entryTestsQueryParams = useMemo(
    () => ({
      limit: entryTestPagination.pageSize,
      page: entryTestPagination.pageIndex + 1,
      q: debouncedEntryTestSearch || undefined,
      status: entryTestStatusFilter || undefined
    }),
    [debouncedEntryTestSearch, entryTestPagination.pageIndex, entryTestPagination.pageSize, entryTestStatusFilter]
  )

  const entryTestsQuery = useEntryTests(entryTestsQueryParams)

  const entryTestRows = useMemo(() => {
    return mapEntryTestsToRows(entryTestsQuery.data?.data?.entry_tests ?? [])
  }, [entryTestsQuery.data])

  const entryTestTotalPages = entryTestsQuery.data?.data?.pagination.total_pages ?? 1

  // Final Exams Query
  const finalExamsQueryParams = useMemo(
    () => ({
      limit: finalExamPagination.pageSize,
      page: finalExamPagination.pageIndex + 1,
      q: debouncedFinalExamSearch || undefined,
      status: finalExamStatusFilter || undefined
    }),
    [debouncedFinalExamSearch, finalExamPagination.pageIndex, finalExamPagination.pageSize, finalExamStatusFilter]
  )

  const finalExamsQuery = useFinalExams(finalExamsQueryParams)

  const finalExamRows = useMemo(() => {
    return mapFinalExamsToRows(finalExamsQuery.data?.data?.final_exams ?? [])
  }, [finalExamsQuery.data])

  const finalExamTotalPages = finalExamsQuery.data?.data?.pagination.total_pages ?? 1

  const handleEditEntryTest = (row: ExamsRow) => {
    const exam = entryTestsQuery.data?.data?.entry_tests?.find((t) => t.entry_test_id === row.id)
    if (exam) {
      setSelectedEntryTest(exam)
      setIsEditEntryTestModalOpen(true)
    }
  }

  const handleEditFinalExam = (row: ExamsRow) => {
    const exam = finalExamsQuery.data?.data?.final_exams?.find((t) => t.final_exam_id === row.id)
    if (exam) {
      setSelectedFinalExam(exam)
      setIsEditFinalExamModalOpen(true)
    }
  }

  const renderEntryTestContent = () => {
    if (entryTestsQuery.isLoading) {
      return (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='h-12 w-full rounded-md bg-greyscale-50' />
          ))}
        </div>
      )
    }

    if (entryTestsQuery.isError) {
      return (
        <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center'>
          <p className='text-sm font-medium text-destructive'>{ErrorHandler.getErrorMessage(entryTestsQuery.error)}</p>
        </div>
      )
    }

    return (
      <PrincipalExamsTable
        data={entryTestRows}
        searchTerm={entryTestSearchTerm}
        onSearchChange={setEntryTestSearchTerm}
        statusFilter={entryTestStatusFilter}
        onStatusFilterChange={setEntryTestStatusFilter}
        isSearchDisabled={entryTestsQuery.isFetching}
        pagination={entryTestPagination}
        onPaginationChange={setEntryTestPagination}
        totalPages={entryTestTotalPages}
        onViewExam={(row: ExamsRow) => {
          router.push(`/principal/exams/${row.id}?type=entry-test`)
        }}
        onEditExam={handleEditEntryTest}
      />
    )
  }

  const renderFinalExamContent = () => {
    if (finalExamsQuery.isLoading) {
      return (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='h-12 w-full rounded-md bg-greyscale-50' />
          ))}
        </div>
      )
    }

    if (finalExamsQuery.isError) {
      return (
        <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center'>
          <p className='text-sm font-medium text-destructive'>{ErrorHandler.getErrorMessage(finalExamsQuery.error)}</p>
        </div>
      )
    }

    return (
      <PrincipalExamsTable
        data={finalExamRows}
        searchTerm={finalExamSearchTerm}
        onSearchChange={setFinalExamSearchTerm}
        statusFilter={finalExamStatusFilter}
        onStatusFilterChange={setFinalExamStatusFilter}
        isSearchDisabled={finalExamsQuery.isFetching}
        pagination={finalExamPagination}
        onPaginationChange={setFinalExamPagination}
        totalPages={finalExamTotalPages}
        onViewExam={(row: ExamsRow) => {
          router.push(`/principal/exams/${row.id}?type=final-exam`)
        }}
        onEditExam={handleEditFinalExam}
      />
    )
  }

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      <header className='flex flex-col gap-2'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900'>Quản lý bài thi</h1>
          <p className='text-sm text-greyscale-500'>
            Xem và quản lý tất cả các bài thi đầu vào, cuối kỳ, phổ điểm và kết quả học sinh
          </p>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full max-w-md grid-cols-2'>
          <TabsTrigger value='entry-test'>Bài thi đầu vào</TabsTrigger>
          <TabsTrigger value='final-exam'>Bài thi cuối kỳ</TabsTrigger>
        </TabsList>

        <TabsContent value='entry-test' className='space-y-4'>
          {renderEntryTestContent()}
        </TabsContent>

        <TabsContent value='final-exam' className='space-y-4'>
          {renderFinalExamContent()}
        </TabsContent>
      </Tabs>

      {/* Edit Entry Test Modal */}
      {selectedEntryTest && (
        <EditEntryTestModal
          open={isEditEntryTestModalOpen}
          onOpenChange={setIsEditEntryTestModalOpen}
          entryTest={selectedEntryTest}
          onSuccess={() => {
            entryTestsQuery.refetch()
          }}
        />
      )}

      {/* Edit Final Exam Modal */}
      {selectedFinalExam && (
        <EditFinalExamModal
          open={isEditFinalExamModalOpen}
          onOpenChange={setIsEditFinalExamModalOpen}
          finalExam={selectedFinalExam}
          onSuccess={() => {
            finalExamsQuery.refetch()
          }}
        />
      )}
    </div>
  )
}
