'use client'

import * as React from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useClassModules } from '@/hooks/api/use-classes'
import { createLecturerModuleColumns, type LecturerModuleRow } from './lecturer-module-columns'

interface LecturerModulesTabProps {
  classId: string
}

export function LecturerModulesTab({ classId }: LecturerModulesTabProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const modulesQuery = useClassModules(classId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    q: searchTerm || undefined
  })

  const modules = modulesQuery.data?.modules ?? []
  const paginationData = modulesQuery.data?.pagination

  const mappedModules: LecturerModuleRow[] = modules.map((module) => ({
    module_id: module.module_id,
    module_code: module.module_code,
    module_name: module.module_name,
    module_description: module.module_description,
    banner: module.banner,
    created_at: module.created_at,
    updated_at: module.updated_at
  }))

  const columns = React.useMemo(() => createLecturerModuleColumns(), [])

  const table = useReactTable({
    data: mappedModules,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: paginationData?.total_records,
    state: {
      pagination
    },
    onPaginationChange: setPagination
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Input
          placeholder='Tìm kiếm chuyên đề...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPagination({ pageIndex: 0, pageSize: 10 })
          }}
          className='h-8 max-w-sm'
        />
      </div>

      {modulesQuery.isLoading ? (
        <div className='space-y-2 rounded-md border'>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className='h-12 w-full' />
          ))}
        </div>
      ) : (
        <>
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
                      Không có chuyên đề nào
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

          {(paginationData?.total_pages ?? 0) > 1 && (
            <div className='flex flex-col gap-3 border-t border-greyscale-100 px-4 py-3 md:flex-row md:items-center md:justify-between'>
              <div className='text-sm text-greyscale-500'>
                Hiển thị {pagination.pageIndex * pagination.pageSize + 1}-
                {Math.min((pagination.pageIndex + 1) * pagination.pageSize, paginationData?.total_records || 0)} /{' '}
                {paginationData?.total_records || 0} chuyên đề
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='h-8 w-8 p-0'
                  onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                  disabled={pagination.pageIndex === 0 || modulesQuery.isLoading}
                  aria-label='Trang trước'
                >
                  <ChevronLeftIcon className='size-4' aria-hidden='true' />
                </Button>
                <span className='text-sm text-greyscale-500'>
                  Trang {pagination.pageIndex + 1} / {paginationData?.total_pages || 1}
                </span>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='h-8 w-8 p-0'
                  onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                  disabled={pagination.pageIndex >= (paginationData?.total_pages || 1) - 1 || modulesQuery.isLoading}
                  aria-label='Trang sau'
                >
                  <ChevronRightIcon className='size-4' aria-hidden='true' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
