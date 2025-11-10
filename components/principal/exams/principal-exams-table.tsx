'use client'

import { useMemo } from 'react'
import type { OnChangeFn, PaginationState } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { createExamsColumns } from './exams-columns'
import { ExamsTableToolbar } from './exams-table-toolbar'

export interface ExamsRow {
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

interface PrincipalExamsTableProps {
  data: ExamsRow[]
  pageSizeOptions?: number[]
  searchTerm?: string
  onSearchChange?: (value: string) => void
  statusFilter?: string | null
  onStatusFilterChange?: (value: string | null) => void
  isSearchDisabled?: boolean
  onViewExam?: (row: ExamsRow) => void
  onEditExam?: (row: ExamsRow) => void
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  totalPages?: number
}

export function PrincipalExamsTable({
  data,
  pageSizeOptions = [10, 20, 50],
  searchTerm = '',
  onSearchChange,
  statusFilter = null,
  onStatusFilterChange,
  isSearchDisabled = false,
  onViewExam,
  onEditExam,
  pagination,
  onPaginationChange,
  totalPages = 1
}: PrincipalExamsTableProps) {
  const columns = useMemo(() => createExamsColumns({ onView: onViewExam, onEdit: onEditExam }), [onViewExam, onEditExam])

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={() => (
        <ExamsTableToolbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          isSearchDisabled={isSearchDisabled}
        />
      )}
      pageSizeOptions={pageSizeOptions}
      manualPagination={Boolean(pagination)}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      pageCount={totalPages}
      isPaginationDisabled={isSearchDisabled}
    />
  )
}
