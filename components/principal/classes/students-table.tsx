'use client'

import * as React from 'react'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { StudentRow } from '@/types/principal/classes'

interface StudentsTableProps {
  columns: ColumnDef<StudentRow>[]
  data: StudentRow[]
  isLoading?: boolean
}

export function StudentsTable({ columns, data, isLoading }: StudentsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data

    return data.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )
  }, [data, searchTerm])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Input
          placeholder='Tìm kiếm học sinh...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='h-8 w-64'
        />
      </div>

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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx} className='h-16 px-4'>
                      <Skeleton className='h-6 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center text-gray-500'>
                  Không có học sinh nào
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

      <div className='flex items-center justify-between text-sm text-gray-500'>
        <span>
          Hiển thị {table.getRowModel().rows.length} / {data.length} học sinh
        </span>
      </div>
    </div>
  )
}
