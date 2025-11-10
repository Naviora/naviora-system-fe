'use client'

import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { formatDateTime } from '@/lib/utils'
import type { PrincipalClassRow, ClassType } from '@/types/principal/classes'
import { PrincipalClassRowActions } from '@/components/principal/classes'

export interface PrincipalClassColumnActions {
  onEdit?: (classItem: PrincipalClassRow) => void
  onToggleStatus?: (classItem: PrincipalClassRow) => void
}

const classTypeLabels: Record<ClassType, string> = {
  school: 'Trường học',
  city: 'Thành phố',
  province: 'Tỉnh',
  national: 'Quốc gia',
  international: 'Quốc tế'
}

const classTypeColors: Record<ClassType, string> = {
  school: 'bg-blue-100 text-blue-800',
  city: 'bg-green-100 text-green-800',
  province: 'bg-yellow-100 text-yellow-800',
  national: 'bg-purple-100 text-purple-800',
  international: 'bg-red-100 text-red-800'
}

export function createPrincipalClassColumns({
  onEdit,
  onToggleStatus
}: PrincipalClassColumnActions = {}): ColumnDef<PrincipalClassRow>[] {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Mã lớp' />,
      cell: ({ row }) => (
        <Link
          href={`/principal/classes/${row.original.id}`}
          className='text-sm font-semibold text-greyscale-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors'
        >
          {row.original.code}
        </Link>
      )
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên lớp' />,
      cell: ({ row }) => (
        <Link
          href={`/principal/classes/${row.original.id}`}
          className='text-sm text-greyscale-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors'
        >
          {row.original.name}
        </Link>
      ),
      filterFn: (row, id, value) => {
        const searchValue = (value as string)?.toLowerCase().trim()
        if (!searchValue) {
          return true
        }

        const name = String(row.original.name ?? '').toLowerCase()
        const code = String(row.original.code ?? '').toLowerCase()

        return name.includes(searchValue) || code.includes(searchValue)
      }
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Loại lớp' />,
      cell: ({ row }) => (
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${classTypeColors[row.original.type]}`}>
          {classTypeLabels[row.original.type]}
        </span>
      ),
      filterFn: (row, id, value) => {
        if (!value) return true
        return row.original.type === value
      }
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày bắt đầu' />,
      cell: ({ row }) => <span className='text-sm text-greyscale-500'>{formatDateTime(row.original.startDate)}</span>
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày kết thúc' />,
      cell: ({ row }) => <span className='text-sm text-greyscale-500'>{formatDateTime(row.original.endDate)}</span>
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      cell: ({ row }) => (
        <button
          onClick={() => onToggleStatus?.(row.original)}
          className={`inline-block px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-all hover:opacity-80 ${row.original.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
        >
          {row.original.isActive ? 'Hoạt động' : 'Không hoạt động'}
        </button>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật' />,
      cell: ({ row }) => <span className='text-sm text-greyscale-500'>{formatDateTime(row.original.updatedAt)}</span>
    },
    {
      id: 'actions',
      header: () => <div className='flex justify-end text-sm font-medium text-greyscale-500'>Thao tác</div>,
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <PrincipalClassRowActions classItem={row.original} onEdit={onEdit} />
        </div>
      ),
      enableSorting: false,
      enableHiding: false
    }
  ]
}
