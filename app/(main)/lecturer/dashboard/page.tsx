'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { DashboardHeader } from '@/components/lecturer/dashboard/dashboard-header'
import { MetricsSection } from '@/components/lecturer/dashboard/metrics-section'
import { TeachingOverview } from '@/components/lecturer/dashboard/teaching-overview'
import { InsightsSection } from '@/components/lecturer/dashboard/insights-section'
import { UpcomingSessions } from '@/components/lecturer/dashboard/upcoming-sessions'
import { AssignmentReviews } from '@/components/lecturer/dashboard/assignment-reviews'
import { FeedbackSection } from '@/components/lecturer/dashboard/feedback-section'
import { QuickResources } from '@/components/lecturer/dashboard/quick-resources'

function formatDateInfo(): { greeting: string; formattedDate: string } {
  const now = new Date()
  const hour = now.getHours()

  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(now)

  return { greeting, formattedDate }
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const isEmptyState = searchParams?.get('state') === 'empty'

  const { greeting, formattedDate } = useMemo(() => formatDateInfo(), [])

  if (isEmptyState) {
    return (
      <div className='flex h-full flex-col items-center justify-center px-4 pb-12 pt-10 sm:px-6 lg:px-8'>
        <Empty className='max-w-2xl border border-dashed border-greyscale-200 bg-greyscale-25/60'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <CalendarDays className='size-6 text-greyscale-500' />
            </EmptyMedia>
            <EmptyTitle>Chưa có dữ liệu khả dụng</EmptyTitle>
            <EmptyDescription>
              Hệ thống sẽ hiển thị lịch giảng dạy, bài nộp và thông báo khi bạn được phân công lớp hoặc sinh viên gửi
              yêu cầu.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href='/lecturer/modules'>Xem danh sách chuyên đề</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/settings/notifications'>Thiết lập thông báo</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8'>
      <DashboardHeader greeting={greeting} formattedDate={formattedDate} />

      <MetricsSection />

      <section className='grid gap-4 xl:grid-cols-3'>
        <TeachingOverview />
        <InsightsSection />
      </section>

      <section className='grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'>
        <UpcomingSessions />
        <AssignmentReviews />
      </section>

      <section className='grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'>
        <FeedbackSection />
        <QuickResources />
      </section>
    </div>
  )
}
