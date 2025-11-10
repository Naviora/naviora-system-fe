'use client'

import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ModuleRow } from '@/types/principal/classes'

interface CreateModuleColumnsOptions {
  onAssignLecturers?: (module: ModuleRow) => void
}

export function createModuleColumns(options?: CreateModuleColumnsOptions): ColumnDef<ModuleRow>[] {
  return [
    {
      accessorKey: 'code',
      header: 'Mã module',
      cell: ({ row }) => <span className='font-medium'>{row.original.code}</span>
    },
    {
      accessorKey: 'name',
      header: 'Tên module',
      cell: ({ row }) => <span>{row.original.name}</span>
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      cell: ({ row }) => <span className='text-sm text-gray-600 line-clamp-2'>{row.original.description || '-'}</span>
    },
    {
      accessorKey: 'updatedAt',
      header: 'Cập nhật lần cuối',
      cell: ({ row }) => <span className='text-sm text-gray-500'>{formatDate(row.original.updatedAt)}</span>
    },
    {
      id: 'actions',
      header: () => <div className='flex justify-end text-sm font-medium text-greyscale-500'>Hành động</div>,
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => options?.onAssignLecturers?.(row.original)}
            className='h-8 gap-2'
          >
            <Users className='h-4 w-4' />
            Gán giáo viên
          </Button>
        </div>
      )
    }
  ]
}
