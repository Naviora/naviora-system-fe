'use client'

import { useParams } from 'next/navigation'
import { useClassDetail } from '@/hooks/api/use-classes'
import { LoadingSpinner } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { Calendar, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { CLASS_TYPE_LABELS } from '@/types/api/class'
import { formatDate } from '@/lib/utils'
import { BreadcrumbProvider } from '@/lib/context/breadcrumb-context'

export default function ClassDetailPage() {
  const params = useParams()
  const classId = params.id as string

  const { data: classDetail, isLoading } = useClassDetail(classId)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner />
      </div>
    )
  }

  if (!classDetail) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Lớp học không tìm thấy</h2>
          <p className='text-muted-foreground mt-2'>Lớp học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button asChild className='mt-4'>
            <Link href='/lecturer/classes'>Quay lại danh sách lớp học</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <BreadcrumbProvider label={classDetail.class_name}>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-3xl font-bold'>{classDetail.class_name}</h1>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    classDetail.is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {classDetail.is_active ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
            <p className='text-muted-foreground'>
              {classDetail.class_code} • {CLASS_TYPE_LABELS[classDetail.class_type]}
            </p>
          </div>
        </div>
      </div>

      {/* Class Information Cards */}
      <div className='grid gap-6 md:grid-cols-3 mb-8'>
        <div className='border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <Calendar className='h-5 w-5 text-primary' />
            <h3 className='font-semibold'>Thời gian học</h3>
          </div>
          <div className='space-y-2 text-sm'>
            <div>
              <span className='text-muted-foreground'>Ngày bắt đầu: </span>
              <span className='font-medium'>{formatDate(classDetail.start_date)}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>Ngày kết thúc: </span>
              <span className='font-medium'>{formatDate(classDetail.end_date)}</span>
            </div>
          </div>
        </div>

        <div className='border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <Users className='h-5 w-5 text-primary' />
            <h3 className='font-semibold'>Giảng viên</h3>
          </div>
          <div className='text-2xl font-bold'>{classDetail.lecturers.length}</div>
          <p className='text-sm text-muted-foreground mt-1'>Giảng dạy lớp học này</p>
        </div>

        <div className='border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <BookOpen className='h-5 w-5 text-primary' />
            <h3 className='font-semibold'>Loại lớp học</h3>
          </div>
          <div className='text-2xl font-bold'>{CLASS_TYPE_LABELS[classDetail.class_type]}</div>
          <p className='text-sm text-muted-foreground mt-1'>Cấp độ cuộc thi</p>
        </div>
      </div>

      {/* Lecturers Section */}
      <div className='border rounded-lg p-6 mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Danh sách giảng viên</h2>
        {classDetail.lecturers.length > 0 ? (
          <div className='space-y-3'>
            {classDetail.lecturers.map((lecturer) => (
              <div
                key={lecturer.lecturer_id}
                className='flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors'
              >
                <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                  <Users className='h-5 w-5 text-primary' />
                </div>
                <div className='flex-1'>
                  <p className='font-medium'>{lecturer.name}</p>
                  <p className='text-sm text-muted-foreground'>{lecturer.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-muted-foreground text-center py-8'>Không có giảng viên được gán cho lớp học này</p>
        )}
      </div>

      {/* Students Section */}
      <div className='border rounded-lg p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Học viên</h2>
          <Button asChild>
            <Link href={`/lecturer/classes/${classId}/students`}>Xem tất cả học viên</Link>
          </Button>
        </div>
        <p className='text-muted-foreground text-center py-8'>Xem và quản lý học viên đăng ký lớp học này</p>
      </div>
      </div>
    </BreadcrumbProvider>
  )
}
