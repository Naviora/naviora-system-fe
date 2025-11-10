'use client'

import * as React from 'react'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import type { ModuleRow } from '@/types/principal/classes'

interface ModulesTableProps {
  columns: ColumnDef<ModuleRow>[]
  data: ModuleRow[]
  isLoading?: boolean
}

export function ModulesTable({ columns, data, isLoading }: ModulesTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data

    return data.filter(
      (module) =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )
  }, [data, searchTerm])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (isLoading) {
    return <div className='text-center py-4 text-greyscale-500'>Đang tải...</div>
  }

  if (data.length === 0) {
    return <div className='text-center py-8 text-greyscale-500'>Không có chuyên đề nào</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Input
          placeholder='Tìm kiếm chuyên đề...'
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
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
