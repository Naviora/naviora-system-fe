'use client'

import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import type { Class, ClassType } from '@/types/api/class'

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

export function createLecturerClassColumns(): ColumnDef<Class>[] {
  return [
    {
      accessorKey: 'class_code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Mã lớp' />,
      cell: ({ row }) => (
        <Link
          href={`/lecturer/classes/${row.original.class_id}`}
          className='text-sm font-semibold text-greyscale-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors'
        >
          {row.original.class_code}
        </Link>
      )
    },
    {
      accessorKey: 'class_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tên lớp' />,
      cell: ({ row }) => (
        <Link
          href={`/lecturer/classes/${row.original.class_id}`}
          className='text-sm text-greyscale-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors'
        >
          {row.original.class_name}
        </Link>
      ),
      filterFn: (row, id, value) => {
        const searchValue = (value as string)?.toLowerCase().trim()
        if (!searchValue) {
          return true
        }

        const name = String(row.original.class_name ?? '').toLowerCase()
        const code = String(row.original.class_code ?? '').toLowerCase()

        return name.includes(searchValue) || code.includes(searchValue)
      }
    },
    {
      accessorKey: 'class_type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Loại lớp' />,
      cell: ({ row }) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${classTypeColors[row.original.class_type]}`}
        >
          {classTypeLabels[row.original.class_type]}
        </span>
      ),
      filterFn: (row, id, value) => {
        if (!value) return true
        return row.original.class_type === value
      }
    },
    {
      accessorKey: 'start_date',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày bắt đầu' />,
      cell: ({ row }) => <span className='text-sm text-greyscale-700'>{formatDateTime(row.original.start_date)}</span>
    },
    {
      accessorKey: 'end_date',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày kết thúc' />,
      cell: ({ row }) => <span className='text-sm text-greyscale-700'>{formatDateTime(row.original.end_date)}</span>
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      cell: ({ row }) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            row.original.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.original.is_active ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      )
    },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật lần cuối' />,
      cell: ({ row }) => <span className='text-sm text-greyscale-500'>{formatDateTime(row.original.updated_at)}</span>
    },
    {
      id: 'actions',
      header: () => <div className='flex justify-end text-sm font-medium text-greyscale-500'>Thao tác</div>,
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <Button asChild variant='ghost' size='sm' className='h-8 gap-2'>
            <Link href={`/lecturer/classes/${row.original.class_id}`}>
              <Eye className='h-4 w-4' />
              Xem chi tiết
            </Link>
          </Button>
        </div>
      )
    }
  ]
}
