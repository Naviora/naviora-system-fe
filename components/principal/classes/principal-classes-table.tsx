'use client'

import { useMemo } from 'react'
import type { OnChangeFn, PaginationState } from '@tanstack/react-table'

import { DataTable } from '@/components/ui/data-table'
import type { PrincipalClassRow, ClassType } from '@/types/principal/classes'

import { createPrincipalClassColumns } from './columns'
import { ClassTableToolbar } from './class-table-toolbar'

interface PrincipalClassesTableProps {
  data: PrincipalClassRow[]
  pageSizeOptions?: number[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  selectedClassType?: ClassType | null
  onClassTypeChange?: (type: ClassType | null) => void
  isSearchDisabled?: boolean
  onEdit?: (classItem: PrincipalClassRow) => void
  onToggleStatus?: (classItem: PrincipalClassRow) => void
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  totalPages?: number
}

export function PrincipalClassesTable({
  data,
  pageSizeOptions = [10, 20, 50],
  searchValue = '',
  onSearchChange,
  selectedClassType,
  onClassTypeChange,
  isSearchDisabled,
  onEdit,
  onToggleStatus,
  pagination,
  onPaginationChange,
  totalPages = 1
}: PrincipalClassesTableProps) {
  const columns = useMemo(
    () =>
      createPrincipalClassColumns({
        onEdit,
        onToggleStatus
      }),
    [onEdit, onToggleStatus]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={() => (
        <ClassTableToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          selectedClassType={selectedClassType}
          onClassTypeChange={onClassTypeChange}
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
