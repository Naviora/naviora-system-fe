'use client'

import { useSearchParams } from 'next/navigation'

import { DayStreak } from '@/components/common/day-streak'
import {
  DashboardEmptyState,
  DashboardStatGrid,
  LearningHoursCard,
  type EmptyStateSuggestion,
  type LearningDataPoint,
  type StatCardConfig
} from '@/components/student/dashboard'
import { Award, BookOpen, Compass, GraduationCap, MoveUpRight, Star } from 'lucide-react'

const getStatCards = (totalModules: number, completedCount: number, ongoingCount: number): StatCardConfig[] => [
  {
    id: 'ongoing',
    title: 'Khoá học đang học',
    value: String(ongoingCount),
    icon: BookOpen,
    accent: 'bg-primary-25 text-primary-200',
    delta: {
      direction: 'up',
      value: '+10%',
      description: 'so với tháng trước'
    }
  },
  {
    id: 'completed',
    title: 'Khoá học đã hoàn thành',
    value: String(completedCount),
    icon: GraduationCap,
    accent: 'bg-primary-25 text-primary-200',
    delta: {
      direction: 'up',
      value: '+10%',
      description: 'so với tháng trước'
    }
  },
  {
    id: 'certificates',
    title: 'Chứng chỉ đạt được',
    value: '8',
    icon: Award,
    accent: 'bg-primary-25 text-primary-200',
    delta: {
      direction: 'up',
      value: '+10%',
      description: 'so với tháng trước'
    }
  },
  {
    id: 'rating',
    title: 'Điểm đánh giá trung bình',
    value: '4.8',
    icon: Star,
    accent: 'bg-primary-25 text-primary-200',
    delta: {
      direction: 'up',
      value: '+5%',
      description: 'so với tháng trước'
    }
  }
]

const learningHours: LearningDataPoint[] = [
  { day: 1, hours: 0.8 },
  { day: 2, hours: 1.1 },
  { day: 3, hours: 1.4 },
  { day: 4, hours: 1.2 },
  { day: 5, hours: 1.8 },
  { day: 6, hours: 1.6 },
  { day: 7, hours: 1.3 },
  { day: 8, hours: 1.5 },
  { day: 9, hours: 1.4 },
  { day: 10, hours: 1.2 },
  { day: 11, hours: 1.6 },
  { day: 12, hours: 1.7 },
  { day: 13, hours: 1.4 },
  { day: 14, hours: 1.5 },
  { day: 15, hours: 1.1 },
  { day: 16, hours: 1.9 }
]

const emptyStateSuggestions: EmptyStateSuggestion[] = [
  {
    id: 'explore',
    title: 'Khám phá lộ trình gợi ý',
    description: 'Chọn lộ trình học phù hợp với mục tiêu của bạn.',
    icon: Compass
  },
  {
    id: 'bookmark',
    title: 'Lưu chủ đề yêu thích',
    description: 'Ghi nhớ học phần quan tâm để học sau.',
    icon: Star
  },
  {
    id: 'set-goal',
    title: 'Đặt mục tiêu theo tuần',
    description: 'Giữ động lực bằng cách theo dõi nhịp học lý tưởng.',
    icon: MoveUpRight
  }
]

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const viewMode = searchParams.get('state')
  const hasData = viewMode !== 'empty'

  return (
    <div className='flex flex-1 flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8'>
      <header className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Bảng điều khiển học viên</h1>
        <p className='text-sm text-muted-foreground'>
          Theo dõi tiến độ, khoá học đang tham gia và các cột mốc cá nhân.
        </p>
      </header>

      {hasData ? <DataStateDashboard /> : <DashboardEmptyState suggestions={emptyStateSuggestions} />}
    </div>
  )
}

function DataStateDashboard() {
  const statCards = getStatCards(5, 2, 3)

  return (
    <div className='flex flex-col gap-6'>
      <DashboardStatGrid stats={statCards} />

      <section className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <LearningHoursCard data={learningHours} />
        <div className='flex flex-col gap-6'>
          <DayStreak />
        </div>
      </section>
    </div>
  )
}
