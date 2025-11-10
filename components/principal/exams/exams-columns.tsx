'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import type { ExamsRow } from './principal-exams-table'
import { ExamsRowActions } from './exams-row-actions'

const STATUS_BADGE_COLORS = {
  DRAFT: 'bg-greyscale-100 text-greyscale-700',
  PUBLISHED: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  CLOSED: 'bg-orange-100 text-orange-700',
  ARCHIVED: 'bg-red-100 text-red-700'
}

const STATUS_LABELS = {
  DRAFT: 'Nháp',
  PUBLISHED: 'Đã xuất bản',
  ACTIVE: 'Đang hoạt động',
  CLOSED: 'Đã đóng',
  ARCHIVED: 'Lưu trữ'
}

interface ExamsColumnsOptions {
  onView?: (row: ExamsRow) => void
  onEdit?: (row: ExamsRow) => void
}

export function createExamsColumns(options?: ExamsColumnsOptions): ColumnDef<ExamsRow>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Bài thi' />,
      size: 300,
      cell: ({ row }) => {
        const test = row.original
        return (
          <div className='space-y-1'>
            <div className='font-medium text-foreground'>{test.title}</div>
            <div className='text-sm text-greyscale-500 line-clamp-1'>{test.description}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      size: 150,
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof STATUS_BADGE_COLORS
        return (
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${STATUS_BADGE_COLORS[status]}`}>
            {STATUS_LABELS[status]}
          </span>
        )
      }
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Bắt đầu' />,
      size: 150,
      cell: ({ row }) => {
        const date = new Date(row.original.startTime)
        return <div className='text-sm'>{format(date, 'dd/MM/yyyy HH:mm')}</div>
      }
    },
    {
      accessorKey: 'endTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Kết thúc' />,
      size: 150,
      cell: ({ row }) => {
        const date = new Date(row.original.endTime)
        return <div className='text-sm'>{format(date, 'dd/MM/yyyy HH:mm')}</div>
      }
    },
    {
      accessorKey: 'questionSets',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Bộ câu hỏi' />,
      size: 100,
      cell: ({ row }) => <div className='text-sm font-medium'>{row.original.questionSets}</div>
    },
    {
      accessorKey: 'createdBy',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Người tạo' />,
      size: 150,
      cell: ({ row }) => <div className='text-sm'>{row.original.createdBy}</div>
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày tạo' />,
      size: 150,
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return <div className='text-sm'>{format(date, 'dd/MM/yyyy')}</div>
      }
    },
    {
      id: 'actions',
      header: () => <div className='flex justify-end text-sm font-medium text-greyscale-500'>Thao tác</div>,
      size: 100,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <ExamsRowActions
            exam={row.original}
            onView={options?.onView}
            onEdit={options?.onEdit}
          />
        </div>
      )
    }
  ]
}
