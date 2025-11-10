'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { ClassCard } from '@/components/lecturer/classes/class-card'
import { ClassesToolbar } from '@/components/lecturer/classes/classes-toolbar'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useAssignedClasses } from '@/hooks/api/use-classes'
import { CLASS_QUERY_DEFAULTS } from '@/lib/constants/modules'
import { ErrorHandler } from '@/lib/utils/error-handler'
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

type PaginationItem = number | 'ellipsis'

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 1) {
    return [1]
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: PaginationItem[] = [1]
  const siblings = 1
  const leftBoundary = Math.max(currentPage - siblings, 2)
  const rightBoundary = Math.min(currentPage + siblings, totalPages - 1)

  if (leftBoundary > 2) {
    items.push('ellipsis')
  }

  for (let page = leftBoundary; page <= rightBoundary; page += 1) {
    items.push(page)
  }

  if (rightBoundary < totalPages - 1) {
    items.push('ellipsis')
  }

  items.push(totalPages)

  return items
}

export function LecturerClassesPageClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('class_name')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const [classType, setClassType] = useState('all')

  const debouncedSearch = useDebounce(searchTerm)

  const queryParams = useMemo(
    () => ({
      limit: CLASS_QUERY_DEFAULTS.limit,
      page,
      q: debouncedSearch || undefined,
      sort_by: sortBy,
      order: sortOrder,
      class_type: classType !== 'all' ? (classType as ClassType) : undefined
    }),
    [debouncedSearch, page, sortBy, sortOrder, classType]
  )

  const classesQuery = useAssignedClasses(queryParams)

  const classes = classesQuery.data?.classes ?? []
  const pagination = classesQuery.data?.pagination
  const totalPages = pagination?.total_pages ?? 0
  const totalRecords = pagination?.total_records ?? 0
  const limit = pagination?.limit ?? CLASS_QUERY_DEFAULTS.limit
  const currentPage = pagination?.current_page ?? page
  const totalRecordCount = totalRecords || classes.length
  const safeTotalPages = Math.max(totalPages || Math.ceil(totalRecordCount / limit) || 1, 1)

  const paginationItems = useMemo(() => getPaginationItems(currentPage, safeTotalPages), [currentPage, safeTotalPages])

  const isInitialLoading = classesQuery.isLoading
  const isFetchingPage = classesQuery.isFetching && !classesQuery.isLoading
  const hasClasses = classes.length > 0
  const skeletonCount = classes.length || CLASS_QUERY_DEFAULTS.limit
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < safeTotalPages

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value)
    setPage(1)
  }, [])

  const handlePageChange = React.useCallback(
    (nextPage: number) => {
      if (nextPage === currentPage || nextPage < 1 || nextPage > safeTotalPages) {
        return
      }

      setPage(nextPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [currentPage, safeTotalPages]
  )

  const handleSortChange = React.useCallback((newSortBy: string) => {
    setSortBy(newSortBy)
    setPage(1)
  }, [])

  const handleSortOrderChange = React.useCallback((newOrder: 'ASC' | 'DESC') => {
    setSortOrder(newOrder)
    setPage(1)
  }, [])

  const handleClassTypeChange = React.useCallback((newType: string) => {
    setClassType(newType)
    setPage(1)
  }, [])

  const fromRecord = totalRecordCount === 0 ? 0 : (currentPage - 1) * limit + 1
  const toRecord = totalRecordCount === 0 ? 0 : Math.min(currentPage * limit, totalRecordCount)

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Quản lý lớp học</h1>
          <p className='text-sm text-muted-foreground'>Xem nhanh các lớp học bạn đang phụ trách.</p>
        </div>
      </div>

      {/* Content Section */}
      <section className='rounded-xl border border-greyscale-200 bg-card p-4 shadow-sm sm:p-6'>
        {/* Toolbar */}
        <ClassesToolbar
          searchQuery={searchTerm}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          classType={classType}
          onClassTypeChange={handleClassTypeChange}
        />

        {/* Classes Grid */}
        <div className='mt-6'>
          {isInitialLoading ? (
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className='h-48 w-full rounded-xl bg-greyscale-100' />
              ))}
            </div>
          ) : classesQuery.isError ? (
            <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center'>
              <p className='text-sm font-medium text-destructive'>{ErrorHandler.getErrorMessage(classesQuery.error)}</p>
              <Button variant='outline' size='sm' onClick={() => classesQuery.refetch()}>
                Thử lại
              </Button>
            </div>
          ) : hasClasses ? (
            <>
              {isFetchingPage ? (
                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3' aria-hidden='true'>
                  {Array.from({ length: skeletonCount }).map((_, index) => (
                    <Skeleton key={`loading-${index}`} className='h-48 w-full rounded-xl bg-greyscale-100' />
                  ))}
                </div>
              ) : (
                <>
                  <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                    {classes.map((classItem: typeof classes[0]) => (
                      <ClassCard key={classItem.class_id} classData={classItem} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {safeTotalPages > 1 && (
                    <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                      <p className='text-sm text-muted-foreground'>
                        Hiển thị {fromRecord}-{toRecord} trên tổng số {totalRecordCount} lớp học
                      </p>
                      <nav className='flex items-center justify-center gap-2' aria-label='Pagination'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='h-9 w-9 p-0'
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!canGoPrevious || classesQuery.isFetching}
                          aria-label='Trang trước'
                        >
                          <ChevronLeftIcon className='size-4' aria-hidden='true' />
                        </Button>
                        {paginationItems.map((item, index) => {
                          if (item === 'ellipsis') {
                            return (
                              <span key={`ellipsis-${index}`} className='px-2 text-sm text-muted-foreground'>
                                …
                              </span>
                            )
                          }

                          const isActive = item === currentPage

                          return (
                            <Button
                              key={item}
                              type='button'
                              variant={isActive ? 'default' : 'outline'}
                              size='sm'
                              className='h-9 w-9 p-0'
                              onClick={() => handlePageChange(item)}
                              disabled={classesQuery.isFetching}
                              aria-label={`Trang ${item}`}
                            >
                              {item}
                            </Button>
                          )
                        })}
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='h-9 w-9 p-0'
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!canGoNext || classesQuery.isFetching}
                          aria-label='Trang sau'
                        >
                          <ChevronRightIcon className='size-4' aria-hidden='true' />
                        </Button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Chưa có lớp học nào</EmptyTitle>
                <EmptyDescription>
                  {searchTerm
                    ? 'Không tìm thấy lớp học phù hợp với bộ lọc của bạn.'
                    : 'Bắt đầu bằng cách tạo lớp học đầu tiên của bạn.'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </section>
    </div>
  )
}
