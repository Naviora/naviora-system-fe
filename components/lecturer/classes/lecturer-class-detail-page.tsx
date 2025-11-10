'use client'

import * as React from 'react'
import { Calendar, Code, BookOpen, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClassDetail } from '@/hooks/api/use-classes'
import { formatDate } from '@/lib/utils'
import { LecturerModulesTab } from '@/components/lecturer/classes/lecturer-modules-tab'
import { LecturerStudentsTab } from '@/components/lecturer/classes/lecturer-students-tab'
import { CLASS_TYPE_LABELS } from '@/types/api/class'

interface LecturerClassDetailPageProps {
  classId: string
}

export function LecturerClassDetailPage({ classId }: LecturerClassDetailPageProps) {
  const classDetailQuery = useClassDetail(classId)
  const classDetail = classDetailQuery.data

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <header className='flex flex-col gap-2'>
        {classDetailQuery.isLoading ? (
          <>
            <Skeleton className='h-8 w-64 mb-2' />
            <Skeleton className='h-5 w-96' />
          </>
        ) : (
          <>
            <h1 className='text-2xl font-semibold text-greyscale-900'>{classDetail?.class_name}</h1>
            <p className='text-sm text-greyscale-500'>
              Mã lớp: <span className='font-semibold text-greyscale-900'>{classDetail?.class_code}</span>
              {classDetail && (
                <>
                  {' • '}
                  <span className='ml-1'>
                    {classDetail.is_active ? (
                      <span className='inline-flex items-center gap-1 text-green-600'>
                        <CheckCircle2 className='h-4 w-4' />
                        Hoạt động
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 text-gray-500'>
                        <Circle className='h-4 w-4' />
                        Không hoạt động
                      </span>
                    )}
                  </span>
                </>
              )}
            </p>
          </>
        )}
      </header>

      {/* Info Cards and Tabs */}
      <Tabs defaultValue='overview' className='w-full'>
        <TabsList className='grid w-full max-w-md grid-cols-3'>
          <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
          <TabsTrigger value='students'>Học sinh</TabsTrigger>
          <TabsTrigger value='modules'>Chuyên đề</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-6 mt-6'>
          {classDetailQuery.isLoading ? (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {[...Array(3)].map((_, idx) => (
                <Card key={idx}>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <Skeleton className='h-5 w-24' />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className='h-8 w-full' />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {/* Dates Card */}
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Thời gian học</CardTitle>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>Ngày bắt đầu</span>
                        <span className='text-sm font-semibold'>{formatDate(classDetail?.start_date || '')}</span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>Ngày kết thúc</span>
                        <span className='text-sm font-semibold'>{formatDate(classDetail?.end_date || '')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Class Type Card */}
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Loại lớp học</CardTitle>
                    <BookOpen className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {classDetail?.class_type ? CLASS_TYPE_LABELS[classDetail.class_type] : '-'}
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>Cấp độ cuộc thi</p>
                  </CardContent>
                </Card>

                {/* Class Code Card */}
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>Mã lớp</CardTitle>
                    <Code className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{classDetail?.class_code}</div>
                    <p className='text-xs text-muted-foreground mt-1'>Định danh lớp học</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value='students' className='mt-6'>
          <LecturerStudentsTab classId={classId} />
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value='modules' className='mt-6'>
          <LecturerModulesTab classId={classId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
