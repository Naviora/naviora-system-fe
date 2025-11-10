'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import type { StudentGradeDto } from '@/hooks/api/principal/use-entry-tests'

const ATTEMPT_STATUS_LABELS = {
  IN_PROGRESS: 'Đang làm',
  SUBMITTED: 'Đã nộp',
  GRADED: 'Đã chấm điểm',
  CANCELLED: 'Đã hủy'
}

const ATTEMPT_STATUS_COLORS = {
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  SUBMITTED: 'bg-yellow-100 text-yellow-700',
  GRADED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700'
}

export function createStudentGradesColumns(): ColumnDef<StudentGradeDto>[] {
  return [
    {
      accessorKey: 'student_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Học sinh' />,
      size: 250,
      cell: ({ row }) => {
        const student = row.original
        const initials = student.student_name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()

        return (
          <div className='flex items-center gap-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={student.student_avatar} alt={student.student_name} />
              <AvatarFallback className='bg-blue-100 text-blue-700 font-medium text-xs'>{initials}</AvatarFallback>
            </Avatar>
            <div className='space-y-0.5'>
              <div className='text-sm font-medium'>{student.student_name}</div>
              <div className='text-xs text-greyscale-500'>{student.student_email}</div>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'score',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Điểm số' className='justify-end' />,
      size: 100,
      cell: ({ row }) => {
        const score = row.original.score
        return (
          <div className='flex items-center justify-end gap-2'>
            <div className='text-lg font-bold text-blue-600'>{score.toFixed(2)}</div>
            <div className='text-xs text-greyscale-500'>/10</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'attempt_status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
      size: 150,
      cell: ({ row }) => {
        const status = row.original.attempt_status as keyof typeof ATTEMPT_STATUS_COLORS
        return (
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${ATTEMPT_STATUS_COLORS[status]}`}>
            {ATTEMPT_STATUS_LABELS[status]}
          </span>
        )
      }
    },
    {
      accessorKey: 'submitted_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày nộp' />,
      size: 150,
      cell: ({ row }) => {
        const date = new Date(row.original.submitted_at)
        return <div className='text-sm'>{format(date, 'dd/MM/yyyy HH:mm')}</div>
      }
    },
    {
      accessorKey: 'penalty',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Trừ điểm' />,
      size: 100,
      cell: ({ row }) => {
        const penalty = row.original.penalty
        return (
          <div className='text-sm'>
            {penalty ? (
              <span className='text-red-600 font-medium'>-{penalty}</span>
            ) : (
              <span className='text-greyscale-400'>-</span>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'note',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Ghi chú' />,
      size: 200,
      enableSorting: false,
      cell: ({ row }) => {
        const note = row.original.note
        return (
          <div className='text-sm text-greyscale-600'>
            {note ? <span className='max-w-xs truncate'>{note}</span> : <span className='text-greyscale-400'>-</span>}
          </div>
        )
      }
    }
  ]
}
