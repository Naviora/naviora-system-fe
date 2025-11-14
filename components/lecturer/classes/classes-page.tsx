'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import type { PaginationState } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { LecturerClassesTable } from '@/components/lecturer/classes/lecturer-classes-table'
import { LecturerClassTableToolbar } from '@/components/lecturer/classes/lecturer-class-table-toolbar'
import { createLecturerClassColumns } from '@/components/lecturer/classes/lecturer-class-columns'
import { Button } from '@/components/ui/button'
import { useGetAssignedClasses } from '@/hooks/api/use-classes'
import type { ClassType } from '@/types/api/class'

function useDebounce<T>(value: T, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}

export function LecturerClassesPageClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClassType, setSelectedClassType] = useState<ClassType | 'all'>('all')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const debouncedSearch = useDebounce(searchTerm)

  const queryParams = useMemo(
    () => ({
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      q: debouncedSearch || undefined,
      class_type: selectedClassType !== 'all' ? selectedClassType : undefined
    }),
    [debouncedSearch, pagination.pageIndex, pagination.pageSize, selectedClassType]
  )

  const classesQuery = useGetAssignedClasses(queryParams)

  const classes = classesQuery.data?.classes ?? []
  const paginationData = classesQuery.data?.pagination
  const totalRecords = paginationData?.total_records ?? 0
  const totalPages = paginationData?.total_pages ?? 1

  const columns = useMemo(() => createLecturerClassColumns(), [])

  const fromRecord = totalRecords === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const toRecord = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRecords)

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Quản lý lớp học</h1>
          <p className='text-sm text-muted-foreground'>Xem nhanh các lớp học bạn đang phụ trách.</p>
        </div>
      </div>

      <section className='rounded-xl border border-greyscale-200 bg-card p-4 shadow-sm sm:p-6'>
        <div className='mb-4'>
          <LecturerClassTableToolbar
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value)
              setPagination({ ...pagination, pageIndex: 0 })
            }}
            selectedClassType={selectedClassType}
            onClassTypeChange={(value) => {
              setSelectedClassType(value)
              setPagination({ ...pagination, pageIndex: 0 })
            }}
          />
        </div>

        <LecturerClassesTable
          data={classes}
          columns={columns}
          pagination={pagination}
          totalRecords={totalRecords}
          onPaginationChange={setPagination}
          isLoading={classesQuery.isLoading}
        />

        {totalPages > 1 && (
          <div className='mt-4 flex flex-col gap-3 border-t border-greyscale-100 px-4 py-3 md:flex-row md:items-center md:justify-between'>
            <div className='text-sm text-greyscale-500'>
              Hiển thị {fromRecord}-{toRecord} / {totalRecords} lớp học
            </div>

            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
                disabled={pagination.pageIndex === 0 || classesQuery.isLoading}
                aria-label='Trang trước'
              >
                <ChevronLeftIcon className='size-4' aria-hidden='true' />
              </Button>
              <span className='text-sm text-greyscale-500'>
                Trang {pagination.pageIndex + 1} / {totalPages}
              </span>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-8 w-8 p-0'
                onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
                disabled={pagination.pageIndex >= totalPages - 1 || classesQuery.isLoading}
                aria-label='Trang sau'
              >
                <ChevronRightIcon className='size-4' aria-hidden='true' />
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
