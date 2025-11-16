'use client'

import * as React from 'react'
import { flexRender, getCoreRowModel, useReactTable, type PaginationState, type ColumnDef } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { Class } from '@/types/api/class'

interface LecturerClassesTableProps {
  data: Class[]
  columns: ColumnDef<Class>[]
  pagination: PaginationState
  totalRecords: number
  onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void
  isLoading?: boolean
}

export function LecturerClassesTable({
  data,
  columns,
  pagination,
  totalRecords,
  onPaginationChange,
  isLoading = false
}: LecturerClassesTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: totalRecords,
    state: {
      pagination
    },
    onPaginationChange
  })

  if (isLoading) {
    return (
      <div className='space-y-2 rounded-md border'>
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className='h-12 w-full' />
        ))}
      </div>
    )
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className='h-12 px-4'>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center text-gray-500'>
                Không có lớp học nào
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className='hover:bg-gray-50'>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className='px-4 py-3'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
