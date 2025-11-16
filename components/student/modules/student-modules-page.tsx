'use client'

import { useState, useEffect, useMemo } from 'react'
import { DayStreak } from '@/components/common/day-streak'
import { StudentModuleGrid, StudentModuleToolbar } from '@/components/student/modules'
import { motion } from 'framer-motion'
import { useClassModules, type ClassModule } from '@/hooks/api/student/use-class-modules'
import { ModuleCardProps } from '@/components/student/modules/module-card'
import { useSetBreadcrumbItems } from '@/lib/context/breadcrumb-context'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React from 'react'

const ITEMS_PER_PAGE = 12

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

function transformClassModulesToCards(classModules: ClassModule[] | undefined): ModuleCardProps[] {
  if (!Array.isArray(classModules)) return []
  return classModules.map((module) => ({
    id: module.module_id,
    moduleName: module.module_name,
    classType: 'Môn học',
    class_name: module.class?.class_code || 'N/A',
    lecturerName: [],
    progress: Math.round(module.progress_percent || 0),
    thumbnail: module.banner || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
  }))
}

export function StudentModulesPageClient() {
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [page, setPage] = useState(1)
  const { data: response, isLoading, isFetching } = useClassModules(selectedClassId, page, ITEMS_PER_PAGE)
  const setBreadcrumbItems = useSetBreadcrumbItems()

  useEffect(() => {
    setBreadcrumbItems([])
  }, [setBreadcrumbItems])

  const classModules = response?.modules ?? []
  const paginationData = response?.pagination
  const currentPage = paginationData?.current_page ?? page
  const totalPages = paginationData?.total_pages ?? 1
  const totalRecords = paginationData?.total_records ?? 0

  const transformedModules = transformClassModulesToCards(classModules)
  const paginationItems = useMemo(() => getPaginationItems(currentPage, totalPages), [currentPage, totalPages])

  const hasModules = transformedModules.length > 0
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages
  const isFetchingPage = isFetching && !isLoading

  const handlePageChange = React.useCallback(
    (nextPage: number) => {
      if (nextPage === currentPage || nextPage < 1 || nextPage > totalPages) {
        return
      }
      setPage(nextPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [currentPage, totalPages]
  )

  const fromRecord = totalRecords === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const toRecord = totalRecords === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)

  return (
    <div className='flex flex-col-reverse lg:flex-row gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full '
      >
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Hành trình học tập của bạn</h1>
          <p className='text-sm text-muted-foreground'>
            Hành trình học tập của bạn bắt đầu từ bây giờ, hãy khám phá các bài học của bạn và tiếp tục tiến về phía
            trước.
          </p>
        </div>

        <section className='mt-6 rounded-xl border border-greyscale-200 bg-card p-4 shadow-sm sm:p-6'>
          <StudentModuleToolbar
            onClassChange={(classId) => {
              setSelectedClassId(classId)
              setPage(1)
            }}
          />

          <div className='mt-6'>
            {isLoading ? (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className='h-48 w-full rounded-xl bg-greyscale-100' />
                ))}
              </div>
            ) : hasModules ? (
              <>
                {isFetchingPage ? (
                  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3' aria-hidden='true'>
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                      <Skeleton key={`loading-${index}`} className='h-48 w-full rounded-xl bg-greyscale-100' />
                    ))}
                  </div>
                ) : (
                  <>
                    <StudentModuleGrid modules={transformedModules} />

                    {hasModules && totalPages > 1 ? (
                      <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <p className='text-sm text-muted-foreground'>
                          Hiển thị {fromRecord}-{toRecord} trên tổng số {totalRecords} chuyên đề
                        </p>
                        <nav className='flex items-center justify-center gap-2' aria-label='Pagination'>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='h-9 w-9 p-0'
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!canGoPrevious || isFetching}
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
                                disabled={isActive || isFetching}
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
                            disabled={!canGoNext || isFetching}
                            aria-label='Trang tiếp theo'
                          >
                            <ChevronRightIcon className='size-4' aria-hidden='true' />
                          </Button>
                        </nav>
                      </div>
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>Không có modules nào cho lớp này</p>
              </div>
            )}
          </div>
        </section>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DayStreak />
      </motion.div>
    </div>
  )
}
