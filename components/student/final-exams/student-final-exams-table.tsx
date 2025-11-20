'use client'

import { useMemo } from 'react'
import type { OnChangeFn, PaginationState } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { createStudentFinalExamColumns, type StudentFinalExamRow } from './columns'
import { StudentFinalExamsToolbar } from './student-final-exams-toolbar'
import type { StudentFinalExamDto } from '@/hooks/api/student/use-final-exams'

const PAGE_SIZE_OPTIONS = [8, 12, 20]

interface StudentFinalExamsTableProps {
  data: StudentFinalExamRow[]
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string | null
  onStatusFilterChange: (value: string | null) => void
  isSearchDisabled?: boolean
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  totalPages?: number
  totalItems?: number
  onJoinExam?: (exam: StudentFinalExamDto) => void
}

export function StudentFinalExamsTable({
  data,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isSearchDisabled = false,
  pagination,
  onPaginationChange,
  totalPages = 1,
  totalItems = data.length,
  onJoinExam
}: StudentFinalExamsTableProps) {
  const columns = useMemo(() => createStudentFinalExamColumns({ onJoin: onJoinExam }), [onJoinExam])

  return (
    <DataTable
      columns={columns}
      data={data}
      manualPagination
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      pageCount={totalPages}
      totalItems={totalItems}
      isPaginationDisabled={isSearchDisabled}
      toolbar={() => (
        <StudentFinalExamsToolbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          isDisabled={isSearchDisabled}
        />
      )}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
    />
  )
}
