'use client'

import * as React from 'react'
import { Calendar, Code, BookOpen, Users, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClassDetail } from '@/hooks/api/principal/use-classes'
import { formatDate } from '@/lib/utils'
import { StudentsTab } from './students-tab'
import { ModulesTab } from './modules-tab'
import type { ClassDetailRow, ClassDto, StudentDto } from '@/types/principal/classes'

interface ClassDetailPageClientProps {
  classId: string
}

function mapClassToDetailRow(classData: ClassDto): ClassDetailRow {
  return {
    id: classData.class_id,
    code: classData.class_code,
    name: classData.class_name,
    type: classData.class_type,
    startDate: classData.start_date,
    endDate: classData.end_date,
    isActive: classData.is_active,
    students: (classData.students || []).map((student: StudentDto) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      avatar: student.avatar,
      phone: student.phone,
      enrolmentDate: student.enrolment_date
    })),
    createdAt: classData.created_at,
    updatedAt: classData.updated_at
  }
}

export function ClassDetailPageClient({ classId }: ClassDetailPageClientProps) {
  const classDetailQuery = useClassDetail(classId)
  const classDetail = classDetailQuery.data?.data
  const mappedClass = classDetail ? mapClassToDetailRow(classDetail) : null

  const getClassTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      school: 'Lớp trường',
      city: 'Lớp thành phố',
      province: 'Lớp tỉnh',
      national: 'Lớp quốc gia',
      international: 'Lớp quốc tế'
    }
    return typeMap[type] || type
  }

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
            <h1 className='text-2xl font-semibold text-greyscale-900'>{mappedClass?.name}</h1>
            <p className='text-sm text-greyscale-500'>
              Mã lớp: <span className='font-semibold text-greyscale-900'>{mappedClass?.code}</span>
              {mappedClass && (
                <>
                  {' • '}
                  <span className='ml-1'>
                    {mappedClass.isActive ? (
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

      {/* Info Cards and Students Table in Tabs */}
      <Tabs defaultValue='overview' className='w-full'>
        <TabsList className='grid w-full max-w-md grid-cols-3'>
          <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
          <TabsTrigger value='students'>Học sinh</TabsTrigger>
          <TabsTrigger value='modules'>Chuyên đề</TabsTrigger>
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value='overview' className='mt-6 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Class Code */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <Code className='h-4 w-4 text-blue-600' />
                  Mã lớp
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classDetailQuery.isLoading ? (
                  <Skeleton className='h-6 w-24' />
                ) : (
                  <p className='text-lg font-semibold'>{mappedClass?.code}</p>
                )}
              </CardContent>
            </Card>

            {/* Class Type */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <BookOpen className='h-4 w-4 text-purple-600' />
                  Loại lớp
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classDetailQuery.isLoading ? (
                  <Skeleton className='h-6 w-32' />
                ) : (
                  <p className='text-lg font-semibold'>{getClassTypeLabel(mappedClass?.type || '')}</p>
                )}
              </CardContent>
            </Card>

            {/* Students Count */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <Users className='h-4 w-4 text-green-600' />
                  Số học sinh
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classDetailQuery.isLoading ? (
                  <Skeleton className='h-6 w-16' />
                ) : (
                  <p className='text-lg font-semibold'>{mappedClass?.students.length || 0}</p>
                )}
              </CardContent>
            </Card>

            {/* Duration */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-orange-600' />
                  Thời gian
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classDetailQuery.isLoading ? (
                  <Skeleton className='h-6 w-40' />
                ) : (
                  <p className='text-sm'>
                    <span className='font-semibold block'>{formatDate(mappedClass?.startDate || '')}</span>
                    <span className='text-gray-500'>đến {formatDate(mappedClass?.endDate || '')}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Students Tab */}
        <TabsContent value='students' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Danh sách học sinh</CardTitle>
              <CardDescription>Quản lý thông tin học sinh trong lớp</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentsTab classId={classId} />
            </CardContent>
          </Card>
        </TabsContent>{' '}
        {/* Modules Tab */}
        <TabsContent value='modules' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Danh sách chuyên đề</CardTitle>
              <CardDescription>Các chuyên đề được gán cho lớp này</CardDescription>
            </CardHeader>
            <CardContent>
              <ModulesTab classId={classId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
