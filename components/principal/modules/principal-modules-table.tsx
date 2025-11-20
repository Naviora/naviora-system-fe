'use client'

import { useMemo } from 'react'
import type { OnChangeFn, PaginationState } from '@tanstack/react-table'

import { DataTable } from '@/components/ui/data-table'
import type { PrincipalModuleRow } from '@/types/principal/modules'

import { createPrincipalModuleColumns } from './columns'
import { ModuleTableToolbar } from './module-table-toolbar'

interface PrincipalModulesTableProps {
  data: PrincipalModuleRow[]
  pageSizeOptions?: number[]
  searchValue?: string
  onSearchChange?: (value: string) => void
  isSearchDisabled?: boolean
  onViewModule?: (module: PrincipalModuleRow) => void
  onEditModule?: (module: PrincipalModuleRow) => void
  onDeleteModule?: (module: PrincipalModuleRow) => void
  deletingModuleId?: string | null
  isDeleteLoading?: boolean
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  totalItems?: number
  isPaginationDisabled?: boolean
}

export function PrincipalModulesTable({
  data,
  pageSizeOptions = [5, 10, 20],
  searchValue,
  onSearchChange,
  isSearchDisabled,
  onViewModule,
  onEditModule,
  onDeleteModule,
  deletingModuleId,
  isDeleteLoading,
  pagination,
  onPaginationChange,
  pageCount,
  totalItems,
  isPaginationDisabled
}: PrincipalModulesTableProps) {
  const columns = useMemo(
    () =>
      createPrincipalModuleColumns({
        onView: onViewModule,
        onEdit: onEditModule,
        onDelete: onDeleteModule,
        deletingModuleId,
        isDeleteLoading
      }),
    [deletingModuleId, isDeleteLoading, onDeleteModule, onEditModule, onViewModule]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={(table) => (
        <ModuleTableToolbar
          table={table}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          isSearchDisabled={isSearchDisabled}
        />
      )}
      pageSizeOptions={pageSizeOptions}
      manualPagination={Boolean(pagination)}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      pageCount={pageCount}
      totalItems={totalItems}
      isPaginationDisabled={isPaginationDisabled}
    />
  )
}
