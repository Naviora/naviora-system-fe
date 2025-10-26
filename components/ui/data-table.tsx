'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { DataTablePagination } from './data-table-pagination'

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  pageSizeOptions?: number[]
  className?: string
  emptyMessage?: string
  manualPagination?: boolean
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  totalItems?: number
  isPaginationDisabled?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  pageSizeOptions,
  className,
  emptyMessage = 'Không có dữ liệu phù hợp.',
  manualPagination = false,
  pagination,
  onPaginationChange,
  pageCount,
  totalItems,
  isPaginationDisabled
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const defaultPageSize = React.useMemo(
    () => pageSizeOptions?.find((size) => size === 10) ?? pageSizeOptions?.[0] ?? 10,
    [pageSizeOptions]
  )
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: defaultPageSize
  }))

  const resolvedPaginationState = manualPagination && pagination ? pagination : internalPagination
  const handlePaginationChange: OnChangeFn<PaginationState> = manualPagination
    ? (onPaginationChange ?? (() => {}))
    : setInternalPagination

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: resolvedPaginationState
    },
    enableSortingRemoval: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination,
    pageCount: manualPagination ? pageCount : undefined
  })

  return (
    <div className={cn('flex flex-col rounded-lg border border-greyscale-100 bg-greyscale-0 shadow-xs', className)}>
      {toolbar && <div className='border-b border-greyscale-100 px-4 py-3'>{toolbar(table)}</div>}

      <div className='w-full overflow-x-auto'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='bg-greyscale-25 hover:bg-greyscale-25'>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='align-middle'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center text-sm text-greyscale-500'>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
        totalItems={totalItems}
        isDisabled={isPaginationDisabled}
      />
    </div>
  )
}
