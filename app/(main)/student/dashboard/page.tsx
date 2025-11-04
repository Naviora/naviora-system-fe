'use client'

import { useSearchParams } from 'next/navigation'

import { DayStreak } from '@/components/common/day-streak'
import {
  BadgesCard,
  CategoryPopularityCard,
  CoursesCard,
  DashboardEmptyState,
  DashboardStatGrid,
  LearningHoursCard,
  type BadgeCardConfig,
  type CategoryConfig,
  type CourseCardConfig,
  type EmptyStateSuggestion,
  type LearningDataPoint,
  type StatCardConfig
} from '@/components/student/dashboard'
import { Award, BookOpen, Compass, Flame, GraduationCap, Medal, MoveUpRight, Sparkles, Star } from 'lucide-react'

const statCards: StatCardConfig[] = [
  {
    id: 'ongoing',
    title: 'Khoá học đang học',
    value: '5',
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
    value: '12',
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

const courses: CourseCardConfig[] = [
  {
    id: 'figma-wireframe',
    moduleName: 'Nhập môn Wireframe',
    classType: 'Thiết kế UI/UX',
    class_name: 'Khoá học ngắn',
    lecturerName: ['Figma Academy'],
    progress: 52,
    thumbnail:
      'https://images.unsplash.com/photo-1587613864521-79b72106b1b0?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  {
    id: 'google-mobile-app',
    moduleName: 'Thiết kế UI cho ứng dụng di động',
    classType: 'Thiết kế UI/UX',
    class_name: 'Khoá học chuyên sâu',
    lecturerName: ['Google Design'],
    progress: 48,
    thumbnail:
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  {
    id: 'meta-web-ux',
    moduleName: 'UX Web & Khả dụng',
    classType: 'Thiết kế UI/UX',
    class_name: 'Khoá học nâng cao',
    lecturerName: ['Meta Learn'],
    progress: 65,
    thumbnail:
      'https://images.unsplash.com/photo-1523476807043-022c00e602c0?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.0.3'
  }
]

const badges: BadgeCardConfig[] = [
  {
    id: 'streak-master',
    title: 'Chuỗi ngày bền bỉ',
    description: 'Duy trì chuỗi học 21 ngày liên tục.',
    icon: Flame,
    accent: 'bg-primary-25 text-primary-200'
  },
  {
    id: 'design-hunter',
    title: 'Nhà khám phá thiết kế',
    description: 'Hoàn thành 5 học phần tư duy thiết kế.',
    icon: Sparkles,
    accent: 'bg-primary-25 text-primary-200'
  },
  {
    id: 'quick-learner',
    title: 'Học nhanh xuất sắc',
    description: 'Hoàn tất một khoá học trong 3 ngày kể từ khi đăng ký.',
    icon: Medal,
    accent: 'bg-primary-25 text-primary-200'
  }
]

const categoryPopularity: CategoryConfig[] = [
  { id: 'uiux', label: 'UI/UX', percentage: 92 },
  { id: 'design', label: 'Thiết kế', percentage: 78 },
  { id: 'mobile', label: 'Di động', percentage: 62 },
  { id: 'programming', label: 'Lập trình', percentage: 54 }
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
  return (
    <div className='flex flex-col gap-6'>
      <DashboardStatGrid stats={statCards} />

      <section className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <LearningHoursCard data={learningHours} />
        <div className='flex flex-col gap-6'>
          <DayStreak />
          <BadgesCard badges={badges} />
        </div>
      </section>

      <section className='grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]'>
        <CoursesCard courses={courses} />
        <CategoryPopularityCard categories={categoryPopularity} />
      </section>
    </div>
  )
}
