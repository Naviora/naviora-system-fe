'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Button } from '@/components/ui/button'
import { cn, formatDurationShort, type ExamCountdownState } from '@/lib/utils'
import type { StudentFinalExamDto } from '@/hooks/api/student/use-final-exams'

export interface StudentFinalExamRow {
  id: string
  title: string
  description: string
  status: string
  startTime: string
  endTime: string
  durationMinutes: number
  questionSetCount: number
  attemptStatus?: string
  countdown: ExamCountdownState
  exam: StudentFinalExamDto
}

const STATUS_BADGES: Record<string, string> = {
  DRAFT: 'bg-greyscale-100 text-greyscale-700',
  PUBLISHED: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700'
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Nháp',
  PUBLISHED: 'Sắp diễn ra',
  ACTIVE: 'Đang diễn ra',
  COMPLETED: 'Đã kết thúc',
  CANCELLED: 'Đã hủy'
}

const COUNTDOWN_STYLES: Record<ExamCountdownState['phase'], string> = {
  UPCOMING: 'text-blue-600 bg-blue-50',
  ONGOING: 'text-green-600 bg-green-50',
  ENDED: 'text-greyscale-500 bg-greyscale-100'
}

const ATTEMPT_LABELS: Record<string, { label: string; className: string }> = {
  IN_PROGRESS: { label: 'Đang làm dở', className: 'bg-amber-100 text-amber-800' },
  SUBMITTED: { label: 'Đã nộp bài', className: 'bg-indigo-100 text-indigo-800' },
  GRADED: { label: 'Đã chấm điểm', className: 'bg-purple-100 text-purple-800' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' }
}

interface ColumnOptions {
  onJoin?: (exam: StudentFinalExamDto) => void
}

export function createStudentFinalExamColumns(options?: ColumnOptions): ColumnDef<StudentFinalExamRow>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Bài thi' />,
      cell: ({ row }) => {
        const statusClass = STATUS_BADGES[row.original.status] ?? 'bg-greyscale-100 text-greyscale-700'
        const statusLabel = STATUS_LABELS[row.original.status] ?? row.original.status
        const attempt = row.original.attemptStatus ? ATTEMPT_LABELS[row.original.attemptStatus] : null

        return (
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <p className='font-semibold text-greyscale-900'>{row.original.title}</p>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusClass)}>{statusLabel}</span>
              {attempt ? (
                <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', attempt.className)}>
                  {attempt.label}
                </span>
              ) : null}
            </div>
            <p className='text-sm text-greyscale-500 line-clamp-2'>{row.original.description}</p>
          </div>
        )
      },
      size: 320
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Bắt đầu' />,
      cell: ({ row }) => (
        <div className='text-sm text-greyscale-800'>{format(new Date(row.original.startTime), 'dd/MM/yyyy HH:mm')}</div>
      )
    },
    {
      accessorKey: 'durationMinutes',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Thời lượng' />,
      cell: ({ row }) => (
        <div className='text-sm text-greyscale-800'>{formatDurationShort(row.original.durationMinutes * 60)}</div>
      )
    },
    {
      accessorKey: 'questionSetCount',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Bộ câu hỏi' />,
      cell: ({ row }) => (
        <div className='text-sm font-semibold text-greyscale-900'>{row.original.questionSetCount}</div>
      ),
      size: 110
    },
    {
      accessorKey: 'countdown',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Đếm ngược' />,
      enableSorting: false,
      cell: ({ row }) => (
        <div className='space-y-1'>
          <span
            className={cn(
              'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
              COUNTDOWN_STYLES[row.original.countdown.phase]
            )}
          >
            {row.original.countdown.phase === 'UPCOMING'
              ? 'Sắp diễn ra'
              : row.original.countdown.phase === 'ONGOING'
                ? 'Đang diễn ra'
                : 'Đã kết thúc'}
          </span>
          <p className='text-sm font-medium text-greyscale-900'>{row.original.countdown.label}</p>
        </div>
      )
    },
    {
      id: 'actions',
      header: () => <div className='text-right text-sm font-medium text-greyscale-500'>Hành động</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const isDisabled = row.original.countdown.phase === 'ENDED'
        return (
          <div className='flex justify-end'>
            <Button size='sm' onClick={() => options?.onJoin?.(row.original.exam)} disabled={isDisabled}>
              Tham gia
            </Button>
          </div>
        )
      }
    }
  ]
}
