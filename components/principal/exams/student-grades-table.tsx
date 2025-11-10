'use client'

import { useMemo } from 'react'
import type { OnChangeFn, PaginationState } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { createStudentGradesColumns } from './student-grades-columns'
import type { StudentGradeDto } from '@/hooks/api/principal/use-entry-tests'

interface StudentGradesTableProps {
  data: StudentGradeDto[]
  searchQuery?: string
  onSearchChange?: (value: string) => void
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  totalPages?: number
  isLoading?: boolean
  pageSizeOptions?: number[]
}

export function StudentGradesTable({
  data,
  searchQuery = '',
  onSearchChange,
  pagination,
  onPaginationChange,
  totalPages = 1,
  isLoading = false,
  pageSizeOptions = [10, 20, 50]
}: StudentGradesTableProps) {
  const columns = useMemo(() => createStudentGradesColumns(), [])

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={() => (
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          <InputGroup className='sm:max-w-xs'>
            <InputGroupAddon>
              <Search className='size-4 text-greyscale-400' aria-hidden='true' />
            </InputGroupAddon>
            <InputGroupInput
              placeholder='Tìm kiếm theo tên hoặc email học sinh...'
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              disabled={isLoading}
            />
          </InputGroup>
        </div>
      )}
      pageSizeOptions={pageSizeOptions}
      manualPagination={Boolean(pagination)}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      pageCount={totalPages}
      isPaginationDisabled={isLoading}
      emptyMessage='Không tìm thấy kết quả nào'
    />
  )
}
