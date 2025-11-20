'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModuleCard } from '@/components/student/modules'

import type { CourseCardConfig } from './types'

type CoursesCardProps = {
  courses: CourseCardConfig[]
}

export function CoursesCard({ courses }: CoursesCardProps) {
  return (
    <Card className='border-[rgba(230,230,230,0.9)] shadow-none'>
      <CardHeader className='flex flex-wrap items-center justify-between gap-3 px-6'>
        <CardTitle className='text-base font-medium text-greyscale-700'>Khoá học của tôi</CardTitle>
        <Button variant='outline' size='sm' className='h-9 rounded-lg border-greyscale-100 text-xs font-medium'>
          Xem tất cả
        </Button>
      </CardHeader>
      <CardContent className='px-6 pb-6'>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {courses.map((course) => (
            <ModuleCard key={course.id} {...course} className='h-full' />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
