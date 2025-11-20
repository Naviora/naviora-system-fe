'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import type { StudentRow } from '@/types/principal/classes'

export function createStudentColumns(): ColumnDef<StudentRow>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Tên học sinh',
      cell: ({ row }) => {
        const student = row.original
        return (
          <div className='flex items-center gap-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>
                {student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className='font-medium'>{student.name}</span>
          </div>
        )
      }
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span className='text-sm text-gray-600'>{row.original.email}</span>
    },
    {
      accessorKey: 'phone',
      header: 'Số điện thoại',
      cell: ({ row }) => <span className='text-sm'>{row.original.phone || '-'}</span>
    },
    {
      accessorKey: 'enrolmentDate',
      header: 'Ngày nhập học',
      cell: ({ row }) => <span className='text-sm'>{formatDate(row.original.enrolmentDate)}</span>
    }
  ]
}
