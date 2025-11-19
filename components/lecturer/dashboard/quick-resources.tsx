'use client'

import Link from 'next/link'
import { ClipboardList, Users2, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function QuickResources() {
  return (
    <Card className='border-greyscale-200'>
      <CardHeader className='px-6 pb-0'>
        <CardTitle className='text-xl text-greyscale-900'>Tài nguyên nhanh</CardTitle>
        <CardDescription>Tổng hợp những tài liệu và hành động thường dùng.</CardDescription>
      </CardHeader>
      <CardContent className='px-6 pt-6'>
        <div className='space-y-4 text-sm'>
          <div className='flex items-start gap-3 rounded-lg border border-greyscale-200/80 bg-greyscale-0 p-4'>
            <div className='rounded-full bg-primary-0 p-2 text-primary-600'>
              <ClipboardList className='size-4' />
            </div>
            <div className='flex-1 space-y-1'>
              <p className='font-medium text-greyscale-900'>Mẫu rubric chi tiết</p>
              <p className='text-sm text-muted-foreground'>
                Sử dụng bộ tiêu chí chuẩn để đảm bảo đánh giá đồng nhất giữa các lớp.
              </p>
              <Button variant='link' className='h-auto p-0' asChild>
                <Link href='/lecturer/modules'>Mở tài liệu</Link>
              </Button>
            </div>
          </div>

          <div className='flex items-start gap-3 rounded-lg border border-greyscale-200/80 bg-greyscale-0 p-4'>
            <div className='rounded-full bg-primary-0 p-2 text-primary-600'>
              <Users2 className='size-4' />
            </div>
            <div className='flex-1 space-y-1'>
              <p className='font-medium text-greyscale-900'>Lên lịch cố vấn nhóm</p>
              <p className='text-sm text-muted-foreground'>Gửi lời mời nhanh cho nhóm đồ án cần hỗ trợ trong tuần.</p>
              <Button variant='link' className='h-auto p-0' asChild>
                <Link href='/meeting'>Tạo lịch cố vấn</Link>
              </Button>
            </div>
          </div>

          <div className='flex items-start gap-3 rounded-lg border border-greyscale-200/80 bg-greyscale-0 p-4'>
            <div className='rounded-full bg-primary-0 p-2 text-primary-600'>
              <CalendarDays className='size-4' />
            </div>
            <div className='flex-1 space-y-1'>
              <p className='font-medium text-greyscale-900'>Mốc quan trọng học kỳ</p>
              <p className='text-sm text-muted-foreground'>
                Tổng hợp deadline thi giữa kỳ, bảo vệ, và thời gian nhập điểm.
              </p>
              <Button variant='link' className='h-auto p-0' asChild>
                <Link href='/calendar'>Tải về</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
