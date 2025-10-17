'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { ModuleToolbar } from '@/components/lecturer/modules/module-toolbar'
import { LecturerModuleGrid } from '@/components/lecturer/modules/module-grid'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useModules } from '@/hooks/api/use-modules'
import { MODULE_QUERY_DEFAULTS } from '@/lib/constants/modules'
import { ErrorHandler } from '@/lib/utils/error-handler'
import { type ModuleDto } from '@/lib/validations/modules'

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

function mapModulesToCards(modules: ModuleDto[]) {
  return modules.map((module) => ({
    id: module.module_id,
    name: module.module_name,
    code: module.module_code,
    description: module.module_description,
    banner: module.banner ?? null,
    updatedAt: module.updated_at
  }))
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

export function LecturerModulesPageClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(searchTerm)

  const queryParams = useMemo(
    () => ({
      limit: MODULE_QUERY_DEFAULTS.limit,
      page,
      q: debouncedSearch || undefined
    }),
    [debouncedSearch, page]
  )

  const modulesQuery = useModules(queryParams)

  const moduleCards = useMemo(() => mapModulesToCards(modulesQuery.data?.data ?? []), [modulesQuery.data?.data])
  const pagination = modulesQuery.data?.pagination
  const totalPages = pagination?.total_pages ?? 0
  const totalRecords = pagination?.total_records ?? 0
  const limit = pagination?.limit ?? MODULE_QUERY_DEFAULTS.limit
  const currentPage = pagination?.current_page ?? page
  const totalRecordCount = totalRecords || moduleCards.length
  const safeTotalPages = Math.max(totalPages || Math.ceil(totalRecordCount / limit) || 1, 1)

  const paginationItems = useMemo(() => getPaginationItems(currentPage, safeTotalPages), [currentPage, safeTotalPages])

  const isFetchingPage = modulesQuery.isFetching && !modulesQuery.isLoading
  const isInitialLoading = modulesQuery.isLoading

  const hasModules = moduleCards.length > 0
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < safeTotalPages
  const skeletonCount = moduleCards.length || limit

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
    },
    [currentPage, safeTotalPages]
  )

  const fromRecord = totalRecordCount === 0 ? 0 : (currentPage - 1) * limit + 1
  const toRecord = totalRecordCount === 0 ? 0 : Math.min(currentPage * limit, totalRecordCount)

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Danh sách chuyên đề</h1>
        <p className='text-sm text-muted-foreground'>Xem nhanh các chuyên đề bạn đang phụ trách.</p>
      </div>

      <section className='rounded-xl border border-greyscale-200 bg-card p-4 shadow-sm sm:p-6'>
        <ModuleToolbar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          isSearchDisabled={modulesQuery.isFetching}
        />

        <div className='mt-6'>
          {isInitialLoading ? (
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className='h-48 w-full rounded-xl bg-greyscale-100' />
              ))}
            </div>
          ) : modulesQuery.isError ? (
            <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center'>
              <p className='text-sm font-medium text-destructive'>{ErrorHandler.getErrorMessage(modulesQuery.error)}</p>
              <Button variant='outline' size='sm' onClick={() => modulesQuery.refetch()}>
                Thử lại
              </Button>
            </div>
          ) : hasModules ? (
            <>
              <LecturerModuleGrid modules={moduleCards} />

              {hasModules ? (
                <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <p className='text-sm text-muted-foreground'>
                    Hiển thị {fromRecord}-{toRecord} trên tổng số {totalRecordCount} chuyên đề
                  </p>
                  <nav className='flex items-center justify-center gap-2' aria-label='Pagination'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='h-9 w-9 p-0'
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!canGoPrevious || modulesQuery.isFetching}
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
                          disabled={isActive || modulesQuery.isFetching}
                          aria-current={isActive ? 'page' : undefined}
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
                      disabled={!canGoNext || modulesQuery.isFetching}
                      aria-label='Trang tiếp theo'
                    >
                      <ChevronRightIcon className='size-4' aria-hidden='true' />
                    </Button>
                  </nav>
                </div>
              ) : null}

              {isFetchingPage ? (
                <div className='mt-4 grid gap-4 opacity-60 sm:grid-cols-2 xl:grid-cols-3' aria-hidden='true'>
                  {Array.from({ length: skeletonCount }).map((_, index) => (
                    <Skeleton key={`loading-${index}`} className='h-48 w-full rounded-xl bg-greyscale-100' />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-greyscale-200 bg-greyscale-50 p-10 text-center'>
              <h2 className='text-lg font-semibold text-greyscale-900'>Chưa có chuyên đề nào</h2>
              <p className='max-w-sm text-sm text-muted-foreground'>
                Các chuyên đề bạn phụ trách sẽ hiển thị tại đây khi được ban giám hiệu giao.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
