'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { useEntryTests } from '@/hooks/api/principal/use-entry-tests'
import { PrincipalExamsTable } from './principal-exams-table'
import { EditEntryTestModal } from './edit-entry-test-modal'
import { ErrorHandler } from '@/lib/utils/error-handler'
import type { EntryTestDto } from '@/hooks/api/principal/use-entry-tests'

const EXAMS_QUERY_DEFAULTS = { limit: 10 }

interface ExamsRow {
  id: string
  title: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: EXAMS_QUERY_DEFAULTS.limit
  }))
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<EntryTestDto | null>(null)

  const debouncedSearch = useDebounce(searchTerm)

  const examsQueryParams = useMemo(
    () => ({
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      q: debouncedSearch || undefined,
      status: statusFilter || undefined
    }),
    [debouncedSearch, pagination.pageIndex, pagination.pageSize, statusFilter]
  )

  const examsQuery = useEntryTests(examsQueryParams)

  const rows = useMemo(() => {
    return mapEntryTestsToRows(examsQuery.data?.data?.entry_tests ?? [])
  }, [examsQuery.data])

  const totalPages = examsQuery.data?.data?.pagination.total_pages ?? 1

  const handleEditExam = (row: ExamsRow) => {
    const exam = examsQuery.data?.data?.entry_tests?.find((t) => t.entry_test_id === row.id)
    if (exam) {
      setSelectedExam(exam)
      setIsEditModalOpen(true)
    }
  }

  const handleEditSubmit = async (data: Partial<EntryTestDto>) => {
    // TODO: Call API to update exam
    console.log('Update exam:', data)
    setIsEditModalOpen(false)
    // Refetch exams after update
    examsQuery.refetch()
  }

  const renderContent = () => {
    if (examsQuery.isLoading) {
      return (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='h-12 w-full rounded-md bg-greyscale-50' />
          ))}
        </div>
      )
    }

    if (examsQuery.isError) {
      return (
        <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center'>
          <p className='text-sm font-medium text-destructive'>{ErrorHandler.getErrorMessage(examsQuery.error)}</p>
        </div>
      )
    }

    return (
      <PrincipalExamsTable
        data={rows}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isSearchDisabled={examsQuery.isFetching}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalPages={totalPages}
        onViewExam={(row: ExamsRow) => {
          router.push(`/principal/exams/${row.id}`)
        }}
        onEditExam={handleEditExam}
      />
    )
  }

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      <header className='flex flex-col gap-2'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900'>Quản lý bài thi</h1>
          <p className='text-sm text-greyscale-500'>
            Xem và quản lý tất cả các bài thi entry test, phổ điểm và kết quả học sinh
          </p>
        </div>
      </header>

      <section className='space-y-4'>{renderContent()}</section>

      {/* Edit Entry Test Modal */}
      {selectedExam && (
        <EditEntryTestModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          entryTest={selectedExam}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  )
}
