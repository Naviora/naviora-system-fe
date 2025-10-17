'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { formatDateTime } from '@/lib/utils'
import type { PrincipalModuleRow } from '@/types/principal/modules'

import { PrincipalModuleRowActions } from './principal-modules-row-actions'

export interface PrincipalModuleColumnActions {
  onView?: (module: PrincipalModuleRow) => void
  onEdit?: (module: PrincipalModuleRow) => void
  onDelete?: (module: PrincipalModuleRow) => void
  deletingModuleId?: string | null
  isDeleteLoading?: boolean
}

export function createPrincipalModuleColumns({
  onView,
  onEdit,
  onDelete,
  deletingModuleId,
  isDeleteLoading
}: PrincipalModuleColumnActions = {}): ColumnDef<PrincipalModuleRow>[] {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Mã chuyên đề' />,
      cell: ({ row }) => <span className='text-sm font-semibold text-greyscale-900'>{row.original.code}</span>
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên chuyên đề' />,
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-semibold text-greyscale-900'>{row.original.name}</span>
          {row.original.description ? (
            <p className='text-xs text-greyscale-500'>{row.original.description}</p>
          ) : (
            <p className='text-xs text-greyscale-400'>Chưa có mô tả</p>
          )}
        </div>
      ),
      filterFn: (row, id, value) => {
        const searchValue = (value as string)?.toLowerCase().trim()
        if (!searchValue) {
          return true
        }

        const name = String(row.original.name ?? '').toLowerCase()
        const code = String(row.original.code ?? '').toLowerCase()
        const description = String(row.original.description ?? '').toLowerCase()

        return name.includes(searchValue) || code.includes(searchValue) || description.includes(searchValue)
      }
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật gần nhất' />,
      cell: ({ row }) => <span className='text-sm text-greyscale-500'>{formatDateTime(row.original.updatedAt)}</span>
    },
    {
      id: 'actions',
      header: () => <div className='flex justify-end text-sm font-medium text-greyscale-500'>Thao tác</div>,
      cell: ({ row }) => (
        <PrincipalModuleRowActions
          module={row.original}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleteLoading && deletingModuleId === row.original.id}
        />
      ),
      enableSorting: false,
      enableHiding: false
    }
  ]
}
