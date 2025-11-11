'use client'

import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export interface LecturerModuleRow {
  module_id: string
  module_code: string
  module_name: string
  module_description?: string
  banner?: string
  created_at: string
  updated_at: string
}

export function createLecturerModuleColumns(): ColumnDef<LecturerModuleRow>[] {
  return [
    {
      accessorKey: 'module_code',
      header: 'Mã chuyên đề',
      cell: ({ row }) => <span className='font-medium'>{row.original.module_code}</span>
    },
    {
      accessorKey: 'module_name',
      header: 'Tên chuyên đề',
      cell: ({ row }) => <span>{row.original.module_name}</span>
    },
    {
      accessorKey: 'module_description',
      header: 'Mô tả',
      cell: ({ row }) => (
        <span className='text-sm text-gray-600 line-clamp-2'>{row.original.module_description || '-'}</span>
      )
    },
    {
      accessorKey: 'updated_at',
      header: 'Cập nhật lần cuối',
      cell: ({ row }) => <span className='text-sm text-gray-500'>{formatDate(row.original.updated_at)}</span>
    },
    {
      id: 'actions',
      header: () => <div className='flex justify-end text-sm font-medium text-greyscale-500'>Hành động</div>,
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <Button asChild variant='ghost' size='sm' className='h-8 gap-2'>
            <Link href={`/lecturer/modules/${row.original.module_id}`}>
              <Eye className='h-4 w-4' />
              Xem chi tiết
            </Link>
          </Button>
        </div>
      )
    }
  ]
}
