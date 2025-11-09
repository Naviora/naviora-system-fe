'use client'

import { useMemo } from 'react'

import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

import { DataTable } from '@/components/ui/data-table'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { AccountRow } from './account-types'

interface AccountTableProps {
  data: AccountRow[]
  onAssignRole: (account: AccountRow) => void
}

export function AccountTable({ data, onAssignRole }: AccountTableProps) {
  const columns = useMemo<ColumnDef<AccountRow>[]>(
    () => [
      { accessorKey: 'name', header: 'Họ và tên' },

      { accessorKey: 'email', header: 'Email' },

      {
        accessorKey: 'role',

        header: 'Vai trò',

        cell: ({ row }) => (
          <span className='inline-flex items-center rounded-sm bg-greyscale-25 px-2 py-0.5 text-xs text-greyscale-700'>
            {row.original.role}
          </span>
        )
      },

      {
        accessorKey: 'status',

        header: 'Trạng thái',

        cell: ({ row }) => (
          <span
            className={
              row.original.status === 'active'
                ? 'inline-flex items-center rounded-sm bg-success-0 text-success px-2 py-0.5 text-xs'
                : 'inline-flex items-center rounded-sm bg-error-0 text-error px-2 py-0.5 text-xs'
            }
          >
            {row.original.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </span>
        )
      },

      {
        id: 'actions',

        header: '',

        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                Thao tác
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onAssignRole(row.original)}>Gán vai trò</DropdownMenuItem>

              <DropdownMenuItem>Vô hiệu hóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],

    [onAssignRole]
  )

  return <DataTable columns={columns} data={data} />
}
