'use client'

import { Table } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
  totalItems?: number
  isDisabled?: boolean
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [5, 10, 20, 50],
  totalItems,
  isDisabled = false
}: DataTablePaginationProps<TData>) {
  const paginationState = table.getState().pagination
  const pageIndex = paginationState?.pageIndex ?? 0
  const pageSize = paginationState?.pageSize ?? pageSizeOptions[0] ?? 10
  const currentRowCount = table.getRowModel().rows.length
  const fallbackTotalItems = table.getFilteredRowModel().rows.length
  const totalCount = totalItems ?? fallbackTotalItems
  const fromItem = totalCount === 0 ? 0 : pageIndex * pageSize + 1
  const toItem = totalCount === 0 ? 0 : Math.min(pageIndex * pageSize + currentRowCount, totalCount)
  const pageCount = Math.max(table.getPageCount(), totalCount === 0 ? 1 : 0)

  return (
    <div className='flex flex-col gap-3 border-t border-greyscale-100 px-4 py-3 md:flex-row md:items-center md:justify-between'>
      <div className='text-sm text-greyscale-500'>
        Hiển thị {fromItem}-{toItem} / {totalCount} mục
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-2 text-sm text-greyscale-500'>
          <span>Kích thước trang</span>
          <Select
            value={`${paginationState?.pageSize ?? pageSize}`}
            onValueChange={(value) => {
              if (isDisabled) {
                return
              }
              table.setPageSize(Number(value))
            }}
            disabled={isDisabled}
          >
            <SelectTrigger size='sm' className='w-[110px] justify-between'>
              <SelectValue placeholder={paginationState?.pageSize ?? pageSize} />
            </SelectTrigger>
            <SelectContent align='end'>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size} / trang
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 w-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isDisabled}
            aria-label='Trang trước'
          >
            <ChevronLeftIcon className='size-4' aria-hidden='true' />
          </Button>
          <span className='text-sm text-greyscale-500'>
            Trang {pageCount === 0 ? 0 : pageIndex + 1} / {pageCount}
          </span>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isDisabled}
            aria-label='Trang tiếp theo'
          >
            <ChevronRightIcon className='size-4' aria-hidden='true' />
          </Button>
        </div>
      </div>
    </div>
  )
}
