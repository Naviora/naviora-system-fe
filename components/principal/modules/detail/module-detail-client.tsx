'use client'

import { useMemo } from 'react'

import { ModuleDetailView } from '@/components/principal/modules/detail'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { Separator } from '@/components/ui/separator'
import { ErrorHandler } from '@/lib/utils/error-handler'
import { useModuleDetail, useModuleLessons } from '@/hooks/api/use-modules'

interface ModuleDetailPageClientProps {
  moduleId: string
}

export function ModuleDetailPageClient({ moduleId }: ModuleDetailPageClientProps) {
  const detailQuery = useModuleDetail(moduleId, {
    enabled: Boolean(moduleId)
  })

  const lessonsQuery = useModuleLessons(moduleId, {
    enabled: Boolean(moduleId)
  })

  const isLoading = detailQuery.isLoading && !detailQuery.data
  const isLessonsLoading = lessonsQuery.isLoading && !lessonsQuery.data

  const error = useMemo(() => detailQuery.error ?? lessonsQuery.error, [detailQuery.error, lessonsQuery.error])

  if (isLoading) {
    return <LoadingPage title='Đang tải chuyên đề' message='Vui lòng đợi trong giây lát…' />
  }

  if (error) {
    return (
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-12 pt-6 sm:px-6 lg:px-0'>
        <Card className='flex flex-col gap-4 border-destructive/30 bg-destructive/5 p-6 shadow-sm'>
          <div>
            <h1 className='text-lg font-semibold text-destructive'>Không thể tải thông tin chuyên đề</h1>
            <p className='mt-1 text-sm text-destructive/80'>{ErrorHandler.getErrorMessage(error)}</p>
          </div>
          <Separator className='bg-destructive/20' />
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-xs text-destructive/70'>Vui lòng kiểm tra kết nối hoặc thử lại sau.</p>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => {
                detailQuery.refetch()
                lessonsQuery.refetch()
              }}
            >
              Thử lại
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const moduleDetail = detailQuery.data

  if (!moduleDetail) {
    return (
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-12 pt-6 sm:px-6 lg:px-0'>
        <Card className='border border-greyscale-200 bg-greyscale-0 p-6 text-center shadow-sm'>
          <h1 className='text-lg font-semibold text-greyscale-900'>Không tìm thấy chuyên đề</h1>
          <p className='mt-2 text-sm text-greyscale-500'>Chuyên đề bạn đang tìm có thể đã bị xóa hoặc không tồn tại.</p>
        </Card>
      </div>
    )
  }

  const lessons = lessonsQuery.data?.lessons ?? []

  return <ModuleDetailView module={moduleDetail} lessons={lessons} isLessonsLoading={isLessonsLoading} />
}
