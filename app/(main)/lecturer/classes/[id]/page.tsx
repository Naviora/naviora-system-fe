'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useClassDetail } from '@/hooks/api/use-classes'
import { LoadingSpinner } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSetBreadcrumbLabel } from '@/lib/context/breadcrumb-context'
import { LecturerClassDetailPage } from '@/components/lecturer/classes/lecturer-class-detail-page'

export default function ClassDetailPage() {
  const params = useParams()
  const classId = params.id as string
  const setBreadcrumbLabel = useSetBreadcrumbLabel()

  const { data: classDetail, isLoading } = useClassDetail(classId)

  // Update breadcrumb when class detail loads
  useEffect(() => {
    if (classDetail?.class_name) {
      setBreadcrumbLabel(classDetail.class_name)
    }
  }, [classDetail?.class_name, setBreadcrumbLabel])

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

  return <LecturerClassDetailPage classId={classId} />
}
