'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

export interface LecturerStudentRow {
  student_id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  enrolment_date: string
}

export function createLecturerStudentColumns(): ColumnDef<LecturerStudentRow>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Tên học sinh',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>{row.original.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className='font-medium'>{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span className='text-sm text-gray-600'>{row.original.email}</span>
    },
    {
      accessorKey: 'phone',
      header: 'Số điện thoại',
      cell: ({ row }) => <span className='text-sm text-gray-600'>{row.original.phone || '-'}</span>
    },
    {
      accessorKey: 'enrolment_date',
      header: 'Ngày đăng ký',
      cell: ({ row }) => <span className='text-sm text-gray-500'>{formatDate(row.original.enrolment_date)}</span>
    }
  ]
}
